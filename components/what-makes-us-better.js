"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
    motion,
    useScroll,
    useTransform,
    useInView,
    AnimatePresence,
    useMotionTemplate,
    useSpring,
    useMotionValue,
} from "framer-motion"
import { ChevronRight, ChevronLeft, Sparkles, Check, ArrowRight, Shield, Award } from "lucide-react"

// Feature data
const features = [
    {
        id: "pharma",
        title: "Pharmaceutically Approved",
        description:
            "Every product is developed in collaboration with certified dermatologists and pharmaceutical experts to ensure safety and effectiveness.",
        icon: Shield,
        color: "#6366f1", // Indigo
        image: "/asset 1.png",
        stats: [
            { value: "100%", label: "Dermatologist Tested" },
            { value: "99.8%", label: "Purity Rating" },
        ],
        benefits: ["Clinically Proven", "Expert Formulated", "Safety Guaranteed"],
    },
    {
        id: "thc-free",
        title: "THC Free",
        description:
            "Our formulations are backed by clinical research, blending science with nature to bring visible results without compromising skin health.",
        icon: Check,
        color: "#10b981", // Emerald
        image: "/asset 2.png",
        stats: [
            { value: "0%", label: "THC Content" },
            { value: "100%", label: "Legal Compliance" },
        ],
        benefits: ["No Psychoactive Effects", "Legal in All 50 States", "Regular Testing"],
    },
    {
        id: "tested",
        title: "Diligently Tested",
        description:
            "Our products are tested for purity, stability, and dermatological safety — approved by pharmaceutical standards for daily use.",
        icon: Award,
        color: "#f59e0b", // Amber
        image: "/asste 3.png",
        stats: [
            { value: "50+", label: "Quality Tests" },
            { value: "3x", label: "Industry Standard" },
        ],
        benefits: ["Third-Party Verified", "Batch Testing", "Transparency Reports"],
    },
]

export default function WhatMakesUsBetterSection() {
    const [activeFeature, setActiveFeature] = useState(0)
    const [hoveredBenefit, setHoveredBenefit] = useState(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: false, amount: 0.2 })
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)

    // Scroll-based animations
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.8, 1, 1, 0.9])

    // Spring animations for smoother motion
    const springScale = useSpring(scale, { stiffness: 100, damping: 30 })
    const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })

    // Mouse tracking for interactive background
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

    // Background gradient position based on mouse
    const gradientX = useTransform(smoothX, [0, windowSize.width || 1], [0, 100])
    const gradientY = useTransform(smoothY, [0, windowSize.height || 1], [0, 100])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        // Set initial size
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Mouse tracking for interactive elements
    const handleMouseMove = (e) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
    }

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
                this.maxRadius = 80 + Math.random() * 80
                this.speed = 4 + Math.random() * 3
                this.life = 0
                this.opacity = 0.7
                // Use the current feature color for ripples
                this.color = features[activeFeature].color
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
                ctx.strokeStyle = `${this.color}${Math.floor(this.opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`
                ctx.lineWidth = 2
                ctx.stroke()
            }
        }

        // Droplet class
        class Droplet {
            constructor(canvasWidth, canvasHeight) {
                this.x = Math.random() * canvasWidth
                this.y = Math.random() * canvasHeight
                this.size = Math.random() * 3 + 1
                this.speedX = (Math.random() - 0.5) * 0.3
                this.speedY = Math.random() * 0.5 + 0.2
                this.opacity = Math.random() * 0.5 + 0.3
                // Use the current feature color for droplets
                this.color = features[activeFeature].color
            }

            update(canvasWidth, canvasHeight) {
                this.x += this.speedX
                this.y += this.speedY

                // Reset position if out of bounds
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
                ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`
                ctx.fill()
            }
        }

        // Initialize ripples and droplets
        const ripples = []
        const droplets = []
        const dropletCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000))

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
            if (now - lastRippleTime > 1200) {
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
            const deltaTime = timestamp - previousTimeRef.current
            previousTimeRef.current = timestamp

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update droplet colors based on current feature
            droplets.forEach((droplet) => {
                droplet.color = features[activeFeature].color
                droplet.update(canvas.width, canvas.height)
                droplet.draw(ctx)
            })

            // Update ripple colors based on current feature
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i]
                ripple.color = features[activeFeature].color
                const alive = ripple.update()
                if (alive) {
                    ripple.draw(ctx)
                } else {
                    ripples.splice(i, 1)
                }
            }

            // Add random ripples occasionally
            if (Math.random() < 0.005 && ripples.length < 8) {
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
    }, [windowSize, activeFeature])

    // Navigation functions
    const goToNext = () => {
        setActiveFeature((prev) => (prev + 1) % features.length)
    }

    const goToPrev = () => {
        setActiveFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1))
    }

    const goToFeature = (index) => {
        setActiveFeature(index)
    }

    // Current feature
    const currentFeature = features[activeFeature]

    // Auto-rotation
    useEffect(() => {
        if (!isInView) return

        const timer = setTimeout(() => {
            goToNext()
        }, 8000)

        return () => clearTimeout(timer)
    }, [activeFeature, isInView])

    // Cursor gradient effect
    const cursorSize = 400
    const cursorX = useMotionTemplate`${mousePosition.x - cursorSize / 2}px`
    const cursorY = useMotionTemplate`${mousePosition.y - cursorSize / 2}px`

    return (
        <motion.section
            ref={containerRef}
            className="relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden sm:px-6 lg:px-8" // Reduced padding
            style={{
                scale: springScale,
                opacity: springOpacity,
                background: `linear-gradient(135deg, 
          hsl(${gradientX.get() * 0.1 + 220}, 70%, 95%) 0%, 
          hsl(${gradientY.get() * 0.1 + 240}, 80%, 93%) 50%, 
          hsl(${(gradientX.get() + gradientY.get()) * 0.05 + 200}, 70%, 90%) 100%)`,
            }}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Canvas styles */}
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

            {/* Interactive Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: "auto" }} />

            {/* Interactive background */}
            <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: backgroundY }}>
                {/* Cursor follower gradient */}
                <motion.div
                    className="absolute w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" // Reduced size
                    style={{
                        background: `radial-gradient(circle, ${currentFeature.color}40 0%, transparent 70%)`,
                        left: cursorX,
                        top: cursorY,
                    }}
                />

                {/* Decorative elements - reduced count */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(10)].map((_, i) => (
                        // Reduced from 20 to 10 elements
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: Math.random() * 6 + 2, // Smaller size
                                height: Math.random() * 6 + 2, // Smaller size
                                x: `${Math.random() * 100}%`,
                                y: `${Math.random() * 100}%`,
                                backgroundColor: features[i % 3].color + "40",
                            }}
                            animate={{
                                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                                opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                                duration: Math.random() * 20 + 10,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Header - more compact */}
            <motion.div
                className="relative z-10 max-w-2xl mx-auto mb-8 text-center" // Reduced max-width and margin
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 border rounded-full shadow-sm bg-white/80 backdrop-blur-sm border-slate-200" // Reduced padding and margin
                    whileHover={{ scale: 1.03 }} // Reduced scale effect
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <Sparkles className="w-3 h-3" style={{ color: currentFeature.color }} /> {/* Smaller icon */}
                    <span className="text-xs font-medium text-slate-800">Exceptional Quality</span> {/* Smaller text */}
                </motion.div>

                <motion.h2
                    className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl" // Reduced text size and margin
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <span className="block text-slate-900">What Makes Us</span>
                    <span className="block" style={{ color: currentFeature.color }}>
                        Better
                    </span>
                </motion.h2>

                <motion.p
                    className="max-w-xl mx-auto text-base sm:text-lg text-slate-600" // Reduced text size
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Discover the science and innovation behind our premium products that set us apart from the competition
                </motion.p>
            </motion.div>

            {/* Main feature showcase - more compact */}
            <div className="relative z-10 w-full max-w-5xl mx-auto">
                {" "}
                {/* Reduced max-width */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFeature}
                        className="relative overflow-hidden bg-white shadow-xl rounded-2xl" // Reduced border radius
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Feature accent color bar */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1.5" // Reduced height
                            style={{ backgroundColor: currentFeature.color }}
                            layoutId="colorBar"
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
                            {" "}
                            {/* Reduced min-height */}
                            {/* Left column - Visual */}
                            <motion.div
                                className="relative flex flex-col items-center justify-center p-6 lg:p-8" // Reduced padding
                                style={{
                                    background: `linear-gradient(135deg, ${currentFeature.color}10, ${currentFeature.color}30)`,
                                }}
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Feature icon */}
                                <motion.div
                                    className="absolute p-2 rounded-lg top-6 left-6" // Reduced size and position
                                    style={{ backgroundColor: currentFeature.color + "20" }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                >
                                    <currentFeature.icon size={24} style={{ color: currentFeature.color }} /> {/* Smaller icon */}
                                </motion.div>

                                {/* Main image with floating animation */}
                                <motion.div
                                    className="relative w-48 h-48 sm:w-64 sm:h-64" // Reduced size
                                    animate={{
                                        y: [0, -10, 0], // Reduced movement
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 rounded-full blur-2xl opacity-30" // Reduced blur
                                        style={{ backgroundColor: currentFeature.color }}
                                    />
                                    <div className="relative z-10 w-full h-full">
                                        <Image
                                            src={currentFeature.image || "/placeholder.svg"}
                                            alt={currentFeature.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                    </div>
                                </motion.div>

                                {/* Stats */}
                                <div className="flex gap-6 mt-8">
                                    {" "}
                                    {/* Reduced gap and margin */}
                                    {currentFeature.stats.map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            className="text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + index * 0.2 }}
                                        >
                                            <motion.div
                                                className="text-2xl font-bold sm:text-3xl" // Reduced text size
                                                style={{ color: currentFeature.color }}
                                                initial={{ scale: 0.8 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.6 + index * 0.2 }}
                                            >
                                                {stat.value}
                                            </motion.div>
                                            <div className="mt-1 text-xs text-slate-600">{stat.label}</div> {/* Smaller text */}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                            {/* Right column - Content */}
                            <motion.div
                                className="flex flex-col justify-center p-6 lg:p-8" // Reduced padding
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.h3
                                    className="mb-4 text-2xl font-bold sm:text-3xl" // Reduced text size and margin
                                    style={{ color: currentFeature.color }}
                                    layoutId={`title-${currentFeature.id}`}
                                >
                                    {currentFeature.title}
                                </motion.h3>

                                <motion.p
                                    className="mb-6 text-base leading-relaxed text-slate-600" // Reduced text size and margin
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {currentFeature.description}
                                </motion.p>

                                {/* Benefits list */}
                                <motion.div
                                    className="mb-6 space-y-3" // Reduced margin and spacing
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase text-slate-500">Key Benefits</h4>

                                    {currentFeature.benefits.map((benefit, index) => (
                                        <motion.div
                                            key={benefit}
                                            className="flex items-center gap-2" // Reduced gap
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            onMouseEnter={() => setHoveredBenefit(index)}
                                            onMouseLeave={() => setHoveredBenefit(null)}
                                        >
                                            <motion.div
                                                className="flex items-center justify-center w-6 h-6 rounded-full" // Reduced size
                                                style={{
                                                    backgroundColor:
                                                        hoveredBenefit === index ? currentFeature.color : currentFeature.color + "20",
                                                }}
                                                animate={{
                                                    scale: hoveredBenefit === index ? 1.05 : 1, // Reduced scale effect
                                                    backgroundColor:
                                                        hoveredBenefit === index ? currentFeature.color : currentFeature.color + "20",
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            >
                                                <Check
                                                    size={14} // Smaller icon
                                                    className="text-white"
                                                    style={{
                                                        color: hoveredBenefit === index ? "#fff" : currentFeature.color,
                                                    }}
                                                />
                                            </motion.div>
                                            <span className="text-sm text-slate-700">{benefit}</span> {/* Smaller text */}
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* CTA button */}
                                <motion.button
                                    className="flex items-center self-start gap-2 px-5 py-2 mt-3 text-sm font-medium text-white rounded-full group" // Reduced size and padding
                                    style={{ backgroundColor: currentFeature.color }}
                                    whileHover={{ scale: 1.03 }} // Reduced scale effect
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <span>Learn More</span>
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />{" "}
                                    {/* Smaller icon */}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                {/* Navigation controls - more compact */}
                <div className="flex justify-center gap-3 mt-6">
                    {" "}
                    {/* Reduced gap and margin */}
                    <motion.button
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg" // Reduced padding
                        onClick={goToPrev}
                        whileHover={{ scale: 1.05 }} // Reduced scale effect
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft size={16} className="text-slate-700" /> {/* Smaller icon */}
                    </motion.button>
                    <div className="flex items-center gap-2">
                        {" "}
                        {/* Reduced gap */}
                        {features.map((feature, index) => (
                            <motion.button
                                key={index}
                                className="w-2 h-2 rounded-full" // Reduced size
                                style={{
                                    backgroundColor: index === activeFeature ? feature.color : "rgba(203, 213, 225, 0.5)",
                                }}
                                onClick={() => goToFeature(index)}
                                whileHover={{ scale: 1.1 }} // Reduced scale effect
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                    scale: index === activeFeature ? [1, 1.1, 1] : 1, // Reduced scale effect
                                }}
                                transition={{
                                    scale: {
                                        repeat: index === activeFeature ? Number.POSITIVE_INFINITY : 0,
                                        duration: 2,
                                        repeatType: "reverse",
                                    },
                                }}
                            />
                        ))}
                    </div>
                    <motion.button
                        className="p-2 bg-white rounded-full shadow-md hover:shadow-lg" // Reduced padding
                        onClick={goToNext}
                        whileHover={{ scale: 1.05 }} // Reduced scale effect
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight size={16} className="text-slate-700" /> {/* Smaller icon */}
                    </motion.button>
                </div>
            </div>

            {/* Progress bar - more compact */}
            <motion.div
                className="absolute w-32 h-0.5 overflow-hidden transform -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-slate-200" // Reduced width, height, and position
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="h-full"
                    style={{ backgroundColor: currentFeature.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                    key={activeFeature}
                />
            </motion.div>
        </motion.section>
    )
}
