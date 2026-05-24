"use client"

import { motion } from "framer-motion"
import { Clock, ExternalLink, Leaf } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { HistoryItem } from "@/lib/types"

interface HistoryPanelProps {
  history: HistoryItem[]
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-primary" />
          Recent Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Clock className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No history yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1 font-medium text-muted-foreground">Image</th>
                    <th className="text-left py-2 px-1 font-medium text-muted-foreground">Prediction</th>
                    <th className="text-left py-2 px-1 font-medium text-muted-foreground">Confidence</th>
                    <th className="text-left py-2 px-1 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-2 px-1">
                        <div className="h-8 w-8 rounded overflow-hidden bg-muted">
                          <img
                            src={item.imageUrl}
                            alt={`${item.crop} - ${item.disease}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-2 px-1">
                        <div className="flex items-center gap-1">
                          {item.isHealthy ? (
                            <Leaf className="h-3 w-3 text-primary" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-warning" />
                          )}
                          <span className="font-medium">{item.disease.replace(/_/g, " ")}</span>
                        </div>
                      </td>
                      <td className="py-2 px-1">
                        <span className={`font-medium ${
                          item.confidence >= 80 ? "text-primary" : 
                          item.confidence >= 50 ? "text-warning" : "text-danger"
                        }`}>
                          {item.confidence.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2 px-1 text-muted-foreground">
                        {formatDate(item.timestamp)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {history.length > 5 && (
              <Button variant="link" className="w-full mt-2 text-primary">
                View All History
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
