import { date, z } from "zod";

export const accountSchema = z.object({
    
    name: z.string().min(1,'Account name must be at least 1 character long'),
    type: z.enum(['CURRENT','SAVINGS']),
    balance: z.string().min(1,'Balance must be at least 1 character long'),
    isDefault: z.boolean().default(false),
   
});

export const transactionSchema = z.object({
    type: z.enum(['INCOME','EXPENSE']),
    amount: z.string().min(1,'Amount must be at least 1 character long'),
    description : z.string().optional(),
    date: z.date({required_error: 'Date is required'}),
    accountId: z.string().min(1,'Account ID must be at least 1 character long'),
    category: z.string().min(1,'Category must be at least 1 character long'),
    isRecurring : z.boolean().default(false),
    recurringInterval : z.enum(['DAILY','WEEKLY','MONTHLY']).optional(),  
}).superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required for recurring transactions",
        path: ["recurringInterval"],
      });
    }
});