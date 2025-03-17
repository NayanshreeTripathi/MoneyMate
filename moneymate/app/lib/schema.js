import { z } from "zod";

export const accountSchema = z.object({
    
    name: z.string().min(1,'Account name must be at least 1 character long'),
    type: z.enum(['CURRENT','SAVINGS']),
    balance: z.string().min(1,'Balance must be at least 1 character long'),
    isDefault: z.boolean().default(false),
   
});