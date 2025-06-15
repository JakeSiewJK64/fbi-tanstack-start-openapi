import React from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { Table as TSTable } from "@tanstack/react-table";

import { cn } from "../styling";

import { Pagination } from "../Pagination";
import { TBody } from "./TBody";
import { TColumnToggle } from "./TColumnToggle";
import { TFilterPopover } from "./TFilterPopover";
import { TFooter } from "./TFooter";
import { THeader } from "./THeader";
import { getPageRecordInfo } from "./utils";

import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  SortingState,
} from "@tanstack/react-table";

import "./table.css";

export interface BaseAPIOptions {
  pageSize: number;
  pageIndex: number;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
}

interface ServerSideProps {
  /** Whether to use server-side data fetching. If `true`, `fetchData` must be provided. */
  serverSideDataSource?: true;

  /** The total number of records available. Only applicable to server
   * side data source to display record information.
   **/
  total: number;

  /** A function to fetch data from the server. Called with options including `pageIndex`, `pageSize`, and `sorting`. */
  fetchData: ({ pageIndex, pageSize, sorting }: BaseAPIOptions) => void;

  /** The total number of pages available (used for server-side pagination). */
  pageCount: number;

  /** Reset selection on filter change. */
  resetSelectionOnFilterChange?: boolean;
}

interface NonServerSideProps {
  serverSideDataSource?: false;
}

type TableProps<T> = (ServerSideProps | NonServerSideProps) & {
  /** Custom filter component */
  filterComponent?: React.ReactElement | null;

  /** A list of options for rows per page in the pagination dropdown. */
  pageSizeOptions?: string[];

  /** The data to display in the table. */
  data: T[];

  /** An array of column definitions to configure table headers and cell rendering. */
  columns: ColumnDef<T, Extract<string, keyof T>>[];

  /** Callback for on rows selected */
  onRowSelect?: (selectedRows: T[], isAllRowSelected: boolean) => void;

  /** The initial number of rows displayed per page. */
  initialPageSize?: number;

  /** The initial page index (0-based) when the table loads. */
  initialPageIndex?: number;

  /** Whether the table is in a loading state, displaying a loading indicator. */
  loading?: boolean;

  /** Whether pagination is enabled for the table. */
  pagination?: boolean;

  /** Is row selection enabled. */
  selection?: boolean;

  /** Class styling for table. */
  className?: string;

  /** Custom footer for table. */
  footer?: React.ReactNode;

  /** Default pinned columns. */
  defaultColumnPin?: ColumnPinningState;
};

export function Table<T>(props: TableProps<T>) {
  const {
    data = [],
    columns = [],
    pageSizeOptions = ["5", "10", "20", "50", "100"],
    pagination = false,
    loading = false,
    selection = false,
    initialPageSize = 10,
    initialPageIndex = 0,
    className,
    footer = null,
    filterComponent = null,
    defaultColumnPin = { left: [], right: [] },
    ...rest
  } = props;

  const reactTable: TSTable<T> = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // for client side filtering
    initialState: {
      pagination: {
        pageIndex: initialPageIndex,
        pageSize: initialPageSize,
      },
      columnPinning: defaultColumnPin,
    },
    ...(rest.serverSideDataSource && {
      pageCount: rest.pageCount,
      manualPagination: true,
      manualSorting: true,
      manualFiltering: true,
    }),
    enableRowSelection: selection,
    columnResizeMode: "onChange",
  });

  const {
    pagination: paginationInfo,
    columnFilters,
    sorting,
    rowSelection,
  } = reactTable.getState();

  const { pageIndex, pageSize } = paginationInfo;

  React.useEffect(() => {
    if (!rest.serverSideDataSource) {
      return;
    }

    if (rest.resetSelectionOnFilterChange) {
      reactTable.resetRowSelection();
    }

    if (rest.fetchData) {
      rest.fetchData({
        pageIndex,
        pageSize,
        sorting,
        columnFilters,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex, columnFilters, sorting]);

  React.useEffect(() => {
    if (rest.onRowSelect) {
      rest.onRowSelect(
        reactTable.getSelectedRowModel().rows.map((row) => row.original),
        reactTable.getIsAllRowsSelected()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  return (
    <div className="dark:bg-secondary dark:text-white">
      <div className="flex flex-row items-center justify-between gap-1">
        <div className="flex flex-row gap-1">
          <TColumnToggle columns={reactTable.getAllColumns()} />
          <TFilterPopover>{filterComponent}</TFilterPopover>
        </div>
        {pagination ? (
          <div className="flex flex-row items-center gap-4">
            <label
              className="min-w-[5rem] text-sm dark:text-white"
              htmlFor="select-pagesize"
            >
              Page Size:{" "}
            </label>
            <select
              aria-label="select-pagesize"
              className="bg-white-50 dark:bg-secondary w-fit rounded-md border border-gray-300 text-sm text-gray-900 dark:text-white dark:placeholder-gray-400"
              id="select-pagesize"
              value={reactTable.getState().pagination.pageSize}
              onChange={(e) => {
                reactTable.setPageSize(Number(e.target.value));
              }}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {data.length !== 0 && (
              <span className="text-nowrap text-sm dark:text-white">
                {getPageRecordInfo({
                  pageIndex,
                  pageSize,
                  totalRows: rest.serverSideDataSource
                    ? rest.total
                    : reactTable.getRowCount(),
                })}
              </span>
            )}
            <Pagination
              disableNext={!reactTable.getCanNextPage()}
              disablePrevious={!reactTable.getCanPreviousPage()}
              pageCount={reactTable.getPageCount()}
              value={reactTable.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                reactTable.setPageIndex(Number(e) - 1);
              }}
              onFirstPage={() => {
                reactTable.firstPage();
              }}
              onLastPage={() => {
                reactTable.lastPage();
              }}
              onNextPage={() => reactTable.nextPage()}
              onPreviousPage={() => reactTable.previousPage()}
            />
          </div>
        ) : null}
      </div>
      <div className={cn("max-h-[50rem] w-full overflow-auto", className)}>
        <table className="min-w-full">
          <THeader headerGroups={reactTable.getHeaderGroups()} />
          <TBody rows={reactTable.getRowModel().rows} />
          <TFooter columns={columns} data={data} isLoading={loading}>
            {footer}
          </TFooter>
        </table>
      </div>
    </div>
  );
}
