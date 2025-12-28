import { Skeleton } from "@/components/ui/skeleton";

export const WalletBalanceSkeleton = () => {
    return (
        <div className="flex flex-col space-y-2">
            <Skeleton className="h-12 w-48 bg-white/10" />
            <Skeleton className="h-4 w-16 bg-white/10" />
        </div>
    );
};
