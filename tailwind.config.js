/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'primary': '#070F2B',
      'secondary': '#00C3FE',
      'hijau': '#00FF9C',
      "merah" : "#FF204E",
      'color1' : '#FFE100',
      'color2' : '#E9EDFF',
      'color3' : '#9290C3',
      'color4' : '#535C91',
      'color5' : '#172048',
      'sidebar': '#070F2B',    // Tambahkan warna khusus untuk sidebar jika dibutuhkan
      'sidebar-hover': '#00C3FE',
    },
    extend: {
      keyframes: {
        typing: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
          },
          shine: {
            '0%': { 'background-position': '100%' },
            '100%': { 'background-position': '-100%' },
          },
      },
      animation: {
        typing: 'typing 3s steps(15, end) forwards',
        blink: 'blink 0.75s step-end infinite',
        gradient: 'gradient 8s linear infinite',
        shine: 'shine 5s linear infinite',
      },
      boxShadow: {
        'custom': '-5px 5px 10px 10px #000000',  
        'customside': '5px 5px 10px 10px #000000',  
        'custom2': '-5px 5px 30px 0px #00C3FE',  
        'custom3': '0px 0px 30px 0px #00C3FE',  
        'custom4': '0px 0px 15px 0px #FFE100',  
        'custom5': '-5px 5px 30px 0px #9290C3',  
      },
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      lobster: ['Lobster', 'cursive'],
      bodoni: ['Libre Bodoni', 'serif'],
    },
    screens: {
      'xs': '400px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'mobile': { 'max': '630px' }, // Mobile devices
    },
  },
  plugins: [],
}
