"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'; // Import shadcn/ui Collapsible components
import { cn } from '../lib/utils'; // For conditional class merging
import { Button } from '@/components/ui/button'; // Import Button for the trigger styling

interface CollapsibleSectionProps {
  title: string;
  count?: number; // Optional count for items in the section
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  count,
  children,
  defaultOpen = true,
  className,
  headerClassName,
  contentClassName,
}) => {
  return (
    <Collapsible defaultOpen={defaultOpen} className={cn("w-full", className)}>
      <div className={cn("bg-[#0D2C60] rounded-t-[27px] p-4 flex items-center justify-between", headerClassName)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 p-0 h-auto text-white hover:bg-transparent hover:text-vanta-neon-blue cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{title}</h2>
            {count !== undefined && (
              <span className="bg-[#01112D] text-vanta-neon-blue text-sm font-bold px-3 py-1 rounded-full">
                {count}
              </span>
            )}
            <ChevronDown size={16} className="inline-block ml-1 transition-transform duration-200 data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className={cn("overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down", contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;