import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Upload, Shield, History, Scale, Zap, Brain, FileText, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient py-16 text-white md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Transforming Handwritten Prescriptions into Digital Clarity
              </h1>
              <p className="text-lg md:text-xl">
                 OCR system designed to digitize and decode handwritten medical prescriptions with precision.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10" asChild>
                  <Link href="/how-it-works">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col space-y-6 text-center md:text-left">
                <div className="flex justify-center md:justify-start space-x-2">
                  <div className="h-1 w-20 bg-white rounded-full"></div>
                  <div className="h-1 w-10 bg-white/50 rounded-full"></div>
                  <div className="h-1 w-5 bg-white/30 rounded-full"></div>
                </div>
                <div className="text-white/90 text-lg md:text-xl">
                  {/* <p className="mb-2">Powered by advanced AI technology</p> */}
                  <p>Trusted by healthcare professionals</p>
                </div>
                <div className="flex justify-center md:justify-start space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white/90 text-sm">Fast</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white/90 text-sm">Accurate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-white/90 text-sm">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Key Features</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our system offers a comprehensive solution for digitizing handwritten prescriptions with
              accuracy and efficiency.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="feature-card border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Easy Upload</h3>
                <p className="text-muted-foreground">
                  Upload handwritten prescriptions with ease through our intuitive interface.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Instant Results</h3>
                <p className="text-muted-foreground">Get digital results instantly .</p>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Secure Access</h3>
                <p className="text-muted-foreground">Role-based access ensures your data remains secure and private.</p>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Recognition History</h3>
                <p className="text-muted-foreground">Access and review your past prescription recognitions anytime.</p>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Scalable Solution</h3>
                <p className="text-muted-foreground">
                  Perfect for individual practitioners, clinics, and researchers alike.
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Structured Data</h3>
                <p className="text-muted-foreground">
                  Convert handwritten notes into structured, searchable digital text.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">CNN</h3>
                  <p className="text-sm text-muted-foreground">
                    Convolutional Neural Networks for feature extraction from images.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">CRNN</h3>
                  <p className="text-sm text-muted-foreground">
                    Convolutional Recurrent Neural Networks for sequence prediction.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">TrOCR</h3>
                  <p className="text-sm text-muted-foreground">Transformer OCR for complex handwriting recognition.</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Accuracy</h3>
                  <p className="text-sm text-muted-foreground">
                    High precision recognition even with complex handwriting.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 flex flex-col justify-center space-y-6 md:order-2">
              <h2 className="text-3xl font-bold md:text-4xl">Advanced Technology</h2>
              <p className="text-muted-foreground">
                Our system is using by advanced deep learning models such as CNN, CRNN, and TrOCR. These models ensure
                high accuracy in interpreting even the most complex handwritten notes.
              </p>
              <p className="text-muted-foreground">
                We combine state-of-the-art OCR technology with specialized medical knowledge to provide accurate and
                reliable prescription digitization.
              </p>
              <Button variant="outline" className="w-fit" asChild>
                <Link href="/how-it-works">
                  Learn more about our technology
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Start Digitizing Your Prescriptions Today</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Join healthcare professionals who are streamlining their workflow and reducing errors with our
              prescription recognition system.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Contact </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
