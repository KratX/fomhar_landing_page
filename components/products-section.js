"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import {
    motion,
    AnimatePresence,
    useInView,
    useAnimation,
    useMotionValue,
    useTransform,
    useSpring,
} from "framer-motion"
import {
    Star,
    ArrowRight,
    Sparkles,
    Award,
    Zap,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Droplet,
    Leaf,
    Search,
} from "lucide-react"

export default function ProductsSection() {
    // State management
    const [activeTab, setActiveTab] = useState("featured")
    const [hoveredProduct, setHoveredProduct] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(6)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedBenefits, setSelectedBenefits] = useState([])
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [scrollDirection, setScrollDirection] = useState("up")
    const [isScrolled, setIsScrolled] = useState(false)

    // Refs
    const containerRef = useRef(null)
    const searchInputRef = useRef(null)
    const headerRef = useRef(null)
    const canvasRef = useRef(null)
    const previousTimeRef = useRef(null)
    const requestRef = useRef(null)

    // Animation hooks
    const isInView = useInView(containerRef, { once: false, margin: "-100px" })
    const controls = useAnimation()
    const productControls = useAnimation()

    // Mouse tracking for interactive effects
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

    // Background gradient position based on mouse
    const gradientX = useTransform(smoothX, [0, windowSize.width || 1], [0, 100])
    const gradientY = useTransform(smoothY, [0, windowSize.height || 1], [0, 100])

    // Parallax values for product images
    const parallaxX = useTransform(smoothX, [0, windowSize.width || 1], [-15, 15])
    const parallaxY = useTransform(smoothY, [0, windowSize.height || 1], [-15, 15])

    // Scroll progress for animations
    const scrollY = useMotionValue(0)
    const scrollYProgress = useMotionValue(0)

    // Product data with skincare theme
    const products = [
        {
            id: 1,
            name: "Hydra Essence",
            type: "Serum",
            price: 699,
            originalPrice: 899,
            images: ["/aura.png"],
            rating: 4.9,
            reviews: 234,
            isNew: true,
            isBestseller: false,
            isFeatured: true,
            discount: 22,
            benefits: ["Anti-Aging", "Vitamin C", "Hydrating", "Plumping"],
            howToUse:
                "Apply 2-3 drops to cleansed face and neck morning and evening. Gently pat into skin until fully absorbed. Follow with moisturizer.",
            category: "Serums",
            color: "#e5e5e5", // sky-500
            icon: Droplet,
            bgGradient: "from-sky-50 to-blue-50",
            variants: [
                { size: "30ml", price: 699, originalPrice: 899 },
                { size: "50ml", price: 999, originalPrice: 1299 },
            ],
        },
        {
            id: 2,
            name: "Radiant Glow",
            type: "Day Cream",
            price: 599,
            originalPrice: 799,
            images: ["/glow.png"],
            rating: 4.7,
            reviews: 189,
            isNew: false,
            isBestseller: true,
            isFeatured: true,
            discount: 25,
            benefits: ["SPF 30", "Brightening", "Moisturizing", "Illuminating"],
            ingredients: ["Niacinamide", "Vitamin E", "Licorice Root Extract", "Zinc Oxide", "Squalane"],
            howToUse:
                "Apply generously to face and neck as the final step in your morning skincare routine. Reapply throughout the day as needed for continued sun protection.",
            category: "Moisturizers",
            color: "#edad56", // emerald-500
            icon: Leaf,
            bgGradient: "from-emerald-50 to-yellow-50",
            variants: [
                { size: "50ml", price: 599, originalPrice: 799 },
                { size: "100ml", price: 899, originalPrice: 1199 },
            ],
        },
        {
            id: 3,
            name: "Solar Shield",
            type: "Sunscreen",
            price: 799,
            originalPrice: 999,
            images: ["/sun.png"],
            rating: 4.8,
            reviews: 156,
            isNew: false,
            isBestseller: true,
            isFeatured: false,
            discount: 20,
            benefits: ["SPF 50+", "Water Resistant", "Zinc Oxide", "Non-greasy"],
            ingredients: ["Zinc Oxide", "Titanium Dioxide", "Green Tea Extract", "Vitamin E", "Aloe Vera"],
            howToUse:
                "Apply liberally 15 minutes before sun exposure. Reapply after 80 minutes of swimming or sweating, immediately after towel drying, and at least every 2 hours.",
            category: "Sun Protection",
            color: "#f59e0b", // amber-500
            icon: Star,
            bgGradient: "from-amber-50 to-orange-50",
            variants: [
                { size: "50ml", price: 799, originalPrice: 999 },
                { size: "100ml", price: 1299, originalPrice: 1599 },
            ],
        },
        {
            id: 4,
            name: "Eye Revival",
            type: "Eye Cream",
            price: 439,
            originalPrice: 599,
            images: ["/rise.png"],
            rating: 4.6,
            reviews: 98,
            isNew: true,
            isBestseller: false,
            isFeatured: false,
            discount: 27,
            benefits: ["Dark Circles", "Puffiness", "Firming", "Anti-wrinkle"],
            ingredients: ["Peptide Complex", "Caffeine", "Hyaluronic Acid", "Vitamin K", "Cucumber Extract"],
            howToUse:
                "Using the ceramic applicator, gently apply a small amount around the eye area morning and evening. Pat gently with ring finger until absorbed.",
            category: "Eye Care",
            color: "#9191b0", // pink-500
            icon: Sparkles,
            bgGradient: "from-pink-50 to-rose-50",
            variants: [{ size: "15ml", price: 439, originalPrice: 599 }],
        },
        {
            id: 5,
            name: "Night Repair",
            type: "Night Cream",
            price: 599,
            originalPrice: 749,
            images: ["/dream.png"],
            rating: 4.8,
            reviews: 167,
            isNew: false,
            isBestseller: false,
            isFeatured: true,
            discount: 20,
            benefits: ["Retinol", "Repair", "Anti-Aging", "Regenerating"],
            ingredients: ["Encapsulated Retinol", "Peptide Complex", "Ceramides", "Shea Butter", "Squalane"],
            howToUse:
                "Apply a pea-sized amount to cleansed face and neck in the evening. Avoid the eye area. For first-time retinol users, start with application 2-3 times per week and gradually increase frequency.",
            category: "Moisturizers",
            color: "#321d63", // violet-500
            icon: Sparkles,
            bgGradient: "from-violet-50 to-purple-50",
            variants: [{ size: "50ml", price: 599, originalPrice: 749 }],
        },
        {
            id: 6,
            name: "Pure Cleanse",
            type: "Facewash",
            price: 449,
            originalPrice: 549,
            images: ["/fresh.png"],
            rating: 4.7,
            reviews: 203,
            isNew: false,
            isBestseller: true,
            isFeatured: true,
            discount: 18,
            benefits: ["Deep Cleansing", "Natural", "Gentle", "pH-balanced"],
            ingredients: ["Amino Acid Cleansing Agents", "Chamomile Extract", "Prebiotics", "Aloe Vera", "Glycerin"],
            howToUse:
                "Massage a small amount onto damp skin morning and evening. Rinse thoroughly with lukewarm water. Suitable for daily use.",
            category: "Cleansers",
            color: "#9598c8", // cyan-500
            icon: Droplet,
            bgGradient: "from-cyan-50 to-sky-50",
            variants: [
                { size: "150ml", price: 449, originalPrice: 549 },
                { size: "250ml", price: 699, originalPrice: 849 },
            ],
        },
        {
            id: 7,
            name: "UV Defense",
            type: "Sunscreen Spray",
            price: 479,
            originalPrice: 599,
            images: ["/shield.png"],
            rating: 4.5,
            reviews: 134,
            isNew: true,
            isBestseller: false,
            isFeatured: false,
            discount: 20,
            benefits: ["Spray Formula", "Quick Application", "Travel Size", "Non-greasy"],
            ingredients: ["Avobenzone", "Homosalate", "Octisalate", "Vitamin E", "Aloe Vera"],
            howToUse:
                "Shake well before use. Spray liberally onto skin 15 minutes before sun exposure, ensuring even coverage. Reapply after 80 minutes of swimming or sweating, immediately after towel drying, and at least every 2 hours.",
            category: "Sun Protection",
            color: "#d27f2e", // rose-500
            icon: Zap,
            bgGradient: "from-rose-50 to-red-50",
            variants: [
                { size: "100ml", price: 479, originalPrice: 599 },
                { size: "200ml", price: 799, originalPrice: 999 },
            ],
        },
        {
            id: 8,
            name: "Luminous Hydration",
            type: "Moisturizer",
            price: 549,
            originalPrice: 699,
            images: ["/radient.png"],
            rating: 4.9,
            reviews: 278,
            isNew: false,
            isBestseller: true,
            isFeatured: true,
            discount: 21,
            benefits: ["Illuminating", "24H Hydration", "Glow Effect", "Oil-free"],
            ingredients: ["Hyaluronic Acid", "Light-Reflecting Minerals", "Niacinamide", "Vitamin B5", "Glycerin"],
            howToUse:
                "Apply to cleansed face and neck morning and evening. Can be used alone or under makeup. For an extra glow, apply a second layer to the high points of the face.",
            category: "Moisturizers",
            color: "#a78394", // teal-500
            icon: Sparkles,
            bgGradient: "from-teal-50 to-emerald-50",
            variants: [{ size: "50ml", price: 549, originalPrice: 699 }],
        },
        {
            id: 9,
            name: "Lip Nourish",
            type: "Lip Balm",
            price: 299,
            originalPrice: 399,
            images: ["/kiss.png"],
            rating: 4.6,
            reviews: 89,
            isNew: true,
            isBestseller: false,
            isFeatured: false,
            discount: 25,
            benefits: ["Natural Oils", "Long Lasting", "Moisturizing", "Repairing"],
            ingredients: ["Shea Butter", "Jojoba Oil", "Vitamin E", "Beeswax", "Rosehip Oil"],
            howToUse:
                "Apply to lips as needed throughout the day. For intensive treatment, apply a generous layer before bedtime.",
            category: "Lip Care",
            color: "#c2c2c2", // pink-400
            icon: Sparkles,
            bgGradient: "from-pink-50 to-fuchsia-50",
            variants: [
                { size: "15ml", price: 299, originalPrice: 399 },
                { size: "30ml", price: 499, originalPrice: 649 },
            ],
        },
    ]

    // Categories for filtering
    const categories = [
        { id: "serums", name: "Serums" },
        { id: "moisturizers", name: "Moisturizers" },
        { id: "sun-protection", name: "Sun Protection" },
        { id: "eye-care", name: "Eye Care" },
        { id: "cleansers", name: "Cleansers" },
        { id: "lip-care", name: "Lip Care" },
    ]

    // Benefits for filtering
    const benefits = [
        { id: "hydrating", name: "Hydrating" },
        { id: "anti-aging", name: "Anti-Aging" },
        { id: "brightening", name: "Brightening" },
        { id: "spf", name: "SPF Protection" },
        { id: "natural", name: "Natural" },
    ]

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })

            // Adjust items per page based on screen size
            if (window.innerWidth < 640) {
                setItemsPerPage(4)
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(6)
            } else {
                setItemsPerPage(9)
            }
        }

        // Set initial size
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Handle scroll for header visibility
    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY

                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        setScrollDirection("down")
                    } else {
                        setScrollDirection("up")
                    }

                    setIsScrolled(currentScrollY > 50)
                    setLastScrollY(currentScrollY)

                    ticking = false
                })

                ticking = true
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY])

    // Handle mouse movement with throttling - optimized
    useEffect(() => {
        let throttleTimeout = null
        let lastUpdateTime = 0
        const THROTTLE_DELAY = 50 // Increase throttle delay to reduce updates

        const handleMouseMove = (e) => {
            const currentTime = Date.now()
            if (currentTime - lastUpdateTime < THROTTLE_DELAY) return

            if (throttleTimeout !== null) return

            throttleTimeout = setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    setMousePosition({ x, y })
                    mouseX.set(x)
                    mouseY.set(y)
                }
                throttleTimeout = null
                lastUpdateTime = Date.now()
            }, 16)
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("mousemove", handleMouseMove, { passive: true })
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

    // Animation control
    useEffect(() => {
        if (isInView) {
            controls.start("visible")
            productControls.start("visible")
        }
    }, [isInView, controls, productControls])

    // Focus search input when search is opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus()
            }, 100)
        }
    }, [isSearchOpen])

    // Filter products based on active tab and search
    const getFilteredProducts = () => {
        let filtered = products

        // Filter by tab
        if (activeTab !== "all") {
            filtered = filtered.filter((product) => {
                if (activeTab === "new") return product.isNew
                if (activeTab === "bestseller") return product.isBestseller
                if (activeTab === "featured") return product.isFeatured
                return true
            })
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.type.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query) ||
                    product.benefits.some((benefit) => benefit.toLowerCase().includes(query)),
            )
        }

        // Filter by price range
        filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

        // Filter by selected categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter((product) => selectedCategories.includes(product.category.toLowerCase()))
        }

        // Filter by selected benefits
        if (selectedBenefits.length > 0) {
            filtered = filtered.filter((product) =>
                product.benefits.some((benefit) => selectedBenefits.includes(benefit.toLowerCase())),
            )
        }

        return filtered
    }

    const filteredProducts = getFilteredProducts()

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = currentPage * itemsPerPage
    const visibleProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

    // Pagination handlers
    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    // Animation variants
    const cardVariants = {
        hover: {
            y: -5,
            scale: 1.03,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
    }

    const imageVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeIn",
            },
        },
    }

    const searchVariants = {
        hidden: {
            opacity: 0,
            y: -20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2,
                ease: "easeIn",
            },
        },
    }

    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1],
            },
        }),
    }

    const staggerItemsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    }

    // Star rating renderer
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                ))}
                <span className="ml-1 text-xs font-medium text-gray-600">{rating}</span>
            </div>
        )
    }

    // Function to calculate rotation based on mouse position
    const rotateX = mouseX.get() > windowSize.width / 2 ? -5 : 5
    const rotateY = mouseY.get() > windowSize.height / 2 ? 5 : -5

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                delayChildren: 0.3,
                staggerChildren: 0.2,
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
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .product-card {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .product-image-container {
          overflow: hidden;
          position: relative;
        }
        
        .glass-effect {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
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
                className="container relative z-10 px-4 pt-24 pb-16 mx-auto sm:px-6 lg:px-8"
            >
                {/* Hero Section - Simplified without animations */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-pink-100 rounded-full bg-white/80 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-medium text-gray-700">Luxury Skincare Collection</span>
                    </div>

                    <h1 className="mb-4 text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-400 bg-clip-text">
                        Elevate Your Skincare Ritual
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl">
                        Discover our scientifically formulated collections designed to transform your skin with the power of nature
                    </p>

                    {/* Filter Tabs - Simplified */}
                    <div className="flex flex-wrap justify-center gap-4 mt-12">
                        {[
                            { key: "featured", label: "Featured", icon: Sparkles },
                            { key: "bestseller", label: "Bestsellers", icon: Award },
                            { key: "new", label: "New Arrivals", icon: Zap },
                            { key: "all", label: "All Products", icon: ShoppingBag },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key)
                                    setCurrentPage(0)
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === tab.key
                                    ? "bg-pink-600 text-white shadow-lg"
                                    : "bg-white/60 text-gray-700 hover:bg-white/80"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pagination Navigation - Simplified */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex gap-3">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentPage === index ? "w-12 bg-pink-500" : "w-2 bg-pink-200"
                                        }`}
                                />
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={prevPage}
                                className="flex items-center justify-center w-10 h-10 bg-white border border-pink-100 rounded-full shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5 text-pink-500" />
                            </button>

                            <button
                                onClick={nextPage}
                                className="flex items-center justify-center w-10 h-10 bg-white border border-pink-100 rounded-full shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5 text-pink-500" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid - Optimized */}
                <div
                    key={`${activeTab}-${currentPage}-${searchQuery}`}
                    className="grid grid-cols-2 gap-6 mx-auto sm:grid-cols-3 lg:grid-cols-3 max-w-7xl"
                >
                    {visibleProducts.length > 0 ? (
                        visibleProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                className="relative product-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.05,
                                    ease: "easeOut",
                                }}
                                onHoverStart={() => setHoveredProduct(product.id)}
                                onHoverEnd={() => setHoveredProduct(null)}
                                style={{ perspective: 1200 }}
                            >
                                <motion.div
                                    className={`relative overflow-hidden rounded-3xl shadow-lg bg-gradient-to-br ${product.bgGradient} border border-white/50`}
                                    style={{
                                        transformStyle: "preserve-3d",
                                        aspectRatio: "1",
                                    }}
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                    }}
                                >
                                    {/* Badges */}
                                    <div className="absolute flex flex-col gap-1 top-4 right-4">
                                        {product.isNew && (
                                            <motion.div
                                                className="px-2 py-0.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + index * 0.1 }}
                                            >
                                                NEW
                                            </motion.div>
                                        )}
                                        {product.isBestseller && (
                                            <motion.div
                                                className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-white rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                            >
                                                <Award className="w-2 h-2" />
                                                BEST
                                            </motion.div>
                                        )}
                                        {product.discount > 0 && (
                                            <motion.div
                                                className="flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 + index * 0.1 }}
                                            >
                                                -{product.discount}%
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Background Image */}
                                    <motion.div
                                        className="absolute inset-0 z-0"
                                        variants={imageVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        style={{
                                            x: hoveredProduct === product.id ? parallaxX : 0,
                                            y: hoveredProduct === product.id ? parallaxY : 0,
                                        }}
                                    >
                                        <Image
                                            src={product.images[0] || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-30`}
                                            initial={{ opacity: 0.3 }}
                                            whileHover={{ opacity: 0.5 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
                                        {/* Title Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                                            className="space-y-2"
                                        >
                                            <motion.h3
                                                className="text-2xl text-black font-achemost sm:text-3xl"
                                                style={{
                                                    textShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                                                }}
                                            >
                                                {product.name}
                                            </motion.h3>
                                            <motion.p
                                                className="text-sm font-medium text-white/90"
                                                style={{
                                                    textShadow: "0px 1px 2px rgba(0,0,0,0.2)",
                                                }}
                                            >
                                                {product.type}
                                            </motion.p>
                                        </motion.div>

                                        {/* Bottom Content */}
                                        <div className="space-y-4">
                                            {/* Description */}
                                            <motion.p
                                                className="text-xs text-black sm:text-sm"
                                                style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.2)" }}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                                            >
                                                {product.description}
                                            </motion.p>

                                            {/* Benefits */}
                                            <motion.div
                                                className="flex flex-wrap gap-2"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                                            >
                                                {product.benefits.slice(0, 3).map((benefit, i) => (
                                                    <motion.span
                                                        key={i}
                                                        className="px-2 py-1 text-xs font-medium text-black rounded-full font-helma bg-white/20 backdrop-blur-sm ingredient-tag"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.6 + index * 0.1 + i * 0.1, duration: 0.4 }}
                                                    >
                                                        {benefit}
                                                    </motion.span>
                                                ))}
                                            </motion.div>

                                            {/* Price and Rating */}
                                            <motion.div
                                                className="flex items-center justify-between"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                                            >
                                                <div>
                                                    <span className="text-lg font-bold text-black">₹{product.price}</span>
                                                    <span className="ml-2 text-sm text-black line-through">₹{product.originalPrice}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                    <span className="ml-1 text-xs font-medium text-black">{product.rating}</span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <motion.div
                                        className="absolute inset-0 opacity-0 pointer-events-none rounded-3xl"
                                        style={{
                                            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${product.color}30 0%, transparent 60%)`,
                                        }}
                                        animate={{
                                            opacity: hoveredProduct === product.id ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    {/* Animated Border */}
                                    <AnimatePresence>
                                        {hoveredProduct === product.id && (
                                            <motion.div
                                                className="absolute inset-0 pointer-events-none rounded-3xl"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div
                                                    className="absolute inset-0 rounded-3xl shimmer-effect"
                                                    style={{
                                                        background: `linear-gradient(90deg, transparent, ${product.color}40, transparent)`,
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 col-span-full">
                            <div className="w-24 h-24 mb-6 text-pink-200">
                                <Search className="w-full h-full" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-700">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* Bottom CTA Section - Simplified */}
                <div className="mt-20 text-center">
                    <button
                        className="relative px-8 py-4 overflow-hidden text-base font-semibold text-white transition-transform duration-300 rounded-full shadow-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105"
                        onClick={() => { }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            View Complete Collection
                            <ArrowRight className="w-5 h-5" />
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
