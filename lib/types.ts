export type InstallerStatus = "pending" | "approved" | "active" | "suspended" | "cancelled";
export type TerritoryStatus = "available" | "limited" | "full" | "priority";
export type LeadStage =
  | "new_enquiry"
  | "contacted"
  | "qualified"
  | "survey_booked"
  | "survey_completed"
  | "quote_issued"
  | "bus_application_submitted"
  | "bus_accepted"
  | "installation_booked"
  | "installation_completed"
  | "lost"
  | "not_eligible";

export type Territory = {
  id: string;
  name: string;
  slug?: string;
  region: string;
  counties: string[];
  postcodePrefixes: string[];
  maxInstallerSlots: number;
  status: TerritoryStatus;
  priority?: boolean;
  leadVolume: number;
  activeInstallerCount: number;
  notes?: string;
};

export type Installer = {
  id: string;
  companyName: string;
  slug: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  companyNumber?: string;
  vatNumber?: string;
  logoUrl: string;
  coverImageUrl: string;
  mcsNumber?: string;
  reccNumber?: string;
  hiesNumber?: string;
  trustmarkNumber?: string;
  territoryIds: string[];
  accreditations: {
    mcsNumber?: string;
    busRegistered: boolean;
    reccNumber?: string;
    hiesNumber?: string;
    trustMarkNumber?: string;
    verified: boolean;
  };
  busRegistered?: boolean;
  accreditationsVerified?: boolean;
  services: string[];
  description: string;
  areasCovered: string[];
  monthlyInstallCapacity: number;
  surveyTurnaroundDays: number;
  warranty: string;
  rating: number;
  status: InstallerStatus;
  subscriptionStatus: "trialing" | "active" | "past_due" | "offline_active" | "cancelled";
  leadPrice?: number;
  gallery: string[];
  internalNotes?: string;
  leadCount?: number;
  installerFeeType?: "monthly_directory" | "pay_per_lead" | "pay_per_install" | "hybrid";
  referralFeeTotal?: number;
  busAcceptanceFee?: number;
  completionFee?: number;
  vatApplicable?: boolean;
  maximumMonthlyLeadAllocation?: number;
};

export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  address?: string;
  homeownerStatus?: boolean;
  currentHeatingSource?: string;
  monthlyBill?: string;
  propertyType: string;
  bedrooms?: number;
  bestTimeToContact?: string;
  interests: string[];
  consentContact?: boolean;
  consentMarketing?: boolean;
  gdprAcceptance?: boolean;
  stage: LeadStage;
  territoryId?: string;
  preferredInstallerId?: string;
  assignedInstallerId?: string;
  source: string;
  campaign?: string;
  referralFeeDue: number;
  referralFeePaid: boolean;
  invoiceStatus: "not_invoiced" | "draft" | "sent" | "paid" | "overdue";
  leadValue?: number;
  leadCost?: number;
  busAcceptancePaymentDue?: number;
  completionPaymentDue?: number;
  vatApplicable?: boolean;
  surveyDate?: string;
  busApplicationDate?: string;
  busAcceptanceDate?: string;
  installDate?: string;
  completionDate?: string;
  notes?: string;
  createdAt: string;
};

export type Review = {
  id?: string;
  installerId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  approved?: boolean;
};

export type DocumentRecord = {
  id: string;
  installerId: string;
  documentType: string;
  fileUrl: string;
  verified: boolean;
  uploadedAt: string;
};

export type TerritoryRequest = {
  id: string;
  installerId: string;
  territoryId: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
};
