export const site = {
  name: "Data Qraft Limited",
  legalName: "Data Qraft Limited",
  shortName: "DQL",
  url: "https://www.dataqraft.io",
  displayUrl: "www.dataqraft.io",
  email: "info@dataqraft.io",
  phoneDisplay: "+234 812 191 2270",
  phoneHref: "tel:+2348121912270",
  addressLines: ["2, Idowu Taylor Street", "Victoria Island, Lagos, Nigeria"],
  address: "2, Idowu Taylor Street, Victoria Island, Lagos, Nigeria",
  tagline: "Hindsight · Insight · Foresight",
  logoTagline: "Research | Data | Intelligence",
  title: "Data Qraft Limited | Data Intelligence, Research & Advisory",
  description:
    "Data Qraft Limited turns complex data and localized sentiment into strategic intelligence for critical decision-makers. Headquartered in Lagos, Nigeria.",
  confidentiality: "All engagements are handled in strict confidence.",
} as const

export const nav = [
  { href: "#method", id: "method", label: "Method" },
  { href: "#about", id: "about", label: "About" },
  { href: "#values", id: "values", label: "Values" },
  { href: "#services", id: "services", label: "Services" },
  { href: "#clients", id: "clients", label: "Clients" },
  { href: "#contact", id: "contact", label: "Contact" },
] as const

export const hero = {
  eyebrow: "Data intelligence · Research · Advisory",
  title: "From data to decision.",
  subhead:
    "Data Qraft turns complex data and localized sentiment into strategic intelligence for Africa's most critical decision-makers.",
  primaryCta: "Request a briefing",
  secondaryCta: "Explore our services",
  trustLine: "Lagos-headquartered · Serving B2B and B2G institutions",
} as const

export const about = {
  index: "02 / About",
  title: "A data intelligence, research and advisory firm.",
  body: "Data Qraft Limited (DQL) is a data intelligence, research, and advisory firm headquartered in Lagos, Nigeria. We offer market insight, socioeconomic intelligence and statecraft support services. DQL transforms raw data and localized sentiment into decisive strategic intelligence for critical decision-making.",
  expertiseTitle: "Our global expertise",
  expertise:
    "At the core of our operations is a multidisciplinary, international team of seasoned researchers, data scientists, and analysts who work with elite software developers, ethical hackers, and cybersecurity specialists. The synergy of on-the-ground human intelligence and advanced technical infrastructure allows us to execute complex data projects proficiently.",
  capabilities: [
    "Researchers",
    "Data Scientists",
    "Analysts",
    "Software Developers",
    "Ethical Hackers",
    "Cybersecurity Specialists",
  ],
} as const

export const services = {
  index: "04 / Services",
  title: "What we deliver",
  description:
    "Three practices. Each one turns local evidence into something a decision-maker can use.",
  items: [
    {
      id: "market",
      index: "Vertical 01",
      icon: "chart",
      title: "Market & Consumer Insights",
      description:
        "Commercial intelligence services focused on route-to-market strategies, product viability, and consumer behavior tracking. This vertical specializes in delivering localized data for high-yield sectors, including extractive industries, agriculture, and commodity trading.",
      tags: ["Route-to-market", "Product viability", "Consumer tracking", "Commodities"],
    },
    {
      id: "political",
      index: "Vertical 02",
      icon: "landmark",
      title: "Political Intelligence & Statecraft",
      description:
        "High-level strategic support for sovereigns, government agencies, and political entities. Services include deploying real-time situational war rooms, rapid field intelligence collection, predictive electoral modeling, and economic policy rollout assessments.",
      tags: ["War rooms", "Field intelligence", "Electoral modeling", "Policy assessment"],
    },
    {
      id: "digital",
      index: "Vertical 03",
      icon: "radio",
      title: "Digital Sentiment & Brand Tracking",
      description:
        "Real-time monitoring and crisis management using AI-driven Natural Language Processing (NLP) specifically tailored to African dialects and nuances. This includes deep hashtag analysis, brand health tracking, and social media listening to gauge public sentiment accurately.",
      tags: ["African dialects", "Hashtag analysis", "Brand health", "Social listening"],
    },
  ],
} as const

export const method = {
  index: "01 / Method",
  title: "From what happened, to what it means, to what comes next.",
  description: "Hindsight. Insight. Foresight. The sequence behind every engagement.",
  stages: [
    {
      id: "hindsight",
      number: "01",
      icon: "history",
      title: "Hindsight",
      description:
        "Understanding what has happened, grounded in verified data and field evidence.",
    },
    {
      id: "insight",
      number: "02",
      icon: "focus",
      title: "Insight",
      description: "Interpreting what it means, with local context and sentiment.",
    },
    {
      id: "foresight",
      number: "03",
      icon: "telescope",
      title: "Foresight",
      description:
        "Anticipating what comes next, through modelling and scenario-based assessment.",
    },
  ],
} as const

