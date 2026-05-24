"use client"

import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, Info, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PredictionResult, DiseaseInfo } from "@/lib/types"

interface PredictionResultProps {
  result: PredictionResult | null
  diseaseInfo: DiseaseInfo | null
  onUploadAnother: () => void
  onDownloadReport: () => void
  isLoading: boolean
}

export function PredictionResultComponent({
  result,
  diseaseInfo,
  onUploadAnother,
  onDownloadReport,
  isLoading
}: PredictionResultProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-medium">Analyzing your crop...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full min-h-[300px]">
          <div className="text-center text-muted-foreground">
            <Info className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No prediction yet</p>
            <p className="text-sm">Upload an image to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
              result.isHealthy ? "bg-primary/20" : "bg-warning/20"
            }`}
          >
            {result.isHealthy ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-warning" />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-1">Prediction</p>
            <h2 className={`text-2xl font-bold ${result.isHealthy ? "text-primary" : "text-warning"}`}>
              {result.crop} - {result.disease.replace(/_/g, " ")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Confidence: <span className="font-semibold">{result.confidence.toFixed(2)}%</span>
            </p>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Preview image */}
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden border bg-muted/30 shrink-0">
            <img
              src={result.imageUrl}
              alt="Analyzed crop"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">About this disease</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {diseaseInfo?.description || "No additional information available."}
            </p>
          </div>
        </div>

        {/* Recommendations */}
        {diseaseInfo && !result.isHealthy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-medium text-sm mb-2">Recommended Actions</h4>
            <ul className="space-y-2">
              {diseaseInfo.recommendations.slice(0, 4).map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onUploadAnother}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Upload Another
          </Button>
          <Button
            className="flex-1"
            onClick={onDownloadReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
