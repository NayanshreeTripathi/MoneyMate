"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializedTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
}

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('You must be logged in to create an account');
        }
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });
        if (!user) {
            throw new Error("User not found")
        }
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true
            },
            data: {
                isDefault: false
            }
        });
        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id
            },
            data: {
                isDefault: true
            }
        });
        revalidatePath('/dashboard');
        return { success: true, account: serializedTransaction(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAccountWithTransactions(accountId) {

    const { userId } = await auth();
    if (!userId) {
        throw new Error('You must be logged in to create an account');
    }
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    });
    if (!user) {
        throw new Error("User not found")
    }

    const account = await db.account.findUnique({
        where: {
            id: accountId,
            userId: user.id
        },
        include: {
            transactions: {
                orderBy: { date: 'desc' }
            },
            _count: {
                select: { transactions: true }
            }
        }
    });
    if (!account) {
        throw new Error('Account not found');
    }
    return {
        ...serializedTransaction(account),
        transactions: account.transactions.map(serializedTransaction),
    };

}

export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('You must be logged in to delete transactions');
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Fetch transactions that belong to the user
        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id
            }
        });

        if (transactions.length === 0) {
            throw new Error("No transactions found for deletion.");
        }

        // Compute account balance changes
        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change = transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {});

        // Delete transactions and update account balances
        await db.$transaction([
            db.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id
                }
            }),
            ...Object.entries(accountBalanceChanges).map(([accountId, balanceChange]) =>
                db.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange // Fixed typo
                        }
                    }
                })
            )
        ]);

        // Revalidate paths to update UI
        revalidatePath('/dashboard');
        revalidatePath('/account/[id]');

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
