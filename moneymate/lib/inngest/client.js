import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "money-mate", // Unique app ID
  name:"MoneyMate",
  retryFunctions: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000,
    maxAttempts: 2,
  })
  
});