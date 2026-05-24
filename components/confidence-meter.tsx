"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfidenceMeterProps {
  confidence: number | null
  isLoading: boolean
}

export function ConfidenceMeter({ confidence, isLoading }: ConfidenceMeterProps) {
  const getConfidenceLevel = (conf: number) => {
    if (conf >= 90) return { label: "Very High Confidence", color: "text-primary" }
    if (conf >= 75) return { label: "High Confidence", color: "text-primary" }
    if (conf >= 50) return { label: "Medium Confidence", color: "text-warning" }
    return { label: "Low Confidence", color: "text-danger" }
  }

  const displayConfidence = confidence ?? 0
  const { label, color } = getConfidenceLevel(displayConfidence)
  
  // Calculate the rotation for the gauge needle
  const rotation = -90 + (displayConfidence / 100) * 180

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          Confidence Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-2">
        {isLoading ? (
          <div className="h-32 w-32 flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : confidence !== null ? (
          <div className="relative w-40 h-24">
            {/* Gauge background */}
            <svg viewBox="0 0 100 60" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 10 55 A 40 40 0 0 1 90 55"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-muted"
              />
              {/* Colored segments */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(0.6 0.2 30)" />
                  <stop offset="50%" stopColor="oklch(0.75 0.15 85)" />
                  <stop offset="100%" stopColor="oklch(0.55 0.18 145)" />
                </linearGradient>
              </defs>
              <path
                d="M 10 55 A 40 40 0 0 1 90 55"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(displayConfidence / 100) * 126} 126`}
              />
              {/* Needle */}
              <motion.g
                initial={{ rotate: -90 }}
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{ transformOrigin: "50px 55px" }}
              >
                <circle cx="50" cy="55" r="4" className="fill-primary" />
                <path
                  d="M 50 55 L 50 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-primary"
                />
              </motion.g>
              {/* Labels */}
              <text x="8" y="58" fontSize="6" className="fill-muted-foreground">0%</text>
              <text x="82" y="58" fontSize="6" className="fill-muted-foreground">100%</text>
            </svg>
            
            {/* Percentage display */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
              <motion.span
                key={displayConfidence}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-3xl font-bold ${color}`}
              >
                {displayConfidence.toFixed(2)}%
              </motion.span>
              <span className={`text-xs ${color}`}>{label}</span>
            </div>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-2 opacity-30" />
            <span className="text-sm">Upload an image to see confidence</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
