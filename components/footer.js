"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useInView, useAnimation, useMotionValue, useTransform } from "framer-motion"

export default function Footer() {
    // State for interactive elements
    const [activeSection, setActiveSection] = useState(null)
    const [hoveredLink, setHoveredLink] = useState(null)
    const [isFormValid, setIsFormValid] = useState(false)
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
    const [isMobile, setIsMobile] = useState(false)

    // Refs for animations
    const footerRef = useRef(null)
    const isInView = useInView(footerRef, { once: false, amount: 0.2 })
    const controls = useAnimation()
    const formControls = useAnimation()

    // Mouse position for interactive elements
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Transform values for parallax effects
    const x = useTransform(mouseX, [-100, 100], [-5, 5])
    const y = useTransform(mouseY, [-100, 100], [-5, 5])

    // Content sections
    const sections = [
        {
            id: "explore",
            title: "Explore",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            links: [
                { name: "Home", href: "/" },
                { name: "Shop", href: "/products" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Blog", href: "/blog" },
            ],
            color: "#FF6B6B",
        },
        {
            id: "support",
            title: "Support",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            links: [
                { name: "FAQs", href: "/faq" },
                { name: "Contact Us", href: "/contact" },
                { name: "Shipping", href: "/shipping" },
                { name: "Returns", href: "/returns" },
                { name: "Track Order", href: "/track" },
            ],
            color: "#4ECDC4",
        },
        {
            id: "learn",
            title: "Learn",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path d="M12 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            links: [
                { name: "CBD Benefits", href: "/benefits" },
                { name: "Research", href: "/research" },
                { name: "Guides", href: "/guides" },
                { name: "Sustainability", href: "/sustainability" },
                { name: "Our Process", href: "/process" },
            ],
            color: "#FFD166",
        },
    ]

    // Social links with hover animations
    const socialLinks = [
        {
            name: "Instagram",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M17.5 6.5H17.51"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            color: "#E1306C",
        },
        {
            name: "Twitter",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            color: "#1DA1F2",
        },
        {
            name: "Facebook",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            color: "#1877F2",
        },
        {
            name: "YouTube",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92925 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42V6.42Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            color: "#FF0000",
        },
        {
            name: "Pinterest",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            color: "#E60023",
        },
    ]

    // Handle mouse movement for interactive elements

    // Validate email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    // Handle email input change
    const handleEmailChange = (e) => {
        const value = e.target.value
        setEmail(value)
        setIsFormValid(validateEmail(value))
    }

    // Handle newsletter form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isFormValid) {
            formControls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.5 },
            })
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        setEmail("")

        // Reset after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
        }, 3000)
    }

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Animate sections when in view
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
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    }

    const linkVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
        hover: {
            scale: 1.05,
            x: 5,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
    }

    const socialVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
            },
        },
        hover: {
            scale: 1.2,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
    }

    return (
        <footer
            ref={footerRef}
            className="relative px-4 py-16 overflow-hidden text-white bg-gradient-to-b from-gray-900 to-black sm:px-6 lg:px-8"
        >
            {/* Interactive background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Simple gradient background */}
                <div className="absolute inset-0 opacity-100 bg-gradient-to-b from-gray-900 to-black" />
            </div>

            {/* Main content container */}
            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Logo and tagline */}
                <motion.div
                    className="flex flex-col items-center mb-16 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        FOMHAR
                    </motion.div>
                    <motion.p
                        className="max-w-md text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Premium CBD products crafted with care for your wellness journey
                    </motion.p>
                </motion.div>

                {/* Main sections */}
                <motion.div
                    className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    {sections.map((section) => (
                        <motion.div
                            key={section.id}
                            className="relative"
                            variants={itemVariants}
                            onMouseEnter={() => setActiveSection(section.id)}
                            onMouseLeave={() => setActiveSection(null)}
                        >
                            {/* Section background that animates on hover */}
                            <motion.div
                                className="absolute inset-0 rounded-xl -z-10"
                                animate={{
                                    backgroundColor: activeSection === section.id ? `${section.color}10` : "transparent",
                                    borderColor: activeSection === section.id ? `${section.color}30` : "transparent",
                                }}
                                transition={{ duration: 0.3 }}
                                style={{ borderWidth: 1 }}
                            />

                            {/* Section header with icon */}
                            <div className="flex items-center pl-4 mb-4">
                                <motion.div
                                    className="p-2 mr-3 rounded-lg"
                                    style={{
                                        backgroundColor: `${section.color}20`,
                                        color: section.color,
                                    }}
                                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {section.icon}
                                </motion.div>
                                <h3 className="text-xl font-semibold">{section.title}</h3>
                            </div>

                            {/* Links with hover animations */}
                            <ul className="pl-4 space-y-3">
                                {section.links.map((link) => (
                                    <motion.li key={link.name} variants={linkVariants}>
                                        <Link href={link.href} className="flex items-center group">
                                            <motion.span
                                                className="inline-block w-0 h-0.5 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"
                                                style={{ backgroundColor: section.color }}
                                            />
                                            <motion.span
                                                className="text-gray-300 transition-colors hover:text-white"
                                                whileHover="hover"
                                                onMouseEnter={() => setHoveredLink(`${section.id}-${link.name}`)}
                                                onMouseLeave={() => setHoveredLink(null)}
                                            >
                                                {link.name}
                                            </motion.span>
                                            {hoveredLink === `${section.id}-${link.name}` && (
                                                <motion.span
                                                    className="ml-2 opacity-0 group-hover:opacity-100"
                                                    initial={{ opacity: 0, x: -5 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 5 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    →
                                                </motion.span>
                                            )}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Newsletter and contact section */}
                <motion.div
                    className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    {/* Newsletter signup */}
                    <motion.div variants={itemVariants} className="relative">
                        <motion.div
                            className="absolute inset-0 rounded-xl -z-10"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.1)",
                            }}
                        />
                        <div className="p-6">
                            <h3 className="mb-4 text-xl font-semibold">Stay Connected</h3>
                            <p className="mb-6 text-gray-400">
                                Subscribe to our newsletter for exclusive offers, wellness tips, and product updates.
                            </p>

                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        onSubmit={handleSubmit}
                                        className="relative"
                                        animate={formControls}
                                        initial={{ opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                placeholder="Your email address"
                                                className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all bg-gray-800 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            <motion.button
                                                type="submit"
                                                className="absolute px-4 font-medium text-white rounded-md right-1 top-1 bottom-1 bg-gradient-to-r from-purple-500 to-pink-500"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    />
                                                ) : (
                                                    "Subscribe"
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        className="flex items-center p-3 text-green-400 bg-green-900 border border-green-500 rounded-lg bg-opacity-20"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-5 h-5 mr-2"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        <span>Thank you for subscribing!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Contact information */}
                    <motion.div variants={itemVariants} className="relative">
                        <motion.div
                            className="absolute inset-0 rounded-xl -z-10"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.1)",
                            }}
                        />
                        <div className="p-6">
                            <h3 className="mb-4 text-xl font-semibold">Contact Us</h3>
                            <ul className="space-y-4">
                                <motion.li
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                    <div className="p-2 mr-3 bg-purple-900 rounded-lg bg-opacity-30">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-5 h-5 text-purple-400"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <a href="mailto:support@fomhar.com" className="text-white transition-colors hover:text-purple-300">
                                            kartikrawat9@gmail.com
                                        </a>
                                    </div>
                                </motion.li>
                                <motion.li
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                    <div className="p-2 mr-3 bg-pink-900 rounded-lg bg-opacity-30">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-5 h-5 text-pink-400"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Phone</p>
                                        <a href="tel:+14487775483" className="text-white transition-colors hover:text-pink-300">
                                            +91 44 8777 ****
                                        </a>
                                    </div>
                                </motion.li>
                                <motion.li
                                    className="flex items-start"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                    <div className="p-2 mr-3 bg-blue-900 rounded-lg bg-opacity-30">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="w-5 h-5 text-blue-400"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Address</p>
                                        <p className="text-white">In the Fairyland</p>
                                    </div>
                                </motion.li>
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Bottom section with social links and copyright */}
                <div className="pt-8 border-t border-gray-800">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        {/* Copyright and legal links */}
                        <motion.div
                            className="mb-6 text-center md:mb-0 md:text-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <p className="mb-2 text-sm text-gray-400">
                                &copy; {new Date().getFullYear()} Fomhar. All Rights Reserved
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 md:justify-start">
                                <Link href="/terms" className="transition-colors hover:text-white">
                                    Terms & Conditions
                                </Link>
                                <Link href="/privacy" className="transition-colors hover:text-white">
                                    Privacy Policy
                                </Link>
                                <Link href="/shipping" className="transition-colors hover:text-white">
                                    Shipping Policy
                                </Link>
                            </div>
                        </motion.div>

                        {/* Social links */}
                        <motion.div
                            className="flex flex-col items-center md:items-end"
                            variants={containerVariants}
                            initial="hidden"
                            animate={controls}
                        >
                            <h2 className="mb-3 text-2xl font-bold text-white font-bardley">Made with love by <a className="text-blue-600" href="https://github.com/KratX">Kartik</a></h2>
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => (
                                    <a
                                        target="_blank"
                                        key={social.name}
                                        href={"https://github.com/KratX"}
                                        className="p-2 transition-colors rounded-full"
                                        style={{
                                            backgroundColor: `${social.color}20`,
                                            color: social.color,
                                        }}
                                        variants={socialVariants}
                                        whileHover="hover"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                        <span className="sr-only">{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll to top button */}
                <motion.button
                    className="fixed z-50 p-3 text-white rounded-full shadow-lg bottom-8 right-8 bg-gradient-to-r from-purple-500 to-pink-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                    </svg>
                </motion.button>
            </div>
        </footer>
    )
}
