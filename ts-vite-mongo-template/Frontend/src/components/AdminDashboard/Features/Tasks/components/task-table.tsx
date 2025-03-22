import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowData
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
import { Task } from "@/SampleData/AdminDashboard/Tasks/schema";
import { fetchTasks } from "@/SampleData/AdminDashboard/Tasks/tasks";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

interface DataTableProps {
  columns: ColumnDef<Task>[];
}

export function TasksTable({ columns }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  // State for pagination and tasks
  const [tasks, setTasks] = React.useState<Task[]>([]);
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
        
        // Process tasks to ensure they have displayId
        const processedTasks = fetchedTasks.map((task, index) => ({
          ...task,
          // Use displayId if it exists from the API, otherwise generate it
          displayId: task.displayId || ((fetchedPage - 1) * fetchedLimit + index + 1)
        }));
        
        setTasks(processedTasks);
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

  // Modify your columns to use displayId for presentation
  const enhancedColumns = React.useMemo(() => {
    return columns.map(column => {
      // Type-safe way to check for accessorKey property
      if ('accessorKey' in column && column.accessorKey === 'id') {
        return {
          ...column,
          accessorFn: (row: Task) => row.displayId || 'N/A',
        };
      }
      return column;
    });
  }, [columns]);

  const table = useReactTable({
    data: tasks,
    columns: enhancedColumns, // Use the enhanced columns
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

  const handlePaginationChange = (newPage: number, newLimit: number) => {
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