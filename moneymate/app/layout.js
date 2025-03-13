
import Header from "@/components/Header";
import "./globals.css";
import { Inter } from 'next/font/google';
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'] }); 

export const metadata = {
  title: "MoneyMate",
  description: "Your personal finance manager",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <Header/>
        {/* Main content */}
        <main className="min-h-screen">{children}</main>
        {/* Footer */}
        <footer className="bg-gray-100 py-12">
          <div className="container mx-auto text-center ">
            <p className="text-gray-800 font-semibold">MoneyMate - Your AI-Powered Partner for Smarter Financial Decisions.</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
