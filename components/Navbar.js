"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue } from "framer-motion"
import Link from "next/link"

export default function Navbar() {
    // State management
    const [isOpen, setIsOpen] = useState(false)
    const [activeLink, setActiveLink] = useState("home")
    const [scrolled, setScrolled] = useState(false)
    const [searchActive, setSearchActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [cartCount, setCartCount] = useState(3)
    const [notificationCount, setNotificationCount] = useState(2)
    const [hoverLink, setHoverLink] = useState(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    // Refs
    const navRef = useRef(null)
    const searchInputRef = useRef(null)

    // Motion values for interactive elements
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const menuControls = useAnimation()

    // Navigation items with rich metadata
    const navItems = [
        {
            name: "HOME",
            href: "#",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
            color: "#FF6B6B",
            description: "Return to our homepage",
        },
        {
            name: "COLLECTION",
            href: "#best-section",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
            color: "#4ECDC4",
            description: "Browse our curated collections",
            subItems: ["Summer", "Wellness", "Essentials", "New Arrivals"],
        },
        {
            name: "PRODUCTS",
            href: "#products-section",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            ),
            color: "#FFD166",
            description: "Explore our product catalog",
            subItems: ["Oils", "Topicals", "Edibles", "Bundles"],
        },
        {
            name: "BLOGS",
            href: "#card-section",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                </svg>
            ),
            color: "#06D6A0",
            description: "Read our latest articles",
            subItems: ["Wellness", "Research", "Lifestyle", "News"],
        },
    ]

    // Handle scroll events to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (navRef.current) {
                setDimensions({
                    width: navRef.current.offsetWidth,
                    height: navRef.current.offsetHeight,
                })
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Focus search input when search is activated
    useEffect(() => {
        if (searchActive && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [searchActive])

    // Handle mouse movement for interactive elements
    const handleMouseMove = (e) => {
        if (navRef.current) {
            const rect = navRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            mouseX.set(x)
            mouseY.set(y)
        }
    }

    // Toggle mobile menu with animation
    const toggleMenu = async () => {
        if (isOpen) {
            await menuControls.start({
                height: 0,
                opacity: 0,
                transition: { duration: 0.3, ease: "easeInOut" },
            })
            setIsOpen(false)
        } else {
            setIsOpen(true)
            menuControls.start({
                height: "auto",
                opacity: 1,
                transition: { duration: 0.3, ease: "easeInOut" },
            })
        }
    }

    // Toggle search input
    const toggleSearch = () => {
        setSearchActive(!searchActive)
        setSearchQuery("")
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery)
            // Implement search functionality here
            setSearchActive(false)
            setSearchQuery("")
        }
    }

    // Animation variants
    const logoVariants = {
        normal: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
    }

    const navItemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: { scale: 0.95 },
    }

    const mobileMenuVariants = {
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        open: {
            height: "auto",
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const mobileNavItemVariants = {
        closed: { opacity: 0, x: -20 },
        open: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    }

    const iconVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.2,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: { scale: 0.9 },
    }

    const badgeVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15,
            },
        },
        exit: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.2 },
        },
    }

    const searchVariants = {
        closed: {
            width: "40px",
            opacity: 0.7,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        open: {
            width: "300px",
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    }

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
            },
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    }

    const dropdownItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    }

    return (
        <motion.nav
            ref={navRef}
            className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-md py-4"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            onMouseMove={handleMouseMove}
        >
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center flex-shrink-0"
                        variants={logoVariants}
                        initial="normal"
                        whileHover="hover"
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href="/" className="flex items-center">
                            <motion.div
                                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                    duration: 8,
                                    ease: "linear",
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                FOMHAR
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="items-center justify-center flex-1 hidden space-x-8 md:flex">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => setHoverLink(item.name)}
                                onMouseLeave={() => setHoverLink(null)}
                            >
                                <motion.a
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${activeLink === item.name.toLowerCase() ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    variants={navItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => setActiveLink(item.name.toLowerCase())}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.name}

                                    {/* Active indicator */}
                                    {activeLink === item.name.toLowerCase() && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                            layoutId="activeIndicator"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.a>

                                {/* Dropdown for items with subitems */}
                                {item.subItems && hoverLink === item.name && (
                                    <motion.div
                                        className="absolute left-0 z-10 w-48 py-2 mt-1 bg-white rounded-md shadow-lg top-full"
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        {item.subItems.map((subItem) => (
                                            <motion.a
                                                key={subItem}
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                variants={dropdownItemVariants}
                                            >
                                                {subItem}
                                            </motion.a>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <AnimatePresence>
                            {searchActive ? (
                                <motion.form
                                    className="relative"
                                    initial={{ width: "40px", opacity: 0.7 }}
                                    animate={{ width: "300px", opacity: 1 }}
                                    exit={{ width: "40px", opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSearchSubmit}
                                >
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search products..."
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <motion.button
                                        type="button"
                                        className="absolute top-0 left-0 flex items-center justify-center w-10 h-full text-gray-500"
                                        onClick={toggleSearch}
                                        variants={iconVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.button
                                    type="button"
                                    className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100"
                                    onClick={toggleSearch}
                                    variants={iconVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Notifications */}
                        <motion.button
                            type="button"
                            className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100"
                            variants={iconVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                            </svg>

                            {notificationCount > 0 && (
                                <motion.span
                                    className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full"
                                    variants={badgeVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    {notificationCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* User */}
                        <motion.button
                            type="button"
                            className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100"
                            variants={iconVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </motion.button>

                        {/* Cart */}
                        <motion.button
                            type="button"
                            className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100"
                            variants={iconVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>

                            {cartCount > 0 && (
                                <motion.span
                                    className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-purple-600 rounded-full"
                                    variants={badgeVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <motion.button
                                type="button"
                                className="relative p-2 text-gray-500 rounded-md hover:bg-gray-100"
                                onClick={toggleMenu}
                                variants={iconVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <span className="sr-only">Open main menu</span>
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.svg
                                            key="close"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 180 }}
                                            exit={{ rotate: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </motion.svg>
                                    ) : (
                                        <motion.svg
                                            key="menu"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                            initial={{ rotate: 180 }}
                                            animate={{ rotate: 0 }}
                                            exit={{ rotate: 180 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="overflow-hidden md:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
                            {navItems.map((item) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${activeLink === item.name.toLowerCase()
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    variants={mobileNavItemVariants}
                                    onClick={() => {
                                        setActiveLink(item.name.toLowerCase())
                                        toggleMenu()
                                    }}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.name}</span>

                                    {/* Show description in mobile menu */}
                                    <span className="ml-auto text-xs text-gray-400">{item.description}</span>
                                </motion.a>
                            ))}

                            {/* Mobile search */}
                            <motion.div className="px-3 py-2" variants={mobileNavItemVariants}>
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search products..."
                                        className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute top-0 left-0 flex items-center justify-center w-10 h-full text-gray-500"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}