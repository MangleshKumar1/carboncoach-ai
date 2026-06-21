export default function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={text ?? 'Loading'}>
      <div
        className={`animate-spin rounded-full border-emerald-200 border-t-emerald-500 ${sizeClasses[size]}`}
      />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
