import { useState, useEffect } from "react";
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
import { fetchUsers } from "@/SampleData/AdminDashboard/Users/users";

export function UsersTable({ columns }) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  // State for pagination and users
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1); // One-based page for API
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users on component mount and when pagination changes
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const {
          users: fetchedUsers,
          total,
          page: fetchedPage,
          limit: fetchedLimit,
        } = await fetchUsers(page, limit);
        setUsers(fetchedUsers);
        setTotalUsers(total);
        // Update page and limit based on the API response
        setPage(fetchedPage);
        setLimit(fetchedLimit);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [page, limit]);

  const table = useReactTable({
    data: users,
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
        totalItems={totalUsers}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
}
