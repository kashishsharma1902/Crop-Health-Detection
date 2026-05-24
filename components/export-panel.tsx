"use client"

import { FileText, Share2, Link2, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ExportPanelProps {
  onDownloadPDF: () => void
  onShare: () => void
  onCopyLink: () => void
  hasResult: boolean
}

export function ExportPanel({ onDownloadPDF, onShare, onCopyLink, hasResult }: ExportPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4 text-primary" />
          Export / Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onDownloadPDF}
          disabled={!hasResult}
        >
          <FileText className="h-4 w-4 mr-2" />
          Download Report (PDF)
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onShare}
          disabled={!hasResult}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Result
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onCopyLink}
          disabled={!hasResult}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copy Result Link
        </Button>
      </CardContent>
    </Card>
  )
}
