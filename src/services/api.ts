import { Task, ActivityLog, Notification, SystemConfig } from '../types';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, getDoc, runTransaction, writeBatch, query, where, getDocs } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class ApiService {
  // Tasks
  async createTask(task: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const path = 'tasks';
    try {
      let code = '';
      await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'counters', 'taskCounter');
        const counterDoc = await transaction.get(counterRef);
        let currentCount = 3; // Start from 3 if not exists
        if (counterDoc.exists()) {
          currentCount = counterDoc.data().count;
        }
        const newCount = currentCount + 1;
        transaction.set(counterRef, { count: newCount }, { merge: true });
        code = `DXS-${newCount.toString().padStart(4, '0')}`;
      });

      const newDocRef = doc(collection(db, 'tasks'));
      const newTask: Task = {
        ...task,
        id: newDocRef.id,
        code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(newDocRef, newTask);
      return newTask;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const path = `tasks/${id}`;
    try {
      const taskRef = doc(db, 'tasks', id);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(taskRef, updatedData);
      
      const taskSnap = await getDoc(taskRef);
      return { id: taskSnap.id, ...taskSnap.data() } as Task;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    const path = `tasks/${id}`;
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  }

  // Logs
  async createLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const path = 'logs';
    try {
      const newDocRef = doc(collection(db, 'logs'));
      const newLog: ActivityLog = {
        ...log,
        id: newDocRef.id,
        createdAt: new Date().toISOString(),
      };
      await setDoc(newDocRef, newLog);
      return newLog;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  }

  // Configs
  async createConfig(config: Omit<SystemConfig, 'id'>): Promise<SystemConfig> {
    const path = 'configs';
    try {
      const newDocRef = doc(collection(db, 'configs'));
      const newConfig: SystemConfig = {
        ...config,
        id: newDocRef.id,
      };
      await setDoc(newDocRef, newConfig);
      return newConfig;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  }

  async updateConfig(id: string, updates: Partial<SystemConfig>): Promise<SystemConfig> {
    const path = `configs/${id}`;
    try {
      const configRef = doc(db, 'configs', id);
      const oldConfigSnap = await getDoc(configRef);
      
      if (!oldConfigSnap.exists()) {
        throw new Error('Config not found');
      }
      
      const oldConfig = oldConfigSnap.data() as SystemConfig;
      
      await updateDoc(configRef, updates);
      
      // If label changed, update all tasks that use the old label
      if (updates.label && updates.label !== oldConfig.label) {
        const tasksRef = collection(db, 'tasks');
        // We need to find tasks where any of the config fields match the old label
        // Since we don't know which field it is without checking the type, we can check the type
        let fieldToUpdate = '';
        switch (oldConfig.type) {
          case 'department': fieldToUpdate = 'department'; break;
          case 'taskType': fieldToUpdate = 'type'; break;
          case 'scope': fieldToUpdate = 'scope'; break;
          case 'systemForm': fieldToUpdate = 'systemForm'; break;
          case 'status': fieldToUpdate = 'status'; break;
        }
        
        if (fieldToUpdate) {
          const q = query(tasksRef, where(fieldToUpdate, '==', oldConfig.label));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const batch = writeBatch(db);
            querySnapshot.forEach((docSnap) => {
              batch.update(docSnap.ref, { [fieldToUpdate]: updates.label });
            });
            await batch.commit();
          }
        }
      }
      
      const configSnap = await getDoc(configRef);
      return { id: configSnap.id, ...configSnap.data() } as SystemConfig;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  }

  async deleteConfig(id: string): Promise<void> {
    const path = `configs/${id}`;
    try {
      await deleteDoc(doc(db, 'configs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  }
}

export const api = new ApiService();
