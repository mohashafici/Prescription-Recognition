import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Award, BookOpen, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">About Prescription</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              We are a team of developers and researchers committed to solving one of the most overlooked challenges in
              the healthcare industry — the interpretation of handwritten prescriptions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex items-center justify-center"></div>
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-bold md:text-4xl">Our Mission</h2>
              <p className="text-muted-foreground">
                At Prescription, our mission is to transform healthcare documentation through innovative solutions.
                We believe that by digitizing handwritten prescriptions, we can reduce medical errors, improve patient
                outcomes, and save valuable time for healthcare professionals.
              </p>
              <p className="text-muted-foreground">
                Our team combines expertise in artificial intelligence, and user experience design to create
                a solution that is not only technologically advanced but also practical and easy to use in real-world
                healthcare settings.
              </p>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-medium">Committed to improving healthcare through technology</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why This Matters</h2>
            <p className="text-muted-foreground">
              Misreading prescriptions can lead to serious health complications. Our system uses cutting-edge OCR 
              to minimize such risks by converting handwritten prescriptions into structured digital text.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Patient Safety</h3>
                <p className="text-muted-foreground">
                  Reducing prescription errors means better patient outcomes and improved safety in medication
                  administration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Healthcare Efficiency</h3>
                <p className="text-muted-foreground">
                  Streamlining the prescription process saves time for healthcare professionals and pharmacists.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-medium">Research Advancement</h3>
                <p className="text-muted-foreground">
                  Digitized prescriptions create valuable datasets for medical research and healthcare improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Team</h2>
            <p className="text-muted-foreground">
              We are a dedicated team of  researchers and software engineers working
              together to revolutionize prescription management.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/50" />
              </div>
              <h3 className="mb-1 text-lg font-medium">MOHAMED SHAFICI ABDIRAHMAN</h3>
              <p className="mb-2 text-sm text-primary">LEADER</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/50" />
              </div>
              <h3 className="mb-1 text-lg font-medium">ADBISHAKUUR</h3>
              <p className="mb-2 text-sm text-primary">Member</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/50" />
              </div>
              <h3 className="mb-1 text-lg font-medium">ABDIRISAQ</h3>
              <p className="mb-2 text-sm text-primary">Member</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-16 w-16 text-primary/50" />
              </div>
              <h3 className="mb-1 text-lg font-medium">MOHAMED ABDI ALI</h3>
              <p className="mb-2 text-sm text-primary">Member</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Background */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl font-bold md:text-4xl">Academic Background</h2>
              <p className="text-muted-foreground">
                This system is part of an academic research project focused on AI-based medical document analysis and
                digital transformation in healthcare.
              </p>
              <p className="text-muted-foreground">
                Our research has been guided by the latest advancements in computer vision, natural language processing,
                and healthcare informatics. We have collaborated with medical professionals to ensure our solution meets
                real-world clinical needs.
              </p>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Bridging academic research with practical healthcare solutions</span>
              </div>
              <Button className="w-fit" asChild>
                <Link href="/how-it-works">
                  Explore Our Technology
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-center text-white md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Join Us in Transforming Healthcare</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Whether you're a healthcare provider looking to improve your workflow or a researcher interested in our
              technology, we'd love to connect with you.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
