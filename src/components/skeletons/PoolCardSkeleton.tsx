import { Skeleton } from "@/components/ui/skeleton";

export const PoolCardSkeleton = () => {
    return (
        <div className="flex-none w-[300px] bg-vanta-blue-medium rounded-[20px] p-5 relative overflow-hidden border border-white/5">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-32 bg-white/10" />
                    <Skeleton className="h-3 w-20 bg-white/10" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
            </div>

            {/* Prize Pot */}
            <div className="mb-6 relative z-10 bg-[#0A1A3B]/50 p-3 rounded-xl border border-white/5">
                <Skeleton className="h-3 w-24 bg-white/10 mb-2" />
                <Skeleton className="h-8 w-3/4 bg-white/10" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                    <Skeleton className="h-4 w-8 mb-1 bg-white/10" />
                    <Skeleton className="h-3 w-12 bg-white/10" />
                </div>
                <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                    <Skeleton className="h-4 w-8 mb-1 bg-white/10" />
                    <Skeleton className="h-3 w-12 bg-white/10" />
                </div>
            </div>

            {/* Button */}
            <Skeleton className="w-full h-12 rounded-xl bg-white/10 relative z-10" />
        </div>
    );
};
