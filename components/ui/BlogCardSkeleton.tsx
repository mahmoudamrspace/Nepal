import Skeleton from './Skeleton';

export default function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden card-shadow">
      <Skeleton variant="rectangular" height={240} className="w-full" />
      <div className="p-6 space-y-4">
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="90%" height={24} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="95%" height={16} />
        <Skeleton variant="text" width="85%" height={16} />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="40%" height={14} className="mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

