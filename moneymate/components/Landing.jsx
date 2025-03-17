"use client";

import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const Landing = () => {
  
  const imageRef = useRef(null);

    useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxTilt = 30; // Maximum tilt angle in degrees

      // Calculate the tilt angle (reduces as the user scrolls down)
      const tiltAngle = Math.max(0, maxTilt - (scrollPosition / 10));

      // Apply transform dynamically
      imageElement.style.transform = `rotateX(${tiltAngle}deg)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  
  

  return (
    <div className='pb-20 px-4'>
      <div className='container mx-auto text-center'>
        <h1 className='text-5xl md:text-8xl lg:text-[100px] pd-6 gradient-title'>Financial Companion for Smarter <br/> Money Management</h1>
        <p className='text-xl text-gray-900 max-w-200 mb-8 mx-auto'>MoneyMate – AI-powered financial wisdom at your fingertips. Track, save, and grow your money smarter than ever!</p>
      </div>
      <div className='flex justify-center'>
        <Link href='/dashboard'>
          <Button size='lg' className='px-8'>Get Started</Button>
        </Link>
      </div>
      <div className='image-wrapper mt-12'>
        <div  ref={imageRef} className='main-image'>
        <Image src='/banner.jpg' width={1280} height={720} alt='dashboard preview'
        className='rounded-lg shadow-2xl border mx-auto  h-[600px] w-[700px]'
        priority/>
        </div>
      </div>
    </div>
  )
}

export default Landing
