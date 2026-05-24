"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Leaf,
  Sparkles,
  Camera,
  MapPin,
  Mic,
  Globe2,
  BarChart3,
  CloudSun,
  MessageCircle,
  ShieldCheck,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  Cpu,
  Compass,
  BellRing,
  Share,
  Sparkle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { ConfidenceMeter } from "@/components/confidence-meter"
import { PredictionResultComponent } from "@/components/prediction-result"
import { DiseaseInfoPanel } from "@/components/disease-info-panel"
import { PreventionTips } from "@/components/prevention-tips"
import { HistoryPanel } from "@/components/history-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { diseaseDatabase, type PredictionResult, type DiseaseInfo, type HistoryItem } from "@/lib/types"

type AnalyticsWidget = {
  label: string
  value: string
  icon: LucideIcon
  accent: string
}

type UploadAction = {
  title: string
  icon: LucideIcon
  description: string
  color: string
}

const analyticsWidgets: AnalyticsWidget[] = [
  { label: "Total Scans", value: "1,258", icon: Activity, accent: "from-emerald-500 to-lime-400" },
  { label: "Healthy Crops", value: "842", icon: ShieldCheck, accent: "from-sky-500 to-cyan-400" },
  { label: "Diseased Crops", value: "416", icon: AlertTriangle, accent: "from-orange-500 to-amber-400" },
  { label: "Accuracy", value: "94.7%", icon: BarChart3, accent: "from-violet-500 to-fuchsia-400" },
]

const uploadActions: UploadAction[] = [
  { title: "Camera", icon: Camera, description: "Capture fresh crop images", color: "bg-emerald-100 text-emerald-700" },
  { title: "Gallery", icon: Upload, description: "Browse existing photos", color: "bg-sky-100 text-sky-700" },
  { title: "Drone", icon: MapPin, description: "Upload drone imagery", color: "bg-lime-100 text-lime-700" },
]

async function predictDisease(imageFile: File): Promise<PredictionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800))

  const diseases = [
    { crop: "Corn", disease: "Common_Rust", confidence: 94.5 },
    { crop: "Corn", disease: "Gray_Leaf_Spot", confidence: 87.2 },
    { crop: "Potato", disease: "Early_Blight", confidence: 91.8 },
    { crop: "Potato", disease: "Late_Blight", confidence: 88.4 },
    { crop: "Rice", disease: "Leaf_Blast", confidence: 92.1 },
    { crop: "Rice", disease: "Brown_Spot", confidence: 85.7 },
    { crop: "Wheat", disease: "Yellow_Rust", confidence: 89.3 },
    { crop: "Corn", disease: "Healthy", confidence: 96.8 },
    { crop: "Rice", disease: "Healthy", confidence: 98.2 },
  ]

  const randomResult = diseases[Math.floor(Math.random() * diseases.length)]

  return {
    crop: randomResult.crop,
    disease: randomResult.disease,
    confidence: randomResult.confidence + (Math.random() * 4 - 2),
    isHealthy: randomResult.disease === "Healthy",
    imageUrl: URL.createObjectURL(imageFile),
    timestamp: new Date(),
  }
}

