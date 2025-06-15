import React from "react";
import { LuFilter } from "react-icons/lu";

import { Popover, PopoverContent, PopoverTrigger } from "../Popover.tsx";

export function TFilterPopover(props: React.PropsWithChildren) {
  const { children } = props;

  if (!children) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="dark:bg-secondary my-1 rounded border p-1 hover:opacity-50"
          type="button"
        >
          <LuFilter size={15} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-fit">
        {children}
      </PopoverContent>
    </Popover>
  );
}
