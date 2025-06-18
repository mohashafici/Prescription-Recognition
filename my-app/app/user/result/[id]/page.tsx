"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"

interface OCRResult {
  id: string
  imageUrl: string
  text: string
  confidence: number
  model: string
  createdAt: string
}

export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [scale, setScale] = useState(1)

  // TODO: Fetch actual result data from API
  const result: OCRResult = {
    id: params.id,
    imageUrl: "/placeholder-prescription.jpg",
    text: "Sample recognized text will appear here...",
    confidence: 0.95,
    model: "TrOCR",
    createdAt: new Date().toISOString(),
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Downloading result...")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-4">
          <Link href="/user/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">OCR Result</h2>
        </div>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Image Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Original Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-muted">
              <img
                src={result.imageUrl}
                alt="Prescription"
                className="h-full w-full object-contain"
                style={{ transform: `scale(${scale})` }}
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setScale(Math.max(1, scale - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setScale(Math.min(3, scale + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recognized Text */}
        <Card>
          <CardHeader>
            <CardTitle>Recognized Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {result.text}
              </pre>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Model:</span> {result.model}
              </div>
              <div>
                <span className="font-medium">Confidence:</span>{" "}
                {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 