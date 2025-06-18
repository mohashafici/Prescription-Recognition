"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useDropzone } from "react-dropzone"

interface PredictionResult {
  ocr_text: string;
  found_drugs: string[];
  ocr_confidence: number;
  drug_confidence: number;
}

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Check file type
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or PDF file.",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
      // Create preview URL for image files
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const result = await response.json()
      setPredictionResult(result)
      
      toast({
        title: "Success",
        description: "Prescription processed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process prescription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Upload Prescription</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Prescription</CardTitle>
          <CardDescription>
            Please upload a clear image of a handwritten prescription. Accepted formats: JPG, PNG, PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                  {previewUrl && (
                    <div className="mt-4 max-w-md">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-64 rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {isDragActive ? (
                    <p>Drop the file here ...</p>
                  ) : (
                    <p>Drag & drop a file here, or click to select</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full md:w-auto"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Run Recognition
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {predictionResult ? "Recognition Results" : "Tips for Best Results"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {predictionResult ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">OCR Text:</h4>
                <p className="text-sm text-muted-foreground">{predictionResult.ocr_text}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">OCR Confidence:</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          predictionResult.ocr_confidence >= 80 ? 'bg-green-500' :
                          predictionResult.ocr_confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${predictionResult.ocr_confidence}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      predictionResult.ocr_confidence >= 80 ? 'text-green-600' :
                      predictionResult.ocr_confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {predictionResult.ocr_confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Drug Detection Confidence:</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          predictionResult.drug_confidence >= 80 ? 'bg-green-500' :
                          predictionResult.drug_confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${predictionResult.drug_confidence}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      predictionResult.drug_confidence >= 80 ? 'text-green-600' :
                      predictionResult.drug_confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {predictionResult.drug_confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Found Drugs:</h4>
                {predictionResult.found_drugs.length > 0 ? (
                  <ul className="list-disc pl-4 text-sm text-muted-foreground">
                    {predictionResult.found_drugs.map((drug, index) => (
                      <li key={index}>{drug}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No drugs detected in the prescription.</p>
                )}
              </div>
            </div>
          ) : (
            <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
              <li>Ensure the prescription is well-lit and clearly visible</li>
              <li>Keep the image straight and avoid shadows</li>
              <li>Make sure all text is readable and not blurry</li>
              <li>Include the entire prescription in the image</li>
              <li>For best results, use a high-resolution image</li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 