export function SkeletonMallCard() {
  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white dark:bg-gray-800 h-full flex flex-col animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-48 sm:h-56 md:h-64"></div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        </div>
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
      </div>
    </div>
  )
}

export function SkeletonStoreCard() {
  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white dark:bg-gray-800 h-full flex flex-col animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-40"></div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/5 mb-3"></div>
        </div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      </div>
    </div>
  )
}

export function SkeletonProductCard() {
  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white dark:bg-gray-800 animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 h-48"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  )
}
