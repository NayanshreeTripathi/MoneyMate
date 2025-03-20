
import { getAccountWithTransactions } from '@/actions/account'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/account-chart';
import TransactionsTable from '../_components/transaction-table';


const AccountPage = async ({ params }) => {
  const accountData = await getAccountWithTransactions(params.id);
  if (!accountData) {
    notFound();
  }
  const { transactions, ...account } = accountData;
  return (
    <div className='space-y-8 px-7'> 
    <div className="flex gap-4 items-center justify-between">
      <div>
        <h1 className="text-5xl font-bold gradient-title capitalize">{account.name}</h1>
        <p className="text-muted-foreground">
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold">${parseFloat(account.balance).toFixed(2)}</div>
        <p className='text-muted-foreground'>{account._count.transactions} Transactions</p>
      </div>
    </div>
      {/* chart section */}
      <Suspense fallback={<BarLoader width={'100%'} className='mt-4' color="#2563EB" />}>
        <AccountChart  transactions={transactions} />
      </Suspense>


      {/* transaction table */}

      <Suspense fallback={<BarLoader width={'100%'} className='mt-4' color="#2563EB" />}>
        <TransactionsTable transactions={transactions} />
      </Suspense>
       

    </div>

  )
}

export default AccountPage
