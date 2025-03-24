"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems: number;
  onPaginationChange: (page: number, limit: number) => void;
}

export function DataTablePagination<TData>({
  table,
  totalItems,
  onPaginationChange,
}: DataTablePaginationProps<TData>) {
  const pageState = table.getState().pagination;
  const pageSize = pageState.pageSize;
  const pageIndex = pageState.pageIndex;

  const currentPage = pageIndex + 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);

    // Calculate the new page index to maintain the current view
    const currentFirstItemIndex = pageIndex * pageSize;
    const newPageIndex = Math.floor(currentFirstItemIndex / newPageSize);

    // Update table pagination
    table.setPageSize(newPageSize);

    // Call external pagination handler
    onPaginationChange(newPageIndex + 1, newPageSize);
  };

  const handleFirstPage = () => {
    table.setPageIndex(0);
    onPaginationChange(1, pageSize);
  };

  const handlePreviousPage = () => {
    const newPage = currentPage - 1;
    table.previousPage();
    onPaginationChange(newPage, pageSize);
  };

  const handleNextPage = () => {
    const newPage = currentPage + 1;
    table.nextPage();
    onPaginationChange(newPage, pageSize);
  };

  const handleLastPage = () => {
    table.setPageIndex(totalPages - 1);
    onPaginationChange(totalPages, pageSize);
  };

  return (
    <div
      className="flex items-center justify-between overflow-clip px-2"
      style={{ overflowClipMargin: 1 }}
    >
      <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleLastPage}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
