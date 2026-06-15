import { z } from "zod";

export const leadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  postcode: z.string(),
  propertyType: z.string(),
  interests: z.array(z.string()),
  stage: z.enum([
    "new_enquiry",
    "contacted",
    "qualified",
    "survey_booked",
    "survey_completed",
    "quote_issued",
    "bus_application_submitted",
    "bus_accepted",
    "installation_booked",
    "installation_completed",
    "lost",
    "not_eligible"
  ])
});
