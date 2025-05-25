export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      KONTOL
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}
