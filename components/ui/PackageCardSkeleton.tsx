import Skeleton from './Skeleton';

export default function PackageCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden card-shadow">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="60%" height={20} />
        <div className="flex gap-2">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={80} height={20} />
        </div>
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="rectangular" width="100%" height={40} className="mt-4" />
      </div>
    </div>
  );
}

