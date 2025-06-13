"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, useAnimation, useScroll, useTransform } from "framer-motion"
import {
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Heart,
    Eye,
    ArrowRight,
    Sparkles,
    Star,
    Award,
    TrendingUp,
} from "lucide-react"

const products = [
    {
        id: 1,
        name: "Fomhar Fresh",
        type: "Facewash",
        price: "₹ 499.00",
        originalPrice: "₹ 699.00",
        img: "/best-fresh.jpg",
        rating: 4.8,
        reviews: 124,
        isNew: true,
        isTrending: false,
        discount: 29,
        description: "Revolutionary cleansing formula with natural extracts and vitamin E",
        benefits: ["Deep Cleansing", "Vitamin E", "Natural Extracts"],
        color: "#FF6B6B",
    },
    {
        id: 2,
        name: "Fomhar Shield",
        type: "Sunscreen Spray",
        price: "₹ 479.00",
        originalPrice: "₹ 599.00",
        img: "/best-shield.jpg",
        rating: 4.7,
        reviews: 98,
        isNew: false,
        isTrending: true,
        discount: 20,
        description: "Advanced UV protection with lightweight, non-greasy formula",
        benefits: ["SPF 50+", "Water Resistant", "Quick Absorption"],
        color: "#4ECDC4",
    },
    {
        id: 3,
        name: "Fomhar Glow",
        type: "Moisturizer",
        price: "₹ 549.00",
        originalPrice: "₹ 749.00",
        img: "/best-glow.jpg",
        rating: 4.9,
        reviews: 156,
        isNew: true,
        isTrending: true,
        discount: 27,
        description: "Illuminating moisturizer with vitamin C and hyaluronic acid",
        benefits: ["Vitamin C", "Hyaluronic Acid", "24H Hydration"],
        color: "#FFE66D",
    },
    {
        id: 4,
        name: "Fomhar Radiant",
        type: "Day cream",
        price: "₹ 599.00",
        originalPrice: "₹ 799.00",
        img: "/best-radiant.jpg",
        rating: 4.6,
        reviews: 87,
        isNew: false,
        isTrending: false,
        discount: 25,
        description: "Brightening day cream with peptides and antioxidants",
        benefits: ["Anti-Aging", "Brightening", "Antioxidants"],
        color: "#A8E6CF",
    },
    {
        id: 5,
        name: "Fomhar Sun",
        type: "Sunscreen",
        price: "₹ 799.00",
        originalPrice: "₹ 999.00",
        img: "/best-sun.jpg",
        rating: 4.8,
        reviews: 112,
        isNew: false,
        isTrending: true,
        discount: 20,
        description: "Premium broad-spectrum protection with zinc oxide",
        benefits: ["Zinc Oxide", "Broad Spectrum", "Reef Safe"],
        color: "#FF8B94",
    },
    {
        id: 6,
        name: "Fomhar Rise",
        type: "Under eye cream",
        price: "₹ 449.00",
        originalPrice: "₹ 649.00",
        img: "/best-rise.jpg",
        rating: 4.5,
        reviews: 76,
        isNew: true,
        isTrending: false,
        discount: 31,
        description: "Intensive under-eye treatment with caffeine and peptides",
        benefits: ["Caffeine", "Peptides", "Dark Circle Reduction"],
        color: "#B4A7D6",
    },
    {
        id: 7,
        name: "Fomhar Dream",
        type: "Night cream",
        price: "₹ 599.00",
        originalPrice: "₹ 849.00",
        img: "/best dream.jpg",
        rating: 4.7,
        reviews: 93,
        isNew: false,
        isTrending: false,
        discount: 29,
        description: "Overnight repair cream with retinol and ceramides",
        benefits: ["Retinol", "Ceramides", "Overnight Repair"],
        color: "#D4A5A5",
    },
    {
        id: 8,
        name: "Fomhar Buff",
        type: "Face scrub",
        price: "₹ 249.00",
        originalPrice: "₹ 349.00",
        img: "/best-buff.jpg",
        rating: 4.6,
        reviews: 68,
        isNew: false,
        isTrending: false,
        discount: 29,
        description: "Gentle exfoliating scrub with natural bamboo particles",
        benefits: ["Natural Exfoliation", "Bamboo Particles", "Gentle Formula"],
        color: "#95E1D3",
    },
]

