"use client"

import { useEffect, useRef } from "react"

const CTAWithVerticalMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null)

  const phrases = [
    "Comece agora a usar IA",
    "Transforme seu futuro com tecnologia",
    "Inteligência artificial ao seu alcance",
    "Inovação que impulsiona resultados",
    "Automatize processos com IA",
    "Tecnologia que pensa com você",
    "Descubra o poder da IA",
    "O futuro é agora com IA",
    "Acelere seu crescimento com tecnologia",
    "IA que entende suas necessidades",
  ]

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    const scrollHeight = marquee.scrollHeight / 2

    let animationId: number
    let currentScroll = 0

    const animate = () => {
      currentScroll += 0.3
      if (currentScroll >= scrollHeight) {
        currentScroll = 0
      }
      marquee.scrollTop = currentScroll
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center py-20">
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="text-center space-y-12">
          {/* Main heading */}
          <div className="space-y-6 animate-[fade-in-up_0.8s_ease-out]">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white/90 leading-tight tracking-tight">
              Próxima Seção
            </h2>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-3xl mx-auto">
              Explore novas possibilidades através de experiências visuais imersivas
            </p>
          </div>

          {/* Vertical Marquee - subtle and minimal */}
          <div className="relative h-[300px] overflow-hidden mx-auto max-w-2xl animate-[fade-in-up_1s_ease-out_0.3s_both]">
            <div
              ref={marqueeRef}
              className="h-full overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
              }}
            >
              <div className="space-y-4 py-4">
                {/* Duplicate phrases for seamless loop */}
                {[...phrases, ...phrases].map((phrase, index) => (
                  <div key={index} className="px-6 py-4">
                    <p className="text-lg md:text-xl text-white/40 text-center font-light tracking-wide">{phrase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTAWithVerticalMarquee
