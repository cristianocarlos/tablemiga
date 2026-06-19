export default function BackgroundFallback({className = ''}: {className?: string}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-white via-gray-100 to-white bg-[length:200%_100%] ${className}`}
    />
  );
}
