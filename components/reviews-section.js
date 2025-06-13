"use client"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function OurReview() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    return (
        <section
            className="bg-[#a3a8ee] relative flex items-center"
            style={{
                paddingTop: "clamp(2rem, 5vw, 3rem)",
                paddingBottom: "clamp(3rem, 8vw, 6rem)",
                paddingLeft: "clamp(1rem, 3vw, 1.5rem)",
                paddingRight: "clamp(1rem, 3vw, 1.5rem)",
                minHeight: "clamp(400px, 60vh, 500px)",
            }}
        >
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full`}>
                {/* Left Side Text Centered Vertically */}
                <div
                    className={`${isMobile ? "w-full mb-8" : "w-[30%]"} flex items-center relative z-10`}
                    style={{
                        marginLeft: isMobile ? "0" : "clamp(1rem, 10vw, 12.5rem)",
                        justifyContent: isMobile ? "center" : "flex-end",
                    }}
                >
                    <div className={`${isMobile ? "text-center" : ""}`}>
                        <h2
                            className="mb-2 font-semibold text-white uppercase"
                            style={{
                                fontSize: "clamp(1.5rem, 6vw, 4.5rem)",
                            }}
                        >
                            OUR REVIEWS
                        </h2>
                        <p
                            className="leading-relaxed text-white"
                            style={{
                                fontSize: "clamp(0.75rem, 2vw, 1.25rem)",
                                marginLeft: isMobile ? "0" : "clamp(1rem, 3vw, 2.5rem)",
                                maxWidth: isMobile ? "100%" : "20rem",
                                textAlign: isMobile ? "center" : "center",
                            }}
                        >
                            See what our customers have said about our product&apos;s goodness
                        </p>
                        <div
                            style={{
                                marginLeft: isMobile ? "auto" : "clamp(2rem, 5vw, 5rem)",
                                marginRight: isMobile ? "auto" : "0",
                                marginTop: isMobile ? "1rem" : "0",
                                width: "clamp(6rem, 15vw, 15rem)",
                                height: "clamp(6rem, 15vw, 15rem)",
                            }}
                        >
                            <Image
                                src="/quote.png"
                                alt="Review Image"
                                width={8000}
                                height={6000}
                                className="object-contain w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side Cards */}
                <div
                    className={`flex ${isMobile ? "flex-col" : "flex-row"} justify-end`}
                    style={{
                        gap: "clamp(1rem, 3vw, 1.5rem)",
                        width: isMobile ? "100%" : "66.666667%",
                    }}
                >
                    {/* Review Card 1 */}
                    <div
                        className="bg-[#e2e1f8] rounded-xl shadow text-gray-900 flex flex-col justify-between"
                        style={{
                            padding: "clamp(1rem, 3vw, 1.5rem)",
                            maxWidth: isMobile ? "100%" : "24rem",
                            width: "100%",
                        }}
                    >
                        <div>
                            <div className="mb-2 text-yellow-400" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>
                                ★★★★★
                            </div>
                            <p
                                className="mb-4 leading-relaxed"
                                style={{
                                    fontSize: "clamp(0.875rem, 2.5vw, 1.25rem)",
                                }}
                            >
                                &quot;FOMHAR has completely changed my skincare game! I struggled with pigmentation and uneven skin tone for
                                years, but within weeks of using their products, my skin looked noticeably clearer and brighter. The
                                formulas are gentle, effective, and feel luxurious - I finally found a brand I can trust. &quot;
                            </p>
                        </div>
                        <div className="flex items-center mt-4">
                            <Image
                                src="/review 1.jpg"
                                alt="Kritika Singh"
                                width={40}
                                height={40}
                                className="object-cover w-10 h-10 rounded-full"
                            />
                            <span className="ml-3 text-sm font-medium">Kritika Singh</span>
                        </div>
                    </div>

                    {/* Review Card 2 */}
                    <div
                        className="bg-[#e2e1f8] rounded-xl shadow text-gray-900 flex flex-col justify-between"
                        style={{
                            padding: "clamp(1rem, 3vw, 1.5rem)",
                            maxWidth: isMobile ? "100%" : "24rem",
                            width: "100%",
                        }}
                    >
                        <div>
                            <div className="mb-2 text-yellow-400" style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>
                                ★★★★★
                            </div>
                            <p
                                className="mb-4 leading-relaxed"
                                style={{
                                    fontSize: "clamp(0.875rem, 2.5vw, 1.25rem)",
                                }}
                            >
                                &quot;I&apos;ve tried countless skincare brands, but nothing worked like FOMHAR. My acne and dark spots have
                                visibly reduced, and my skin feels smooth and healthy every day. It&apos;s clean, effective, and gives real
                                results, highly recommend! &quot;
                            </p>
                        </div>
                        <div className="flex items-center mt-4">
                            <Image
                                src="/review 2.jpg"
                                alt="Muskan Dogra"
                                width={40}
                                height={40}
                                className="object-cover w-10 h-10 rounded-full"
                            />
                            <span className="ml-3 text-sm font-medium">Muskan Dogra</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
