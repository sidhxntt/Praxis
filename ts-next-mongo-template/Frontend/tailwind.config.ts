import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const addVariablesForColors = ({ addBase, theme }: any) => {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
};

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            h1: { color: theme('colors.foreground') },
            h2: { color: theme('colors.foreground') },
            h3: { color: theme('colors.foreground') },
            h4: { color: theme('colors.foreground') },
            h5: { color: theme('colors.foreground') },
            h6: { color: theme('colors.foreground') },
            strong: { color: theme('colors.foreground') },
            blockquote: { color: theme('colors.muted.foreground') },
            code: { color: theme('colors.foreground') },
            pre: {
              backgroundColor: theme('colors.muted.DEFAULT'),
              color: theme('colors.foreground'),
            },
            a: { 
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.DEFAULT'),
                opacity: 0.8,
              },
            },
            table: {
              color: theme('colors.foreground'),
              borderCollapse: 'collapse',
              width: '100%',
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
              borderSpacing: '0',
              border: `1px solid ${theme('colors.border')}`,
              borderRadius: theme('borderRadius.lg'),
              th: {
                border: `1px solid ${theme('colors.border')}`,
                padding: theme('spacing.2'),
                textAlign: 'left',
                fontWeight: theme('fontWeight.bold'),
              },
              td: {
                border: `1px solid ${theme('colors.border')}`,
                padding: theme('spacing.2'),
              },
              thead: {
                th: {
                  backgroundColor: theme('colors.muted.DEFAULT'),
                }
              },
              tbody: {
                tr: {
                  '&:nth-child(odd)': {
                    backgroundColor: theme('colors.muted.DEFAULT'),
                    opacity: 0.8,
                  },
                },
              },
            },
          },
        },
      }),
    },
  },
  plugins: [tailwindcssAnimate, require("@tailwindcss/typography"), addVariablesForColors],
};

export default config;