export default function OptimizedProductCarousel() {
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(4)
    const [hoveredProduct, setHoveredProduct] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
    const [wishlist, setWishlist] = useState([])
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const containerRef = useRef(null)
    const carouselRef = useRef(null)
    const isInView = useInView(containerRef, { once: false, margin: "-50px", amount: 0.1 })
    const controls = useAnimation()

    // Scroll animations - reduced complexity
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

    // Auto-play functionality with increased interval
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentPage((prev) => {
                const totalPages = Math.ceil(products.length / itemsPerPage)
                return (prev + 1) % totalPages
            })
        }, 6000) // Increased from 4000 to 6000ms

        return () => clearInterval(interval)
    }, [isAutoPlaying, itemsPerPage])

    // Responsive items per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(1)
            } else if (window.innerWidth < 768) {
                setItemsPerPage(2)
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(3)
            } else {
                setItemsPerPage(4)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Animation controls - simplified
    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [isInView, controls])

    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIndex = currentPage * itemsPerPage
    const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage)

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    const toggleWishlist = (productId) => {
        setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
    }

    const addToCart = (product) => {
        // Simple cart functionality
    }

    const handleQuickView = (product) => {
        setSelectedProduct(product)
        setIsQuickViewOpen(true)
    }

    // Simplified animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Reduced from 0.1
                delayChildren: 0.1, // Reduced from 0.2
                duration: 0.4, // Reduced from 0.6
            },
        },
    }

    const titleVariants = {
        hidden: {
            y: -30, // Reduced from -100
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 70, // Reduced from 100
                damping: 20, // Increased from 15
                duration: 0.7, // Reduced from 1.2
            },
        },
    }

    const cardVariants = {
        hidden: {
            y: 30, // Reduced from 100
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 70, // Reduced from 100
                damping: 20, // Increased from 15
                duration: 0.6, // Reduced from 0.8
            },
        },
    }

    const imageVariants = {
        rest: { scale: 1 },
        hover: {
            scale: 1.05, // Reduced from 1.2
            transition: {
                duration: 0.4, // Reduced from 0.6
                ease: "easeOut",
            },
        },
    }

    const overlayVariants = {
        rest: { opacity: 0 },
        hover: {
            opacity: 1,
            transition: {
                duration: 0.3, // Reduced from 0.4
                ease: "easeOut",
            },
        },
    }

    // Simplified stats section
    const stats = [
        { icon: TrendingUp, value: "50K+", label: "Happy Customers" },
        { icon: Star, value: "4.8", label: "Average Rating" },
        { icon: Award, value: "100%", label: "Natural" },
    ]

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
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

    return (
        <motion.div
            ref={containerRef}
            className="relative min-h-screen overflow-hidden"
            style={{
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                opacity,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Simplified Background Elements */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: backgroundY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 40%)
            `,
                    }}
                />
            </motion.div>

            {/* Reduced floating particles - only 4 instead of 12 */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/20"
                    style={{
                        left: `${20 + i * 20}%`,
                        top: `${10 + i * 20}%`,
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 5 + i,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        repeatType: "reverse",
                    }}
                />
            ))}

            {/* Header Section - Simplified */}
            <motion.div
                className="relative z-10 pt-16 pb-12 text-center"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="inline-flex items-center gap-3 px-6 py-3 mb-8 border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
                    variants={titleVariants}
                >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="font-medium text-white">Premium Collection</span>
                </motion.div>

                <motion.h1 className="mb-6 text-6xl font-black text-white md:text-7xl" variants={titleVariants}>
                    BEST PRODUCTS
                </motion.h1>

                <motion.p
                    className="max-w-3xl mx-auto text-xl leading-relaxed md:text-2xl text-white/80"
                    variants={titleVariants}
                >
                    Experience the future of skincare with our revolutionary collection
                </motion.p>

                {/* Stats Section - Simplified */}
                <div className="flex justify-center gap-8 mt-12">
                    {stats.map((stat, i) => (
                        <motion.div key={i} className="text-center" variants={cardVariants}>
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 border rounded-full bg-white/10 backdrop-blur-sm border-white/20">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-white/70">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Product Carousel - Simplified */}
            <motion.div
                ref={carouselRef}
                className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div className="mx-auto max-w-7xl">
                    {/* Navigation - Simplified */}
                    <motion.div className="flex items-center justify-between mb-12" variants={containerVariants}>
                        <div className="flex gap-3">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentPage === index ? "w-12 bg-white" : "w-2 bg-white/40"
                                        }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                />
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <motion.button
                                onClick={prevPage}
                                className="flex items-center justify-center w-12 h-12 text-white border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                onClick={nextPage}
                                className="flex items-center justify-center w-12 h-12 text-white border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Products Grid - Simplified */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                            {visibleProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    className="relative group"
                                    variants={cardVariants}
                                    onHoverStart={() => setHoveredProduct(product.id)}
                                    onHoverEnd={() => setHoveredProduct(null)}
                                >
                                    <motion.div
                                        className="relative overflow-hidden border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20"
                                        whileHover={{
                                            y: -5,
                                            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 25,
                                        }}
                                    >
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden aspect-square">
                                            <motion.div className="w-full h-full" variants={imageVariants} initial="rest" whileHover="hover">
                                                <Image
                                                    src={product.img || "/placeholder.svg"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    priority={index < 2} // Only prioritize first two images
                                                />
                                            </motion.div>

                                            {/* Badges - Simplified */}
                                            <div className="absolute flex flex-col gap-2 top-4 left-4">
                                                {product.isNew && (
                                                    <div className="px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-green-400 to-blue-500">
                                                        NEW
                                                    </div>
                                                )}
                                                {product.isTrending && (
                                                    <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-pink-500 to-orange-500">
                                                        <TrendingUp className="w-3 h-3" />
                                                        TRENDING
                                                    </div>
                                                )}
                                            </div>

                                            {/* Discount Badge - Simplified */}
                                            {product.discount > 0 && (
                                                <div className="absolute flex items-center justify-center w-12 h-12 text-xs font-bold text-white bg-red-500 rounded-full top-4 right-4">
                                                    -{product.discount}%
                                                </div>
                                            )}

                                            {/* Quick Actions Overlay - Simplified */}
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center gap-4 bg-black/30 backdrop-blur-sm"
                                                variants={overlayVariants}
                                                initial="rest"
                                                whileHover="hover"
                                            >
                                                <motion.button
                                                    onClick={() => handleQuickView(product)}
                                                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Eye className="w-5 h-5 text-gray-800" />
                                                </motion.button>

                                                <motion.button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    animate={{
                                                        backgroundColor: wishlist.includes(product.id) ? "#ef4444" : "#ffffff",
                                                    }}
                                                >
                                                    <Heart
                                                        className={`w-5 h-5 ${wishlist.includes(product.id) ? "text-white fill-white" : "text-gray-800"
                                                            }`}
                                                    />
                                                </motion.button>

                                                <motion.button
                                                    onClick={() => addToCart(product)}
                                                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <ShoppingBag className="w-5 h-5 text-gray-800" />
                                                </motion.button>
                                            </motion.div>
                                        </div>

                                        {/* Product Info - Simplified */}
                                        <div className="p-6">
                                            <div className="mb-3">{renderStars(product.rating)}</div>

                                            <h3 className="mb-2 text-xl font-bold text-white">{product.name}</h3>
                                            <p className="mb-3 text-sm text-white/70">{product.type}</p>
                                            <p className="mb-4 text-xs text-white/60 line-clamp-2">{product.description}</p>

                                            {/* Benefits - Simplified */}
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {product.benefits.slice(0, 2).map((benefit, i) => (
                                                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80">
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-2xl font-bold text-white">{product.price}</span>
                                                    <span className="ml-2 text-sm line-through text-white/50">{product.originalPrice}</span>
                                                </div>

                                                <button className="flex items-center gap-2 transition-colors text-white/80 hover:text-white">
                                                    <span className="text-sm font-medium">Details</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom CTA - Simplified */}
                    <motion.div
                        className="mt-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            className="relative px-8 py-4 overflow-hidden font-bold text-white rounded-full shadow-xl group bg-gradient-to-r from-indigo-600 to-purple-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore All Products
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Quick View Modal - Simplified */}
            <AnimatePresence>
                {isQuickViewOpen && selectedProduct && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsQuickViewOpen(false)}
                        />

                        <motion.div
                            className="fixed z-50 w-full max-w-4xl overflow-hidden transform -translate-x-1/2 -translate-y-1/2 border top-1/2 left-1/2 bg-white/10 backdrop-blur-md rounded-2xl border-white/20"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                            }}
                        >
                            <div className="grid h-full grid-cols-1 md:grid-cols-2">
                                <div className="relative p-8 aspect-square md:aspect-auto">
                                    <Image
                                        src={selectedProduct.img || "/placeholder.svg"}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-8 text-white">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="mb-2 text-3xl font-bold">{selectedProduct.name}</h2>
                                            <p className="text-white/70">{selectedProduct.type}</p>
                                        </div>

                                        <button
                                            onClick={() => setIsQuickViewOpen(false)}
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10"
                                        >
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
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        {renderStars(selectedProduct.rating)}
                                        <p className="mt-1 text-sm text-white/60">{selectedProduct.reviews} reviews</p>
                                    </div>

                                    <p className="mb-6 text-white/80">{selectedProduct.description}</p>

                                    <div className="mb-8">
                                        <h4 className="mb-3 text-lg font-semibold">Key Benefits</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.benefits.map((benefit, i) => (
                                                <span key={i} className="px-3 py-1 text-sm rounded-full bg-white/10">
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-3xl font-bold">{selectedProduct.price}</span>
                                            <span className="ml-3 text-lg line-through text-white/50">{selectedProduct.originalPrice}</span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                addToCart(selectedProduct)
                                                setIsQuickViewOpen(false)
                                            }}
                                            className="px-6 py-3 font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
