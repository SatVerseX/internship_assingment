export default function LoadingSkeleton() {
  return (
    <div className="animate-fade-in py-4">
      <div className="grid grid-cols-3 gap-6 mb-8 max-md:grid-cols-1">
        <div className="skeleton h-40 rounded-lg" />
        <div className="skeleton h-40 rounded-lg" />
        <div className="skeleton h-40 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8 max-md:grid-cols-1">
        <div className="skeleton h-80 rounded-lg" />
        <div className="skeleton h-80 rounded-lg" />
      </div>
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-14 mb-3 rounded-md" />
        ))}
      </div>
    </div>
  );
}
