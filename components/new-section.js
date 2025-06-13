import Image from "next/image"

const newProducts = [
    {
        name: "FOMHAR AURA serum",
        price: "699.00",
        imageUrl: "/new-aura.jpg",
        alt: "Fomhar Aura Serum",
    },
    {
        name: "FOMHAR KISS Lip balm",
        price: "299.00",
        imageUrl: "/new-kiss.jpg",
        alt: "Fomhar Kiss Lip Balm",
    },
]

export default function NewLaunches() {
    return (
        <section
            className="pt-12 pb-24 bg-purple-200"
            style={{
                backgroundImage: "url('/placeholder.svg?width=1920&height=500&text=FloralBG3')",
                backgroundSize: "cover",
                paddingTop: "clamp(2rem, 5vw, 3rem)",
                paddingBottom: "clamp(3rem, 8vw, 6rem)",
            }}
        >
            <div className="container px-4 mx-auto text-center">
                <h2
                    className="mb-10 font-bold text-purple-800"
                    style={{
                        fontSize: "clamp(2rem, 6vw, 3rem)",
                        marginBottom: "clamp(1.5rem, 5vw, 2.5rem)",
                    }}
                >
                    NEWLY LAUNCHED PRODUCTS
                </h2>
                <div
                    className="grid grid-cols-1 mx-auto md:grid-cols-2"
                    style={{
                        maxWidth: "80%",
                        gap: "clamp(1.5rem, 5vw, 5.5rem)",
                    }}
                >
                    {newProducts.map((product, index) => (
                        <div
                            key={index}
                            className="text-center bg-white rounded-lg shadow-lg"
                            style={{
                                padding: "clamp(1rem, 3vw, 1.5rem)",
                            }}
                        >
                            <div
                                className="relative w-full mb-4 overflow-hidden rounded"
                                style={{
                                    height: "clamp(200px, 40vw, 32rem)",
                                }}
                            >
                                <Image
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.alt}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <h3
                                className="font-semibold text-purple-700"
                                style={{
                                    fontSize: "clamp(1rem, 3vw, 1.25rem)",
                                }}
                            >
                                {product.name}
                            </h3>
                            <p
                                className="font-bold text-gray-800"
                                style={{
                                    fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
                                }}
                            >
                                ₹ {product.price}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
