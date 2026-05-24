"use client"

import { motion } from "framer-motion"
import { BookOpen, Leaf, Bug, AlertCircle, Wind, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DiseaseInfo } from "@/lib/types"

interface DiseaseInfoPanelProps {
  diseaseInfo: DiseaseInfo | null
  isLoading: boolean
}

export function DiseaseInfoPanel({ diseaseInfo, isLoading }: DiseaseInfoPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "text-primary bg-primary/10"
      case "Medium": return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
      case "High": return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "Critical": return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      default: return "text-muted-foreground bg-muted"
    }
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Disease Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!diseaseInfo) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Disease Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
          <BookOpen className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Disease details will appear here</p>
        </CardContent>
      </Card>
    )
  }

  const infoItems = [
    { icon: Leaf, label: "Common Name", value: diseaseInfo.commonName },
    { icon: Bug, label: "Scientific Name", value: diseaseInfo.scientificName, italic: true },
    { icon: Leaf, label: "Affects", value: diseaseInfo.affects },
    { icon: AlertCircle, label: "Severity", value: diseaseInfo.severity, badge: true },
    { icon: Wind, label: "Spread", value: diseaseInfo.spread },
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="h-4 w-4 text-primary" />
          Disease Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              {item.badge ? (
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(item.value)}`}>
                  {item.value}
                </span>
              ) : (
                <p className={`text-sm font-medium truncate ${item.italic ? "italic" : ""}`}>
                  {item.value}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        
        <Button variant="link" className="px-0 h-auto text-primary text-sm mt-2">
          View Detailed Guide
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
