import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

import Image from 'next/image'
import Link from 'next/link'

import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async() => {
  await checkUser();
  return (
    <div className=' fixed top-0 bg-white/80 w-full z-50 border-b backdrop-blur-md'>
      <nav className='container flex justify-between items-center px-3 py-1'>
        <Link href="/">
          <Image src='/logo.png' alt='logo' width={500} height={60} className='object-contain h-28 w-auto' />
        </Link>
        <div className='flex items-center gap-5'>
          <SignedIn>
            <Link href="/dashboard" className='flex items-center gap-1'>
               <Button variant='outline'>
                <LayoutDashboard size={3} />
                 <span className='hidden md:inline'>Dashboard</span>
               </Button>
            </Link>
            <Link href="/transaction/create" className='flex items-center gap-1'>
               <Button>
                <PenBox size={3} />
                 <span className='hidden md:inline'>Add Transaction</span>
               </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant='outline'>Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{
              elements: {
                avatarBox : "w-20 h-20",
              },
            }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}

export default Header