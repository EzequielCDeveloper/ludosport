export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6" />
        <p className="font-display text-yellow-400/60 text-lg tracking-widest">
          CARGANDO...
        </p>
      </div>
    </div>
  );
}
