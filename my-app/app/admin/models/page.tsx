"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Brain, Package, Calendar, Target, Zap, Layers, Server, Shield } from "lucide-react"

export default function ModelPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">OCR Model Information</h2>
          <p className="text-muted-foreground">
            Details of the active model used for interpreting handwritten prescriptions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Model Name</p>
                <p className="text-sm text-muted-foreground">CNN + BERT Hybrid</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Version</p>
                <p className="text-sm text-muted-foreground">v1.0</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Deployed On</p>
                <p className="text-sm text-muted-foreground">May 25, 2025</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Accuracy</p>
                <p className="text-sm text-muted-foreground">99.9% (on test set)</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Inference Time</p>
                <p className="text-sm text-muted-foreground">~1.3s per image</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Layers className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Architecture</p>
                <p className="text-sm text-muted-foreground">CNN for visual features + BERT for text correction</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Server className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Served From</p>
                <p className="text-sm text-muted-foreground">Flask API endpoint /predict</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant="success" className="mt-1">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active and In Use
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The system uses a hybrid deep learning model that combines a Convolutional Neural Network (CNN) for extracting features from handwritten prescription images and a BERT model for refining and correcting recognized text. This combination improves recognition accuracy, especially for complex drug names and irregular handwriting. The model is deployed through a Flask API and actively used for all OCR processing in the platform.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 