import { create } from 'zustand';
import { User } from '../types';
import { auth, db, signInWithGoogle, logOut } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAuthReady: boolean;
  setUser: (user: User | null) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthReady: false,
  setUser: (user) => set({ user }),
  loginWithGoogle: async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let role: 'admin' | 'viewer' = 'viewer';
        
        if (userDoc.exists()) {
          role = userDoc.data().role as 'admin' | 'viewer';
        } else {
          // If first time login and email matches the admin email, make them admin
          if (firebaseUser.email === 'phandinhtinqlr@gmail.com') {
            role = 'admin';
          }
          
          // Save user to Firestore
          await setDoc(userDocRef, {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: role,
          });
        }
        
        set({
          user: {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: role,
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
          }
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  },
  logout: async () => {
    await logOut();
    set({ user: null });
  },
}));

// Set up auth state listener
auth.onAuthStateChanged(async (firebaseUser) => {
  if (firebaseUser) {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    let role: 'admin' | 'viewer' = 'viewer';
    
    if (userDoc.exists()) {
      role = userDoc.data().role as 'admin' | 'viewer';
    } else {
      if (firebaseUser.email === 'phandinhtinqlr@gmail.com') {
        role = 'admin';
      }
      // We don't save here to avoid permission issues if rules don't allow it yet,
      // but the loginWithGoogle function handles the initial save.
    }
    
    useAuthStore.setState({
      user: {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: role,
        avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
      },
      isAuthReady: true
    });
  } else {
    useAuthStore.setState({ user: null, isAuthReady: true });
  }
});
