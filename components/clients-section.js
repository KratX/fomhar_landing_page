"use client"

import React from "react"

import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, useSpring, useScroll, useInView, AnimatePresence } from "framer-motion"
import {
    Star,
    MessageCircle,
    Clock,
    User,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Maximize2,
    Minimize2,
    Layers,
    Droplet,
    Sun,
    MapPin,
    TrendingUp,
} from "lucide-react"

// Testimonial data
const testimonials = [
    {
        id: 1,
        name: "Aishwika Das",
        role: "Skincare Enthusiast",
        location: "Mumbai, India",
        skinType: "Combination",
        text: "I've been using Fomhar skincare products for five weeks now, and I'm truly amazed by the results. My skin feels softer, looks brighter, and the texture has improved significantly.",
        image: "/client 1.jpeg",
        rating: 5,
        productUsed: "Complete Skincare Kit",
        timeUsed: "5 weeks",
        improvement: "95%",
        keyBenefits: ["Texture", "Brightness", "Confidence"],
        color: "#FF6B6B",
    },
    {
        id: 2,
        name: "Vidhi Kampla",
        role: "Beauty Influencer",
        location: "Delhi, India",
        skinType: "Dry",
        text: "Fomhar's product line is a game-changer. My pores feel more even, and the hydration level is off the charts. Been recommending them to family and friends.",
        image: "/client 2.jpg",
        rating: 5,
        productUsed: "Hydration Series",
        timeUsed: "8 weeks",
        improvement: "98%",
        keyBenefits: ["Hydration", "Pore Refinement", "Glow"],
        color: "#4ECDC4",
    },
    {
        id: 3,
        name: "Namratha",
        role: "Loyal Customer",
        location: "Bangalore, India",
        skinType: "Normal",
        text: "Absolutely in love with Fomhar skincare! My skin has evened out, and the glow is real. I used to struggle with dryness, but not anymore. Highly recommend!",
        image: "/client 3.jpg",
        rating: 4,
        productUsed: "Glow Enhancement Kit",
        timeUsed: "6 weeks",
        improvement: "92%",
        keyBenefits: ["Even Tone", "Natural Glow", "Hydration"],
        color: "#FFD166",
    },
    {
        id: 4,
        name: "Abhinav Aryan",
        role: "Skincare Novice",
        location: "Pune, India",
        skinType: "Sensitive",
        text: "I was skeptical at first, but Fomhar totally impressed me. The products absorb quickly and work well with my sensitive skin. The transformation wasn't instant, but steady.",
        image: "/client 4.jpg",
        rating: 5,
        productUsed: "Sensitive Skin Formula",
        timeUsed: "7 weeks",
        improvement: "89%",
        keyBenefits: ["Gentle", "Calming", "Progressive"],
        color: "#06D6A0",
    },
    {
        id: 5,
        name: "Deepak Jha",
        role: "Product Reviewer",
        location: "Chennai, India",
        skinType: "Oily",
        text: "I've tried so many brands, but Fomhar stands out. The glow you get is unreal. It feels luxurious but affordable. My skin's the clearest it's been in years.",
        image: "/client 5.jpg",
        rating: 5,
        productUsed: "Premium Glow Series",
        timeUsed: "4 weeks",
        improvement: "96%",
        keyBenefits: ["Clarity", "Oil Control", "Radiance"],
        color: "#118AB2",
    },
    {
        id: 6,
        name: "Nishita Rane",
        role: "Skincare Enthusiast",
        location: "Hyderabad, India",
        skinType: "Acne-prone",
        text: "Fomhar has completely transformed my skincare routine. My acne has visibly reduced and my skin texture feels more refined. So grateful I made the switch!",
        image: "/client 6.jpg",
        rating: 4,
        productUsed: "Acne Control Kit",
        timeUsed: "9 weeks",
        improvement: "94%",
        keyBenefits: ["Acne Control", "Texture", "Confidence"],
        color: "#9381FF",
    },
    {
        id: 7,
        name: "Kritika Singh",
        role: "Wellness Advisor",
        location: "Bangalore, India",
        skinType: "Acne-prone",
        text: "FOMHAR has completely changed my skincare game! I struggled with pigmentation and uneven skin tone for years, but within weeks of using their products, my skin looked noticeably clearer and brighter.",
        image: "/review 1.jpg",
        rating: 5,
        productUsed: "Acne Control Kit",
        timeUsed: "18 weeks",
        improvement: "97%",
        keyBenefits: ["Oil Control", "Texture", "Glowing"],
        color: "#F7D9C4",
    },
    {
        id: 8,
        name: "Nishita Rane",
        role: "Skincare Enthusiast",
        location: "Hyderabad, India",
        skinType: "Acne-prone",
        text: "I've tried countless skincare brands, but nothing worked like FOMHAR. My acne and dark spots have visibly reduced, and my skin feels smooth and healthy every day.",
        image: "/review 2.jpg",
        rating: 5,
        productUsed: "Radiance Booster",
        timeUsed: "6 weeks",
        improvement: "92%",
        keyBenefits: ["Beauty Standards", "Smooth", "Ecstatic"],
        color: "#B76E79",
    },
]

