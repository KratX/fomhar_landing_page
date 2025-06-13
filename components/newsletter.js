"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion"

export default function Newsletter() {
    // Form state
    const [email, setEmail] = useState("")
    const [isValid, setIsValid] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [activeProduct, setActiveProduct] = useState("serum") // serum, cream, cleanser, mask
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    // Refs
    const formRef = useRef(null)
    const inputRef = useRef(null)
    const containerRef = useRef(null)
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)

    // Animation controls
    const formControls = useAnimation()
    const successControls = useAnimation()
    const dropletControls = useAnimation()
    const bubbleControls = useAnimation()

    // Mouse movement for parallax
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

    // Background gradient position based on mouse
    const gradientX = useTransform(smoothX, [0, windowSize.width || 1], [0, 100])
    const gradientY = useTransform(smoothY, [0, windowSize.height || 1], [0, 100])

    // Transform values for parallax effects
    const bgX = useTransform(mouseX, [-300, 300], [5, -5])
    const bgY = useTransform(mouseY, [-300, 300], [5, -5])
    const productX = useTransform(mouseX, [-300, 300], [15, -15])
    const productY = useTransform(mouseY, [-300, 300], [15, -15])

    // Product configurations
    const productConfig = {
        serum: {
            primary: "#F9D5E5",
            secondary: "#EC6EAD",
            accent: "#C06C84",
            gradient: "from-pink-300 to-purple-400",
            bgGradient: "from-pink-50 via-purple-50 to-white",
            icon: "💧",
            name: "Hydrating Serum",
            elements: Array(8).fill("✨").concat(Array(8).fill("💧")),
            message: "Unlock the secret to radiant, dewy skin!",
            texture: "droplet",
        },
        cream: {
            primary: "#E0F4FF",
            secondary: "#87CEEB",
            accent: "#5DA9E9",
            gradient: "from-blue-300 to-cyan-400",
            bgGradient: "from-blue-50 via-cyan-50 to-white",
            icon: "🧴",
            name: "Moisture Cream",
            elements: Array(8).fill("❄️").concat(Array(8).fill("🧴")),
            message: "Experience 72-hour hydration and plump skin!",
            texture: "cream",
        },
        cleanser: {
            primary: "#D1FAE5",
            secondary: "#34D399",
            accent: "#059669",
            gradient: "from-green-300 to-emerald-400",
            bgGradient: "from-green-50 via-emerald-50 to-white",
            icon: "🫧",
            name: "Gentle Cleanser",
            elements: Array(8).fill("🫧").concat(Array(8).fill("🧼")),
            message: "Cleanse and refresh without stripping your skin!",
            texture: "bubble",
        },
        mask: {
            primary: "#FEF3C7",
            secondary: "#F59E0B",
            accent: "#D97706",
            gradient: "from-yellow-300 to-amber-400",
            bgGradient: "from-yellow-50 via-amber-50 to-white",
            icon: "✨",
            name: "Radiance Mask",
            elements: Array(8).fill("✨").concat(Array(8).fill("🌟")),
            message: "Reveal your natural glow in just 10 minutes!",
            texture: "glow",
        },
    }

    const currentProduct = productConfig[activeProduct]

    // Generate floating elements - reduced count for better performance
    const floatingElements = currentProduct.elements.slice(0, 10).map((element, i) => ({
        id: i,
        element,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 12,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
    }))

    // Generate bubbles for cleanser - reduced count
    const bubbles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 8 + 4,
        delay: Math.random() * 5,
    }))

    // Generate droplets for serum - reduced count
    const droplets = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        size: Math.random() * 15 + 5,
        x: Math.random() * 100,
        startY: Math.random() * 30,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5,
    }))

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

    // Handle mouse movement for parallax effect
    const handleMouseMove = (e) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        mouseX.set(e.clientX - centerX)
        mouseY.set(e.clientY - centerY)

        // For canvas ripple effect
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            mouseX.set(x)
            mouseY.set(y)
        }
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
                // Use the current product color for ripples
                this.color = currentProduct.secondary
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
                // Use the current product color for droplets
                this.color = currentProduct.secondary
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

            // Update droplet colors based on current product
            droplets.forEach((droplet) => {
                droplet.color = currentProduct.secondary
                droplet.update(canvas.width, canvas.height)
                droplet.draw(ctx)
            })

            // Update ripple colors based on current product
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i]
                ripple.color = currentProduct.secondary
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
    }, [windowSize, activeProduct, currentProduct.secondary])

    // Validate email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    // Handle input change
    const handleEmailChange = (e) => {
        const value = e.target.value
        setEmail(value)
        setIsValid(validateEmail(value))

        if (value && !validateEmail(value)) {
            setErrorMessage("Please enter a valid email address")
        } else {
            setErrorMessage("")
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isValid) {
            // Shake animation if invalid
            formControls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.5 },
            })
            return
        }

        setIsLoading(true)

        // Simulate API call
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Animate droplets or bubbles flying
            if (currentProduct.texture === "droplet") {
                await dropletControls.start({
                    y: [0, -100, -200],
                    x: [0, 20, 40],
                    opacity: [1, 0.5, 0],
                    scale: [1, 0.8, 0.6],
                    transition: { duration: 1.5 },
                })
            } else if (currentProduct.texture === "bubble") {
                await bubbleControls.start({
                    y: [0, -100, -200],
                    x: [0, -20, -40],
                    opacity: [1, 0.5, 0],
                    scale: [1, 1.2, 0.8],
                    transition: { duration: 1.5 },
                })
            }

            setIsSubmitted(true)
            setIsLoading(false)

            // Show success message with staggered animation
            successControls.start({
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.8,
                    staggerChildren: 0.1,
                },
            })
        } catch (error) {
            setIsLoading(false)
            setErrorMessage("Something went wrong. Please try again.")

            formControls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.5 },
            })
        }
    }

    // Change product every 10 seconds
    useEffect(() => {
        const products = ["serum", "cream", "cleanser", "mask"]
        let currentIndex = products.indexOf(activeProduct)

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % products.length
            setActiveProduct(products[currentIndex])
        }, 10000)

        return () => clearInterval(interval)
    }, [activeProduct])

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current && !isSubmitted) {
            inputRef.current.focus()
        }
    }, [isSubmitted])

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, 
          hsl(${gradientX.get() * 0.1 + 220}, 70%, 95%) 0%, 
          hsl(${gradientY.get() * 0.1 + 240}, 80%, 93%) 50%, 
          hsl(${(gradientX.get() + gradientY.get()) * 0.05 + 200}, 70%, 90%) 100%)`,
            }}
            onMouseMove={handleMouseMove}
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

            {/* Skincare-inspired background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background texture */}
                <motion.div
                    className="absolute inset-0 z-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23${currentProduct.primary.replace(
                            "#",
                            "",
                        )}' fillOpacity='0.4'/%3E%3C/svg%3E")`,
                        backgroundSize: "60px 60px",
                        x: bgX,
                        y: bgY,
                    }}
                />

                {/* Floating product elements - reduced for better performance */}
                {floatingElements.map((item) => (
                    <motion.div
                        key={item.id}
                        className="absolute z-0 pointer-events-none select-none"
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            fontSize: item.size,
                        }}
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, item.id % 2 === 0 ? 10 : -10, 0],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: item.duration,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: item.delay,
                            ease: "easeInOut",
                        }}
                    >
                        {item.element}
                    </motion.div>
                ))}

                {/* Product-specific background effects */}
                {activeProduct === "serum" && (
                    <>
                        {droplets.map((droplet) => (
                            <motion.div
                                key={droplet.id}
                                className="absolute z-0 rounded-full bg-gradient-to-b from-pink-200 to-pink-300 opacity-70"
                                style={{
                                    width: droplet.size,
                                    height: droplet.size * 1.5,
                                    left: `${droplet.x}%`,
                                    top: `${droplet.startY}%`,
                                }}
                                animate={{
                                    y: [0, 500],
                                    opacity: [0.7, 0],
                                }}
                                transition={{
                                    duration: droplet.duration,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: droplet.delay,
                                    ease: "easeIn",
                                }}
                            />
                        ))}
                    </>
                )}

                {activeProduct === "cleanser" && (
                    <>
                        {bubbles.map((bubble) => (
                            <motion.div
                                key={bubble.id}
                                className="absolute z-0 rounded-full bg-gradient-to-b from-emerald-100 to-emerald-200 opacity-70"
                                style={{
                                    width: bubble.size,
                                    height: bubble.size,
                                    left: `${bubble.x}%`,
                                    top: `${bubble.y}%`,
                                }}
                                animate={{
                                    y: [0, -200],
                                    x: [0, Math.random() * 40 - 20],
                                    opacity: [0.7, 0],
                                }}
                                transition={{
                                    duration: bubble.duration,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: bubble.delay,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                    </>
                )}

                {activeProduct === "cream" && (
                    <motion.div
                        className="absolute bottom-0 left-0 z-0 w-full h-32 bg-gradient-to-t from-blue-100 to-transparent opacity-30"
                        style={{
                            y: productY,
                        }}
                    />
                )}

                {activeProduct === "mask" && (
                    <motion.div
                        className="absolute inset-0 z-0"
                        animate={{
                            background: [
                                "radial-gradient(circle at 30% 40%, rgba(251, 191, 36, 0.1), transparent 70%)",
                                "radial-gradient(circle at 70% 60%, rgba(251, 191, 36, 0.1), transparent 70%)",
                                "radial-gradient(circle at 30% 40%, rgba(251, 191, 36, 0.1), transparent 70%)",
                            ],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-4xl px-4 py-12 mx-auto sm:px-6 sm:py-16">
                <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            {/* Product indicator */}
                            <motion.div
                                className="flex items-center justify-center mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white/70 backdrop-blur-sm">
                                    <span className="text-2xl">{currentProduct.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{currentProduct.name}</span>
                                </div>
                            </motion.div>

                            {/* Heading with product theme */}
                            <motion.div
                                className="mb-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <motion.h2
                                    className={`text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${currentProduct.gradient}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    Glow From Within
                                </motion.h2>

                                <motion.p
                                    className="max-w-2xl mx-auto text-lg text-gray-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    Join our beauty community and receive{" "}
                                    <span className="font-semibold" style={{ color: currentProduct.accent }}>
                                        15% off
                                    </span>{" "}
                                    your first purchase. {currentProduct.message}
                                </motion.p>
                            </motion.div>

                            {/* Interactive form */}
                            <motion.form ref={formRef} onSubmit={handleSubmit} className="max-w-md mx-auto" animate={formControls}>
                                <motion.div
                                    className="relative overflow-hidden rounded-lg shadow-xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                    {/* Glass effect background */}
                                    <motion.div
                                        className="absolute inset-0 backdrop-blur-sm bg-white/80"
                                        style={{
                                            borderWidth: "1px",
                                            borderStyle: "solid",
                                            borderColor: currentProduct.primary,
                                            borderRadius: "0.5rem",
                                        }}
                                    />

                                    {/* Animated glow */}
                                    <motion.div
                                        className="absolute inset-0 opacity-50"
                                        animate={{
                                            background: [
                                                `radial-gradient(circle at 20% 50%, ${currentProduct.primary}40, transparent 70%)`,
                                                `radial-gradient(circle at 80% 50%, ${currentProduct.primary}40, transparent 70%)`,
                                                `radial-gradient(circle at 20% 50%, ${currentProduct.primary}40, transparent 70%)`,
                                            ],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Form inputs with skincare styling */}
                                    <div className="relative flex items-center">
                                        <div className="absolute text-gray-400 left-4" style={{ color: currentProduct.accent }}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {isLoading ? (
                                                    <motion.circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        animate={{ rotate: 360 }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Number.POSITIVE_INFINITY,
                                                            ease: "linear",
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                        <polyline points="22,6 12,13 2,6" />
                                                    </>
                                                )}
                                            </svg>
                                        </div>

                                        <input
                                            ref={inputRef}
                                            type="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            placeholder="Your email address"
                                            disabled={isLoading}
                                            className="relative z-10 w-full py-4 pl-12 pr-32 text-gray-700 bg-transparent focus:outline-none"
                                            style={{ caretColor: currentProduct.accent }}
                                        />

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className="absolute z-10 px-6 py-2 overflow-hidden font-medium text-white rounded-md right-2"
                                            style={{
                                                background: `linear-gradient(90deg, ${currentProduct.secondary}, ${currentProduct.accent})`,
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {/* Animated product icon */}
                                            <motion.span
                                                className="absolute left-2"
                                                animate={currentProduct.texture === "droplet" ? dropletControls : bubbleControls}
                                            >
                                                {isLoading && currentProduct.icon}
                                            </motion.span>

                                            <span className="relative z-10">{isLoading ? "SENDING..." : "SUBSCRIBE"}</span>
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Error message with animation */}
                                <AnimatePresence>
                                    {errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: "auto" }}
                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-2 ml-2 text-sm"
                                            style={{ color: currentProduct.accent }}
                                        >
                                            {errorMessage}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Privacy note */}
                                <motion.p
                                    className="mt-4 text-xs text-center text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    By subscribing, you agree to our{" "}
                                    <span
                                        className="underline transition-colors cursor-pointer hover:text-gray-700"
                                        style={{ color: currentProduct.accent }}
                                    >
                                        Privacy Policy
                                    </span>{" "}
                                    and{" "}
                                    <span
                                        className="underline transition-colors cursor-pointer hover:text-gray-700"
                                        style={{ color: currentProduct.accent }}
                                    >
                                        Terms
                                    </span>
                                    .
                                </motion.p>
                            </motion.form>

                            {/* Benefits with skincare styling */}
                            <motion.div
                                className="grid max-w-3xl grid-cols-1 gap-6 mx-auto mt-12 md:grid-cols-3"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.2,
                                        },
                                    },
                                }}
                            >
                                {[
                                    {
                                        icon: "✨",
                                        title: "Early Access",
                                        description: "Be the first to shop new product launches",
                                    },
                                    {
                                        icon: "🎁",
                                        title: "Exclusive Offers",
                                        description: "Special discounts and gifts for subscribers",
                                    },
                                    {
                                        icon: "📝",
                                        title: "Skincare Tips",
                                        description: "Expert advice for your unique skin concerns",
                                    },
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-col items-center p-6 text-center shadow-lg bg-white/80 backdrop-blur-sm rounded-xl"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                transition: { duration: 0.5 },
                                            },
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <motion.div className="mb-4 text-4xl" whileHover={{ rotate: 10, scale: 1.2 }}>
                                            {benefit.icon}
                                        </motion.div>
                                        <h3 className="mb-2 text-lg font-semibold" style={{ color: currentProduct.accent }}>
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Product selector */}
                            <div className="flex justify-center gap-4 mt-12">
                                {Object.keys(productConfig).map((productKey) => (
                                    <motion.button
                                        key={productKey}
                                        className={`p-3 rounded-full ${activeProduct === productKey ? "ring-2 ring-offset-2" : "opacity-70 hover:opacity-100"
                                            }`}
                                        style={{
                                            backgroundColor: productConfig[productKey].secondary,
                                            ringColor: productConfig[productKey].accent,
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveProduct(productKey)}
                                    >
                                        <span className="text-xl">{productConfig[productKey].icon}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        // Success state
                        <motion.div key="success" initial={{ opacity: 0 }} animate={successControls} className="py-10 text-center">
                            {/* Success animation */}
                            <motion.div
                                className="relative w-24 h-24 mx-auto mb-8"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.2,
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full opacity-50 blur-md"
                                    style={{ backgroundColor: currentProduct.secondary }}
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatType: "reverse",
                                    }}
                                />
                                <div
                                    className="absolute inset-0 flex items-center justify-center text-white rounded-full"
                                    style={{
                                        background: `linear-gradient(135deg, ${currentProduct.secondary}, ${currentProduct.accent})`,
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                            </motion.div>

                            <motion.h2
                                className={`text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${currentProduct.gradient}`}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                Welcome to Your Skincare Journey!
                            </motion.h2>

                            <motion.p
                                className="max-w-md mx-auto mb-8 text-xl text-gray-700"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                            >
                                Your 15% discount code has been sent to your email. Get ready to transform your skincare routine!
                            </motion.p>

                            <motion.button
                                className="px-8 py-3 font-medium text-white rounded-lg shadow-lg"
                                style={{
                                    background: `linear-gradient(90deg, ${currentProduct.secondary}, ${currentProduct.accent})`,
                                }}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsSubmitted(false)}
                            >
                                Explore Products
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
