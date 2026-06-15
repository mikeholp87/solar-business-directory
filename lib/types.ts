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
  region: string;
  counties: string[];
  postcodePrefixes: string[];
  maxInstallerSlots: number;
  status: TerritoryStatus;
  leadVolume: number;
  activeInstallerCount: number;
  notes?: string;
};

export type Installer = {
  id: string;
  companyName: string;
  slug: string;
  logoUrl: string;
  coverImageUrl: string;
  territoryIds: string[];
  accreditations: {
    mcsNumber?: string;
    busRegistered: boolean;
    reccNumber?: string;
    hiesNumber?: string;
    trustMarkNumber?: string;
    verified: boolean;
  };
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
};

export type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  propertyType: string;
  interests: string[];
  stage: LeadStage;
  territoryId?: string;
  preferredInstallerId?: string;
  assignedInstallerId?: string;
  source: string;
  campaign?: string;
  referralFeeDue: number;
  referralFeePaid: boolean;
  invoiceStatus: "not_invoiced" | "draft" | "sent" | "paid" | "overdue";
  createdAt: string;
};

export type Review = {
  installerId: string;
  customerName: string;
  rating: number;
  reviewText: string;
};
