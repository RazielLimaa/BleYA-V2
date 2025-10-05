"use client"
import React from "react"
import BleyaScrollHero from "@/components/ui/bleya-scroll-hero"
import ImageGalleryZoom from "@/components/ui/image-gallery-zoom"
import { Navbar } from "@/components/ui/navbar"
import Lenis from "@studio-freight/lenis"

export default function Home() {
  const lenisRef = React.useRef<Lenis | null>(null)
  const lenisStartedRef = React.useRef<boolean>(false)
  const [expansionComplete, setExpansionComplete] = React.useState(false)

  React.useEffect(() => {
    const lenis = new Lenis()
    lenisRef.current = lenis
    lenis.stop()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  React.useEffect(() => {
    const handleExpansionComplete = () => {
      if (!lenisStartedRef.current && lenisRef.current) {
        console.log("[v0] Expansion complete, starting Lenis")
        lenisRef.current.start()
        lenisStartedRef.current = true
      }
      setExpansionComplete(true)
    }

    window.addEventListener("bleya-expansion-complete", handleExpansionComplete)

    return () => {
      window.removeEventListener("bleya-expansion-complete", handleExpansionComplete)
    }
  }, [])

  return (
    <main className="min-h-screen w-full">
      <Navbar />
      <BleyaScrollHero />
      {expansionComplete && (
        <>
          <ImageGalleryZoom />
        </>
      )}
    </main>
  )
}
