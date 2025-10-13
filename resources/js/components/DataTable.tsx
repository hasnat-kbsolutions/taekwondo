import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    className?: string;
    emptyMessage?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    className = "rounded-md border",
    emptyMessage = "No results.",
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className={className}>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef
                                        .meta as any;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={
                                                meta?.sticky
                                                    ? `sticky z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
                                                          meta.className || ""
                                                      }`
                                                    : ""
                                            }
                                            style={
                                                meta?.sticky
                                                    ? { left: meta.left }
                                                    : {}
                                            }
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef
                                            .meta as any;
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={
                                                    meta?.sticky
                                                        ? `sticky z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
                                                              meta.className ||
                                                              ""
                                                          }`
                                                        : ""
                                                }
                                                style={
                                                    meta?.sticky
                                                        ? { left: meta.left }
                                                        : {}
                                                }
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
