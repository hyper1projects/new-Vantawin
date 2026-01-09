import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
    return (
        <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans border border-transparent">
            {/* Header */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <Skeleton className="h-4 w-48 bg-white/10" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-16 bg-white/10" />
                </div>
            </div>

            {/* Teams and Odds */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col space-y-3 min-w-0 flex-1">
                    <div className="flex items-center min-w-0 max-w-full">
                        <Skeleton className="h-6 w-6 rounded-full mr-2 bg-white/10 flex-shrink-0" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                    <div className="flex items-center min-w-0 max-w-full">
                        <Skeleton className="h-6 w-6 rounded-full mr-2 bg-white/10 flex-shrink-0" />
                        <Skeleton className="h-4 w-32 bg-white/10" />
                    </div>
                </div>

                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                    <div className="flex space-x-2">
                        <Skeleton className="h-11 min-w-[44px] max-w-[60px] w-[50px] bg-white/10 rounded-md" />
                        <Skeleton className="h-11 min-w-[44px] max-w-[60px] w-[50px] bg-white/10 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <div className="flex items-center space-x-3 font-medium text-gray-400 text-xs">
                    <Skeleton className="h-3 w-16 bg-white/10" />
                    <span className="text-gray-500 text-xs">|</span>
                    <Skeleton className="h-3 w-16 bg-white/10" />
                </div>
                <Skeleton className="h-3 w-24 bg-white/10" />
            </div>
        </div>
    );
};

