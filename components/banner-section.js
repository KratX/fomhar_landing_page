"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, Heart, Share2, Sparkles, X } from "lucide-react"

const skincareImages = [
    {
        id: 1,
        src: "/placeholder.svg?height=600&width=1200&text=Radiant+Glow+Collection",
        title: "Radiant Glow Collection",
        description: "Discover our premium vitamin C serum collection for luminous, healthy-looking skin",
        category: "Serums",
        featured: true,
        color: "#FF6B9D",
    },
    {
        id: 2,
        src: "/placeholder.svg?height=600&width=1200&text=Hydrating+Essence+Range",
        title: "Hydrating Essence Range",
        description: "Deep hydration meets luxury with our botanical-infused moisturizing essences",
        category: "Moisturizers",
        featured: false,
        color: "#4ECDC4",
    },
    {
        id: 3,
        src: "/placeholder.svg?height=600&width=1200&text=Anti-Aging+Powerhouse",
        title: "Anti-Aging Powerhouse",
        description: "Revolutionary retinol formulations that turn back time for youthful, radiant skin",
        category: "Anti-Aging",
        featured: true,
        color: "#FFE66D",
    },
    {
        id: 4,
        src: "/placeholder.svg?height=600&width=1200&text=Gentle+Cleansing+Ritual",
        title: "Gentle Cleansing Ritual",
        description: "Pure, gentle cleansers that respect your skin's natural barrier while deep cleaning",
        category: "Cleansers",
        featured: false,
        color: "#A8E6CF",
    },
    {
        id: 5,
        src: "/placeholder.svg?height=600&width=1200&text=Sun+Protection+Excellence",
        title: "Sun Protection Excellence",
        description: "Advanced UV protection with invisible, weightless formulas for daily defense",
        category: "Sunscreen",
        featured: true,
        color: "#FFB3BA",
    },
    {
        id: 6,
        src: "/placeholder.svg?height=600&width=1200&text=Overnight+Recovery",
        title: "Overnight Recovery",
        description: "Intensive night treatments that work while you sleep for morning radiance",
        category: "Night Care",
        featured: false,
        color: "#B5A7E6",
    },
]

