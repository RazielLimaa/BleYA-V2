"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface Star {
  x: number
  y: number
  z: number
  element: HTMLDivElement
}

export function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<Star[]>([])
  const scrollVelocityRef = useRef(0)
  const baseSpeedRef = useRef(2)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const starCount = 200
    const stars: Star[] = []

    const getContainerDimensions = () => {
      const rect = container.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    }

    let dimensions = getContainerDimensions()

    // Criar estrelas
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "absolute rounded-full bg-white"
      star.style.boxShadow = "0 0 4px 1px rgba(255, 255, 255, 0.8)"

      const starData: Star = {
        x: Math.random() * dimensions.width - dimensions.width / 2,
        y: Math.random() * dimensions.height - dimensions.height / 2,
        z: Math.random() * 2000,
        element: star,
      }

      stars.push(starData)
      container.appendChild(star)
    }

    starsRef.current = stars

    // Função para atualizar posição das estrelas
    const updateStars = () => {
      dimensions = getContainerDimensions()
      const speed = baseSpeedRef.current + scrollVelocityRef.current * 1.5

      stars.forEach((star) => {
        // Mover estrela baseado na velocidade (positivo = frente, negativo = trás)
        star.z -= speed

        // Reset quando estrela passa pela câmera (muito perto)
        if (star.z < 1) {
          star.z = 1000
          star.x = Math.random() * dimensions.width - dimensions.width / 3
          star.y = Math.random() * dimensions.height - dimensions.height / 2
        }
        // Reset quando estrela vai muito longe (scrollando para cima)
        else if (star.z > 2000) {
          star.z = 1
          star.x = Math.random() * dimensions.width - dimensions.width / 2
          star.y = Math.random() * dimensions.height - dimensions.height / 2
        }

        // Projeção 3D para 2D
        const scale = 1000 / star.z
        const x2d = star.x * scale + dimensions.width / 2
        const y2d = star.y * scale + dimensions.height / 2

        // Tamanho baseado na profundidade
        const size = (1 - star.z / 2000) * 4
        const opacity = (1 - star.z / 2000) * 1.0
        const glowIntensity = (1 - star.z / 2000) * 6

        // Aplicar transformações
        gsap.set(star.element, {
          x: x2d,
          y: y2d,
          width: size,
          height: size,
          opacity: opacity,
          boxShadow: `0 0 ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 255, 255, ${opacity * 0.8})`,
          force3D: true,
        })
      })

      // Diminuir velocidade do scroll gradualmente
      scrollVelocityRef.current *= 0.32

      animationFrameRef.current = requestAnimationFrame(updateStars)
    }

    // Iniciar animação
    updateStars()

    // Listener de scroll
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      scrollVelocityRef.current = Math.max(-30, Math.min(scrollVelocityRef.current + delta * 1.2, 50))

      lastScrollY = currentScrollY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      stars.forEach((star) => star.element.remove())
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true" />
}
