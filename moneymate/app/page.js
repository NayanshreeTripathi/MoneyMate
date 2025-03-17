
import React from 'react'
import { Button } from "@/components/ui/button"
import Landing from '@/components/Landing'
import { featuresData, howItWorksData } from '@/data/landing'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const page = () => {
  return (
    <div className='mt-40'>
      <Landing />
      <div>
        <section className='py-20 bg-blue-50'>
          <div className='container mx-auto  px-4'>
            <h2 className='text-3xl font-bold text-center mb-12'>Everything You Need To Manage Your Finances</h2>
            <div  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
              {featuresData.map((feature, index) => (
                <Card key={index} className='p-6'>
                  <CardContent className='space-y-4 pt-4'>
                    {feature.icon}
                    <h3 className='text-xl font-semibold'>{feature.title}</h3>
                    <p className='text-gray-600'>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className='py-20'>
          <div className='container mx-auto  px-4 text-center'>
            <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
            <div  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>
              {howItWorksData.map((step, index) => (
                <div key={index} >
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'>{step.icon}</div>
                  <h3 className='text-xl font-semibold mb-3'>{step.title}</h3>
                  <p className='text-gray-600'>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='py-20 bg-teal-600 text-white'>
          <div className='container mx-auto  px-4 text-center'>
            <h2 className='text-4xl font-bold text-center mb-4'>Take charge of your finances with MoneyMate</h2>
            <p className='text-teal-50 max-w-2xl mx-auto mb-8'>
              Embark on your MoneyMate journey and take charge of your finances with confidence. Let AI-powered insights simplify budgeting, track spending, and help you build a smarter, stress-free financial future!
            </p>
            <Link href='/dashboard'>
              <Button size='lg' className='bg-white text-teal-600 hover:bg-teal-50 animate-bounce px-8'>Get Started</Button>
            </Link>
          </div>
        </section>

      </div>
    </div>

  )
}

export default page