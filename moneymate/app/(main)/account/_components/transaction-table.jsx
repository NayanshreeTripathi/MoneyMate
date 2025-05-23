"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge } from "@/components/ui/badge";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    MoreHorizontal,
    RefreshCcw,
    Search,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

const TransactionsTable = ({ transactions }) => {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState([]);
    const [sortedConfig, setSortedConfig] = useState({
        field: "date",
        direction: "desc",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");

    const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

    const filteredAndSortedTransaction = useMemo(() => {
        let result = [...transactions];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) =>
                transaction.description?.toLowerCase().includes(searchLower)
            );
        }

        if (recurringFilter) {
            result = result.filter((transaction) =>
                recurringFilter === "recurring" ? transaction.isRecurring : !transaction.isRecurring
            );
        }

        if (typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter);
        }

        result.sort((a, b) => {
            let comparison = 0;
            switch (sortedConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;
                default:
                    break;
            }
            return sortedConfig.direction === "asc" ? comparison : -comparison;
        });

        return result;
    }, [transactions, searchTerm, typeFilter, recurringFilter, sortedConfig]);

    const handleSort = (field) => {
        setSortedConfig((current) => ({
            field,
            direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    const handleSelect = (id) => {
        setSelectedIds((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedIds(
            selectedIds.length === filteredAndSortedTransaction.length
                ? []
                : filteredAndSortedTransaction.map((t) => t.id)
        );
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
            return;
        }
        deleteFn(selectedIds);
    };

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.success("Transaction(s) deleted successfully");
        }
    }, [deleted, deleteLoading]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setSelectedIds([]);
    };

    return (
        <div className="space-y-4">
            {deleteLoading && <BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-8"
                        placeholder="Search Transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringFilter} onValueChange={setRecurringFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">Recurring Only</SelectItem>
                            <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
                        </SelectContent>
                    </Select>

                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            Delete {selectedIds.length}
                        </Button>
                    )}

                    {(searchTerm || typeFilter || recurringFilter) && (
                        <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Transaction Table */}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableCaption>A list of your recent transactions.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    onCheckedChange={handleSelectAll}
                                    checked={
                                        selectedIds.length === filteredAndSortedTransaction.length &&
                                        filteredAndSortedTransaction.length > 0
                                    }
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                                <div className="flex items-center">
                                    Date{" "}
                                    {sortedConfig.field === "date" &&
                                        (sortedConfig.direction === "asc" ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        ))}
                                </div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                                <div className="flex items-center">
                                    Category{" "}
                                    {sortedConfig.field === "category" &&
                                        (sortedConfig.direction === "asc" ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        ))}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                                <div className="flex items-center">
                                    Amount{" "}
                                    {sortedConfig.field === "amount" &&
                                        (sortedConfig.direction === "asc" ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        ))}
                                </div>
                            </TableHead>
                            <TableHead>Recurring</TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedTransaction.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedTransaction.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox
                                            onCheckedChange={() => handleSelect(transaction.id)}
                                            checked={selectedIds.includes(transaction.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className="capitalize">
                                        <span
                                            style={{
                                                backgroundColor:
                                                    categoryColors[transaction.category] || "#6b7280",
                                            }}
                                            className="px-2 py-1 rounded text-white text-sm"
                                        >
                                            {transaction.category || "Uncategorized"}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        style={{ color: transaction.type === "EXPENSE" ? "red" : "green" }}
                                    >
                                        {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.isRecurring ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1 bg-teal-100 text-teal-700 hover:bg-teal-200"
                                                        >
                                                            <RefreshCcw className="h-3 w-3" />
                                                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-sm">
                                                            <div className="font-light">Next Date:</div>
                                                            <div>
                                                                {format(new Date(transaction.nextRecurringDate), "PP")}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Badge variant="outline" className="gap-1">
                                                <Clock className="h-3 w-3" />
                                                One-Time
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(`/transaction/create?edit=${transaction.id}`)
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => deleteFn([transaction.id])}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TransactionsTable;
