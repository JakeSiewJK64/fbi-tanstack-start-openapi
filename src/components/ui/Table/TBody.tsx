import { flexRender } from "@tanstack/react-table";

import type { Row } from "@tanstack/react-table";

import { cn } from "../styling";

import { getCommonPinningStyles } from "./utils.ts";

export function TBody<T>(props: { rows: Row<T>[] }) {
  const { rows } = props;

  return (
    <tbody>
      {rows.map((rowGroup) => (
        <tr key={rowGroup.id} className="sticky-hover">
          {rowGroup.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={cn(
                "dark:bg-secondary bg-white p-4",
                rowGroup.getIsSelected() && "bg-background dark:bg-secondary"
              )}
              style={{ ...getCommonPinningStyles(cell.column) }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
