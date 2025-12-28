import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
    return (
        <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans border border-transparent">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-2">
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
                    <Skeleton className="h-4 w-12 bg-white/10" />
                </div>
            </div>

            {/* Teams and Odds */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col space-y-3 w-1/2">
                    <div className="flex items-center">
                        <Skeleton className="h-6 w-6 rounded-full mr-2 bg-white/10" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                    <div className="flex items-center">
                        <Skeleton className="h-6 w-6 rounded-full mr-2 bg-white/10" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                    <div className='flex space-x-2'>
                        <Skeleton className="h-9 w-24 bg-white/10 rounded-md" />
                        <Skeleton className="h-9 w-24 bg-white/10 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-3 w-16 bg-white/10" />
                    <div className="h-3 w-[1px] bg-gray-700"></div>
                    <Skeleton className="h-3 w-16 bg-white/10" />
                </div>
                <Skeleton className="h-3 w-20 bg-white/10" />
            </div>
        </div>
    );
};
