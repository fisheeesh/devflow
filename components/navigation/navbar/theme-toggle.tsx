"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const getImageFilter = (themeType: string) => {
    const isActive = theme === themeType
    return isActive
      ? 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(17deg) brightness(118%) contrast(101%)'
      : ''
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" fill="#ff7000" stroke="#ff7000" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" fill="#ff7000" stroke="#ff7000" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="background-light900_dark200">
        <DropdownMenuItem onClick={() => setTheme("light")} className="font-bold flex items-center gap-3 hover:background-light900_dark300">
          <Image
            src='/icons/sun.svg'
            alt='sun'
            width={16}
            height={16}
            style={{
              filter: getImageFilter("light")
            }}
            className="transition-all duration-200"
          />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="font-bold flex items-center gap-3 hover:background-light900_dark300">
          <Image
            src='/icons/moon.svg'
            alt='moon'
            width={16}
            height={16}
            style={{
              filter: getImageFilter("dark")
            }}
            className="transition-all duration-200"
          />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="font-bold flex items-center gap-3 hover:background-light900_dark300">
          <Image
            src='/icons/computer.svg'
            alt='computer'
            width={16}
            height={16}
            style={{
              filter: getImageFilter("system")
            }}
            className="transition-all duration-200"
          />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}