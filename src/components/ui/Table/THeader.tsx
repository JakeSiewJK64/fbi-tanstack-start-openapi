import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import {
  LuArrowUp,
  LuArrowUpDown,
  LuMoveHorizontal,
  LuPin,
  LuPinOff,
} from "react-icons/lu";

import { getCommonPinningStyles } from "./utils";

export function THeader<T>(props: { headerGroups: HeaderGroup<T>[] }) {
  const { headerGroups } = props;

  return (
    <thead className="z-2 sticky top-0">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();
            const isPinned = header.column.getIsPinned();
            const canPin = header.column.getCanPin();
            const canResize = header.column.getCanResize();

            const headerTitle = flexRender(
              header.column.columnDef.header,
              header.getContext()
            );

            return (
              <th
                key={header.id}
                className="dark:bg-secondary bg-background p-4"
                style={{ ...getCommonPinningStyles(header.column) }}
              >
                <div className="flex flex-row items-center justify-between gap-2">
                  <span>{headerTitle}</span>
                  <div className="flex flex-row gap-2">
                    {canSort ? (
                      <button
                        title={`Sort by ${headerTitle}`}
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {isSorted ? (
                          <div
                            className={`transform transition-transform duration-300 ${
                              header.column.getIsSorted() === "asc"
                                ? "rotate-0"
                                : "rotate-180"
                            }`}
                          >
                            <LuArrowUp size={15} />
                          </div>
                        ) : (
                          <LuArrowUpDown size={15} />
                        )}
                      </button>
                    ) : null}
                    {canPin ? (
                      <div
                        className="cursor-pointer rounded-full p-1"
                        title={
                          !isPinned
                            ? `Pin ${headerTitle} column`
                            : {
                                left: `Change ${headerTitle} pin position`,
                                right: `Unpin ${headerTitle}`,
                              }[isPinned]
                        }
                        onClick={() => {
                          if (!isPinned) {
                            header.column.pin("left");

                            return;
                          }

                          if (isPinned === "left") {
                            header.column.pin("right");

                            return;
                          }

                          header.column.pin(false);
                        }}
                      >
                        {!isPinned ? (
                          <LuPinOff size={15} />
                        ) : (
                          <LuPin size={15} />
                        )}
                      </div>
                    ) : null}
                    {canResize ? (
                      <div
                        className="my-auto"
                        title="Adjust column width"
                        onDoubleClick={() => {
                          header.column.resetSize();
                        }}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      >
                        <LuMoveHorizontal
                          className="cursor-ew-resize"
                          size={15}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
