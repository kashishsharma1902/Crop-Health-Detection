export interface PredictionResult {
  crop: string
  disease: string
  confidence: number
  isHealthy: boolean
  imageUrl: string
  timestamp: Date
}

export interface DiseaseInfo {
  commonName: string
  scientificName: string
  affects: string
  severity: "Low" | "Medium" | "High" | "Critical"
  spread: string
  description: string
  recommendations: string[]
}

export interface HistoryItem extends PredictionResult {
  id: string
}

export interface PreventionTip {
  id: string
  title: string
  description: string
  icon: string
}

// Disease database with detailed information
export const diseaseDatabase: Record<string, DiseaseInfo> = {
  "Common_Rust": {
    commonName: "Common Rust",
    scientificName: "Puccinia sorghi",
    affects: "Leaves",
    severity: "Medium",
    spread: "Wind-borne spores",
    description: "Common rust is a fungal disease that produces small, circular to elongated pustules on both leaf surfaces. The pustules are cinnamon-brown and contain powdery spores.",
    recommendations: [
      "Plant resistant hybrids",
      "Apply fungicide if severe",
      "Remove infected plant debris",
      "Ensure proper spacing for air circulation"
    ]
  },
  "Gray_Leaf_Spot": {
    commonName: "Gray Leaf Spot",
    scientificName: "Cercospora zeae-maydis",
    affects: "Leaves",
    severity: "High",
    spread: "Wind, Rain splash",
    description: "Gray leaf spot appears as rectangular lesions that run parallel to the leaf veins. Lesions are tan to gray with distinct parallel edges.",
    recommendations: [
      "Rotate crops with non-host plants",
      "Use resistant varieties",
      "Apply foliar fungicides",
      "Till under crop residue"
    ]
  },
  "Northern_Leaf_Blight": {
    commonName: "Northern Leaf Blight",
    scientificName: "Exserohilum turcicum",
    affects: "Leaves",
    severity: "High",
    spread: "Wind-borne spores",
    description: "Characterized by cigar-shaped, grayish-green lesions that can grow 1-6 inches long. Severe infections can cause significant yield loss.",
    recommendations: [
      "Plant resistant hybrids",
      "Apply fungicides preventively",
      "Practice crop rotation",
      "Remove crop residues"
    ]
  },
  "Early_Blight": {
    commonName: "Early Blight",
    scientificName: "Alternaria solani",
    affects: "Leaves, Stems, Tubers",
    severity: "Medium",
    spread: "Wind, Water splash",
    description: "Early blight causes dark brown to black lesions with concentric rings forming a target pattern. It typically starts on older, lower leaves.",
    recommendations: [
      "Use certified disease-free seeds",
      "Practice crop rotation",
      "Apply protective fungicides",
      "Maintain proper plant nutrition"
    ]
  },
  "Late_Blight": {
    commonName: "Late Blight",
    scientificName: "Phytophthora infestans",
    affects: "Leaves, Stems, Tubers",
    severity: "Critical",
    spread: "Wind, Water, Infected tubers",
    description: "Late blight is a devastating disease causing water-soaked lesions that turn brown and necrotic. White fungal growth may appear on leaf undersides.",
    recommendations: [
      "Use resistant varieties",
      "Apply fungicides immediately",
      "Destroy infected plants",
      "Avoid overhead irrigation"
    ]
  },
  "Brown_Spot": {
    commonName: "Brown Spot",
    scientificName: "Bipolaris oryzae",
    affects: "Leaves, Seeds",
    severity: "Medium",
    spread: "Seed-borne, Wind",
    description: "Brown spot produces oval to circular brown spots with gray or white centers on leaves. Severely infected seeds may be discolored.",
    recommendations: [
      "Use disease-free seeds",
      "Apply foliar fungicides",
      "Improve soil fertility",
      "Maintain proper water management"
    ]
  },
  "Leaf_Blast": {
    commonName: "Leaf Blast",
    scientificName: "Magnaporthe oryzae",
    affects: "Leaves, Nodes, Panicles",
    severity: "High",
    spread: "Wind-borne spores",
    description: "Leaf blast causes diamond-shaped lesions with gray centers and brown borders. Can spread rapidly under favorable conditions.",
    recommendations: [
      "Plant resistant varieties",
      "Apply systemic fungicides",
      "Avoid excessive nitrogen",
      "Maintain proper field drainage"
    ]
  },
  "Neck_Blast": {
    commonName: "Neck Blast",
    scientificName: "Magnaporthe oryzae",
    affects: "Neck, Panicles",
    severity: "Critical",
    spread: "Wind-borne spores",
    description: "Neck blast infects the panicle neck causing it to rot. This results in partially filled or empty grains and significant yield loss.",
    recommendations: [
      "Use resistant varieties",
      "Apply fungicides at heading",
      "Avoid late planting",
      "Balance nitrogen fertilization"
    ]
  },
  "Bacterial_Blight": {
    commonName: "Bacterial Blight",
    scientificName: "Xanthomonas albilineans",
    affects: "Leaves, Stalks",
    severity: "High",
    spread: "Infected cuttings, Wind",
    description: "Bacterial blight causes white or cream-colored leaf streaks that may have red or brown borders. Stalks may show internal red discoloration.",
    recommendations: [
      "Use disease-free seed cane",
      "Practice crop rotation",
      "Remove infected plants",
      "Hot water treat seed cane"
    ]
  },
  "Red_Rot": {
    commonName: "Red Rot",
    scientificName: "Colletotrichum falcatum",
    affects: "Stalks, Leaves",
    severity: "Critical",
    spread: "Infected cuttings, Soil",
    description: "Red rot causes reddening of internal stalk tissue with white spots. Infected canes have a characteristic alcoholic smell.",
    recommendations: [
      "Plant resistant varieties",
      "Use healthy seed cane",
      "Destroy infected stalks",
      "Practice crop rotation"
    ]
  },
  "Brown_Rust": {
    commonName: "Brown Rust",
    scientificName: "Puccinia triticina",
    affects: "Leaves",
    severity: "Medium",
    spread: "Wind-borne spores",
    description: "Brown rust produces small, circular, orange-brown pustules scattered across the upper leaf surface. It's the most common wheat rust.",
    recommendations: [
      "Plant resistant varieties",
      "Apply foliar fungicides",
      "Monitor fields regularly",
      "Remove volunteer wheat"
    ]
  },
  "Yellow_Rust": {
    commonName: "Yellow Rust",
    scientificName: "Puccinia striiformis",
    affects: "Leaves, Heads",
    severity: "High",
    spread: "Wind-borne spores",
    description: "Yellow rust produces yellow-orange pustules arranged in stripes along the leaf veins. It's favored by cool, moist conditions.",
    recommendations: [
      "Use resistant cultivars",
      "Apply fungicides early",
      "Avoid early sowing",
      "Balanced fertilization"
    ]
  },
  "Healthy": {
    commonName: "Healthy",
    scientificName: "N/A",
    affects: "N/A",
    severity: "Low",
    spread: "N/A",
    description: "Your crop appears healthy with no visible signs of disease. Continue with regular maintenance and monitoring.",
    recommendations: [
      "Continue regular monitoring",
      "Maintain proper irrigation",
      "Apply balanced fertilization",
      "Practice preventive measures"
    ]
  }
}

export const preventionTips: PreventionTip[] = [
  {
    id: "1",
    title: "Use disease-resistant seeds",
    description: "Select certified, disease-resistant seed varieties",
    icon: "seed"
  },
  {
    id: "2",
    title: "Avoid overhead irrigation",
    description: "Use drip irrigation to reduce leaf wetness",
    icon: "water"
  },
  {
    id: "3",
    title: "Ensure proper sunlight",
    description: "Adequate spacing for light penetration",
    icon: "sun"
  },
  {
    id: "4",
    title: "Practice crop rotation",
    description: "Rotate crops to break disease cycles",
    icon: "rotate"
  },
  {
    id: "5",
    title: "Monitor regularly",
    description: "Early detection prevents major outbreaks",
    icon: "eye"
  },
  {
    id: "6",
    title: "Maintain soil health",
    description: "Healthy soil promotes plant immunity",
    icon: "leaf"
  }
]

// Supported crops for the model
export const supportedCrops = ["Corn", "Potato", "Rice", "Sugarcane", "Wheat"]
