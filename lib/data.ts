import type { Installer, Lead, Review, Territory } from "./types";

export const territories: Territory[] = [
  { id: "north-wales", name: "North Wales", region: "Wales", counties: ["Gwynedd", "Conwy", "Denbighshire", "Flintshire", "Wrexham", "Anglesey"], postcodePrefixes: ["LL", "CH5", "CH6", "CH7", "CH8"], maxInstallerSlots: 3, status: "limited", leadVolume: 86, activeInstallerCount: 2 },
  { id: "south-wales", name: "South Wales", region: "Wales", counties: ["Cardiff", "Swansea", "Newport", "Bridgend", "Vale of Glamorgan"], postcodePrefixes: ["CF", "SA", "NP"], maxInstallerSlots: 3, status: "priority", leadVolume: 128, activeInstallerCount: 1 },
  { id: "mid-wales", name: "Mid Wales", region: "Wales", counties: ["Powys", "Ceredigion"], postcodePrefixes: ["SY", "LD"], maxInstallerSlots: 3, status: "available", leadVolume: 34, activeInstallerCount: 1 },
  { id: "north-west-england", name: "North West England", region: "England", counties: ["Greater Manchester", "Merseyside", "Lancashire", "Cheshire"], postcodePrefixes: ["M", "L", "WA", "WN", "PR", "BB", "BL", "OL", "SK"], maxInstallerSlots: 3, status: "full", leadVolume: 146, activeInstallerCount: 3 },
  { id: "yorkshire", name: "Yorkshire", region: "England", counties: ["West Yorkshire", "South Yorkshire", "North Yorkshire", "East Riding"], postcodePrefixes: ["LS", "YO", "HU", "HD", "HX", "S", "BD", "WF"], maxInstallerSlots: 3, status: "available", leadVolume: 72, activeInstallerCount: 1 },
  { id: "midlands", name: "Midlands", region: "England", counties: ["West Midlands", "Nottinghamshire", "Derbyshire", "Leicestershire", "Warwickshire"], postcodePrefixes: ["B", "CV", "DE", "LE", "NG", "WS", "WV"], maxInstallerSlots: 3, status: "limited", leadVolume: 91, activeInstallerCount: 2 },
  { id: "south-west-england", name: "South West England", region: "England", counties: ["Devon", "Cornwall", "Somerset", "Dorset", "Gloucestershire"], postcodePrefixes: ["EX", "PL", "TR", "TA", "BS", "GL"], maxInstallerSlots: 3, status: "available", leadVolume: 65, activeInstallerCount: 1 },
  { id: "south-east-england", name: "South East England", region: "England", counties: ["Kent", "Surrey", "Sussex", "Hampshire", "Berkshire"], postcodePrefixes: ["GU", "RH", "BN", "TN", "ME", "RG", "SO"], maxInstallerSlots: 3, status: "available", leadVolume: 99, activeInstallerCount: 1 },
  { id: "london", name: "London", region: "England", counties: ["Greater London"], postcodePrefixes: ["E", "EC", "N", "NW", "SE", "SW", "W", "WC"], maxInstallerSlots: 3, status: "priority", leadVolume: 156, activeInstallerCount: 2 },
  { id: "scotland", name: "Scotland", region: "Scotland", counties: ["Central Belt", "Highlands", "Aberdeenshire", "Borders"], postcodePrefixes: ["G", "EH", "AB", "DD", "FK", "IV", "PA", "PH"], maxInstallerSlots: 3, status: "available", leadVolume: 58, activeInstallerCount: 1 },
  { id: "isle-of-man", name: "Isle of Man", region: "Isle of Man", counties: ["Isle of Man"], postcodePrefixes: ["IM"], maxInstallerSlots: 3, status: "available", leadVolume: 12, activeInstallerCount: 0 }
];

