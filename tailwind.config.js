/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1D29",
        paper: "#F7F8FA",
        navy: {
          DEFAULT: "#0B3D91",
          50: "#EAF0FA",
          100: "#CBDBF2",
          600: "#0B3D91",
          700: "#092F70",
          900: "#061B40"
        },
        gold: {
          DEFAULT: "#E1B62C",
          50: "#FDF7E3",
          600: "#E1B62C",
          700: "#B68E17"
        },
        line: "#E4E7EC",
        success: "#1F8A55",
        danger: "#C4432B"
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-bengali)", "sans-serif"],
        body: ["var(--font-body)", "var(--font-bengali)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,61,145,0.06), 0 1px 0 rgba(11,61,145,0.04)",
        cardHover: "0 8px 24px rgba(11,61,145,0.10)"
      },
      borderRadius: {
        card: "10px"
      }
    }
  },
  plugins: []
};
