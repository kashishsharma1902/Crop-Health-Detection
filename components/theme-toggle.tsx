"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  if (!mounted) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Moon className="h-4 w-4 text-primary" />
            Dark Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-muted rounded-full animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Moon className="h-4 w-4 text-primary" />
          Dark Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Switch between light and dark mode for better experience.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Sun className={`h-5 w-5 transition-colors ${!isDark ? "text-warning" : "text-muted-foreground"}`} />
          
          <button
            onClick={toggleTheme}
            className="relative h-7 w-14 rounded-full bg-muted p-1 transition-colors"
            role="switch"
            aria-checked={isDark}
          >
            <motion.div
              className="h-5 w-5 rounded-full bg-primary shadow-sm"
              animate={{ x: isDark ? 26 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          
          <Moon className={`h-5 w-5 transition-colors ${isDark ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </CardContent>
    </Card>
  )
}