export const installers: Installer[] = [
  {
    id: "cambrian-eco-heat",
    companyName: "Cambrian Eco Heat Ltd",
    slug: "cambrian-eco-heat",
    logoUrl: "CE",
    coverImageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1800&auto=format&fit=crop",
    territoryIds: ["north-wales", "mid-wales"],
    accreditations: { mcsNumber: "MCS-984512", busRegistered: true, reccNumber: "RECC-20134", trustMarkNumber: "TRM-77281", verified: true },
    services: ["Air source heat pumps", "Heat loss calculations", "BUS applications", "Solar PV"],
    description: "Welsh renewables contractor specialising in low-carbon heating upgrades for rural and coastal homes.",
    areasCovered: ["Bangor", "Conwy", "Wrexham", "Aberystwyth"],
    monthlyInstallCapacity: 14,
    surveyTurnaroundDays: 5,
    warranty: "7 year workmanship warranty with manufacturer-backed equipment cover.",
    rating: 4.8,
    status: "active",
    subscriptionStatus: "active",
    leadPrice: 38,
    gallery: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1400&auto=format&fit=crop"]
  },
  {
    id: "valley-renewables",
    companyName: "Valley Renewables Group",
    slug: "valley-renewables-group",
    logoUrl: "VR",
    coverImageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1800&auto=format&fit=crop",
    territoryIds: ["south-wales"],
    accreditations: { mcsNumber: "MCS-441209", busRegistered: true, hiesNumber: "HIES-88301", verified: true },
    services: ["Air source heat pumps", "Battery storage", "Technical surveys", "Finance available"],
    description: "Cardiff-based heating and electrical team delivering funded heat pump and storage projects.",
    areasCovered: ["Cardiff", "Newport", "Swansea", "Bridgend"],
    monthlyInstallCapacity: 18,
    surveyTurnaroundDays: 4,
    warranty: "Insurance-backed workmanship warranty available.",
    rating: 4.7,
    status: "active",
    subscriptionStatus: "offline_active",
    leadPrice: 42,
    gallery: ["https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1400&auto=format&fit=crop"]
  },
  {
    id: "northline-heat",
    companyName: "Northline Heat Partners",
    slug: "northline-heat-partners",
    logoUrl: "NH",
    coverImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1800&auto=format&fit=crop",
    territoryIds: ["north-west-england"],
    accreditations: { mcsNumber: "MCS-120773", busRegistered: true, reccNumber: "RECC-77190", verified: true },
    services: ["Air source heat pumps", "Ground source heat pumps", "Heat loss calculations"],
    description: "Regional low-carbon heating partner for Manchester, Liverpool and Lancashire homes.",
    areasCovered: ["Manchester", "Liverpool", "Preston", "Warrington"],
    monthlyInstallCapacity: 22,
    surveyTurnaroundDays: 6,
    warranty: "5 year workmanship warranty.",
    rating: 4.6,
    status: "active",
    subscriptionStatus: "active",
    leadPrice: 45,
    gallery: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop"]
  },
  {
    id: "mercia-home-energy",
    companyName: "Mercia Home Energy",
    slug: "mercia-home-energy",
    logoUrl: "MH",
    coverImageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1800&auto=format&fit=crop",
    territoryIds: ["midlands"],
    accreditations: { mcsNumber: "MCS-556712", busRegistered: true, trustMarkNumber: "TRM-33492", verified: true },
    services: ["Air source heat pumps", "Solar PV", "Battery storage", "Finance available"],
    description: "Midlands installer combining heat pump design, PV, and battery storage for whole-home upgrades.",
    areasCovered: ["Birmingham", "Coventry", "Leicester", "Nottingham"],
    monthlyInstallCapacity: 16,
    surveyTurnaroundDays: 7,
    warranty: "Manufacturer warranties plus 5 year workmanship warranty.",
    rating: 4.5,
    status: "active",
    subscriptionStatus: "active",
    leadPrice: 40,
    gallery: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop"]
  },
  {
    id: "thames-clean-heat",
    companyName: "Thames Clean Heat",
    slug: "thames-clean-heat",
    logoUrl: "TC",
    coverImageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1800&auto=format&fit=crop",
    territoryIds: ["london", "south-east-england"],
    accreditations: { mcsNumber: "MCS-700941", busRegistered: true, reccNumber: "RECC-44087", hiesNumber: "HIES-39102", verified: true },
    services: ["Air source heat pumps", "Technical surveys", "BUS applications", "Warranty packages"],
    description: "London and South East heating specialist focused on compact homes, planning constraints and fast survey turnaround.",
    areasCovered: ["London", "Croydon", "Guildford", "Reading"],
    monthlyInstallCapacity: 20,
    surveyTurnaroundDays: 3,
    warranty: "Extended warranty options available.",
    rating: 4.9,
    status: "active",
    subscriptionStatus: "active",
    leadPrice: 55,
    gallery: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1400&auto=format&fit=crop"]
  },
  {
    id: "caledonia-heatworks",
    companyName: "Caledonia Heatworks",
    slug: "caledonia-heatworks",
    logoUrl: "CH",
    coverImageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1800&auto=format&fit=crop",
    territoryIds: ["scotland"],
    accreditations: { mcsNumber: "MCS-612908", busRegistered: true, verified: true },
    services: ["Air source heat pumps", "Ground source heat pumps", "Heat loss calculations"],
    description: "Scottish installer experienced with colder-climate design, rural properties and larger emitters.",
    areasCovered: ["Glasgow", "Edinburgh", "Stirling", "Perth"],
    monthlyInstallCapacity: 12,
    surveyTurnaroundDays: 8,
    warranty: "5 year workmanship warranty.",
    rating: 4.6,
    status: "active",
    subscriptionStatus: "active",
    leadPrice: 39,
    gallery: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1400&auto=format&fit=crop"]
  }
];

