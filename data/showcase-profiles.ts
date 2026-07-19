export type ShowcaseTier = "free" | "verified" | "featured" | "priority";

export type ShowcaseProfile = {
  tier: ShowcaseTier;
  name: string;
  slug: string;
  label: string;
  price: string;
  description: string;
  about: string;
  rating: string;
  reviews: number;
  projects: number;
  established: string;
  engineers: string;
  response: string;
  installTime: string;
  territory: string;
  phone: string;
  accent: string;
  hero: string;
  images: string[];
  featured?: boolean;
  verified?: boolean;
  priority?: boolean;
  caseStudies: number;
  map: string;
};

const image = (id: string, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;

const gallery = [
  image("photo-1509391366360-2e959784a276"),
  image("photo-1559302504-64aae6ca6b6d"),
  image("photo-1545208942-e7c1c4f4a0c7"),
  image("photo-1592833159155-c62df1b65634"),
  image("photo-1621905251918-48416bd8575a"),
  image("photo-1597683255448-7a0f6aab2a53"),
  image("photo-1592172478746-16d2a1bf2dc0"),
  image("photo-1576618148400-6e9f0e4b2e41"),
  image("photo-1548337138-e87d889cc369"),
  image("photo-1508514177221-188b1cf16e9d"),
  image("photo-1509391366360-2e959784a276"),
  image("photo-1559302504-64aae6ca6b6d"),
];

export const SHOWCASE_PROFILES: Record<ShowcaseTier, ShowcaseProfile> = {
  free: {
    tier: "free", slug: "renew-green-energy", name: "Renew Green Energy Ltd", label: "Free Listing", price: "£0", rating: "4.8", reviews: 3, projects: 48, established: "2021", engineers: "3 local engineers", response: "Within 2 working days", installTime: "1–2 days", territory: "Cheshire & North Wales", phone: "01244 567 890", accent: "green", hero: gallery[0], images: gallery.slice(0, 1), caseStudies: 1, map: "Cheshire & North Wales", verified: false,
    description: "Solar, battery and heat pump specialists serving homeowners across Cheshire and North Wales.",
    about: "Renew Green Energy Ltd is a local renewable energy team built around a simple promise: clear advice, careful installation and support that lasts beyond the day your system goes live. Our engineers help homeowners understand the practical options for generating, storing and using cleaner energy at home. From a first solar PV installation to a complete battery and EV charging set-up, we keep every recommendation grounded in your property, your energy use and your long-term plans. We work with trusted equipment manufacturers and take pride in tidy workmanship, clear communication and a finish that feels right at home. Every project starts with an honest survey and a straightforward quotation, with no hidden extras or pressure to decide. Our small team handles your installation locally and remains available for questions, maintenance and future upgrades. As an independent installer, we can focus on the solution that suits you best, while our workmanship and product guarantees give you confidence for the years ahead.",
  },
  verified: {
    tier: "verified", slug: "ecofuture-renewables", name: "EcoFuture Renewables Ltd", label: "Verified Listing", price: "£99", rating: "4.9", reviews: 12, projects: 186, established: "2017", engineers: "8 local engineers", response: "Within 4 hours", installTime: "1–2 days", territory: "Cheshire, Wirral & North Wales", phone: "01244 681 245", accent: "teal", hero: gallery[1], images: gallery.slice(0, 6), caseStudies: 3, map: "Cheshire, Wirral & North Wales", verified: true,
    description: "MCS certified solar and battery specialists with a friendly local team and a complete aftercare promise.",
    about: "EcoFuture Renewables Ltd helps homeowners take control of their energy with well-designed solar, battery storage, heat pump and EV charging systems. Since 2017, our local engineers have completed hundreds of installations across Cheshire, the Wirral and North Wales. We believe premium service starts before the first panel is fitted: a clear survey, a realistic performance estimate and an explanation of every option in plain English. Our project managers keep you updated from design through commissioning, while our own installation teams take responsibility for the quality of every detail. We specify proven products from leading manufacturers, designed to work together reliably and deliver value over the long term. Accreditations including MCS, RECC, TrustMark and NICEIC reflect the standards we hold ourselves to every day. We can also talk you through flexible finance options, subject to status, so you can choose a system that fits your home and budget. Once your installation is complete, our relationship continues through handover, monitoring, maintenance and responsive aftercare. It is a more considered way to make your home more efficient—and a more reassuring way to invest in renewable energy.",
  },
  featured: {
    tier: "featured", slug: "premier-renewable-solutions", name: "Premier Renewable Solutions Ltd", label: "Featured Installer", price: "£199", rating: "4.9", reviews: 35, projects: 412, established: "2013", engineers: "14 local engineers", response: "Within 90 minutes", installTime: "1–2 days", territory: "Cheshire, North Wales & Merseyside", phone: "01244 772 610", accent: "gold", hero: gallery[2], images: gallery.slice(0, 9), caseStudies: 8, map: "Cheshire, North Wales & Merseyside", verified: true, featured: true,
    description: "Award-winning renewable design and installation, from high-performance solar to whole-home energy systems.",
    about: "Premier Renewable Solutions Ltd designs and installs high-performance energy systems for homeowners who want their property to work harder. Our team has spent more than a decade combining solar PV, intelligent battery storage, heat pumps and EV charging into beautifully considered solutions. We do not sell a one-size-fits-all package. Instead, our surveyors model your energy use, your roof, your future plans and the way you want your home to feel—then our design team builds a system around that picture. With more than 400 completed projects, our engineers bring the experience to solve the details that make a real difference: cable routes that disappear, equipment rooms that stay tidy and controls that are easy to use. From our Chester base, dedicated project managers keep every customer informed and our in-house teams stay accountable from first conversation to final handover. Our MCS, RECC, TrustMark and NICEIC approvals sit alongside manufacturer certifications from Tesla, SolarEdge, Enphase, GivEnergy and more. We offer transparent finance illustrations, comprehensive guarantees and an aftercare service designed to protect your investment. The result is a premium installation that performs beautifully, looks considered and gives you a clearer, more resilient relationship with energy.",
  },
  priority: {
    tier: "priority", slug: "elite-energy-group", name: "Elite Energy Group Ltd", label: "Priority Lead Partner", price: "£499", rating: "5.0", reviews: 78, projects: 1260, established: "2008", engineers: "28 local engineers", response: "Within 12 minutes", installTime: "1 day typical", territory: "Cheshire, North Wales, Merseyside & Lancashire", phone: "01244 880 316", accent: "violet", hero: gallery[3], images: gallery, caseStudies: 12, map: "Cheshire, North Wales, Merseyside & Lancashire", verified: true, featured: true, priority: true,
    description: "The region’s most responsive whole-home energy partner, trusted for complex renewable projects and exceptional care.",
    about: "Elite Energy Group Ltd is a renewable energy partner for homeowners who expect the very best from their investment. Since 2008, our dedicated local teams have delivered more than 1,200 solar, storage, heat pump and EV charging projects across Cheshire, North Wales, Merseyside and Lancashire. We pair the technical depth of a specialist energy company with the care and accountability of a genuinely local business. Every project is led by a named advisor, designed around your property and delivered by our own accredited engineers—never handed to an unknown subcontractor. Our specialists can integrate solar generation, battery storage, low-carbon heating, EV charging and smart energy controls into one coherent system, with live monitoring and a handover that leaves you feeling completely in control. We specify premium equipment from the manufacturers we trust, and we stand behind our work with robust guarantees, dedicated aftercare and rapid support when you need it. As an MCS, RECC, TrustMark and NICEIC approved installer, our standards are visible at every stage. Our Priority Lead Partner service reflects the same standards we bring to installations: fast response, clear communication, reliable follow-through and a relationship that continues for the life of your system. A cleaner, more independent energy future deserves an exceptional team to deliver it.",
  },
};

export const showcaseTiers: ShowcaseTier[] = ["free", "verified", "featured", "priority"];

