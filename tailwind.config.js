// tailwind.config.js
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                achemost: ['var(--font-achemost)'],
                bradley: ['var(--font-bradley)'],
                helma: ['var(--font-helma)'],
                montserrat: ['var(--font-montserrat)'],
            },
        },
    },
    plugins: [],
}
