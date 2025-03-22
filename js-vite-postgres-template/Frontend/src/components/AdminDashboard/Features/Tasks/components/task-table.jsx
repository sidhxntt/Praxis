import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { fetchTasks } from "@/SampleData/AdminDashboard/Tasks/tasks.js";

export function TasksTable({ columns }) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  
  // State for pagination and tasks
  const [tasks, setTasks] = React.useState([]);
  const [totalTasks, setTotalTasks] = React.useState(0);
  const [page, setPage] = React.useState(1); // One-based page for API
  const [limit, setLimit] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch tasks on component mount and when pagination changes
  React.useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const { tasks: fetchedTasks, total, page: fetchedPage, limit: fetchedLimit } = await fetchTasks(page, limit);
        setTasks(fetchedTasks);
        setTotalTasks(total);
        // Update page and limit based on the API response
        setPage(fetchedPage);
        setLimit(fetchedLimit);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTasks([]);
        setTotalTasks(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [page, limit]);

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: page - 1, // Convert one-based page to zero-based pageIndex
        pageSize: limit,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true, // Enable manual pagination
  });

  const handlePaginationChange = (newPage, newLimit) => {
    setPage(newPage); // Update one-based page
    setLimit(newLimit);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={header.column.columnDef.meta?.className ?? ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        totalItems={totalTasks}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}