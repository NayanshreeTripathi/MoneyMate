"use client";

import { createTransaction, updateTransaction } from '@/actions/transaction';
import { transactionSchema } from '@/app/lib/schema';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar1Icon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ReceiptScanner from './reciept-scanner';

const AddTransactionForm = ({ accounts, categories ,editMode = false,initialData=null}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams?.get('edit');
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        watch,
        getValues,
        reset,
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues:
        editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
    });

    const {
        loding: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
    } = useFetch(editMode ? updateTransaction : createTransaction);

    const type = watch('type');
    const isRecurring = watch('isRecurring');
    const date = watch('date');

    const onSubmit = async (data) => {
        const formdata = {
            ...data,
            amount: parseFloat(data.amount),
        };
        if (editMode) {
            transactionFn(editId, formdata);
        }
        else{
            transactionFn(formdata);
        }
    };

    useEffect(() => {
        if (transactionResult?.success && !transactionLoading) {
            toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
    }, [transactionResult, transactionLoading , editMode])

    const filteredCategories = categories.filter((category) => category.type === type);
    const handleScanComplete = (scannedData) => {
        console.log(scannedData);
        if (scannedData) {
            setValue('amount', scannedData.amount.toString());
            setValue('date', new Date(scannedData.date));
            if (scannedData.description) {
                setValue('description', scannedData.description);
            }
            if (scannedData.category) {
                setValue('category', scannedData.category);
            }
        }
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-xl rounded-xl border bg-white p-6 shadow-sm space-y-6"
        >
            {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}
            {/* --- Type --- */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                    defaultValue={getValues('type')}
                    onValueChange={(v) => setValue('type', v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            {/* --- Amount & Account --- */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('amount')}
                    />
                    {errors.amount && (
                        <p className="text-xs text-red-500">{errors.amount.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Account</label>
                    <Select
                        defaultValue={getValues('accountId')}
                        onValueChange={(v) => setValue('accountId', v)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((ac) => (
                                <SelectItem key={ac.id} value={ac.id}>
                                    {ac.name}&nbsp;(${parseFloat(ac.balance).toFixed(2)})
                                </SelectItem>
                            ))}
                            <CreateAccountDrawer>
                                <Button variant="ghost" className="w-full justify-start">
                                    + Create Account
                                </Button>
                            </CreateAccountDrawer>
                        </SelectContent>
                    </Select>
                    {errors.accountId && (
                        <p className="text-xs text-red-500">{errors.accountId.message}</p>
                    )}
                </div>
            </div>

            {/* --- Category --- */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                    defaultValue={getValues('category')}
                    onValueChange={(v) => setValue('category', v)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && (
                    <p className="text-xs text-red-500">{errors.category.message}</p>
                )}
            </div>

            {/* --- Date --- */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex w-full items-center justify-between"
                        >
                            {date ? format(date, 'PPP') : 'Pick a date'}
                            <Calendar1Icon className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => setValue('date', d)}
                            disabled={(d) => d > new Date() || d < new Date('1900-01-01')}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            {/* --- Description --- */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                    placeholder="Enter description"
                    {...register('description')}
                />
                {errors.description && (
                    <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
            </div>

            {/* --- Recurring --- */}
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <label className="text-sm font-medium">Recurring Transaction</label>
                    <p className="text-xs text-muted-foreground">
                        Set up a recurring schedule
                    </p>
                </div>
                <Switch
                    checked={isRecurring}
                    onCheckedChange={(c) => setValue('isRecurring', c)}
                />
            </div>

            {isRecurring && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Recurring Interval</label>
                    <Select
                        defaultValue={getValues('recurringInterval')}
                        onValueChange={(v) => setValue('recurringInterval', v)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.recurringInterval && (
                        <p className="text-xs text-red-500">
                            {errors.recurringInterval.message}
                        </p>
                    )}
                </div>
            )}

            {/* --- Footer Buttons --- */}
            <div className="flex w-fit flex-col gap-3 pt-2 sm:flex-row">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={transactionLoading}
                >
                    {editMode?"Edit Transaction" : "Create Transaction"}
                </Button>
            </div>
        </form>

    );
};

export default AddTransactionForm;
