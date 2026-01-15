/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
        xxxl: "1600px",
      },
      colors: {
        mainColor: "#070707",
        headingColor: "#fff",
        primaryColor: "#f4f3ed",
        lighterColor: "#f7f7f7",
        subtitleColor: "#f7f7f7",
        blackColor: "#070707",
        borderColor: "rgba(255, 255, 255, 0.0784313725)",
        buttonBorder: "rgba(119, 119, 125, 0.2)",
        bodyBackground: "#000",
        bodyColor: "rgb(119, 119, 125)",
        greyBg: "#e6eaee",
      },
      fontFamily: {
        textFont: ["Poppins", "sans-serif"],
        titleFont: ["Oswald", "sans-serif"],
      },
    },
    plugins: [],
  },
};
