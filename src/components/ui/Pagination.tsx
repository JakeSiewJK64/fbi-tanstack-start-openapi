import {
  LuArrowLeft as ArrowLeft,
  LuArrowRight as ArrowRight,
  LuChevronsLeft as ChevronsLeft,
  LuChevronsRight as ChevronsRight,
  LuEllipsis as Ellipsis,
} from "react-icons/lu";

import { cn } from "./styling";

export interface PaginationParams {
  onChange: (e: number) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onFirstPage?: () => void;
  onLastPage?: () => void;
  value: number;
  pageCount: number;
  offset?: number;
  disableNext?: boolean;
  disablePrevious?: boolean;
}

/**
 * Pagination component to navigate through paginated data.
 *
 * @param {number} value - The current page number (1-indexed).
 *
 * @param {(e: number) => void} onChange - Callback triggered when the page changes, receiving the new page number as an argument.
 *
 * @param {number} pageCount - Total number of pages available.
 *
 * @param {number} [offset] - Number of pages to display in the pagination control before showing ellipsis.
 *
 * @param {boolean} [disableNext=false] - Disables the "Next" button if set to true.
 *
 * @param {boolean} [disablePrevious=false] - Disables the "Previous" button if set to true.
 *
 * @param {() => void} [onFirstPage] - Callback triggered when the user navigates to the first page.
 *
 * @param {() => void} [onLastPage] - Callback triggered when the user navigates to the last page.
 *
 * @param {() => void} [onNextPage] - Callback triggered when the user navigates to the next page.
 *
 * @param {() => void} [onPreviousPage] - Callback triggered when the user navigates to the previous page.
 */
export function Pagination(props: PaginationParams) {
  const { offset = 7, disableNext = false, disablePrevious = false } = props;

  if (props.pageCount === 0) {
    return null;
  }

  function getIntermediaryPages() {
    function createButtons(start: number, count: number) {
      return Array.from({ length: count }).map((_, index) => {
        const pageIndex = start + index;

        return (
          <button
            key={pageIndex}
            className={cn(
              `h-6 w-6 rounded-md border-slate-300 hover:cursor-pointer disabled:cursor-not-allowed dark:text-white`,
              props.value === pageIndex && "bg-primary text-white"
            )}
            disabled={props.value === pageIndex}
            title={String(pageIndex)}
            type="button"
            onClick={() => props.onChange(pageIndex)}
          >
            <div className="text-sm">{pageIndex}</div>
          </button>
        );
      });
    }

    // Case 1: Total pages are less than the offset
    if (props.pageCount <= offset) {
      return createButtons(1, props.pageCount);
    }

    // Case 2: Current page is somewhere in the middle
    if (props.value >= offset && props.value <= props.pageCount - offset) {
      const start = props.value - Math.floor(offset / 2);

      return (
        <>
          <Ellipsis size={15} />
          {createButtons(start, offset)}
          <div className="pt-1">
            <Ellipsis size={15} />
          </div>
        </>
      );
    }

    // Case 3: Current page is near the end
    if (props.value + offset > props.pageCount) {
      const start = props.pageCount - offset;

      return (
        <>
          <Ellipsis size={15} />
          {createButtons(start, offset + 1)}
        </>
      );
    }

    // Case 4: Current page is near the beginning
    if (props.value - offset < 1) {
      return (
        <>
          {createButtons(1, offset)}
          <Ellipsis size={15} />
        </>
      );
    }

    return null;
  }

  return (
    <div className="my-2 flex flex-row items-center gap-1">
      <button
        aria-label="first page"
        className="h-6 w-6 border-slate-300 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        disabled={disablePrevious}
        title="First Page"
        type="button"
        onClick={() => {
          if (props.onFirstPage) {
            props.onFirstPage();
          }
        }}
      >
        <ChevronsLeft size={15} />
      </button>
      <button
        aria-label="previous one page"
        className="h-6 w-6 border-slate-300 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        disabled={disablePrevious}
        title="Previous Page"
        type="button"
        onClick={() => {
          if (props.onPreviousPage) {
            props.onPreviousPage();
          }
        }}
      >
        <ArrowLeft size={15} />
      </button>
      {getIntermediaryPages()}
      <button
        aria-label="next one page"
        className="h-6 w-6 border-slate-300 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        disabled={disableNext}
        title="Next Page"
        type="button"
        onClick={() => {
          if (props.onNextPage) {
            props.onNextPage();
          }
        }}
      >
        <ArrowRight size={15} />
      </button>
      <button
        aria-label="last page"
        className="h-6 w-6 border-slate-300 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        disabled={disableNext}
        title="Last Page"
        type="button"
        onClick={() => {
          if (props.onLastPage) {
            props.onLastPage();
          }
        }}
      >
        <ChevronsRight size={15} />
      </button>
    </div>
  );
}
