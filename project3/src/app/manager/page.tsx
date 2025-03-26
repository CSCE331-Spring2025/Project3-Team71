import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Logout from '@/components/Logout'
import Image from 'next/image'

const ManagerPage = async () => {
  const session = await auth();
  
    if (!session?.user) redirect("/");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl my-3"> Manager {session?.user?.name}</h1>
      
      <Image
        src={session?.user?.image ?? "/default-avatar.png"} // Use a default image if `image` is null or undefined
        alt={session?.user?.name ?? "User avatar"}
        width={72}
        height={72}
      />


      <Logout />
    </div>
  )
}

export default ManagerPage