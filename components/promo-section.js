"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Droplet, Leaf, Star, Heart } from "lucide-react"

export default function PromoSection() {
    const [activeProduct, setActiveProduct] = useState(null)
    const containerRef = useRef(null)
    const canvasRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const requestRef = useRef(null)
    const previousTimeRef = useRef(null)

    // Mouse tracking for background gradient
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

    // Handle mouse movement with throttling
    useEffect(() => {
        let throttleTimeout = null

        const handleMouseMove = (e) => {
            if (throttleTimeout !== null) return

            throttleTimeout = setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    mouseX.set(x)
                    mouseY.set(y)
                }
                throttleTimeout = null
            }, 16) // ~60fps
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("mousemove", handleMouseMove)
            return () => {
                container.removeEventListener("mousemove", handleMouseMove)
                if (throttleTimeout) clearTimeout(throttleTimeout)
            }
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
                ctx.fillStyle = `rgba(244, 114, 182, ${this.opacity})`
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
    }, [windowSize])

    // Product data with skincare theme
    const products = [
        {
            id: 1,
            title: "HYDRATION COLLECTION",
            subtitle: "Quench your skin's thirst",
            image: "/product 1.jpg",
            cta: "Shop Collection",
            icon: Droplet,
            gradient: "from-sky-400 via-blue-500 to-indigo-600",
            bgGradient: "from-sky-50 to-blue-50",
            accentColor: "#0ea5e9", // sky-500
            category: "Bestseller",
            description: "Ultra-hydrating formulas with hyaluronic acid and ceramides",
            ingredients: ["Hyaluronic Acid", "Ceramides", "Glycerin"],
            price: "$48",
        },
        {
            id: 2,
            title: "BOTANICAL ESSENCE",
            subtitle: "Nature's purest extracts",
            image: "/product 2.jpg",
            cta: "Explore Range",
            icon: Leaf,
            gradient: "from-emerald-400 via-green-500 to-teal-600",
            bgGradient: "from-emerald-50 to-green-50",
            accentColor: "#10b981", // emerald-500
            category: "Organic",
            description: "Plant-based formulations for sensitive skin",
            ingredients: ["Aloe Vera", "Green Tea", "Chamomile"],
            price: "$52",
        },
        {
            id: 3,
            title: "RADIANCE RITUAL",
            subtitle: "Reveal your natural glow",
            image: "/product 3.jpg",
            cta: "Discover Now",
            icon: Star,
            gradient: "from-amber-400 via-orange-500 to-pink-600",
            bgGradient: "from-amber-50 to-orange-50",
            accentColor: "#f59e0b", // amber-500
            category: "Limited Edition",
            description: "Brightening complex with vitamin C and niacinamide",
            ingredients: ["Vitamin C", "Niacinamide", "Alpha Arbutin"],
            price: "$65",
            isSpecial: true,
        },
    ]

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.25,
                delayChildren: 0.1,
            },
        },
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
            },
        },
        initial: {
            scale: 1,
            zIndex: 1,
            boxShadow: "0 4px 24px 0 rgba(244,114,182,0.10)",
        },
        hover: {
            scale: 1.07,
            zIndex: 10,
            boxShadow: "0 8px 40px 0 rgba(244,114,182,0.25)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 18,
            },
        },
    }

    return (
        <div
            className="relative min-h-screen overflow-hidden"
            style={{
                background: `linear-gradient(135deg, 
          hsl(${gradientX.get() * 0.1 + 320}, 70%, 95%) 0%, 
          hsl(${gradientY.get() * 0.1 + 340}, 80%, 93%) 50%, 
          hsl(${(gradientX.get() + gradientY.get()) * 0.05 + 300}, 70%, 90%) 100%)`,
            }}
        >
            {/* Inline styles for animations */}
            <style jsx global>{`
        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .ingredient-tag {
          transition: all 0.3s ease;
        }
        
        .ingredient-tag:hover {
          transform: translateY(-2px);
        }
      `}</style>

            {/* Interactive Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "auto" }} />

            {/* Main Content */}
            <motion.div
                ref={containerRef}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative z-10 px-4 pt-16 pb-24 sm:px-6 lg:px-8"
            >
                {/* Header Section */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-pink-100 rounded-full bg-white/80 backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-medium text-gray-700">Luxury Skincare</span>
                    </motion.div>

                    <h1 className="mb-4 text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 bg-clip-text">
                        Elevate Your Ritual
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl">
                        Discover our scientifically formulated collections designed to transform your skin with the power of nature
                    </p>
                </motion.div>

                {/* Product Grid */}
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
                        variants={containerVariants}
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                variants={cardVariants}
                                className="relative group"
                                initial="initial"
                                animate={activeProduct === product.id ? "hover" : "initial"}
                                whileHover="hover"
                                onHoverStart={() => setActiveProduct(product.id)}
                                onHoverEnd={() => setActiveProduct(null)}
                                style={{ willChange: "transform" }}
                            >
                                <div
                                    className={`relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br ${product.bgGradient} border border-white/50`}
                                    style={{ aspectRatio: "1" }}
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-30`} />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
                                        {/* Title Section */}
                                        <div className="space-y-2">
                                            <h3
                                                className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
                                                style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}
                                            >
                                                {product.title}
                                            </h3>
                                            <p
                                                className="text-sm font-medium text-white/90 sm:text-base"
                                                style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.2)" }}
                                            >
                                                {product.subtitle}
                                            </p>
                                        </div>

                                        {/* Special Edition Marker */}
                                        {product.isSpecial && (
                                            <motion.div
                                                className="absolute transform -translate-y-1/2 top-1/2 right-6"
                                                animate={{
                                                    y: [0, -8, 0],
                                                    rotate: [-2, 2, -2],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                <div className="flex items-center justify-center w-20 h-20 rounded-full shadow-lg bg-gradient-to-br from-amber-400 to-pink-500">
                                                    <div className="text-center">
                                                        <div className="text-xs font-bold text-white">LIMITED</div>
                                                        <div className="text-xs font-bold text-white">EDITION</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Bottom Content */}
                                        <div className="space-y-4">
                                            {/* Description */}
                                            <p
                                                className="text-xs text-white/90 sm:text-sm"
                                                style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.2)" }}
                                            >
                                                {product.description}
                                            </p>

                                            {/* Ingredients */}
                                            <div className="flex flex-wrap gap-2">
                                                {product.ingredients.map((ingredient, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 text-xs font-medium text-white rounded-full bg-white/20 backdrop-blur-sm ingredient-tag"
                                                    >
                                                        {ingredient}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA Button */}
                                            <button
                                                className="self-start flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 font-semibold text-sm transition-all duration-300 shadow-md hover:translate-x-1"
                                                style={{ color: product.accentColor }}
                                            >
                                                <span>{product.cta}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom CTA Section */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <button className="relative px-10 py-4 overflow-hidden font-semibold text-white transition-transform duration-300 rounded-full shadow-xl group bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105">
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-rose-500 to-pink-400 group-hover:opacity-100" />
                        <span className="relative z-10 flex items-center gap-2">
                            View Complete Collection
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    )
}