// Simplified benefit icons mapping
const benefitIcons = {
    Texture: Layers,
    Brightness: Sun,
    Confidence: Sun,
    Hydration: Droplet,
    "Pore Refinement": Layers,
    Glow: Sparkles,
    "Even Tone": Layers,
    "Natural Glow": Sun,
    Gentle: Droplet,
    Calming: Droplet,
    Progressive: Clock,
    Clarity: Layers,
    "Oil Control": Droplet,
    Radiance: Sparkles,
    "Acne Control": Layers,
}

export default function ClientsSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [minimizedView, setMinimizedView] = useState(false)
    const [interacting, setInteracting] = useState(false)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: false, amount: 0.2 })
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)

    // Simplified motion values
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const rotateX = useTransform(mouseY, [-300, 300], [3, -3])
    const rotateY = useTransform(mouseX, [-300, 300], [-3, 3])

    // Spring animations with optimized settings
    const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 40 })
    const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 40 })
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

    // Background gradient position based on mouse
    const gradientX = useTransform(smoothX, [0, windowSize.width || 1], [0, 100])
    const gradientY = useTransform(smoothY, [0, windowSize.height || 1], [0, 100])

    // Scroll-based effects with reduced complexity
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

    // Current testimonial - memoized
    const currentTestimonial = useMemo(() => testimonials[activeIndex], [activeIndex])
    const testimonialColor = useMemo(() => currentTestimonial.color, [currentTestimonial])

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
                // Use the current testimonial color for ripples
                this.color = testimonialColor
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
                // Use the current testimonial color for droplets
                this.color = testimonialColor
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

            // Update droplet colors based on current testimonial
            droplets.forEach((droplet) => {
                droplet.color = testimonialColor
                droplet.update(canvas.width, canvas.height)
                droplet.draw(ctx)
            })

            // Update ripple colors based on current testimonial
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i]
                ripple.color = testimonialColor
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
    }, [windowSize, testimonialColor])

    // Optimized mouse movement handler
    const handleMouseMove = useCallback(
        (e) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // Reduced sensitivity for better performance
            const x = (e.clientX - centerX) * 0.5
            const y = (e.clientY - centerY) * 0.5

            mouseX.set(x)
            mouseY.set(y)
        },
        [mouseX, mouseY],
    )

    // Navigation functions - memoized
    const goToNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
        setMinimizedView(false) // Reset minimized view when changing testimonials
    }, [])

    const goToPrev = useCallback(() => {
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
        setMinimizedView(false) // Reset minimized view when changing testimonials
    }, [])

    const goToSlide = useCallback((index) => {
        setActiveIndex(index)
        setMinimizedView(false) // Reset minimized view when changing testimonials
    }, [])

    // Toggle minimized view
    const toggleMinimized = useCallback(() => {
        setMinimizedView((prev) => !prev)
    }, [])

    // Generate star rating - memoized
    const renderStars = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={14} // Smaller stars
                className={`${i < currentTestimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
            />
        ))
    }, [currentTestimonial.rating])

    // Auto-advance testimonials
    React.useEffect(() => {
        if (!isInView || minimizedView) return // Don't auto-advance when minimized

        const timer = setTimeout(() => {
            goToNext()
        }, 8000)

        return () => clearTimeout(timer)
    }, [isInView, activeIndex, goToNext, minimizedView])

    return (
        <section
            ref={containerRef}
            className="relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden text-white" // Reduced padding
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            style={{
                background: `linear-gradient(135deg, 
          hsl(${gradientX.get() * 0.1 + 220}, 70%, 15%) 0%, 
          hsl(${gradientY.get() * 0.1 + 240}, 80%, 13%) 50%, 
          hsl(${(gradientX.get() + gradientY.get()) * 0.05 + 200}, 70%, 10%) 100%)`,
            }}
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

            {/* Main content container */}
            <motion.div
                className="relative z-10 w-full max-w-5xl mx-auto" // Reduced max width
                style={{
                    scale,
                }}
            >
                {/* Header section - simplified */}
                <div className="mb-8 text-center">
                    {" "}
                    {/* Reduced margin */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 border rounded-full bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                        {" "}
                        {/* Smaller padding and margin */}
                        <Sparkles className="w-3 h-3" style={{ color: testimonialColor }} /> {/* Smaller icon */}
                        <span className="text-xs font-medium">Stellar Testimonials</span> {/* Smaller text */}
                    </div>
                    <h1 className="mb-3 text-3xl font-bold md:text-4xl">
                        {" "}
                        {/* Smaller text and margin */}
                        <span className="block">Client</span>
                        <span className="block" style={{ color: testimonialColor }}>
                            Experiences
                        </span>
                    </h1>
                    <p className="max-w-xl mx-auto text-sm text-gray-400">
                        {" "}
                        {/* Smaller text and max width */}
                        Discover the transformative skincare experiences from our satisfied clients
                    </p>
                </div>

                {/* Testimonial showcase */}
                <div className="relative flex flex-col items-center justify-center">
                    {/* Central testimonial display */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            className="z-30 w-full max-w-4xl" // Reduced max width
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="relative p-4 overflow-hidden border backdrop-blur-lg rounded-xl border-opacity-30" // Reduced padding and border radius
                                style={{
                                    backgroundColor: `${testimonialColor}10`,
                                    borderColor: `${testimonialColor}30`,
                                }}
                            >
                                {/* Minimize/Maximize button */}
                                <motion.button
                                    className="absolute z-20 p-1.5 transition-colors rounded-full top-3 right-3 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 group" // Smaller button and positioning
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleMinimized()
                                    }}
                                    aria-label={minimizedView ? "Expand view" : "Minimize view"}
                                >
                                    {minimizedView ? <Maximize2 size={16} /> : <Minimize2 size={16} />} {/* Smaller icon */}
                                    <span className="absolute px-2 py-1 text-xs transition-opacity transform -translate-x-1/2 bg-gray-800 rounded opacity-0 -bottom-8 left-1/2 whitespace-nowrap group-hover:opacity-100">
                                        {minimizedView ? "Expand view" : "Minimize view"}
                                    </span>
                                </motion.button>

                                {/* Simplified glowing background */}
                                <div
                                    className="absolute inset-0 opacity-20 blur-xl"
                                    style={{
                                        background: `radial-gradient(circle at 50% 50%, ${testimonialColor}, transparent 70%)`,
                                    }}
                                />

                                {/* Content - LANDSCAPE LAYOUT */}
                                <div className={`relative z-10 flex flex-col ${minimizedView ? "gap-3" : "gap-6"} md:flex-row`}>
                                    {/* Left column - Profile information */}
                                    <div
                                        className={`flex flex-col items-center md:items-start ${minimizedView ? "md:w-1/5" : "md:w-1/4"
                                            } transition-all duration-300`}
                                    >
                                        {/* Profile image and info */}
                                        <div
                                            className={`flex flex-col items-center ${minimizedView ? "gap-2 mb-2" : "gap-4 mb-4"
                                                } md:items-start transition-all duration-300`}
                                        >
                                            <div
                                                className={`relative overflow-hidden border-2 rounded-full ${minimizedView ? "w-16 h-16" : "w-24 h-24"
                                                    } transition-all duration-300`}
                                                style={{ borderColor: testimonialColor }}
                                            >
                                                <Image
                                                    src={currentTestimonial.image || "/placeholder.svg"}
                                                    alt={currentTestimonial.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes={minimizedView ? "64px" : "96px"}
                                                    priority
                                                />
                                            </div>

                                            <div className="text-center md:text-left">
                                                <h3
                                                    className={`font-bold ${minimizedView ? "text-base" : "text-lg"} transition-all duration-300`}
                                                    style={{ color: testimonialColor }}
                                                >
                                                    {currentTestimonial.name}
                                                </h3>

                                                <div
                                                    className={`mt-0.5 text-gray-300 ${minimizedView ? "text-xs" : "text-sm"
                                                        } transition-all duration-300`}
                                                >
                                                    {currentTestimonial.role}
                                                </div>

                                                <div className="flex justify-center mt-1 mb-1 md:justify-start">{renderStars}</div>

                                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                    <MapPin size={12} />
                                                    <span>{currentTestimonial.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Client details - show in compact form when minimized */}
                                        <div
                                            className={`w-full mt-1 ${minimizedView ? "space-y-1" : "space-y-2"} transition-all duration-300`}
                                        >
                                            <div
                                                className={`flex items-center gap-2 ${minimizedView ? "p-1.5 text-xs" : "p-2 text-xs"
                                                    } bg-gray-800/30 backdrop-blur-sm rounded-lg transition-all duration-300`}
                                            >
                                                <div
                                                    className={`${minimizedView ? "p-1.5" : "p-2"} rounded-full transition-all duration-300`}
                                                    style={{ backgroundColor: `${testimonialColor}20` }}
                                                >
                                                    <Clock size={minimizedView ? 12 : 14} style={{ color: testimonialColor }} />
                                                </div>
                                                <div>
                                                    <div className="text-gray-400">Duration</div>
                                                    <div className="font-medium">{currentTestimonial.timeUsed}</div>
                                                </div>
                                            </div>

                                            {!minimizedView && (
                                                <>
                                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30 backdrop-blur-sm">
                                                        <div className="p-2 rounded-full" style={{ backgroundColor: `${testimonialColor}20` }}>
                                                            <TrendingUp size={14} style={{ color: testimonialColor }} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-400">Improvement</div>
                                                            <div className="font-medium">{currentTestimonial.improvement}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30 backdrop-blur-sm">
                                                        <div className="p-2 rounded-full" style={{ backgroundColor: `${testimonialColor}20` }}>
                                                            <User size={14} style={{ color: testimonialColor }} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-400">Skin Type</div>
                                                            <div className="font-medium">{currentTestimonial.skinType}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right column - Testimonial content */}
                                    <div className={`${minimizedView ? "md:w-4/5" : "md:w-3/4"} transition-all duration-300`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className={`px-3 py-1.5 text-xs font-medium rounded-full ${minimizedView ? "text-xs" : "text-xs"
                                                    } transition-all duration-300`}
                                                style={{ backgroundColor: `${testimonialColor}20`, color: testimonialColor }}
                                            >
                                                {currentTestimonial.productUsed}
                                            </div>
                                        </div>

                                        {/* Quote - always show full text */}
                                        <div
                                            className={`relative mb-4 ${minimizedView ? "text-sm" : "text-base md:text-lg"
                                                } transition-all duration-300`}
                                        >
                                            <MessageCircle
                                                size={minimizedView ? 20 : 24}
                                                className="absolute -top-3 -left-1 opacity-20"
                                                style={{ color: testimonialColor }}
                                            />
                                            <p className="pl-6 leading-relaxed">{currentTestimonial.text}</p>
                                        </div>

                                        {/* Key benefits - show in compact form when minimized */}
                                        <div className={`${minimizedView ? "mb-2" : "mb-4"} transition-all duration-300`}>
                                            <h4
                                                className={`mb-2 text-gray-400 ${minimizedView ? "text-xs mb-1" : "text-xs mb-2"
                                                    } transition-all duration-300`}
                                            >
                                                Key Benefits:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {currentTestimonial.keyBenefits.map((benefit) => {
                                                    const IconComponent = benefitIcons[benefit] || Sparkles
                                                    return (
                                                        <div
                                                            key={benefit}
                                                            className={`flex items-center gap-1 rounded-full ${minimizedView ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"
                                                                } transition-all duration-300`}
                                                            style={{
                                                                backgroundColor: `${testimonialColor}20`,
                                                                color: testimonialColor,
                                                            }}
                                                        >
                                                            <IconComponent size={minimizedView ? 10 : 12} />
                                                            <span>{benefit}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Additional content - only visible in normal view */}
                                        <AnimatePresence mode="sync">
                                            {!minimizedView && (
                                                <motion.div
                                                    className="pt-3 mt-3 border-t border-gray-700/30" // Reduced padding and margin
                                                    initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                    animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="p-3 rounded-lg bg-gray-800/30 backdrop-blur-sm">
                                                        {" "}
                                                        {/* Reduced padding */}
                                                        <div className="mb-1 text-xs text-gray-400">Client Journey:</div>{" "}
                                                        {/* Smaller text and margin */}
                                                        <div className="flex items-center gap-1.5 mb-1 text-xs">
                                                            {" "}
                                                            {/* Smaller gap and text */}
                                                            <div
                                                                className="w-1.5 h-1.5 rounded-full"
                                                                style={{ backgroundColor: testimonialColor }}
                                                            ></div>
                                                            <span>Started using {currentTestimonial.timeUsed} ago</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mb-1 text-xs">
                                                            <div
                                                                className="w-1.5 h-1.5 rounded-full"
                                                                style={{ backgroundColor: testimonialColor }}
                                                            ></div>
                                                            <span>Noticed first results after 2 weeks</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs">
                                                            <div
                                                                className="w-1.5 h-1.5 rounded-full"
                                                                style={{ backgroundColor: testimonialColor }}
                                                            ></div>
                                                            <span>Achieved {currentTestimonial.improvement} improvement</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation controls - more compact */}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        {" "}
                        {/* Reduced margin and gap */}
                        <motion.button
                            className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 backdrop-blur-sm" // Smaller padding
                            onClick={goToPrev}
                            whileHover={{ scale: 1.05 }} // Reduced scale effect
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft size={16} /> {/* Smaller icon */}
                        </motion.button>
                        <div className="flex gap-1.5">
                            {" "}
                            {/* Reduced gap */}
                            {testimonials.map((_, i) => (
                                <motion.button
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6" : "bg-gray-600 hover:bg-gray-500"
                                        }`}
                                    style={{
                                        backgroundColor: i === activeIndex ? testimonialColor : undefined,
                                    }}
                                    onClick={() => goToSlide(i)}
                                    whileHover={{ scale: 1.1 }} // Reduced scale effect
                                />
                            ))}
                        </div>
                        <motion.div
                            className="absolute w-32 h-0.5 overflow-hidden transform -translate-x-1/2 rounded-full -bottom-6 left-1/2 bg-slate-200/20" // Smaller height and position
                            initial={{ opacity: 0 }}
                            animate={{ opacity: minimizedView ? 0 : 1 }}
                            transition={{ delay: 1 }}
                        >
                            <motion.div
                                className="h-full"
                                style={{ backgroundColor: testimonialColor }}
                                initial={{ width: "0%" }}
                                animate={{ width: minimizedView ? "0%" : "100%" }}
                                transition={{ duration: 8, ease: "linear", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                                key={activeIndex}
                            />
                        </motion.div>
                        <motion.button
                            className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700/70 backdrop-blur-sm" // Smaller padding
                            onClick={goToNext}
                            whileHover={{ scale: 1.05 }} // Reduced scale effect
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronRight size={16} /> {/* Smaller icon */}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
