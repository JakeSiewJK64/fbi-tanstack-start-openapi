import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./styling";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

function TooltipContent(
  props: React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>
) {
  const { className, sideOffset = 4, ...rest } = props;

  return (
    <TooltipPrimitive.Content
      className={cn(
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground dark:bg-secondary z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm shadow-md",
        className
      )}
      sideOffset={sideOffset}
      {...rest}
    />
  );
}

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
};
