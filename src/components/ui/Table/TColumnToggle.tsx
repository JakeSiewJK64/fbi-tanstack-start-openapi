import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import type { Column } from "@tanstack/react-table";
import { LuColumns2 } from "react-icons/lu";

export function TColumnToggle<T>(props: { columns: Column<T, unknown>[] }) {
  const { columns } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="dark:bg-secondary my-1 rounded border p-1 hover:opacity-50"
          title="Toggle Column Visibility"
          type="button"
        >
          <LuColumns2 size={15} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start">
        {columns.map((column) => {
          if (column.id === "select") {
            return null;
          }

          const header = String(column.columnDef.header);

          return (
            <div key={column.id} className="flex flex-row justify-between">
              <label htmlFor={`toggle-${header}`}>{header}</label>
              <input
                checked={column.getIsVisible()}
                id={`toggle-${header}`}
                type="checkbox"
                onChange={column.getToggleVisibilityHandler()}
              />
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
