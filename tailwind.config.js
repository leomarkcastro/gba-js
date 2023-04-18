/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        AlegreyaSansSC: ["Alegreya Sans SC", "sans-serif"],
        AlegreyaSans: ["Alegreya Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: ["dark"],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "d-",
    darkTheme: "dark",
  },
};
