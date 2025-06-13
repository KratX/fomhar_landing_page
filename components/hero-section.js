"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

export default function CarouselSection() {
    const slides = [
        {
            id: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            image: "/first-slide.png",
            category: "SKINCARE ESSENTIALS",
            title: "FOMHAR FRESH",
            subtitle: "Daily Protection Redefined",
            description:
                "Your daily skin shield, powered by science and nature. Lightweight, non-greasy formula with zero white cast.",
            features: ["UV Protection", "Anti-Pollution", "Stress Defense"],
            cta: "Discover Collection",
            accent: "#4f46e5",
        },
        {
            id: 2,
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            image: "/second-slide.png",
            category: "PREMIUM CARE",
            title: "RHYTHM SYNC",
            subtitle: "Day & Night Harmony",
            description:
                "A nourishing cream that syncs with your skin's natural rhythm. Infused with ceramides and plant extracts.",
            features: ["24H Hydration", "Ceramide Complex", "Plant Extracts"],
            cta: "Shop Now",
            accent: "#ec4899",
            products: ["/Jar 1.png", "/Jar 3.png", "/Jar2.png"],
        },
        {
            id: 3,
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            image: "/third-slide.png",
            category: "ADVANCED FORMULA",
            title: "FOMHAR AURA",
            subtitle: "Concentrated Excellence",
            description:
                "High-concentration serum with active ingredients targeting specific skin concerns for visible results.",
            features: ["Active Peptides", "Hyaluronic Acid", "Antioxidant Rich"],
            cta: "Add to Cart",
            accent: "#0ea5e9",
        },
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })

    const containerRef = useRef(null)
    const timeoutRef = useRef(null)
    const progressAnimation = useAnimation()

    const x = useMotionValue(0)
    const background = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])
    const springX = useSpring(x, { stiffness: 300, damping: 30 })

    const autoSlideInterval = 6000

    // Navigation functions
    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }, [slides.length])

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index)
    }, [])

    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying) return

        progressAnimation.set({ scaleX: 0 })
        progressAnimation.start({
            scaleX: 1,
            transition: { duration: autoSlideInterval / 1000, ease: "linear" },
        })

        timeoutRef.current = setTimeout(nextSlide, autoSlideInterval)

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [currentIndex, isPlaying, nextSlide, progressAnimation])

    // Drag handling
    const handleDragEnd = (event, info) => {
        const threshold = 50
        if (info.offset.x > threshold) {
            prevSlide()
        } else if (info.offset.x < -threshold) {
            nextSlide()
        }
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "ArrowLeft") prevSlide()
            if (e.key === "ArrowRight") nextSlide()
            if (e.key === " ") {
                e.preventDefault()
                setIsPlaying(!isPlaying)
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [nextSlide, prevSlide, isPlaying])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95,
            rotateY: direction > 0 ? 15 : -15,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
        exit: (direction) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95,
            rotateY: direction < 0 ? 15 : -15,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        }),
    }

    const contentVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: (delay = 0) => ({
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                delay: delay * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        }),
    }

    const featureVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: (i) => ({
            x: 0,
            opacity: 1,
            transition: {
                delay: 0.6 + i * 0.1,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    }

    const productVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.8 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.8 + i * 0.15,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
            },
        }),
        hover: {
            y: -5,
            scale: 1.05,
            rotateY: 5,
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
            },
        },
    }

    const currentSlide = slides[currentIndex]

    return (
        <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full overflow-hidden bg-black h-[500px] sm:h-[550px] md:h-[600px]" // Reduced height
            style={{
                perspective: 1000,
                fontFeatureSettings: '"rlig" 1, "calt" 1',
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
            }}
        >
            {/* Background Gradient */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    background: currentSlide.background,
                    scale: background,
                }}
                animate={{
                    background: currentSlide.background,
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {/* Animated Background Pattern */}
            <motion.div
                className="absolute inset-0 z-10 opacity-10"
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
                    backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
                    backgroundSize: "40px 40px", // Smaller pattern
                }}
            />

            {/* Main Content */}
            <AnimatePresence mode="wait" custom={currentIndex}>
                <motion.div
                    key={currentIndex}
                    custom={currentIndex}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: -100, right: 100 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 z-20"
                >
                    {/* Background Image */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.3 }}
                        transition={{ duration: 1.5 }}
                    >
                        <Image
                            src={currentSlide.image || "/placeholder.svg"}
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Content Container */}
                    <div className="relative z-30 flex items-center h-full">
                        <div className="container max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                            <div className="grid items-center gap-6 md:gap-8 lg:grid-cols-2">
                                {/* Text Content */}
                                <motion.div className="space-y-4 sm:space-y-6">
                                    <motion.div variants={contentVariants} initial="hidden" animate="visible" custom={0}>
                                        <motion.span
                                            className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase border rounded-full backdrop-blur-sm sm:text-sm sm:px-4 sm:py-1.5"
                                            style={{
                                                backgroundColor: `${currentSlide.accent}20`,
                                                color: currentSlide.accent,
                                                borderColor: `${currentSlide.accent}40`,
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {currentSlide.category}
                                        </motion.span>
                                    </motion.div>

                                    <motion.div
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={1}
                                        className="space-y-2 sm:space-y-3"
                                    >
                                        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                                            {currentSlide.title.split(" ").map((word, i) => (
                                                <motion.span
                                                    key={i}
                                                    className="inline-block mr-3"
                                                    initial={{ y: 60, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{
                                                        delay: 0.3 + i * 0.1,
                                                        duration: 0.6,
                                                        ease: [0.25, 0.46, 0.45, 0.94],
                                                    }}
                                                >
                                                    {word}
                                                </motion.span>
                                            ))}
                                        </h1>

                                        <motion.h2
                                            className="text-lg font-light sm:text-xl md:text-2xl text-white/80"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                        >
                                            {currentSlide.subtitle}
                                        </motion.h2>
                                    </motion.div>

                                    <motion.p
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={2}
                                        className="max-w-lg text-sm leading-relaxed sm:text-base text-white/70"
                                    >
                                        {currentSlide.description}
                                    </motion.p>

                                    {/* Features */}
                                    <motion.div
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={3}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {currentSlide.features.map((feature, i) => (
                                            <motion.span
                                                key={feature}
                                                variants={featureVariants}
                                                initial="hidden"
                                                animate="visible"
                                                custom={i}
                                                className="px-3 py-1 text-xs font-medium text-white border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
                                                whileHover={{
                                                    backgroundColor: "rgba(255,255,255,0.2)",
                                                    scale: 1.05,
                                                }}
                                            >
                                                {feature}
                                            </motion.span>
                                        ))}
                                    </motion.div>

                                    {/* CTA Button */}
                                    <motion.div variants={contentVariants} initial="hidden" animate="visible" custom={4}>
                                        <motion.button
                                            className="relative px-5 py-2 overflow-hidden text-xs font-semibold text-black bg-white rounded-full group sm:px-6 sm:py-2.5 sm:text-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                outline: "none",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.outline = "2px solid rgba(255, 255, 255, 0.5)"
                                                e.target.style.outlineOffset = "2px"
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.outline = "none"
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                initial={{ x: "-100%" }}
                                                whileHover={{ x: "100%" }}
                                                transition={{ duration: 0.6 }}
                                            />
                                            <span className="relative z-10">{currentSlide.cta}</span>
                                        </motion.button>
                                    </motion.div>
                                </motion.div>

                                {/* Product Showcase (for slide 2) */}
                                {currentSlide.products && (
                                    <motion.div
                                        className="flex justify-center lg:justify-end"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                            {currentSlide.products.map((product, i) => (
                                                <motion.div
                                                    key={i}
                                                    variants={productVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    whileHover="hover"
                                                    custom={i}
                                                    className="relative w-16 h-20 overflow-hidden border sm:w-20 sm:h-24 md:w-24 md:h-28 bg-white/10 backdrop-blur-sm rounded-xl border-white/20"
                                                >
                                                    <Image
                                                        src={product || "/placeholder.svg"}
                                                        alt={`Product ${i + 1}`}
                                                        fill
                                                        className="object-contain p-2"
                                                    />
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                                                        initial={{ opacity: 0 }}
                                                        whileHover={{ opacity: 1 }}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute z-40 transform -translate-x-1/2 bottom-4 left-1/2">
                <div className="flex items-center px-3 py-1.5 space-x-3 border rounded-full sm:space-x-4 bg-black/20 backdrop-blur-md sm:px-4 sm:py-2 border-white/10">
                    {/* Play/Pause Button */}
                    <motion.button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 text-white transition-colors hover:text-white/80"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ outline: "none" }}
                        onFocus={(e) => {
                            e.target.style.outline = "2px solid rgba(255, 255, 255, 0.5)"
                            e.target.style.outlineOffset = "2px"
                        }}
                        onBlur={(e) => {
                            e.target.style.outline = "none"
                        }}
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </motion.button>

                    {/* Slide Indicators */}
                    <div className="flex space-x-1.5 sm:space-x-2">
                        {slides.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className="relative w-1.5 h-1.5 overflow-hidden rounded-full"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                style={{ outline: "none" }}
                                onFocus={(e) => {
                                    e.target.style.outline = "2px solid rgba(255, 255, 255, 0.5)"
                                    e.target.style.outlineOffset = "2px"
                                }}
                                onBlur={(e) => {
                                    e.target.style.outline = "none"
                                }}
                            >
                                <motion.div className="absolute inset-0 rounded-full bg-white/40" />
                                <motion.div
                                    className="absolute inset-0 bg-white rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: index === currentIndex ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-10 h-0.5 overflow-hidden rounded-full sm:w-12 bg-white/20">
                        <motion.div className="h-full origin-left bg-white rounded-full" animate={progressAnimation} />
                    </div>
                </div>
            </div>

            {/* Side Navigation */}
            <motion.button
                onClick={prevSlide}
                className="absolute z-40 p-1.5 text-white transform -translate-y-1/2 border rounded-full left-2 sm:left-4 top-1/2 sm:p-2 bg-black/20 backdrop-blur-md border-white/10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.9 }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ outline: "none" }}
                onFocus={(e) => {
                    e.target.style.outline = "2px solid rgba(255, 255, 255, 0.5)"
                    e.target.style.outlineOffset = "2px"
                }}
                onBlur={(e) => {
                    e.target.style.outline = "none"
                }}
            >
                <ChevronLeft size={16} />
            </motion.button>

            <motion.button
                onClick={nextSlide}
                className="absolute z-40 p-1.5 text-white transform -translate-y-1/2 border rounded-full right-2 sm:right-4 top-1/2 sm:p-2 bg-black/20 backdrop-blur-md border-white/10"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.9 }}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ outline: "none" }}
                onFocus={(e) => {
                    e.target.style.outline = "2px solid rgba(255, 255, 255, 0.5)"
                    e.target.style.outlineOffset = "2px"
                }}
                onBlur={(e) => {
                    e.target.style.outline = "none"
                }}
            >
                <ChevronRight size={16} />
            </motion.button>

            {/* Slide Counter */}
            <motion.div
                className="absolute z-40 font-mono text-xs top-4 right-4 text-white/60"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
            >
                <span className="font-bold text-white">{String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="mx-1">/</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
            </motion.div>
        </motion.div>
    )
}
