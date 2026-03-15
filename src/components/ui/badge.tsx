import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
        {
          'border-transparent bg-slate-900 text-white hover:bg-slate-800 shadow-sm': variant === 'default',
          'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200': variant === 'secondary',
          'border-transparent bg-red-100 text-red-700 hover:bg-red-200': variant === 'destructive',
          'border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200': variant === 'success',
          'border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200': variant === 'warning',
          'border-slate-200 text-slate-700 hover:bg-slate-50': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