export const visionMission = {
  vision: {
    label: "Our vision",
    quote: "Pioneering a new standard of leadership and enterprise in Africa.",
    supporting:
      "To build Africa's definitive intelligence engine for statecraft, commerce, and consumer foresight.",
  },
  mission: {
    label: "Our mission",
    quote: "Transforming raw data into strategic advantage.",
    supporting:
      "To turn complex data and localized sentiment into decisive strategic intelligence for Africa's most critical decision-makers.",
  },
} as const

export const values = {
  index: "03 / Values",
  title: "How we operate.",
  items: [
    {
      number: "01",
      icon: "crosshair",
      title: "Empirical Precision",
      description: "Work is grounded in verified data and field evidence.",
    },
    {
      number: "02",
      icon: "map",
      title: "Contextual Mastery",
      description: "Local conditions and sentiment shape the reading.",
    },
    {
      number: "03",
      icon: "cpu",
      title: "Technological Synergy",
      description: "Human intelligence and technical systems operate together.",
    },
    {
      number: "04",
      icon: "lock",
      title: "Strategic Discretion",
      description: "Engagements are held in strict confidence.",
    },
    {
      number: "05",
      icon: "gauge",
      title: "Agile Execution",
      description: "Delivery keeps pace with the decision at hand.",
    },
  ],
} as const

export const model = {
  index: "05 / Model",
  title: "How the work is chosen, and how it is funded.",
  revenueTitle: "How we generate revenue",
  revenue:
    "Data Qraft operates on a diversified, high-value monetization model, blending productized intelligence with bespoke consulting and elite advisory contracts.",
  revenueItems: [
    "Advisory retainers and project fees from direct B2B and B2G engagements.",
    "Sale of proprietary data, syndicated and special reports, including sector-specific intelligence reports.",
  ],
  selectionTitle: "How we choose our work",
  selection:
    "DQL does not operate as a volume-driven data mill. To maintain brand integrity, operational focus, and alignment with our core values, every potential engagement is filtered through a strict three-pillar assessment.",
  pillars: [
    {
      icon: "scale",
      title: "Ethical Considerations",
      description: "No engagement compromises our independence or integrity.",
    },
    {
      icon: "target",
      title: "Level of Impact",
      description: "Priority goes to work with measurable, meaningful outcomes.",
    },
    {
      icon: "heart",
      title: "Service to Humanity",
      description: "Every mandate must serve people, not just power or profit.",
    },
  ],
} as const

export const clients = {
  index: "06 / Clients",
  title: "Trusted by institutions across sectors.",
  logos: [
    { name: "Eagle Hills", src: "/clients/eagle-hills.png", width: 95, height: 135 },
    { name: "Bank of Agriculture", src: "/clients/bank-of-agriculture.png", width: 183, height: 106 },
    { name: "Beam Suntory", src: "/clients/beam-suntory.png", width: 273, height: 63 },
    { name: "China Minmetals Corporation", src: "/clients/china-minmetals.png", width: 278, height: 76 },
    { name: "Dangote", src: "/clients/dangote.png", width: 160, height: 87 },
    { name: "Pernod Ricard", src: "/clients/pernod-ricard.png", width: 266, height: 109 },
    {
      name: "Nigerian National Petroleum Corporation (NNPC)",
      src: "/clients/nnpc.png",
      width: 210,
      height: 130,
    },
    { name: "Government of Enugu State", src: "/clients/government-of-enugu-state.png", width: 152, height: 147 },
    { name: "National Sugar Development Council", src: "/clients/national-sugar-development-council.png", width: 307, height: 71 },
    { name: "Oil&Gas Middle East", src: "/clients/oil-and-gas-middle-east.png", width: 227, height: 70 },
    { name: "Sohar International", src: "/clients/sohar-international.png", width: 265, height: 95 },
  ],
} as const

export const interestAreas = [
  { value: "market", label: "Market & Consumer Insights" },
  { value: "political", label: "Political Intelligence & Statecraft" },
  { value: "digital", label: "Digital Sentiment & Brand Tracking" },
  { value: "other", label: "Other" },
] as const

export const contact = {
  index: "07 / Contact",
  title: "Request a briefing.",
  subhead: "Tell us what you need to know. Every enquiry is handled in confidence.",
} as const
