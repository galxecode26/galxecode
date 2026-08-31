export interface ConnectedPartner {
  id: string;
  name: string;
  role: string;
  logoSrc: string;
  websiteUrl?: string;
  badgeColor?: "purple" | "emerald" | "cyan" | "amber" | "rose" | "blue" | "indigo";
  description?: string;
}

/**
 * ============================================================================
 * CONNECTED PARTNERS CONFIGURATION ARRAY
 * ============================================================================
 * Add or edit your connected partners below!
 * 
 * Each partner item requires:
 * - name: Partner Organization Name
 * - role: Partnership Role (e.g., "Title Partner", "Technology Partner", "AI Partner")
 * - logoSrc: Logo image path (e.g., "/uplearn-logo.png", "/image.png")
 * - websiteUrl: (Optional) Partner website link
 * ============================================================================
 */
export const INITIAL_PARTNERS: ConnectedPartner[] = [
  {
    id: "partner-1",
    name: "UpLearning",
    role: "Title Partner",
    logoSrc: "/uplearn-logo.png",
    websiteUrl: "https://uplearning.in",
    badgeColor: "purple",
    description: "Empowering hands-on tech learning and rapid skill development.",
  },
  {
    id: "partner-2",
    name: "Webwrite Services",
    role: "Co-Technology Partner",
    logoSrc: "/webwrite.png",
    websiteUrl: "https://webwrite.co.in",
    badgeColor: "blue",
    description: "Converting Ideas into Reality.",
  },
  {
    id: "partner-3",
    name: "Seyonix",
    role: "Technology Partner",
    logoSrc: "/Scan documents20260826_161919_page-0001.jpg",
    badgeColor: "emerald",
    description: "Pioneering technological solutions and innovative software engineering.",
  },
  {
    id: "partner-4",
    name: "Vipra Cube AI",
    role: "AI & Innovation Partner",
    logoSrc: "/image.png",
    badgeColor: "indigo",
    description: "Accelerating AI-driven transformation and smart product intelligence.",
  },
  {
    id: "partner-5",
    name: "P. A. Inamdar University",
    role: "Academic Partner",
    logoSrc: "/pa-inamdar-logo.png",
    websiteUrl: "#",
    badgeColor: "cyan",
    description: "Leading higher education excellence, innovation & campus hosting.",
  },
];
