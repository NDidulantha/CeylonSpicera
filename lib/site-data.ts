/* ============================================================
   Ceylon Spicera — site content
   Ported verbatim from the approved design mockup so every
   section pulls from one typed source of truth.
   ============================================================ */

export const nav = [
  "Home",
  "Shop",
  "About Ceylon",
  "Contact",
] as const;

export const getNavHref = (link: string) => {
  switch (link) {
    case "Home":
      return "/#top";

    case "Shop":
      return "/shop";

    case "About Ceylon":
      return "/about-ceylon";

    case "Contact":
      return "/contact";

    default:
      return "/";
  }
};

export const trustBadges = [
  "100% Sri Lankan Origin",
  "Export Quality",
  "Worldwide Shipping",
] as const;

export const heroSpices = [
  "Cinnamon",
  "Coriander",
  "Cardamom",
  "Pepper",
  "Cloves",
  "Nutmeg",
] as const;

export type Category = { name: string; tag: string; delay: number; img?: string };
export const categories: Category[] = [
  { name: "Ceylon Cinnamon", tag: "True Cinnamon", delay: 0 },
  { name: "Black Pepper", tag: "Highland Grown", delay: 80 },
  { name: "Green Cardamom", tag: "Queen of Spices", delay: 160 },
  { name: "Cloves", tag: "Warming Buds", delay: 0 },
  { name: "Nutmeg & Mace", tag: "Rich & Sweet", delay: 80 },
  { name: "Coriander", tag: "Fresh & Citrusy", delay: 160 },
];

export type Why = { n: string; title: string; desc: string };
export const why: Why[] = [
  { n: "01", title: "Authentic Origin", desc: "Single-source Sri Lankan estates, fully traceable." },
  { n: "02", title: "Ethically Sourced", desc: "Fair partnerships with farming communities." },
  { n: "03", title: "Hand Selected", desc: "Graded and inspected by master tasters." },
  { n: "04", title: "Export Certified", desc: "ISO, HACCP & organic compliant." },
  { n: "05", title: "Fresh Harvest", desc: "Milled to order for peak potency." },
  { n: "06", title: "Worldwide Delivery", desc: "Climate-safe packaging to 40+ countries." },
];

export type Product = {
  id: string;
  name: string;
  desc: string;
  price: string;
  rating: string;
  badge: string;
};
export const products: Product[] = [
  { id: "p1", name: "Ceylon Cinnamon Quills", desc: "Grade C5 · hand-rolled true cinnamon", price: "$18.00", rating: "4.9", badge: "Best Seller" },
  { id: "p2", name: "Malabar Black Pepper", desc: "Bold, high-piperine single origin", price: "$14.50", rating: "4.8", badge: "" },
  { id: "p3", name: "Green Cardamom Pods", desc: "Highland-grown, intensely aromatic", price: "$22.00", rating: "4.9", badge: "" },
  { id: "p4", name: "Ceylon Ginger", desc: "Sun-dried, pungent & warming", price: "$13.00", rating: "4.8", badge: "" },
  { id: "p5", name: "Whole Cloves", desc: "Aromatic, hand-picked buds", price: "$16.00", rating: "4.8", badge: "" },
  { id: "p6", name: "Nutmeg & Mace", desc: "Rich, sweet & freshly milled", price: "$19.50", rating: "4.9", badge: "" },
  { id: "p7", name: "Ceylon Turmeric", desc: "Vivid, high-curcumin root", price: "$12.00", rating: "4.7", badge: "New" },
  { id: "p8", name: "Curry Leaf Blend", desc: "Fragrant, slow-dried leaves", price: "$15.50", rating: "4.8", badge: "" },
];

export type Stat = { v: string; l: string; delay: number };
export const stats: Stat[] = [
  { v: "40+", l: "Countries Served", delay: 0 },
  { v: "500+", l: "Global Clients", delay: 80 },
  { v: "100%", l: "Export Grade", delay: 160 },
  { v: "20+", l: "Years of Trade", delay: 240 },
];

export type Review = {
  quote: string;
  name: string;
  role: string;
  country: string;
  delay: number;
};
export const reviews: Review[] = [
  { quote: "The finest cinnamon we have sourced in twenty years of buying. Aroma unlike anything else on the market.", name: "Amara Fernando", role: "Head Buyer, Fortuna Grocers", country: "United Kingdom", delay: 0 },
  { quote: "Ceylon Spicera's cardamom transformed our tasting menu. Consistent, vivid, unmistakably premium.", name: "Luca Moretti", role: "Executive Chef, Aria", country: "Italy", delay: 90 },
  { quote: "Flawless export grade, immaculate documentation, and on time with every single shipment.", name: "David Chen", role: "Procurement, Pacific Foods", country: "Singapore", delay: 180 },
];

export type FooterColumn = { title: string; links: string[] };
export const footer: FooterColumn[] = [
  { title: "Shop", links: ["All Spices", "Gift Sets", "Best Sellers", "New Arrivals"] },
  { title: "Company", links: ["About Ceylon", "Our Heritage", "Sustainability", "Careers"] },
  { title: "Export", links: ["Wholesale", "Bulk Orders", "Private Label", "Certifications"] },
  { title: "Support", links: ["Contact", "Shipping", "Returns", "FAQ"] },
  { title: "Legal", links: ["Terms", "Privacy", "Cookies"] },
];