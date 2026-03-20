/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    light: '#3e6a5e',
                    DEFAULT: '#1e3932',
                    dark: '#13231f',
                },
                accent: '#d97706',
            },
            borderRadius: {
                'xl': '1.5rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
