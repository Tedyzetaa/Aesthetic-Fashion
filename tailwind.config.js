/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#F5F0EB", // fundo creme
        card: "#E6DFD5", // bege claro
        ink: "#2A2522", // marrom espresso / tipografia
        inkmuted: "#544C45",
        gold: "#C5A880",
        golddeep: "#A8875C",
        line: "rgba(42,37,34,0.12)",
        alert: "#B3543E"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "-apple-system", "sans-serif"]
      },
      borderRadius: {
        card: "2px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(42,37,34,0.06)"
      }
    }
  },
  plugins: []
};
