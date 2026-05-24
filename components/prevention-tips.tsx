"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, ChevronLeft, ChevronRight, Droplets, Sun, RotateCcw, Eye, Leaf, Sprout } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { preventionTips } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  seed: Sprout,
  water: Droplets,
  sun: Sun,
  rotate: RotateCcw,
  eye: Eye,
  leaf: Leaf,
}

export function PreventionTips() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3
  const maxIndex = Math.max(0, preventionTips.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  const visibleTips = preventionTips.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4 text-warning" />
          Prevention Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {visibleTips.map((tip) => {
                  const Icon = iconMap[tip.icon] || Leaf
                  return (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center mb-2">
                        <Icon className="h-5 w-5 text-warning" />
                      </div>
                      <p className="text-xs font-medium line-clamp-2">{tip.title}</p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {[...Array(maxIndex + 1)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
