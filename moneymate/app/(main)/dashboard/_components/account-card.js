"use client";
import { updateDefaultAccount } from '@/actions/account';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const AccountCard = ({account}) => {
    const {name,type,balance,id,isDefault} = account;
    const{ loding:updateDefaultLoading, fn:updateDefaultFn, data:updateAccount, error} =useFetch(updateDefaultAccount);
    const handleDefaultAccount = async(event) => {
        event.preventDefault();
        if(isDefault){
            toast.warning('You need to have at least one default account');
            return;
        }
        await updateDefaultFn(id);
    }
    useEffect(() => {
        if(updateAccount?.success){
            toast.success('Default account updated successfully');
        }
      
    }, [updateDefaultFn,updateDefaultLoading]);

    useEffect(() => {
        if(error){
            toast.error('An error occured while updating default account');
        }
      
    }, [error]);
    
    return (
            <Card className='hover:shadow-md transition-shadow cursor-pointer group relative'>
                <Link href={`/account/${id}`}>
                <CardHeader className='flex flex-row space-y-0 pb-2 justify-between items-center'>
                    <CardTitle>{name}</CardTitle>
                    <Switch checked={isDefault} onClick={handleDefaultAccount} disabled={updateDefaultLoading}/>
                </CardHeader>
                <CardContent className='mt-2'>
                    <div className='text-2xl font-bold'>
                        ${parseFloat(balance).toFixed(2)}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {type.charAt(0) + type.slice(1).toLowerCase()} Account
                    </p>
                </CardContent>
                <CardFooter className='flex justify-between text-sm text-muted-foreground mt-4'>
                   <div className='flex items-center'>
                    <ArrowUpRight className='mr-1 h-4 w-4 text-green-500'/>
                    Income
                    </div>
                   <div className='flex items-center'>
                    <ArrowDownRight  className='mr-1 h-4 w-4 text-red-500'/>
                    Expense
                   </div>
                </CardFooter>
                </Link>
            </Card>
    )
}

export default AccountCard