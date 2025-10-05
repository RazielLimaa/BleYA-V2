"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { StarfieldBackground } from "./starfield-background"
import { useRouter } from "next/navigation"

gsap.registerPlugin(ScrollTrigger)

export default function ImageGalleryZoom() {
  const sectionRef = useRef<HTMLElement>(null)
  const expandImageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const blackBgRef = useRef<HTMLDivElement>(null)
  const image1Ref = useRef<HTMLDivElement>(null)
  const image2Ref = useRef<HTMLDivElement>(null)
  const image3Ref = useRef<HTMLDivElement>(null)
  const image4Ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const hasNavigatedRef = useRef(false)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !expandImageRef.current || !contentRef.current) return

    const section = sectionRef.current
    const expandImage = expandImageRef.current
    const content = contentRef.current
    const blackBg = blackBgRef.current
    const image1 = image1Ref.current
    const image2 = image2Ref.current
    const image3 = image3Ref.current
    const image4 = image4Ref.current

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.9 && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true
            navigationTimeoutRef.current = setTimeout(() => {
              router.push("/ia")
            }, 1500)
          }
        },
      },
    })

    tl.to(expandImage, {
      scale: 3,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: 1,
      ease: "power2.inOut",
    })

    if (image1) {
      tl.to(
        image1,
        {
          scale: 3,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      )
    }

    if (image2) {
      tl.to(
        image2,
        {
          scale: 3,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      )
    }

    if (image3) {
      tl.to(
        image3,
        {
          scale: 3,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      )
    }

    if (image4) {
      tl.to(
        image4,
        {
          scale: 3,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0,
      )
    }

    tl.to(
      content,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.in",
      },
      0.7,
    )

    if (blackBg) {
      tl.to(
        blackBg,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.in",
        },
        0.5,
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [router])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center bg-white"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={image1Ref}
        className="absolute z-10 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: "200px",
          height: "200px",
          top: "15%",
          left: "10%",
          transform: "rotateY(-25deg) rotateX(10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <img src="/abstract-geometric-blue.png" alt="Decorative 3D element" className="h-full w-full object-cover" />
      </div>

      <div
        ref={image2Ref}
        className="absolute z-10 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: "180px",
          height: "180px",
          top: "20%",
          right: "12%",
          transform: "rotateY(25deg) rotateX(-10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <img src="/abstract-tech-purple.png" alt="Decorative 3D element" className="h-full w-full object-cover" />
      </div>

      <div
        ref={image3Ref}
        className="absolute z-10 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: "220px",
          height: "220px",
          bottom: "15%",
          left: "8%",
          transform: "rotateY(15deg) rotateX(15deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/abstract-digital-art-gradient.jpg"
          alt="Decorative 3D element"
          className="h-full w-full object-cover"
        />
      </div>

      <div
        ref={image4Ref}
        className="absolute z-10 overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: "190px",
          height: "190px",
          bottom: "18%",
          right: "10%",
          transform: "rotateY(-20deg) rotateX(-15deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <img src="/abstract-futuristic-design.jpg" alt="Decorative 3D element" className="h-full w-full object-cover" />
      </div>

      <div
        ref={expandImageRef}
        className="overflow-hidden rounded-3xl relative z-20"
        style={{
          width: "400px",
          height: "300px",
          background: "black",
        }}
      >
        <StarfieldBackground />
      </div>

      <div ref={blackBgRef} className="absolute inset-0 bg-black opacity-0 z-25" />

      <div ref={contentRef} className="absolute inset-0 opacity-0 z-30 flex items-center justify-center">
        <p className="text-white text-2xl font-light">Carregando IA...</p>
      </div>
    </section>
  )
}
