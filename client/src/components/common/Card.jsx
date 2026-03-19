import { cn } from '@/services/utils';

export function Card({ className, children, ...props }) {
  return (
    <div 
      className={cn(
        'group relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-900/50 dark:border dark:border-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className }) {
  return (
    <div className={cn('relative -mx-6 -mt-6 mb-6 aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800', className)}>
      <img 
        src={src} 
        alt={alt} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children }) {
  return (
    <p className={cn('mt-2 text-sm text-gray-500 dark:text-gray-400', className)}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('mt-6 flex items-center justify-between', className)}>
      {children}
    </div>
  );
}
