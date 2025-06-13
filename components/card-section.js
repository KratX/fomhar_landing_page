"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import {
    motion,
    AnimatePresence,
    useAnimation,
    useInView,
    useMotionValue,
    useTransform,
    useSpring,
} from "framer-motion"

export default function CardSection() {
    const [hoveredCard, setHoveredCard] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: false, amount: 0.2 })
    const controls = useAnimation()
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)

    // Mouse tracking for interactive background
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
    const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

    const xTransform = useTransform(springX, [0, 400], [0, 5])
    const yTransform = useTransform(springY, [0, 400], [0, 5])

    // Background gradient position based on mouse
    const gradientX = useTransform(mouseX, [0, windowSize.width || 1], [0, 100])
    const gradientY = useTransform(mouseY, [0, windowSize.height || 1], [0, 100])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Track mouse movement for interactive background
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                setMousePosition({ x, y })
                mouseX.set(x)
                mouseY.set(y)
            }
        }
        const container = containerRef.current
        if (container) {
            container.addEventListener("mousemove", handleMouseMove)
            return () => container.removeEventListener("mousemove", handleMouseMove)
        }
    }, [mouseX, mouseY])

    // Interactive water ripple effect
    useEffect(() => {
        if (!canvasRef.current || typeof window === "undefined") return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        // Set canvas dimensions
        const updateCanvasSize = () => {
            const { width, height } = canvas.getBoundingClientRect()
            const dpr = window.devicePixelRatio || 1
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.scale(dpr, dpr)
        }

        updateCanvasSize()
        window.addEventListener("resize", updateCanvasSize)

        // Ripple class
        class Ripple {
            constructor(x, y) {
                this.x = x
                this.y = y
                this.radius = 0
                this.maxRadius = 100 + Math.random() * 100
                this.speed = 5 + Math.random() * 3
                this.life = 0
                this.opacity = 0.7
                this.hue = Math.floor(Math.random() * 60) + 300 // Pink/purple hues
            }
            update() {
                this.radius += this.speed
                this.life += this.speed
                this.opacity = Math.max(0, 0.7 - this.life / this.maxRadius)
                return this.radius <= this.maxRadius
            }
            draw(ctx) {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
                ctx.closePath()
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`
                ctx.lineWidth = 2
                ctx.stroke()
            }
        }

        // Droplet class
        class Droplet {
            constructor(canvasWidth, canvasHeight) {
                this.x = Math.random() * canvasWidth
                this.y = Math.random() * canvasHeight
                this.size = Math.random() * 4 + 1
                this.speedX = (Math.random() - 0.5) * 0.3
                this.speedY = Math.random() * 0.5 + 0.2
                this.opacity = Math.random() * 0.5 + 0.3
            }
            update(canvasWidth, canvasHeight) {
                this.x += this.speedX
                this.y += this.speedY
                if (this.y > canvasHeight) {
                    this.y = 0
                    this.x = Math.random() * canvasWidth
                }
                if (this.x < 0 || this.x > canvasWidth) {
                    this.x = Math.random() * canvasWidth
                    this.y = Math.random() * canvasHeight
                }
            }
            draw(ctx) {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(244, 114, 182, ${this.opacity})`
                ctx.fill()
            }
        }

        // Initialize ripples and droplets
        const ripples = []
        const droplets = []
        const dropletCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000))
        for (let i = 0; i < dropletCount; i++) {
            droplets.push(new Droplet(canvas.width, canvas.height))
        }

        // Add ripple on click
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            ripples.push(new Ripple(x, y))
        }

        // Add ripple on mouse move (throttled)
        let lastRippleTime = 0
        const handleMouseMove = (e) => {
            const now = Date.now()
            if (now - lastRippleTime > 1000) {
                const rect = canvas.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
                    ripples.push(new Ripple(x, y))
                    lastRippleTime = now
                }
            }
        }

        canvas.addEventListener("click", handleClick)
        canvas.addEventListener("mousemove", handleMouseMove)

        // Animation loop
        const animate = (timestamp) => {
            if (!previousTimeRef.current) previousTimeRef.current = timestamp
            previousTimeRef.current = timestamp

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            droplets.forEach((droplet) => {
                droplet.update(canvas.width, canvas.height)
                droplet.draw(ctx)
            })
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i]
                const alive = ripple.update()
                if (alive) {
                    ripple.draw(ctx)
                } else {
                    ripples.splice(i, 1)
                }
            }
            if (Math.random() < 0.01 && ripples.length < 10) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                ripples.push(new Ripple(x, y))
            }
            requestRef.current = requestAnimationFrame(animate)
        }

        requestRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(requestRef.current)
            canvas.removeEventListener("click", handleClick)
            canvas.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("resize", updateCanvasSize)
        }
    }, [windowSize])

    // Memoized cards array
    const cards = useMemo(() => [
        {
            id: 1,
            title: "SEASONAL COLLECTION",
            subtitle: "Glow into the season",
            description: "Discover our limited edition formulas crafted with seasonal botanicals",
            buttonText: "Explore Now",
            image: "/card-1.png",
            bgColor: "bg-gradient-to-br from-[#d8e4b3] to-[#a8b885]",
            textColor: "text-[#2d4a0d]",
            subtitleColor: "text-[#4a6b2a]",
            buttonGradient: "bg-gradient-to-r from-[#4e9e3a] to-[#a8b885] hover:from-[#3a6b2d] hover:to-[#7c9a5c]",
            buttonTextColor: "text-white",
            accentColor: "#4e9e3a",
        },
        {
            id: 2,
            title: "GLOW UP FOR LESS",
            subtitle: "50% OFF",
            description: "Limited time offer on our bestselling radiance-boosting collection",
            buttonText: "Shop Now",
            image: "/card 2.png",
            bgColor: "bg-gradient-to-br from-[#f9e7e7] to-[#f4d7d7]",
            textColor: "text-[#2d2d2d]",
            subtitleColor: "text-[#1a1a1a] font-black",
            buttonGradient: "bg-gradient-to-r from-white via-[#f4d7d7] to-white hover:from-[#fbeaea] hover:to-[#f4d7d7]",
            buttonTextColor: "text-[#2d2d2d]",
            accentColor: "#e5bcbc",
        },
        {
            id: 3,
            title: "RADIANCE COMBO",
            subtitle: "All-in-one skincare kit",
            description: "Complete your routine with our expertly curated collection",
            buttonText: "Check it Out",
            image: "/card-3.png",
            bgColor: "bg-gradient-to-br from-[#f5ebd7] to-[#e5d5b8]",
            textColor: "text-[#4a3728]",
            subtitleColor: "text-[#6b4f3a]",
            buttonGradient: "bg-gradient-to-r from-[#7c5a3c] to-[#d4c4a8] hover:from-[#4a3728] hover:to-[#bfa77a]",
            buttonTextColor: "text-white",
            accentColor: "#7c5a3c",
        },
    ], [])

    // Auto-rotate without using cards.length directly
    useEffect(() => {
        if (!cards?.[0]) return
        const total = cards.length
        const interval = setInterval(() => {
            if (!hoveredCard) {
                setActiveIndex((prev) => (prev + 1) % total)
            }
        }, 5000)
        return () => clearInterval(interval)
    }, [hoveredCard, cards])

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [isInView, controls])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    }

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: (custom) => ({
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8,
                delay: custom * 0.1,
            },
        }),
        hover: {
            y: -10,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
            },
        },
    }

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: { scale: 0.95 },
    }

    const textRevealVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.2,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1],
            },
        }),
    }

    const imageHoverVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.08,
            transition: { duration: 1.2, ease: [0.215, 0.61, 0.355, 1] },
        },
    }

    const overlayVariants = {
        initial: { opacity: 0.5 },
        hover: {
            opacity: 0.2,
            transition: { duration: 0.5 },
        },
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-screen overflow-hidden"
            style={{
                background: `linear-gradient(135deg, 
          hsl(${gradientX.get() * 0.1 + 320}, 70%, 95%) 0%, 
          hsl(${gradientY.get() * 0.1 + 340}, 80%, 93%) 50%, 
          hsl(${(gradientX.get() + gradientY.get()) * 0.05 + 300}, 70%, 90%) 100%)`,
            }}
        >
            <style jsx global>{`
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

            <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: "auto" }} />

            <motion.div
                className="absolute inset-0 z-0 opacity-30"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "linear",
                }}
                style={{
                    backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.1) 2px, transparent 2px)
          `,
                    backgroundSize: "80px 80px",
                }}
            />

            <motion.div
                className="relative z-10 p-6 space-y-8 md:p-8 lg:p-12 md:space-y-12 lg:space-y-16"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >
                <div className="relative text-center">
                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#2d2d2d] mb-2"
                        variants={textRevealVariants}
                        custom={0}
                    >
                        FOMHAR Exclusive Collections
                    </motion.h1>
                    <motion.div
                        className="h-1 w-24 bg-gradient-to-r from-[#4e9e3a] to-[#7c5a3c] rounded-full mx-auto"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "6rem", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    />
                    <motion.p className="mt-4 text-[#2d2d2d]/70 max-w-2xl mx-auto" variants={textRevealVariants} custom={1}>
                        Discover our premium skincare collections designed to elevate your daily ritual
                    </motion.p>
                </div>

                <motion.div className="flex justify-center gap-3 my-6" variants={textRevealVariants} custom={2}>
                    {cards?.map((_, index) => (
                        <motion.button
                            key={`indicator-${index}`}
                            className={`w-3 h-3 rounded-full ${activeIndex === index ? "bg-[#4a3728]" : "bg-[#4a3728]/30"
                                } transition-all duration-300`}
                            onClick={() => setActiveIndex(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </motion.div>

                {cards?.map((card, index) => (
                    <motion.div
                        key={card.id}
                        className={`relative rounded-xl overflow-hidden shadow-2xl ${card.bgColor}`}
                        variants={cardVariants}
                        custom={index}
                        whileHover="hover"
                        initial="initial"
                        animate={activeIndex === index ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0.9 }}
                        transition={{ duration: 0.5 }}
                        onHoverStart={() => {
                            setHoveredCard(index)
                            setActiveIndex(index)
                        }}
                        onHoverEnd={() => setHoveredCard(null)}
                    >
                        <motion.div className="absolute inset-0 w-full h-full" variants={imageHoverVariants}>
                            <Image src={card.image || "/placeholder.svg"} alt={card.title} fill className="object-cover" priority />
                            <motion.div className="absolute inset-0 bg-black/50" variants={overlayVariants} />
                        </motion.div>
                        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 md:py-24 lg:py-32 md:px-12">
                            <AnimatePresence>
                                {hoveredCard === index && (
                                    <motion.div
                                        className="absolute inset-0 border-2 border-white/30 rounded-xl"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <motion.div
                                className="absolute inset-0 opacity-0 pointer-events-none rounded-xl"
                                style={{
                                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${card.accentColor}20 0%, transparent 50%)`,
                                }}
                                animate={{
                                    opacity: hoveredCard === index ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            {hoveredCard === index && (
                                <motion.div
                                    className="absolute inset-0 border-2 opacity-50 pointer-events-none rounded-xl"
                                    style={{
                                        borderColor: card.accentColor,
                                        x: xTransform,
                                        y: yTransform,
                                    }}
                                />
                            )}
                            <motion.div
                                className="absolute px-3 py-1 border rounded-full top-6 right-6 bg-white/20 backdrop-blur-sm border-white/30"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <span className="text-sm font-medium text-white">FOMHAR</span>
                            </motion.div>
                            <motion.h2
                                className={`${card.textColor} font-bold tracking-wide text-center mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl`}
                                variants={textRevealVariants}
                                custom={1}
                            >
                                {card.title}
                            </motion.h2>
                            <motion.p
                                className={`${card.subtitleColor} font-medium text-center mb-4 md:mb-6 text-xl md:text-2xl lg:text-3xl`}
                                variants={textRevealVariants}
                                custom={2}
                            >
                                {card.subtitle}
                            </motion.p>
                            <motion.p
                                className={`${card.textColor}/80 text-center mb-8 max-w-md`}
                                variants={textRevealVariants}
                                custom={3}
                            >
                                {card.description}
                            </motion.p>
                            <motion.button
                                className={`${card.buttonGradient} ${card.buttonTextColor} rounded-full font-semibold tracking-wide shadow-lg border-2 border-white/40 px-8 py-3 md:px-10 md:py-4 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-white/30 relative overflow-hidden`}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <motion.div
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.8 }}
                                />
                                <span className="relative z-10">{card.buttonText}</span>
                            </motion.button>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    className="relative flex justify-center items-center mt-12 pt-8 border-t border-[#2d2d2d]/10"
                    variants={textRevealVariants}
                    custom={4}
                >
                    <div className="text-center">
                        <p className="text-sm md:text-base text-[#2d2d2d]/70 font-light italic mb-2">
                            FOMHAR — Elevate Your Skincare Ritual
                        </p>
                        <p className="text-xs text-[#2d2d2d]/50">Premium skincare collections crafted with natural ingredients</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}