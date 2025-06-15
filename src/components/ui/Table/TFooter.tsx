/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { LuLoaderCircle } from "react-icons/lu";

export function TFooter<T>(
  props: React.PropsWithChildren & {
    isLoading: boolean;
    columns: ColumnDef<T, any>[];
    data: T[];
  }
) {
  const { data, columns, isLoading: loading, children } = props;

  return (
    <tfoot className="z-1 sticky bottom-0">
      <tr className="bg-background">
        <th className="font-normal" colSpan={columns.length}>
          {loading ? (
            <div className="m-4 flex flex-col items-center">
              <LuLoaderCircle className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : null}
          {data.length === 0 && !loading && (
            <span className="my-2 flex justify-center">No Data</span>
          )}
        </th>
      </tr>
      <tr>
        <td colSpan={columns.length}>{children}</td>
      </tr>
    </tfoot>
  );
}
