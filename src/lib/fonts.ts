import {
  Inter,
  Roboto,
  Poppins,
  Montserrat,
  Playfair_Display,
  JetBrains_Mono,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "600", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const fontVariables = [
  inter.variable,
  roboto.variable,
  poppins.variable,
  montserrat.variable,
  playfairDisplay.variable,
  jetbrainsMono.variable,
].join(" ");

export const fontMap: Record<string, string> = {
  Inter: "var(--font-inter)",
  Roboto: "var(--font-roboto)",
  Poppins: "var(--font-poppins)",
  Montserrat: "var(--font-montserrat)",
  "Playfair Display": "var(--font-playfair-display)",
  "JetBrains Mono": "var(--font-jetbrains-mono)",
};
