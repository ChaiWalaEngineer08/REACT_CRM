// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // your main HTML
    "./src/**/*.{js,ts,jsx,tsx}", // **includes all** React files
    
  ],
  theme: { extend: {} },
  plugins: [],
};
