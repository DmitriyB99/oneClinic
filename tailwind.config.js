/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "Roboto Flex, sans-serif",
    },
    fontSize: {
      Regular10: [
        "0.625rem",
        {
          lineHeight: ".75rem",
          fontWeight: "400",
        },
      ],
      Regular11: [
        "0.6875rem",
        {
          lineHeight: "1rem",
          fontWeight: "400",
        },
      ],
      Regular12: [
        "0.75rem",
        {
          lineHeight: "1rem",
          fontWeight: "400",
        },
      ],
      Regular14: [
        "0.875rem",
        {
          lineHeight: "1rem",
          fontWeight: "400",
        },
      ],
      Regular16: [
        "1rem",
        {
          lineHeight: "1.25rem",
          fontWeight: "400",
        },
      ],
      Medium12: [
        "0.75rem",
        {
          lineHeight: "1rem",
          fontWeight: "500",
        },
      ],
      Medium14: [
        "0.875rem",
        {
          lineHeight: "1rem",
          fontWeight: "500",
        },
      ],
      Medium16: [
        "1rem",
        {
          lineHeight: "1.25rem",
          fontWeight: "500",
        },
      ],
      Medium24: [
        "1.5rem",
        {
          lineHeight: "1.75rem",
          fontWeight: "500",
        },
      ],
      Medium32: [
        "2rem",
        {
          lineHeight: "2.375rem",
          fontWeight: "500",
        },
      ],
      Semibold11: [
        "0.6875rem",
        {
          lineHeight: "1rem",
          fontWeight: "600",
        },
      ],
      Semibold12: [
        "0.75rem",
        {
          lineHeight: "1rem",
          fontWeight: "600",
        },
      ],
      Semibold16: [
        "1rem",
        {
          lineHeight: "1rem",
          fontWeight: "600",
        },
      ],
      Semibold20: [
        "1.25rem",
        {
          lineHeight: "1rem",
          fontWeight: "600",
        },
      ],
      Semibold48: [
        "3rem",
        {
          lineHeight: "1rem",
          fontWeight: "600",
        },
      ],
      Bold11: [
        "0.6875rem",
        {
          lineHeight: "1rem",
          fontWeight: "700",
        },
      ],
      Bold12: [
        "0.75rem",
        {
          lineHeight: "1rem",
          fontWeight: "700",
        },
      ],
      Bold14: [
        "0.875rem",
        {
          lineHeight: "1rem",
          fontWeight: "700",
        },
      ],
      Bold16: [
        "1rem",
        {
          lineHeight: "1.25rem",
          fontWeight: "700",
        },
      ],
      Bold20: [
        "1.25rem",
        {
          lineHeight: "1.5rem",
          fontWeight: "700",
        },
      ],
      Bold24: [
        "1.5rem",
        {
          lineHeight: "1.75rem",
          fontWeight: "700",
        },
      ],
      Bold32: [
        "2rem",
        {
          lineHeight: "normal",
          fontWeight: "700",
        },
      ],
      Bold42: [
        "2.625rem",
        {
          lineHeight: "normal",
          fontWeight: "700",
        },
      ],
    },
    extend: {
      colors: {
        gray: {
          icon: "#C4C4C4",
          desktopIcon: "#6C7278",
          bgCard: "#fafafa",
          secondary: "#737373",
          tertiary: "#7676801F",
          0: "#F0F0F0",
          1: "#F5F5F5",
          2: "#F2F2F2",
          3: "#E5E5E5",
          4: "rgba(0, 0, 0, 0.45)",
          5: "rgba(0, 0, 0, 0.02)",
          6: "rgba(0, 0, 0, 0.04)",
          7: "rgba(0, 0, 0, 0.15)",
          8: "rgba(0, 0, 0, 0.25)",
        },
        brand: {
          primary: "#F62F5A",
          light: "#FCB8C5",
          pale: "#D1E0CE",
          darkGreenChart: "#008404",
          superLight: "#FCB8C5",
          ultraLight: "#FFF3F5",
          secondary: "#193914",
          dark: "#081106",
          icon: "#F62F5A",
          darkGreen: "#F62F5A",
        },
        primary: {
          0: "#128C7E",
          2: "#D1E4E8",
        },
        purple: {
          0: "#A34B98",
          1: "#FFF2FE",
          2: "#610084",
        },
        dark: "#030602",
        secondaryText: "#737373",
        white: "#FFFFFF",
        black: "#000000",
        blue: "#007AFF",
        crimson: "#F62F5A",
        red: "#FF5555",
        lightRed: "#F8EAED",
        lavenderGray: "#9B9BC4",
        pink: "#FFF2FE",
        lightPink: "#FEEAEE",
        gradientPurple: "#D42EF9",
        ToolBar: "rgba(255, 255, 255, 0.2)",
        Overlay: "rgba(0, 0, 0, 0.4)",
        lightWarning: "#FFF2DE",
        warningStatus: "#C17C15",
        lightPositive: "#DEFFE1",
        positiveStatus: "#3D9645",
        lightNeutral: "#E7F5FF",
        neutralStatus: "#2995E3",
        lightNegative: "#FFDDDD",
        negativeStatus: "#931F1F",
        placeholderText: "#9C9C9C",
        transparent: "transparent",
        success: "#52C41A",
        colorPrimaryBase: "#1677FF",
        colorPrimaryBg: "#E6F4FF",
        colorPrimaryBorder: "#91CAFF",
        lightDark: "rgba(0, 0, 0, 0.28)",
        iconDisabled: "rgba(255, 255, 255, 0.25)",
        blueGray: "#F7F7FC",
        indigo: "#0000E0",
        darkBlue: "#001529",
        darkPurple: "#6E7FA9",
        lightGreen: "#DCEFED",
        lightOrange2: "#FE9256",
        lightOrange: "#FEECDC",
        orange: "#F76241",
        emphasis: "rgba(224, 236, 255, 0.8)",
        surfaceDark: "#0F1115",
        highEmphasis: "rgba(245, 249, 255, 0.9)",
        twinPurple: "#7E47EB",
        borderLight: "#2D3440",
        surfaceLight: "#1E232A",
        borderDefault: "#1B1F26",
        lightGreen: "#AEEFA2",
        darkVideo: "#02101D",
        secondaryDefault: "#475366",
        pressedButton: {
          primary: "#F62F5A",
          secondary: "#FFEBEF",
          tertiary: "#FFDBE2",
          tinted: "#F9A4B5",
          outlineDanger: "#ff7875",
        },
        toolbarButton: "rgba(255, 255, 255, 0.2)",
        segmentedGroupBg: "#0000000A",
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
        fadeOut: "fadeOut 0.4s ease-in-out",
        modalOpen: "modalOpen 0.4s ease-in-out",
        modalClose: "modalClose 0.4s ease-in-out",
      },

      keyframes: () => ({
        modalOpen: {
          "0%": { top: "100vh" },
          "100%": { top: 0 },
        },
        modalClose: {
          "0%": { top: 0 },
          "100%": { top: "100vh" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      }),
      lineHeight: {
        3.5: "0.875rem",
      },
      height: {
        15: "3.75rem",
        28: "7rem",
        27: "6.75rem",
        26: "6.5rem",
        25: "6.25rem",
        5.5: "1.375rem",
        "9/10": "90%",
        inherit: "inherit",
      },
      width: {
        35: "8.75rem",
        37: "9.25rem",
        25: "6.25rem",
        31: "7.75rem",
        23: "5.75rem",
        15: "3.75rem",
        13: "3.25rem",
        5.5: "1.375rem",
        message: "15.625rem",
      },
      minWidth: {
        4: "1rem",
        6: "1.5rem",
      },
      minHeight: {
        4: "1rem",
        6: "1.5rem",
        12: "3rem",
        15: "3.75rem",
      },
      maxHeight: {
        half: "50%",
      },
      borderWidth: {
        halfOne: "0.5px",
      },
      borderRadius: {
        cardCarousel: "18px",
        bigCardCarousel: "20px",
        bigIcon: "72px",
      },
      boxShadow: {
        cardCarousel: "0px 4px 16px rgba(0, 0, 0, 0.08)",
        card: "0px 4px 16px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        cardCarousel:
          "linear-gradient(360deg, #FFFFFF 3.55%, rgba(255, 255, 255, 0) 63.83%)",
      },
      padding: {
        "3,5": "0.875rem",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
