import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface HeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Header({ title, description, subtitle, action, children, className }: HeaderProps) {
  return (
    <div className={cn('flex items-start justify-between p-6 border-b border-navy-700', className)}>
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {(description || subtitle) && (
          <p className="mt-1 text-gray-400">{description || subtitle}</p>
        )}
      </div>
      {(action || children) && <div>{action || children}</div>}
    </div>
  );
}