export default function CropHealthDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 3200)
  }, [])

  const handleImageSelect = useCallback(
    async (file: File, preview: string) => {
      setSelectedImage(preview)
      setIsLoading(true)
      setResult(null)
      setDiseaseInfo(null)

      try {
        const prediction = await predictDisease(file)
        setResult(prediction)

        const info = diseaseDatabase[prediction.disease] || diseaseDatabase["Healthy"]
        setDiseaseInfo(info)

        const historyItem: HistoryItem = {
          ...prediction,
          id: crypto.randomUUID(),
        }

        setHistory((prev) => [historyItem, ...prev].slice(0, 12))
        showToast(`Prediction complete: ${prediction.disease.replace(/_/g, " ")}`)
      } catch (error) {
        console.error("Prediction error:", error)
        showToast("Prediction failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [showToast],
  )

  const handleUploadAnother = useCallback(() => {
    setSelectedImage(null)
    setResult(null)
    setDiseaseInfo(null)
    showToast("Ready for next scan")
  }, [showToast])

  const handleQuickUpload = useCallback((channel: string) => {
    showToast(`${channel} upload selected`)
  }, [showToast])

  const handleDownloadReport = useCallback(() => {
    if (!result) return

    const report = `Crop Health Detection AI Report\n\nCrop: ${result.crop}\nDisease: ${result.disease.replace(/_/g, " ")}\nConfidence: ${result.confidence.toFixed(2)}%\nStatus: ${result.isHealthy ? "Healthy" : "Disease Detected"}\n\nRecommendations:\n${diseaseInfo?.recommendations.map((item) => `- ${item}`).join("\n") || "N/A"}\n\nGenerated by Crop Health Detection AI`;

    const blob = new Blob([report], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `crop-health-report-${Date.now()}.pdf`
    anchor.click()
    URL.revokeObjectURL(url)
    showToast("Report download started")
  }, [result, diseaseInfo, showToast])

  const totalScans = history.length
  const healthyCount = history.filter((item) => item.isHealthy).length
  const diseasedCount = totalScans - healthyCount

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,#ecfdf5_0%,#f8fafc_100%)] text-slate-900">
      <div className="border-b border-slate-200/70 bg-white/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Smart Farming Dashboard</p>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Crop Disease Detection AI</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" className="gap-2 px-4 py-2">
              <BellRing className="h-4 w-4" /> Alerts
            </Button>
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <Sparkles className="h-4 w-4" /> Analytics
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <Card className="border-2 border-emerald-100/80 bg-white/95 shadow-xl">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Side actions</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">Quick access</h2>
                  </div>
                  <div className="rounded-3xl bg-emerald-100 p-3 text-emerald-700">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  {uploadActions.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => handleQuickUpload(item.title)}
                        className={`group flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white/90 ${item.color}`}
                      >
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm text-slate-800 transition group-hover:bg-emerald-50">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Farm utilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Farm insights", icon: Compass },
                  { label: "Sensor status", icon: Cpu },
                  { label: "Disease map", icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-white hover:text-emerald-700"
                    >
                      <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-emerald-100/40 backdrop-blur-lg">
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">AI-Powered Farming</p>
                  <h2 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                    AI-Powered Crop Disease Detection for Smart Farming
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-slate-600">
                    Detect crop issues quickly with intelligent image analysis, live farm insights, and practical guidance for healthier yields.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default" className="gap-2 px-5 py-3">
                      <Sparkle className="h-4 w-4" /> Start analysis
                    </Button>
                    <Button variant="outline" className="gap-2 px-5 py-3">
                      <MapPin className="h-4 w-4" /> View disease map
                    </Button>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-emerald-50/90 p-6 shadow-inner shadow-emerald-100/40">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.22),transparent_35%)]" />
                  <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-20" />
                  <div className="relative flex h-full flex-col justify-between gap-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-700/90">Field readiness</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">Healthy growth</p>
                      </div>
                      <div className="rounded-3xl bg-white/80 p-3 text-emerald-700 shadow-sm">
                        <Leaf className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Crop yield forecast</p>
                        <p className="mt-2 text-lg font-semibold">+17% improvement</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
                          <p className="text-xs text-slate-600">Soil moisture</p>
                          <p className="mt-2 font-semibold">68%</p>
                        </div>
                        <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
                          <p className="text-xs text-slate-600">Disease risk</p>
                          <p className="mt-2 font-semibold">Low</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {analyticsWidgets.map((widget) => {
                    const Icon = widget.icon
                    return (
                      <div key={widget.label} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${widget.accent} text-white shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-slate-500">{widget.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{widget.value}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Healthy vs Diseased</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-emerald-50 p-4">
                        <p className="text-xs text-emerald-700">Healthy</p>
                        <p className="mt-3 text-3xl font-semibold text-emerald-900">{healthyCount}</p>
                        <p className="mt-2 text-sm text-slate-500">Clean crop images</p>
                      </div>
                      <div className="rounded-3xl bg-orange-50 p-4">
                        <p className="text-xs text-orange-700">Diseased</p>
                        <p className="mt-3 text-3xl font-semibold text-orange-900">{diseasedCount}</p>
                        <p className="mt-2 text-sm text-slate-500">Detected issues</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Prediction Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 h-28 rounded-3xl bg-slate-100 p-4">
                        <div className="flex h-full flex-col justify-between">
                          {[80, 65, 90, 45, 75, 55, 95].map((value, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                <div style={{ width: `${value}%` }} className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                              </div>
                              <span className="text-[11px] text-slate-500">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">Confidence scores from recent scans. Higher values indicate more accurate detection.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 border border-emerald-100/80">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Auto Farming Assistant</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-500">Voice-enabled advice for field actions and disease control.</p>
                    <div className="grid gap-3">
                      <Button variant="default" className="w-full gap-2 px-4 py-3">
                        <Mic className="h-4 w-4" /> Voice Assistant
                      </Button>
                      <Button variant="outline" className="w-full gap-2 px-4 py-3">
                        <Globe2 className="h-4 w-4" /> Multi-Language
                      </Button>
                      <Button variant="ghost" className="w-full justify-between px-4 py-3">
                        <span>Download PDF Report</span>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="font-semibold">Disease alert</p>
                      <p className="text-sm text-slate-500">Gray Leaf Spot detected in the east field. Start treatment within 24 hours.</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="font-semibold">Weather advisory</p>
                      <p className="text-sm text-slate-500">Showers expected later today. Reduce overhead irrigation to prevent disease spread.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 shadow-xl shadow-slate-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Upload & analyze crops</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                  <div className="space-y-6">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      selectedImage={selectedImage}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="space-y-6">
                    <PredictionResultComponent
                      result={result}
                      diseaseInfo={diseaseInfo}
                      onUploadAnother={handleUploadAnother}
                      onDownloadReport={handleDownloadReport}
                      isLoading={isLoading}
                    />
                    <DiseaseInfoPanel diseaseInfo={diseaseInfo} isLoading={isLoading} />
                    <ConfidenceMeter confidence={result?.confidence ?? null} isLoading={isLoading} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-white via-emerald-50 to-emerald-100 border border-emerald-100/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Live Weather</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Field temperature</p>
                        <h3 className="mt-2 text-3xl font-semibold text-slate-900">28°C</h3>
                      </div>
                      <CloudSun className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between rounded-3xl bg-slate-100 p-3">
                        <span>Humidity</span>
                        <span>72%</span>
                      </div>
                      <div className="flex items-center justify-between rounded-3xl bg-slate-100 p-3">
                        <span>Wind</span>
                        <span>14 km/h</span>
                      </div>
                      <div className="flex items-center justify-between rounded-3xl bg-slate-100 p-3">
                        <span>Soil moisture</span>
                        <span>68%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Farm Chatbot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[1.75rem] bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">"How can I improve disease resistance this season?"</p>
                  </div>
                  <div className="grid gap-3">
                    <Button variant="outline" className="w-full gap-2 px-4 py-3">
                      <MessageCircle className="h-4 w-4" /> Ask question
                    </Button>
                    <Button variant="default" className="w-full gap-2 px-4 py-3">
                      <Mic className="h-4 w-4" /> Talk to assistant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <HistoryPanel history={history} />
            </div>
            <div>
              <PreventionTips />
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/40">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Project presentation</p>
                <h2 className="text-2xl font-semibold text-slate-900">Professional agricultural dashboard for your major project</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" className="gap-2 px-5 py-3">
                  <Share className="h-4 w-4" /> Share dashboard
                </Button>
                <Button variant="outline" className="gap-2 px-5 py-3">
                  <Download className="h-4 w-4" /> Export summary
                </Button>
              </div>
            </div>
          </section>
        </section>
      </main>

      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-4 top-24 z-50 rounded-3xl border border-slate-200 bg-white/95 px-5 py-4 shadow-xl shadow-slate-300/20"
        >
          <p className="text-sm text-slate-800">{toastMessage}</p>
        </motion.div>
      )}
    </div>
  )
}
