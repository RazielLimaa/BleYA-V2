"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import RuixenBentoCards from "./ruixen-bento-cards"
import { PointerHighlight } from "./pointer-highlight"
import { SVGFollower } from "./svg-follower"

const BleyaScrollHero = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [showContent, setShowContent] = useState<boolean>(false)
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false)
  const [touchStartY, setTouchStartY] = useState<number>(0)
  const [isMobileState, setIsMobileState] = useState<boolean>(false)
  const [animationsTriggered, setAnimationsTriggered] = useState<boolean>(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const eventDispatchedRef = useRef<boolean>(false)

  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: "0px",
    top: "0px",
    opacity: 0,
  })
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    setScrollProgress(0)
    setShowContent(false)
    setMediaFullyExpanded(false)
    eventDispatchedRef.current = false
  }, [])

  useEffect(() => {
    if (!mediaFullyExpanded) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
      document.body.style.height = "100vh"
      document.documentElement.style.height = "100vh"
    } else {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.height = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.height = ""
      document.documentElement.style.height = ""
    }
  }, [mediaFullyExpanded])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false)
        e.preventDefault()
      } else if (!mediaFullyExpanded) {
        e.preventDefault()
        e.stopPropagation()
        const scrollDelta = e.deltaY * 0.0006
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1)
        setScrollProgress(newProgress)

        if (newProgress >= 1) {
          setMediaFullyExpanded(true)
          setShowContent(true)
          if (!eventDispatchedRef.current) {
            console.log("[v0] Dispatching expansion complete event")
            window.dispatchEvent(new CustomEvent("bleya-expansion-complete"))
            eventDispatchedRef.current = true
          }
        } else if (newProgress < 0.75) {
          setShowContent(false)
        }

        if (newProgress > 0 && !animationsTriggered) {
          setAnimationsTriggered(true)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (!mediaFullyExpanded) {
        e.preventDefault()
      }
      setTouchStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return

      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false)
        e.preventDefault()
      } else if (!mediaFullyExpanded) {
        e.preventDefault()
        e.stopPropagation()
        const scrollFactor = deltaY < 0 ? 0.006 : 0.004
        const scrollDelta = deltaY * scrollFactor
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1)
        setScrollProgress(newProgress)

        if (newProgress >= 1) {
          setMediaFullyExpanded(true)
          setShowContent(true)
          if (!eventDispatchedRef.current) {
            console.log("[v0] Dispatching expansion complete event")
            window.dispatchEvent(new CustomEvent("bleya-expansion-complete"))
            eventDispatchedRef.current = true
          }
        } else if (newProgress < 0.75) {
          setShowContent(false)
        }

        if (newProgress > 0 && !animationsTriggered) {
          setAnimationsTriggered(true)
        }

        setTouchStartY(touchY)
      }
    }

    const handleTouchEnd = (): void => {
      setTouchStartY(0)
    }

    const handleScroll = (e: Event): void => {
      if (!mediaFullyExpanded) {
        e.preventDefault()
        e.stopPropagation()
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener("wheel", handleWheel as unknown as EventListener, {
      passive: false,
    })
    window.addEventListener("scroll", handleScroll as unknown as EventListener, {
      passive: false,
    })
    window.addEventListener("touchstart", handleTouchStart as unknown as EventListener, {
      passive: false,
    })
    window.addEventListener("touchmove", handleTouchMove as unknown as EventListener, {
      passive: false,
    })
    window.addEventListener("touchend", handleTouchEnd as EventListener)

    return () => {
      window.removeEventListener("wheel", handleWheel as unknown as EventListener)
      window.removeEventListener("scroll", handleScroll as EventListener)
      window.removeEventListener("touchstart", handleTouchStart as unknown as EventListener)
      window.removeEventListener("touchmove", handleTouchMove as unknown as EventListener)
      window.removeEventListener("touchend", handleTouchEnd as EventListener)
    }
  }, [scrollProgress, mediaFullyExpanded, touchStartY, animationsTriggered])

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll(".word-animate")
      wordElements.forEach((word) => {
        const delay = Number.parseInt(word.getAttribute("data-delay") || "0") || 0
        setTimeout(() => {
          if (word) (word as HTMLElement).style.animation = "word-appear 0.8s ease-out forwards"
        }, delay)
      })
    }
    const timeoutId = setTimeout(animateWords, 100)
    return () => clearTimeout(timeoutId)
  }, [animationsTriggered])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY }
      setRipples((prev) => [...prev, newRipple])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 1000)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const mediaWidth = 300 + scrollProgress * (window.innerWidth - 300)
  const mediaHeight = 400 + scrollProgress * (window.innerHeight - 400)
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150)
  const textContentOpacity = Math.min(scrollProgress * 2, 1)

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(96, 165, 250, 0.08), rgba(59, 130, 246, 0.05), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }
    @keyframes word-appear { 
      0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 
      50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
    }
    @keyframes grid-draw { 
      0% { stroke-dashoffset: 1000; opacity: 0; } 
      50% { opacity: 0.3; } 
      100% { stroke-dashoffset: 0; opacity: 0.15; } 
    }
    @keyframes pulse-glow { 
      0%, 100% { opacity: 0.1; transform: scale(1); } 
      50% { opacity: 0.3; transform: scale(1.1); } 
    }
    .word-animate { 
      display: inline-block; 
      opacity: 0; 
      margin: 0 0.1em; 
      transition: color 0.3s ease, transform 0.3s ease; 
    }
    .word-animate:hover { 
      color: rgba(255, 255, 255, 0.8); 
      transform: translateY(-2px); 
    }
    .ripple-effect { 
      position: fixed; 
      width: 4px; 
      height: 4px; 
      background: rgba(96, 165, 250, 0.6); 
      border-radius: 50%; 
      transform: translate(-50%, -50%); 
      pointer-events: none; 
      animation: pulse-glow 1s ease-out forwards; 
      z-index: 9999; 
    }
    @keyframes float-smooth-1 {
      0%, 100% { 
        transform: translate(0, 0) rotate(0deg); 
      }
      25% { 
        transform: translate(20px, -25px) rotate(90deg); 
      }
      50% { 
        transform: translate(-15px, -20px) rotate(180deg); 
      }
      75% { 
        transform: translate(-25px, 15px) rotate(270deg); 
      }
    }
    @keyframes float-smooth-2 {
      0%, 100% { 
        transform: translate(0, 0) rotate(0deg); 
      }
      25% { 
        transform: translate(-22px, 18px) rotate(-90deg); 
      }
      50% { 
        transform: translate(18px, 25px) rotate(-180deg); 
      }
      75% { 
        transform: translate(25px, -18px) rotate(-270deg); 
      }
    }
    @keyframes float-smooth-3 {
      0%, 100% { 
        transform: translate(0, 0) rotate(0deg); 
      }
      33% { 
        transform: translate(15px, 22px) rotate(120deg); 
      }
      66% { 
        transform: translate(-20px, -15px) rotate(240deg); 
      }
    }
    @keyframes float-smooth-4 {
      0%, 100% { 
        transform: translate(0, 0) rotate(0deg); 
      }
      33% { 
        transform: translate(-18px, -20px) rotate(-120deg); 
      }
      66% { 
        transform: translate(22px, 12px) rotate(-240deg); 
      }
    }
    @keyframes fade-in-scale {
      0% { 
        opacity: 0; 
        transform: scale(0); 
      }
      100% { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
    .svg-decorator-1 {
      position: absolute;
      pointer-events: none;
      z-index: 0;
      top: -60px;
      left: 10%;
      width: 70px;
      height: 70px;
      opacity: 0;
      transform: scale(0);
      transition: opacity 1.2s ease-out, transform 1.2s ease-out;
    }
    .svg-decorator-1.visible {
      opacity: 1;
      transform: scale(1);
      animation: float-smooth-1 20s ease-in-out infinite;
    }
    .svg-decorator-2 {
      position: absolute;
      pointer-events: none;
      z-index: 0;
      top: -40px;
      right: 5%;
      width: 60px;
      height: 60px;
      opacity: 0;
      transform: scale(0);
      transition: opacity 1.2s ease-out 0.2s, transform 1.2s ease-out 0.2s;
    }
    .svg-decorator-2.visible {
      opacity: 1;
      transform: scale(1);
      animation: float-smooth-2 18s ease-in-out infinite;
    }
    .svg-decorator-3 {
      position: absolute;
      pointer-events: none;
      z-index: 0;
      bottom: -50px;
      left: 15%;
      width: 55px;
      height: 55px;
      opacity: 0;
      transform: scale(0);
      transition: opacity 1.2s ease-out 0.4s, transform 1.2s ease-out 0.4s;
    }
    .svg-decorator-3.visible {
      opacity: 1;
      transform: scale(1);
      animation: float-smooth-3 22s ease-in-out infinite;
    }
    .svg-decorator-4 {
      position: absolute;
      pointer-events: none;
      z-index: 0;
      bottom: -60px;
      right: 8%;
      width: 48px;
      height: 48px;
      opacity: 0;
      transform: scale(0);
      transition: opacity 1.2s ease-out 0.6s, transform 1.2s ease-out 0.6s;
    }
    .svg-decorator-4.visible {
      opacity: 1;
      transform: scale(1);
      animation: float-smooth-4 16s ease-in-out infinite;
    }
    .bleya-card-expansion {
      transition: width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), 
                  height 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: width, height;
    }
  `

  return (
    <>
      <style>{pageStyles}</style>
      <div
        ref={sectionRef}
        className="overflow-x-hidden transition-colors duration-700 ease-in-out"
        style={{
          backgroundColor: showContent ? "white" : "black",
          position: mediaFullyExpanded ? "relative" : "fixed",
          inset: mediaFullyExpanded ? "auto" : 0,
          width: "100%",
          height: mediaFullyExpanded ? "auto" : "100vh",
          zIndex: mediaFullyExpanded ? "auto" : 50,
        }}
      >
        <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
          <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
            <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
              <div className="relative flex w-full flex-col items-center justify-center h-[99dvh]">
                <div
                  className="bleya-card-expansion absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
                  style={{
                    width: `${mediaWidth}px`,
                    height: `${mediaHeight}px`,
                    maxWidth: "95vw",
                    maxHeight: "85vh",
                    boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                    backgroundImage:
                      "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uJfTNtCwkbhBEKdlgWSDmX3Dy6qhJp.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className="relative w-full h-full flex flex-col justify-between items-center px-6 py-10 sm:px-8 sm:py-12 md:px-16 md:py-20 transition-opacity duration-500"
                    style={{ opacity: textContentOpacity }}
                  >
                    <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl px-6 py-4">
                      <h2 className="text-xs sm:text-sm font-mono font-light text-white uppercase tracking-[0.2em] opacity-90">
                        <span className="word-animate" data-delay="0">
                          Bleya
                        </span>
                        <span className="word-animate" data-delay="150">
                          thinks.
                        </span>
                      </h2>
                    </div>

                    <div className="text-center max-w-5xl mx-auto relative backdrop-blur-sm bg-white/10 rounded-2xl px-8 py-10">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight leading-loose tracking-tight text-white">
                        <div className="mb-4 md:mb-6">
                          <span className="word-animate" data-delay="300">
                            Meet
                          </span>
                          <span className="word-animate" data-delay="400">
                            Bleya,
                          </span>
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-thin text-white leading-loose tracking-wide">
                          <span className="word-animate" data-delay="700">
                            where
                          </span>
                          <span className="word-animate" data-delay="800">
                            artificial
                          </span>
                          <span className="word-animate" data-delay="900">
                            intelligence
                          </span>
                          <span className="word-animate" data-delay="1000">
                            meets
                          </span>
                          <span className="word-animate" data-delay="1100">
                            human
                          </span>
                          <span className="word-animate" data-delay="1200">
                            creativity
                          </span>
                          <span className="word-animate" data-delay="1300">
                            and
                          </span>
                          <span className="word-animate" data-delay="1400">
                            innovation
                          </span>
                          <span className="word-animate" data-delay="1500">
                            flows.
                          </span>
                        </div>
                      </h1>
                    </div>

                    <div className="text-center backdrop-blur-sm bg-white/10 rounded-2xl px-6 py-4">
                      <h2 className="text-xs sm:text-sm font-mono font-light text-white uppercase tracking-[0.2em] opacity-90">
                        <span className="word-animate" data-delay="1700">
                          Learn,
                        </span>
                        <span className="word-animate" data-delay="1850">
                          adapt,
                        </span>
                        <span className="word-animate" data-delay="2000">
                          evolve.
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex flex-row items-center justify-center gap-0 text-center mix-blend-difference whitespace-nowrap">
                  <motion.h2
                    className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                    style={{
                      transform: `translateX(-${textTranslateX}vw)`,
                      transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    Ble
                  </motion.h2>
                  <motion.h2
                    className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                    style={{
                      transform: `translateX(${textTranslateX}vw)`,
                      transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    YA
                  </motion.h2>
                </div>

                <div className="absolute bottom-20 z-10">
                  <p className="text-center font-medium text-white/70 mix-blend-difference">Role para explorar</p>
                </div>
              </div>

              <motion.section
                className="flex w-full flex-col px-8 py-10 md:px-16 lg:py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.7 }}
              >
                <RuixenBentoCards />
              </motion.section>

              <motion.section
                className="flex w-full flex-col items-center justify-center px-8 py-20 md:px-16 lg:py-32 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
                  <SVGFollower
                    width={typeof window !== "undefined" ? window.innerWidth : 1400}
                    height={600}
                    colors={["#0066FF", "#FF6B00", "#FFD700", "#00D4FF", "#FF3366"]}
                    removeDelay={400}
                    className="w-full h-full pointer-events-auto"
                  />
                </div>

                <div className="mx-auto max-w-5xl text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl relative z-0">
                  <div className={`svg-decorator-1 ${showContent ? "visible" : ""}`}>
                    <svg width="94" height="93" viewBox="0 0 94 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13 0C24.55 0 36.1 0 48 0C48.33 14.52 48.66 29.04 49 44C66.2469 31.3401 66.2469 31.3401 83.3242 18.4531C83.876 18.0326 84.4278 17.6122 84.9963 17.179C86.534 16.0068 88.0679 14.8297 89.6016 13.6523C92 12 92 12 94 12C94 23.55 94 35.1 94 47C79.15 47 64.3 47 49 47C55.7587 56.8595 55.7587 56.8595 62.875 66.375C66.6344 71.1982 70.3142 76.0737 73.9375 81C74.3982 81.6231 74.8589 82.2462 75.3335 82.8882C75.7687 83.482 76.2039 84.0757 76.6523 84.6875C77.0338 85.207 77.4153 85.7265 77.8083 86.2617C79.304 88.4435 80.639 90.7317 82 93C70.45 93 58.9 93 47 93C46.67 78.15 46.34 63.3 46 48C34.5724 56.1396 34.5724 56.1396 23.375 64.5625C21.9429 65.6631 20.5107 66.7633 19.0781 67.8633C18.0485 68.6553 18.0485 68.6553 16.998 69.4634C14.0463 71.7335 11.0912 73.9988 8.125 76.25C7.19945 76.9564 6.27391 77.6628 5.32031 78.3906C3 80 3 80 0 81C0 69.45 0 57.9 0 46C15.18 46 30.36 46 46 46C39.4502 36.9907 39.4502 36.9907 32.875 28C32.4305 27.3933 31.986 26.7867 31.5281 26.1616C28.7575 22.3834 25.9748 18.6145 23.1836 14.8516C22.5412 13.984 21.8987 13.1165 21.2368 12.2227C19.9663 10.5076 18.6939 8.79406 17.4194 7.08203C16.844 6.30473 16.2686 5.52742 15.6758 4.72656C15.1593 4.03127 14.6428 3.33599 14.1106 2.61963C13 1 13 1 13 0Z"
                        fill="#FF6B00"
                      />
                    </svg>
                  </div>
                  <div className={`svg-decorator-2 ${showContent ? "visible" : ""}`}>
                    <svg width="87" height="86" viewBox="0 0 87 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M40 4.99999C41.3324 5.6685 42.6655 6.33572 44 6.99999C45.0519 6.07186 45.0519 6.07186 46.125 5.12499C52.226 0.615525 58.6196 0.169693 66 0.99999C72.3705 2.84147 78.5946 6.20689 82.2187 11.9219C85.349 17.8694 86.5631 23.2425 86 30C84.5225 34.0753 82.6105 37.9062 80.5 41.6875C79.6738 44.2404 79.6738 44.2404 81.8125 47.0625C82.8953 48.5166 82.8953 48.5166 84 50C86.2952 56.6823 86.0552 65.335 83.5 71.875C80.668 77.3474 76.1491 81.4122 70.6758 84.1719C64.313 86.1411 55.9586 86.2054 49.75 83.625C47 82 47 82 45 80C42.3831 80.2707 40.8121 81.1156 38.5625 82.5C32.4732 86.0645 23.5915 86.1292 16.8398 84.4687C10.4766 81.8955 6.35602 77.902 2.99999 72C0.451345 65.3735 -0.422647 57.8333 2.31249 51.125C3.71589 48.5261 5.1046 46.2564 6.99999 44C5.83548 41.4769 4.75094 39.7216 2.87499 37.625C-0.577597 32.569 0.457251 25.8005 0.999991 20C2.39609 13.0319 8.06015 7.16987 13.625 3.06249C22.6769 -0.987027 31.5253 0.482328 40 4.99999Z"
                        fill="#0066FF"
                      />
                    </svg>
                  </div>
                  <div className={`svg-decorator-3 ${showContent ? "visible" : ""}`}>
                    <svg width="82" height="82" viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="41" cy="41" r="41" fill="#FFD700" />
                    </svg>
                  </div>
                  <div className={`svg-decorator-4 ${showContent ? "visible" : ""}`}>
                    <svg width="82" height="83" viewBox="0 0 82 83" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0 0C27.06 0 54.12 0 82 0C82 27.39 82 54.78 82 83C54.94 83 27.88 83 0 83C0 55.61 0 28.22 0 0Z"
                        fill="#FFB800"
                      />
                    </svg>
                  </div>
                  <span className="relative z-20">
                    A melhor forma de aprender a programar é com{" "}
                    <PointerHighlight
                      pointerClassName="h-8 w-8 text-blue-600"
                      rectangleClassName="border-2 border-blue-600"
                    >
                      <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]">
                        inteligência artificial
                      </span>
                    </PointerHighlight>{" "}
                    ao seu lado
                  </span>
                </div>
              </motion.section>
            </div>
          </div>
        </section>

        <div
          id="mouse-gradient-react"
          className="w-60 h-60 blur-xl sm:w-80 sm:h-80 sm:blur-2xl md:w-96 md:h-96 md:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        ></div>

        {ripples.map((ripple) => (
          <div key={ripple.id} className="ripple-effect" style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}></div>
        ))}
      </div>
    </>
  )
}

export default BleyaScrollHero
