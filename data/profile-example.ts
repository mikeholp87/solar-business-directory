export const EXAMPLE_COMPANY = {
  name: "GreenVolt Renewables Ltd",
  slug: "greenvolt-renewables-ltd",
  badge: "Approved Renewable Installer",
  featured: true,
  rating: 4.9,
  reviewCount: 127,
  location: "Chester",
  coverage:
    "North Wales, Chester, Cheshire, Wirral, Liverpool and surrounding areas",
  tagline:
    "Approved solar, battery and heat pump installer covering North Wales, Chester and the Wirral.",
  trustStatement:
    "MCS certified renewable energy specialists helping homeowners cut energy bills with trusted solar, battery, heat pump and EV charging installations.",
  phone: "01244 567890",
  email: "hello@greenvoltrenewables.co.uk",
  website: "https://greenvoltrenewables.co.uk",
  stats: [
    { value: "1,200+", label: "Installations completed" },
    { value: "10+", label: "Years trading" },
    { value: "£5m", label: "Public liability cover" },
    { value: "24hr", label: "Enquiry response target" },
  ],
  accreditations: [
    { label: "MCS Certified", icon: "ShieldCheck" },
    { label: "RECC Member", icon: "Award" },
    { label: "NICEIC Approved", icon: "CheckCircle" },
    { label: "Fully Insured", icon: "Shield" },
    { label: "Verified by The Renewable Directory", icon: "BadgeCheck" },
    { label: "10+ Years Experience", icon: "Clock" },
  ],
  about:
    "GreenVolt Renewables Ltd is a trusted renewable energy installer specialising in Solar PV, battery storage, EV charging and air source heat pumps. The company works with homeowners, landlords and small commercial clients, offering design, installation, certification and aftercare from one experienced team.",
  aboutBullets: [
    "Free home surveys and clear recommendations",
    "MCS-compliant installations",
    "Battery storage and smart energy advice",
    "Full handover, documentation and aftercare",
    "Local team covering North Wales, Cheshire and the Wirral",
  ],
  whyChoose: [
    { title: "Clear communication", desc: "Honest, transparent advice from first contact to aftercare." },
    { title: "Tidy installations", desc: "Work carried out to a high standard with minimal disruption." },
    { title: "Trusted accreditations", desc: "MCS, RECC and NICEIC approved for full peace of mind." },
    { title: "Local aftercare", desc: "A local team who are nearby if you ever need support." },
    { title: "Verified reviews", desc: "Over 120 independent, verified homeowner recommendations." },
  ],
  services: [
    {
      name: "Solar Panel Installation",
      icon: "Sun",
      desc: "Design and installation of efficient Solar PV systems to help reduce electricity bills and improve home energy independence.",
    },
    {
      name: "Battery Storage",
      icon: "BatteryCharging",
      desc: "Store surplus solar energy and use more of the power your system generates.",
    },
    {
      name: "Air Source Heat Pumps",
      icon: "Thermometer",
      desc: "Low-carbon heating solutions designed for efficient home comfort.",
    },
    {
      name: "EV Chargers",
      icon: "Zap",
      desc: "Smart home EV charger installation for convenient overnight charging.",
    },
    {
      name: "Solar Maintenance",
      icon: "Wrench",
      desc: "System checks, cleaning guidance and performance support for existing solar installations.",
    },
    {
      name: "Inverter Upgrades",
      icon: "ArrowUpCircle",
      desc: "Replace or upgrade old inverters to improve reliability and system performance.",
    },
    {
      name: "Commercial Solar",
      icon: "Building2",
      desc: "Solar solutions for small businesses, landlords and commercial properties.",
    },
    {
      name: "Grant-Funded Installations",
      icon: "FileText",
      desc: "Support for eligible homeowners looking for renewable energy funding options.",
    },
  ],
  reviews: [
    {
      name: "Sarah Thompson",
      location: "Chester",
      service: "Solar PV and Battery Storage",
      rating: 5,
      date: "March 2026",
      text: "Excellent from survey to installation. The team explained everything clearly and the battery system is already reducing our bills.",
    },
    {
      name: "David Hughes",
      location: "Wrexham",
      service: "Solar Panel Installation",
      rating: 5,
      date: "February 2026",
      text: "Professional, tidy and reliable. The MCS paperwork was handled quickly and the handover was clear.",
    },
    {
      name: "Emma Carter",
      location: "Wirral",
      service: "EV Charger",
      rating: 5,
      date: "January 2026",
      text: "Great service from start to finish. The charger was installed neatly and everything was shown to us before the team left.",
    },
    {
      name: "Mark Williams",
      location: "North Wales",
      service: "Air Source Heat Pump",
      rating: 5,
      date: "December 2025",
      text: "Helpful advice, clear pricing and a very tidy installation. We felt looked after throughout the process.",
    },
    {
      name: "Claire Evans",
      location: "Cheshire",
      service: "Battery Storage",
      rating: 5,
      date: "November 2025",
      text: "The battery was installed within a week of the survey. Excellent communication and aftercare support.",
    },
    {
      name: "James Roberts",
      location: "Liverpool",
      service: "Solar PV and EV Charger",
      rating: 5,
      date: "October 2025",
      text: "Seamless process from quote through to installation. Both the solar panels and EV charger work brilliantly.",
    },
  ],
  projects: [
    {
      type: "Roof Solar PV Installation",
      location: "Chester",
      system: "5.2kW Solar PV with 10kWh battery",
    },
    {
      type: "Battery and Inverter Upgrade",
      location: "Wrexham",
      system: "Hybrid inverter with 9.5kWh battery storage",
    },
    {
      type: "Air Source Heat Pump Installation",
      location: "North Wales",
      system: "Low-carbon heating upgrade for detached home",
    },
    {
      type: "EV Charger Installation",
      location: "Wirral",
      system: "Smart 7kW home EV charger",
    },
    {
      type: "Ground-Mounted Solar Array",
      location: "Cheshire",
      system: "12kW ground-mounted solar system",
    },
  ],
  directoryBenefits: [
    {
      title: "Find verified installers",
      desc: "All installers are MCS certified with visible accreditations.",
      icon: "ShieldCheck",
    },
    {
      title: "Compare local companies",
      desc: "See coverage areas and services at a glance before you enquire.",
      icon: "Search",
    },
    {
      title: "Read homeowner reviews",
      desc: "Real reviews from homeowners who have used the installer.",
      icon: "Star",
    },
    {
      title: "Avoid rogue traders",
      desc: "Every listed installer is checked for recognised certifications.",
      icon: "AlertTriangle",
    },
    {
      title: "Request free quotes",
      desc: "One simple form connects you with trusted local installers.",
      icon: "Send",
    },
    {
      title: "Recognised accreditations",
      desc: "Only installers with proper industry credentials are listed.",
      icon: "BadgeCheck",
    },
  ],
} as const;
