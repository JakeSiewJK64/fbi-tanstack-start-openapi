import { createColumnHelper } from '@tanstack/react-table';

import type { Column } from '@tanstack/react-table';
import type { CSSProperties } from 'react';

export { createColumnHelper };

export function getPageRecordInfo(params: {
  totalRows: number;
  pageIndex: number;
  pageSize: number;
}) {
  const firstRowNum = params.pageIndex * params.pageSize + 1;
  const currLastRowNum = (params.pageIndex + 1) * params.pageSize;

  const lastRowNum =
    currLastRowNum < params.totalRows ? currLastRowNum : params.totalRows;

  return `${firstRowNum} - ${lastRowNum} of ${params.totalRows}`;
}

export function getCommonPinningStyles<T>(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned();

  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');

  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  let boxShadow: string | undefined;

  if (isLastLeftPinnedColumn) {
    boxShadow = '-4px 0 4px -4px gray inset';
  } else if (isFirstRightPinnedColumn) {
    boxShadow = '4px 0 4px -4px gray inset';
  }

  return {
    boxShadow,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}
