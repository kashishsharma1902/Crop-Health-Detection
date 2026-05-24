import { NextRequest, NextResponse } from "next/server"

// Flask backend URL - update this to point to your Flask server
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Forward the request to Flask backend
    const flaskFormData = new FormData()
    flaskFormData.append("file", file)

    try {
      const response = await fetch(`${FLASK_BACKEND_URL}/predict`, {
        method: "POST",
        body: flaskFormData,
      })

      if (!response.ok) {
        throw new Error(`Flask server error: ${response.status}`)
      }

      const result = await response.json()

      // Transform the response to match our frontend format
      return NextResponse.json({
        crop: result.crop || "Unknown",
        disease: result.disease || result.prediction || "Unknown",
        confidence: result.confidence || 0,
        isHealthy: (result.disease || result.prediction || "").toLowerCase().includes("healthy"),
      })
    } catch (fetchError) {
      // If Flask backend is not available, return mock data for demo
      console.warn("[v0] Flask backend not available, returning mock data")
      
      const mockResults = [
        { crop: "Corn", disease: "Common_Rust", confidence: 94.5 },
        { crop: "Potato", disease: "Early_Blight", confidence: 91.8 },
        { crop: "Rice", disease: "Leaf_Blast", confidence: 92.1 },
        { crop: "Wheat", disease: "Yellow_Rust", confidence: 89.3 },
        { crop: "Corn", disease: "Healthy", confidence: 96.8 },
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      
      return NextResponse.json({
        crop: randomResult.crop,
        disease: randomResult.disease,
        confidence: randomResult.confidence + (Math.random() * 5 - 2.5),
        isHealthy: randomResult.disease === "Healthy",
        mock: true, // Indicate this is mock data
      })
    }
  } catch (error) {
    console.error("[v0] Prediction API error:", error)
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Crop Health Detection API",
    endpoints: {
      predict: "POST /api/predict - Upload an image file to get disease prediction"
    },
    supportedCrops: ["Corn", "Potato", "Rice", "Sugarcane", "Wheat"],
    flaskBackend: FLASK_BACKEND_URL,
  })
}