export const reviews: Review[] = [
  { installerId: "cambrian-eco-heat", customerName: "Rhian P.", rating: 5, reviewText: "Clear survey, tidy installation and good support with the grant paperwork." },
  { installerId: "valley-renewables", customerName: "Martin D.", rating: 5, reviewText: "They explained the running costs honestly and handled the BUS application." },
  { installerId: "thames-clean-heat", customerName: "Asha K.", rating: 5, reviewText: "Fast survey and a sensible design for a London terrace." }
];

export const leads: Lead[] = Array.from({ length: 20 }).map((_, index) => {
  const territory = territories[index % territories.length];
  const installer = installers.find((item) => item.territoryIds.includes(territory.id));
  const stages = ["new_enquiry", "contacted", "qualified", "survey_booked", "bus_accepted", "installation_completed"] as const;
  return {
    id: `lead-${index + 1}`,
    firstName: ["Ella", "James", "Priya", "Gareth", "Nia"][index % 5],
    lastName: ["Morgan", "Taylor", "Patel", "Evans", "Jones"][index % 5],
    email: `homeowner${index + 1}@example.com`,
    phone: "07000 000000",
    postcode: `${territory.postcodePrefixes[0]}${index + 1} 1AA`,
    propertyType: ["Detached", "Semi-detached", "Terraced", "Bungalow"][index % 4],
    interests: ["Air source heat pump", "Boiler Upgrade Scheme"],
    stage: stages[index % stages.length],
    territoryId: territory.id,
    assignedInstallerId: installer?.id,
    source: "UKSD directory",
    campaign: index % 2 === 0 ? "BUS Wales search" : "Installer profile CTA",
    referralFeeDue: index % 5 === 0 ? 1250 : 0,
    referralFeePaid: false,
    invoiceStatus: index % 5 === 0 ? "draft" : "not_invoiced",
    createdAt: new Date(Date.now() - index * 86400000).toISOString()
  };
});

export const leadStages = [
  "New enquiry",
  "Contacted",
  "Qualified",
  "Survey booked",
  "Survey completed",
  "Quote issued",
  "BUS application submitted",
  "BUS accepted",
  "Installation booked",
  "Installation completed",
  "Lost",
  "Not eligible"
];

export const serviceFilters = ["MCS accredited", "BUS registered", "Air source heat pumps", "Solar available", "Battery storage available", "Finance available", "Survey availability"];
