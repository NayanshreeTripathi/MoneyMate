"use client"; 
import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from 'react'

const page = () => {
  const { userId } = useAuth(); // Get current user
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      router.push("/dashboard"); // Redirect if already signed in
    }
  }, [userId, router]);

  if (userId) return null; // Prevents rendering SignIn when signed in

  return <SignIn />;

}

export default page