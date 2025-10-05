"use client"

import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { StarfieldBackground } from "@/components/ui/starfield-background"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function IAPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen w-full bg-black">
      <StarfieldBackground />

      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="relative z-10">
        <AnimatedAIChat />
      </div>
    </div>
  )
}
