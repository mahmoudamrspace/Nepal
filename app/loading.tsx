export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbe2dd]">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-sans">Loading...</p>
      </div>
    </div>
  );
}

