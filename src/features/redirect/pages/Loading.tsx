export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-b-4 border-black/30 border-t-black"></div>
          <div className="absolute inset-4 rounded-full bg-white" />
        </div>
        <span className="text-black text-sm tracking-wide animate-pulse">
          Loading, please wait...
        </span>
      </div>
    </div>
  );
}
