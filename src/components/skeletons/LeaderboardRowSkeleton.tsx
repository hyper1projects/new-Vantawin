import { Skeleton } from "@/components/ui/skeleton";

export const LeaderboardRowSkeleton = () => {
    return (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-4 items-center py-2 px-3 rounded-lg bg-[#012A5E]/20 mb-2">
            <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-4 w-12 bg-white/10" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-4 w-12 bg-white/10" />
            </div>
            <div className="flex justify-end">
                <Skeleton className="h-4 w-16 bg-white/10" />
            </div>
        </div>
    );
};
