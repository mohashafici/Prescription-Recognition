"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, Upload } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setFile(null)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Contact Us</h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Need help or want to collaborate? Reach out to us for support, partnership, or academic collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Get In Touch</h2>
                  <p className="text-muted-foreground">
                    Have questions about our technology or interested in implementing it in your healthcare facility?
                    We'd love to hear from you.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">support@prescription.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+252-614-859913</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">Mogadishu, Somalia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message here..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screenshot">Screenshot (optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("screenshot")?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {file ? file.name : "Upload Screenshot"}
                        </Button>
                        {file && <span className="text-sm text-muted-foreground">File selected</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If you're experiencing an issue, a screenshot can help us understand the problem better.
                      </p>
                    </div>

                    {isSuccess && (
                      <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <p className="text-sm text-green-800 dark:text-green-400">
                          Your message has been sent successfully. We'll get back to you soon!
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 text-3xl font-bold">Contact Information</h2>
            <p className="text-muted-foreground">Feel free to reach out to us through the following channels:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Mail className="mx-auto h-6 w-6 text-primary" />
              <h3 className="mt-2 font-medium">Email</h3>
              <p className="text-muted-foreground">support@prescription.com</p>
            </div>
            <div className="text-center">
              <Phone className="mx-auto h-6 w-6 text-primary" />
              <h3 className="mt-2 font-medium">Phone</h3>
              <p className="text-muted-foreground">+252-614-859913</p>
            </div>
            <div className="text-center">
              <MapPin className="mx-auto h-6 w-6 text-primary" />
              <h3 className="mt-2 font-medium">Address</h3>
              <p className="text-muted-foreground">Mogadishu, Somalia</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our prescription recognition system.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6">
            {[
              {
                question: "How accurate is the prescription recognition system?",
                answer:
                  "Our system achieves over 90% accuracy for medical terminology recognition and 95% for character recognition, based on our internal testing with diverse handwriting samples.",
              },
              {
                question: "Is my data secure when using your system?",
                answer:
                  "Yes, we take data security very seriously. All uploads are encrypted, and we comply with healthcare data protection regulations. Your prescription data is only accessible to authorized users.",
              },
              {
                question: "Can the system integrate with existing healthcare software?",
                answer:
                  "Yes, our system is designed with integration in mind. We offer APIs and custom integration solutions to work with electronic health record (EHR) systems and other healthcare software.",
              },
              {
                question: "What file formats are supported for prescription uploads?",
                answer:
                  "Our system supports common image formats including JPEG, PNG, TIFF, and PDF. You can upload scanned documents or photos taken with a smartphone.",
              },
              {
                question: "Do you offer training for new users?",
                answer:
                  "Yes, we provide comprehensive training resources including video tutorials, documentation, and live training sessions for organizations implementing our system.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-medium">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
