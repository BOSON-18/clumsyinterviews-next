"use client"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect } from "react"

const Header = () => {

    const path=usePathname();//Hook hai so use useClient

   
  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src={"/logo.png"} alt="logo" width={100} height={100}></Image>
      <ul className="hidden md:flex gap-6 "> {/**small pr hiedden and md lg pr show hoga */}
        <Link href={"/dashboard"} >
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/dashboard" && "text-primary font-bold"}`}>Dashboard</li>
        </Link>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/dashboard/questions" && "text-primary font-bold"}`} >Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/dashboard/upgrade" && "text-primary font-bold"}`} >Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=="/dashboard/work" && "text-primary font-bold"}`} >How it works ?</li>
      </ul>
      <div className="w-16">
      <UserButton/>
      </div>
    </div>
  )
}

export default Header