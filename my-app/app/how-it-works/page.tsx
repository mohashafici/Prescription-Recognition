import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Upload, Cpu, FileText, Database, CheckCircle, Brain } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">How It Works</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Our system utilizes Optical Character Recognition (OCR) enhanced by machine learning models to read
              handwritten prescriptions with unprecedented accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Workflow</h2>
            <p className="text-muted-foreground">
              From upload to result, our system processes prescriptions in real-time with a focus on accuracy and speed.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-primary/20 md:block"></div>

            <div className="grid gap-12">
              {/* Step 1 */}
              <div className="relative grid gap-8 md:grid-cols-2">
                <div className="flex flex-col items-end justify-center md:order-1">
                  <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-2 text-xl font-medium">Upload Image</h3>
                    <p className="text-muted-foreground">
                      Upload a photo or scan of the handwritten prescription through our secure interface.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center md:order-2">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Upload className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid gap-8 md:grid-cols-2">
                <div className="flex justify-center md:order-2">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Cpu className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex flex-col justify-center md:order-1">
                  <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-2 text-xl font-medium">Image Preprocessing</h3>
                    <p className="text-muted-foreground">
                      The system enhances the image quality, normalizes lighting, and prepares it for optimal
                      recognition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid gap-8 md:grid-cols-2">
                <div className="flex flex-col items-end justify-center md:order-1">
                  <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-2 text-xl font-medium">Text Prediction</h3>
                    <p className="text-muted-foreground">
                      Our  models (CNN, CRNN, TrOCR) analyze the image and predict the text content with high
                      accuracy.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center md:order-2">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Brain className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative grid gap-8 md:grid-cols-2">
                <div className="flex justify-center md:order-2">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex flex-col justify-center md:order-1">
                  <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-2 text-xl font-medium">Result Display</h3>
                    <p className="text-muted-foreground">
                      The digitized prescription is displayed in a structured, readable format with highlighted
                      confidence levels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative grid gap-8 md:grid-cols-2">
                <div className="flex flex-col items-end justify-center md:order-1">
                  <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="mb-2 text-xl font-medium">Storage & Retrieval</h3>
                    <p className="text-muted-foreground">
                      Results are securely stored and can be accessed, exported, or integrated with other healthcare
                      systems.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center md:order-2">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Database className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Models</h2>
            <p className="text-muted-foreground">
              We use a combination of state-of-the-art deep learning models to achieve the highest possible accuracy in
              prescription recognition.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">CNN</h3>
                </div>
                <h4 className="mb-2 font-medium text-primary">Convolutional Neural Networks</h4>
                <p className="mb-4 text-muted-foreground">
                  CNNs excel at feature extraction from images, identifying patterns and shapes in handwritten text.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Powerful image feature extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Character-level recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Robust to variations in handwriting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">CRNN</h3>
                </div>
                <h4 className="mb-2 font-medium text-primary">Convolutional Recurrent Neural Networks</h4>
                <p className="mb-4 text-muted-foreground">
                  CRNNs combine CNNs with RNNs to handle sequence prediction, ideal for connected handwriting.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Sequential text recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Contextual understanding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Effective for cursive writing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">TrOCR</h3>
                </div>
                <h4 className="mb-2 font-medium text-primary">Transformer OCR</h4>
                <p className="mb-4 text-muted-foreground">
                  TrOCR leverages transformer architecture for state-of-the-art text recognition performance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Advanced attention mechanisms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Superior long-range dependencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm">Handles complex layouts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Accuracy & Performance */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-bold md:text-4xl">Accuracy & Performance</h2>
              <p className="text-muted-foreground">
                Our system has been rigorously tested and optimized to achieve industry-leading accuracy rates for
                handwritten prescription recognition.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Character Recognition</span>
                    <span className="text-primary">95%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[95%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Word Recognition</span>
                    <span className="text-primary">92%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[92%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Medical Term Recognition</span>
                    <span className="text-primary">90%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[90%] rounded-full bg-primary"></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">Processing Speed</span>
                    <span className="text-primary">98%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-2 w-[98%] rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                * Based on internal testing with a diverse dataset of handwritten prescriptions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Experience the Technology?</h2>
            <p className="mb-8 text-muted-foreground">
              See how our prescription recognition system can transform your workflow and improve accuracy.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Try It Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Request a Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
