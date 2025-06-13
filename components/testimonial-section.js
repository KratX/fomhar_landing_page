"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion"

export default function TestimonialSection() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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
        if (typeof window === "undefined") return
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
            ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform before scaling
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
                this.maxRadius = 80 + Math.random() * 80 // Smaller ripples
                this.speed = 4 + Math.random() * 3
                this.life = 0
                this.opacity = 0.7
                this.hue = Math.floor(Math.random() * 60) + 40 // Amber/gold hues
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
                this.size = Math.random() * 3 + 1 // Smaller droplets
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
                ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity})` // Amber color
                ctx.fill()
            }
        }

        // Initialize ripples and droplets
        const ripples = []
        const droplets = []
        const dropletCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 25000)) // Fewer droplets

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
                // Less frequent ripples
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

            // Add random ripples occasionally (less frequently)
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
    }, [windowSize])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Faster stagger
                delayChildren: 0.2,
            },
        },
    }

    const cardVariants = {
        hidden: { y: 60, opacity: 0, scale: 0.9 }, // Less movement
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 20,
                duration: 0.6, // Faster animation
            },
        },
    }

    const headingVariants = {
        hidden: { opacity: 0, y: -20 }, // Less movement
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8, // Faster animation
                ease: "easeOut",
            },
        },
    }

    return (
        <section
            ref={containerRef}
            className="relative flex flex-col items-center px-4 py-12 overflow-hidden sm:px-6 lg:px-8" // Centered content
            style={{
                background: `linear-gradient(135deg, 
          hsl(${gradientX.get() * 0.1 + 30}, 70%, 15%) 0%, 
          hsl(${gradientY.get() * 0.1 + 40}, 80%, 13%) 50%, 
          hsl(${(gradientX.get() + gradientY.get()) * 0.05 + 20}, 70%, 10%) 100%)`,
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

            {/* Decorative elements - smaller and repositioned */}
            <div className="absolute z-0 w-24 h-24 rounded-full top-10 left-5 bg-amber-400/10 blur-2xl" />
            <div className="absolute z-0 w-32 h-32 rounded-full bottom-10 right-5 bg-amber-500/10 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
                {/* Enhanced animated heading - more compact */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={headingVariants}
                    className="flex flex-col items-center w-full mb-10"
                >
                    <h2 className="mb-4 text-3xl font-light tracking-wider text-center text-white sm:text-4xl lg:text-5xl">
                        CUSTOMER{" "}
                        <span className="font-bold text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">
                            TESTIMONIALS
                        </span>
                    </h2>
                    <motion.div
                        className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
                        initial={{ width: 0, opacity: 0 }}
                        animate={isInView ? { width: 96, opacity: 1 } : { width: 0, opacity: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    />
                    <motion.p
                        className="max-w-xl mx-auto mt-4 text-base text-center text-gray-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        Real stories from real customers who transformed their skin with Fomhar
                    </motion.p>
                </motion.div>
                {/* Large landscape testimonial cards - more compact */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="w-full space-y-8"
                >
                    {/* Card 1 */}
                    <TestimonialCard
                        variants={cardVariants}
                        image="/test 1.jpg"
                        alt="Acne testimonial"
                        title="ACNE TRANSFORMATION"
                        description="Acne is a skin condition caused by clogged pores, oil, and bacteria. It's often hormone-related and manageable with proper care and the right products."
                        quote="After years of battling acne, Fomhar was a game-changer. Their targeted skincare kit helped reduce my breakouts and soothe my skin."
                        author="Riya M., 24"
                        imagePosition="left"
                    />

                    {/* Card 2 */}
                    <TestimonialCard
                        variants={cardVariants}
                        image="/test 2.jpeg"
                        alt="Pigmentation testimonial"
                        title="PIGMENTATION SOLUTION"
                        description="Pigmentation is a skin issue where dark spots or patches form due to excess melanin. It's often caused by sun exposure, hormones, or inflammation."
                        quote="Dark spots and uneven pigmentation had been my biggest skin concern. Fomhar's products work on my skin like magic—without harsh chemicals."
                        author="Ananya T., 31"
                        imagePosition="right"
                    />

                    {/* Card 3 */}
                    <TestimonialCard
                        variants={cardVariants}
                        image="/test 3.jpg"
                        alt="Uneven skin testimonial"
                        title="SKIN TONE EVENING"
                        description="Uneven skin tone is caused by sun damage, pigmentation, or acne scars. It leads to patches of different skin colors that can affect confidence."
                        quote="I followed their tips and used their brightening formula — my skin is smoother, brighter, and more even now."
                        author="Priya S., 28"
                        imagePosition="left"
                    />
                </motion.div>
            </div>
        </section>
    )
}

// More compact testimonial card component
function TestimonialCard({ variants, image, alt, title, description, quote, author, imagePosition = "left" }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            variants={variants}
            whileHover={{
                y: -8, // Less movement
                scale: 1.01, // Smaller scale
                transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`flex flex-col lg:flex-row ${imagePosition === "right" ? "lg:flex-row-reverse" : ""
                    } overflow-hidden transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl min-h-[300px] lg:min-h-[350px]`}
            >
                {/* Image section - takes up about 40% of the card */}
                <div className="relative h-48 overflow-hidden lg:w-2/5 lg:h-auto">
                    <motion.div
                        animate={{
                            scale: isHovered ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full h-full"
                    >
                        <Image
                            height={800}
                            width={800}
                            src={image || "/placeholder.svg"}
                            alt={alt}
                            className="object-cover w-full h-full"
                        />
                    </motion.div>
                    {/* Enhanced overlay with gradient */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: isHovered ? 0.7 : 0.3 }}
                        transition={{ duration: 0.4 }}
                    />
                    {/* Decorative corner accent - smaller */}
                    <motion.div
                        className="absolute w-12 h-12 border-t-3 border-l-3 top-4 left-4 border-amber-400 rounded-tl-xl"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    />
                </div>

                {/* Content section - takes up about 60% of the card */}
                <div className="flex flex-col justify-center flex-grow p-6 lg:p-8 lg:w-3/5">
                    {/* Title with enhanced styling */}
                    <div className="relative mb-4">
                        <motion.h3
                            className="text-2xl font-bold leading-tight text-gray-800 lg:text-3xl"
                            animate={{ color: isHovered ? "#f59e0b" : "#1f2937" }}
                            transition={{ duration: 0.3 }}
                        >
                            {title}
                        </motion.h3>
                        <motion.div
                            className="h-1 mt-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                            initial={{ width: "30%" }}
                            animate={{ width: isHovered ? "70%" : "30%" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                    {/* Description with better typography - more concise */}
                    <p className="max-w-2xl mb-4 text-sm font-light leading-relaxed text-gray-700 lg:text-base">
                        {description}
                    </p>
                    {/* Enhanced quote section - more compact */}
                    <div className="relative">
                        <motion.div
                            className="absolute font-serif text-5xl -left-3 -top-2 text-amber-400/30"
                            animate={{
                                scale: isHovered ? 1.1 : 1,
                                opacity: isHovered ? 0.5 : 0.3,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            &quot;
                        </motion.div>
                        <motion.blockquote
                            className="py-1 pl-6 text-base italic leading-relaxed text-gray-700 border-l-3 lg:text-lg border-amber-400"
                            animate={{
                                borderLeftColor: isHovered ? "#f59e0b" : "#fbbf24",
                                paddingLeft: isHovered ? "1.75rem" : "1.5rem",
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {quote}

                            <footer className="mt-3 not-italic">
                                <motion.div
                                    className="flex items-center gap-3"
                                    animate={{ x: isHovered ? 5 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-10 h-0.5 bg-amber-400"></div>
                                    <span className="text-base font-semibold text-gray-800">{author}</span>
                                </motion.div>
                            </footer>
                        </motion.blockquote>
                    </div>
                    {/* Decorative element - smaller */}
                    <motion.div
                        className="absolute w-16 h-16 border-b-3 border-r-3 bottom-6 right-6 border-amber-400/30 rounded-br-xl"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    />
                </div>
            </div>
        </motion.div>
    )
}