export default function SlideshowSection() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [direction, setDirection] = useState(0)
    const [hoveredThumbnail, setHoveredThumbnail] = useState(null)
    const [likedImages, setLikedImages] = useState([])
    const [bgColor, setBgColor] = useState(skincareImages[0].color)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    const containerRef = useRef(null)
    const progressAnimation = useAnimation()
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)

    const currentImage = skincareImages[currentIndex]
    const autoSlideInterval = 6000

    // Update background color when current image changes
    useEffect(() => {
        setBgColor(currentImage.color)
    }, [currentIndex, currentImage.color])

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
                this.maxRadius = 100 + Math.random() * 100
                this.speed = 5 + Math.random() * 3
                this.life = 0
                this.opacity = 0.7
                // Use the current image color for ripples
                this.hue = this.getHueFromHex(bgColor)
            }

            getHueFromHex(hex) {
                // Simple conversion from hex to hue (not perfect but works for visualization)
                const r = Number.parseInt(hex.slice(1, 3), 16) / 255
                const g = Number.parseInt(hex.slice(3, 5), 16) / 255
                const b = Number.parseInt(hex.slice(5, 7), 16) / 255

                const max = Math.max(r, g, b)
                const min = Math.min(r, g, b)

                let h = 0

                if (max === min) {
                    h = 0
                } else if (max === r) {
                    h = 60 * ((g - b) / (max - min))
                } else if (max === g) {
                    h = 60 * (2 + (b - r) / (max - min))
                } else {
                    h = 60 * (4 + (r - g) / (max - min))
                }

                if (h < 0) h += 360

                return h
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
                // Use the current image color for droplets
                this.color = bgColor
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
        const dropletCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000)) // Limit based on screen size

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
                // Add ripple every second on mouse move
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

            // Update and draw droplets
            droplets.forEach((droplet) => {
                droplet.color = bgColor // Update color based on current image
                droplet.update(canvas.width, canvas.height)
                droplet.draw(ctx)
            })

            // Update and draw ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i]
                const alive = ripple.update()
                if (alive) {
                    ripple.draw(ctx)
                } else {
                    ripples.splice(i, 1)
                }
            }

            // Add random ripples occasionally
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
    }, [windowSize, bgColor])

    // Auto-slide functionality
    useEffect(() => {
        if (!isPlaying || isFullscreen) return

        progressAnimation.set({ scaleX: 0 })
        progressAnimation.start({
            scaleX: 1,
            transition: { duration: autoSlideInterval / 1000, ease: "linear" },
        })

        const interval = setInterval(nextSlide, autoSlideInterval)
        return () => clearInterval(interval)
    }, [currentIndex, isPlaying, isFullscreen, progressAnimation])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "ArrowLeft") prevSlide()
            if (e.key === "ArrowRight") nextSlide()
            if (e.key === " ") {
                e.preventDefault()
                setIsPlaying(!isPlaying)
            }
            if (e.key === "Escape") setIsFullscreen(false)
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [isPlaying])

    // Navigation functions
    const nextSlide = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % skincareImages.length)
    }

    const prevSlide = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + skincareImages.length) % skincareImages.length)
    }

    const goToSlide = (index) => {
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }

    const toggleLike = (imageId) => {
        setLikedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
    }

    // Function to darken a hex color
    const darkenColor = (hex, amount = 0.5) => {
        // Remove the # if present
        hex = hex.replace("#", "")

        // Parse the hex values
        let r = Number.parseInt(hex.substring(0, 2), 16)
        let g = Number.parseInt(hex.substring(2, 4), 16)
        let b = Number.parseInt(hex.substring(4, 6), 16)

        // Darken each component
        r = Math.floor(r * amount)
        g = Math.floor(g * amount)
        b = Math.floor(b * amount)

        // Convert back to hex
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }

    // Background style with gradient based on mouse position
    const backgroundStyle = useMemo(() => {
        if (isFullscreen) {
            return {
                backgroundColor: "#000000",
            }
        }

        return {
            background: `linear-gradient(135deg, 
    hsl(320, 70%, 95%) 0%, 
    hsl(340, 80%, 93%) 50%, 
    hsl(300, 70%, 90%) 100%)`,
        }
    }, [isFullscreen])

    // Memoized title gradient style
    const titleGradientStyle = useMemo(() => {
        return {
            backgroundImage: `linear-gradient(135deg, #1f2937, ${currentImage.color})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }
    }, [currentImage.color])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
            },
        },
    }

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 1.1,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
        exit: (direction) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.95,
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

    const thumbnailVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.5 + i * 0.1,
                duration: 0.5,
                ease: "easeOut",
            },
        }),
    }

    // Memoized pattern style
    const patternStyle = useMemo(() => {
        return {
            backgroundImage: `
        radial-gradient(circle at 25% 25%, ${currentImage.color} 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, ${currentImage.color} 2px, transparent 2px)
      `,
            backgroundSize: "80px 80px",
        }
    }, [currentImage.color])

    // Memoized slide container style
    const slideContainerStyle = useMemo(() => {
        return {
            backgroundImage: `linear-gradient(135deg, ${currentImage.color}20, transparent)`,
        }
    }, [currentImage.color])

    return (
        <motion.div
            ref={containerRef}
            className={`relative w-full ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "min-h-screen"} overflow-hidden`}
            style={backgroundStyle}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.5 }}
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
                
                .ingredient-tag {
                    transition: all 0.3s ease;
                }
                
                .ingredient-tag:hover {
                    transform: translateY(-2px);
                }
            `}</style>

            {/* Interactive Canvas Background */}
            {!isFullscreen && <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: "auto" }} />}

            {/* Background Pattern */}
            {!isFullscreen && (
                <motion.div
                    className="absolute inset-0 z-0 opacity-10"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                    style={patternStyle}
                />
            )}

            {/* Floating Particles - Reduced count for better performance */}
            {!isFullscreen &&
                [...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full opacity-20 z-1"
                        style={{
                            backgroundImage: `linear-gradient(45deg, ${currentImage.color}, transparent)`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [-20, 20, -20],
                            x: [0, Math.random() * 30 - 15, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                        }}
                    />
                ))}

            {/* Header */}
            {!isFullscreen && (
                <motion.div className="relative z-20 pt-16 pb-8 text-center" variants={contentVariants} custom={0}>
                    <motion.div
                        className="inline-flex items-center gap-3 px-6 py-3 mb-6 border border-gray-200 rounded-full bg-white/80 backdrop-blur-sm"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-pink-500" />
                        </motion.div>
                        <span className="font-semibold text-gray-700">Premium Skincare Collection</span>
                    </motion.div>

                    <motion.h1
                        className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl"
                        variants={contentVariants}
                        custom={1}
                        style={titleGradientStyle}
                    >
                        Skincare Gallery
                    </motion.h1>

                    <motion.p className="max-w-2xl mx-auto text-xl text-gray-600" variants={contentVariants} custom={2}>
                        Explore our curated collection of premium skincare products designed for radiant, healthy skin
                    </motion.p>
                </motion.div>
            )}

            {/* Main Slideshow Container */}
            <motion.div
                className={`relative ${isFullscreen ? "h-full flex items-center justify-center" : "px-4 sm:px-6 lg:px-8 pb-20"}`}
                onMouseEnter={() => !isFullscreen && setIsPlaying(false)}
                onMouseLeave={() => !isFullscreen && setIsPlaying(true)}
            >
                <div className={`${isFullscreen ? "w-full h-full" : "max-w-7xl mx-auto"}`}>
                    {/* Main Image Display */}
                    <motion.div
                        className={`relative ${isFullscreen ? "w-full h-full" : "w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px]"
                            } rounded-3xl overflow-hidden shadow-2xl`}
                        style={slideContainerStyle}
                        variants={contentVariants}
                        custom={3}
                    >
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="absolute inset-0"
                            >
                                {/* Main Image */}
                                <div className="relative w-full h-full">
                                    <Image
                                        src={skincareImages[currentIndex].src || "/placeholder.svg"}
                                        alt={skincareImages[currentIndex].title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                                        priority={currentIndex === 0}
                                    />

                                    {/* Gradient Overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    />

                                    {/* Image Info Overlay */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8"
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <motion.div
                                            className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full bg-white/20 backdrop-blur-sm border-white/30"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentImage.color }} />
                                            <span className="text-sm font-medium">{currentImage.category}</span>
                                            {currentImage.featured && (
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        <h2 className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl">{currentImage.title}</h2>
                                        <p className="max-w-2xl text-lg leading-relaxed text-white/90">{currentImage.description}</p>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        className="absolute flex gap-3 top-6 right-6"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <motion.button
                                            onClick={() => toggleLike(currentImage.id)}
                                            className="p-3 text-white border rounded-full bg-white/20 backdrop-blur-sm border-white/30"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                                            whileTap={{ scale: 0.9 }}
                                            animate={{
                                                color: likedImages.includes(currentImage.id) ? "#ef4444" : "#ffffff",
                                            }}
                                        >
                                            <Heart className="w-5 h-5" fill={likedImages.includes(currentImage.id) ? "#ef4444" : "none"} />
                                        </motion.button>

                                        <motion.button
                                            onClick={() => setIsFullscreen(!isFullscreen)}
                                            className="p-3 text-white border rounded-full bg-white/20 backdrop-blur-sm border-white/30"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Maximize2 className="w-5 h-5" />
                                        </motion.button>

                                        <motion.button
                                            className="p-3 text-white border rounded-full bg-white/20 backdrop-blur-sm border-white/30"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <motion.button
                            onClick={prevSlide}
                            className="absolute z-20 p-3 text-white transform -translate-y-1/2 border rounded-full left-4 top-1/2 bg-white/20 backdrop-blur-md border-white/30"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <ChevronLeft size={24} />
                        </motion.button>

                        <motion.button
                            onClick={nextSlide}
                            className="absolute z-20 p-3 text-white transform -translate-y-1/2 border rounded-full right-4 top-1/2 bg-white/20 backdrop-blur-md border-white/30"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <ChevronRight size={24} />
                        </motion.button>
                    </motion.div>

                    {/* Thumbnail Navigation */}
                    {!isFullscreen && (
                        <motion.div className="px-4 mt-8" variants={contentVariants} custom={4}>
                            <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
                                {skincareImages.map((image, index) => (
                                    <motion.button
                                        key={image.id}
                                        onClick={() => goToSlide(index)}
                                        className={`relative flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${index === currentIndex
                                            ? "border-white shadow-lg scale-105"
                                            : "border-transparent hover:border-white/50"
                                            }`}
                                        variants={thumbnailVariants}
                                        custom={index}
                                        onHoverStart={() => setHoveredThumbnail(index)}
                                        onHoverEnd={() => setHoveredThumbnail(null)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Image
                                            src={image.src || "/placeholder.svg"}
                                            alt={image.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 160px"
                                        />

                                        {/* Overlay */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center bg-black/40"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: index === currentIndex ? 0 : hoveredThumbnail === index ? 0.3 : 0.6,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {index === currentIndex && (
                                                <motion.div
                                                    className="w-3 h-3 bg-white rounded-full"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                />
                                            )}
                                        </motion.div>

                                        {/* Category Badge */}
                                        <motion.div
                                            className="absolute px-2 py-1 text-xs font-medium text-white rounded top-1 left-1 bg-black/60 backdrop-blur-sm"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            {image.category}
                                        </motion.div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Controls */}
                    <motion.div
                        className={`${isFullscreen ? "absolute bottom-8 left-1/2 transform -translate-x-1/2" : "mt-8"
                            } flex items-center justify-center gap-6`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <div className="flex items-center gap-4 px-6 py-3 border border-gray-200 rounded-full shadow-lg bg-white/80 backdrop-blur-md">
                            {/* Play/Pause Button */}
                            <motion.button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-2 text-gray-700 transition-colors hover:text-gray-900"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                            </motion.button>

                            {/* Slide Indicators */}
                            <div className="flex gap-2">
                                {skincareImages.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className="relative w-2 h-2 overflow-hidden rounded-full"
                                        whileHover={{ scale: 1.3 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <motion.div className="absolute inset-0 bg-gray-300 rounded-full" />
                                        <motion.div
                                            className="absolute inset-0 rounded-full"
                                            style={{ backgroundColor: currentImage.color }}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: index === currentIndex ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Progress Bar */}
                            {!isFullscreen && (
                                <div className="w-16 h-1 overflow-hidden bg-gray-200 rounded-full">
                                    <motion.div
                                        className="h-full origin-left rounded-full"
                                        style={{ backgroundColor: currentImage.color }}
                                        animate={progressAnimation}
                                    />
                                </div>
                            )}

                            {/* Image Counter */}
                            <div className="text-sm font-medium text-gray-600">
                                <span className="font-bold text-gray-900">{String(currentIndex + 1).padStart(2, "0")}</span>
                                <span className="mx-1">/</span>
                                <span>{String(skincareImages.length).padStart(2, "0")}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Fullscreen Close Button */}
            {isFullscreen && (
                <motion.button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute z-30 p-3 text-white border rounded-full top-6 right-6 bg-white/20 backdrop-blur-md border-white/30"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <X size={24} />
                </motion.button>
            )}
        </motion.div>
    )
}
