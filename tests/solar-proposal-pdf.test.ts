import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { createSolarProposalPdf } from "@/lib/solar-proposal-pdf";
import { calculateSolarProposal, type SolarProposalInput } from "@/lib/solar-proposal";
import { writeFileSync, mkdirSync } from "node:fs";

const input: SolarProposalInput & { firstName: string; lastName: string; email: string } = {
  firstName: "Morgan", lastName: "Smith", email: "morgan@example.com", postcode: "IM4 6EE", address: "1 Highfield Drive, Baldrine",
  propertyType: "detached", ownership: "yes", roofType: "pitched", roofCovering: "tile", shading: "minimal", orientation: "south",
  consumptionMethod: "annual", annualConsumption: 4000, futureLoads: ["ev"], batteryPreference: "self_consumption", objective: "reduce_bills"
};

describe("solar proposal PDF", () => {
  it("creates a readable multi-page PDF", async () => {
    const bytes = await createSolarProposalPdf(input, calculateSolarProposal(input), "SD-2026-TEST1234");
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBe(6);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    if (process.env.RENDER_PDF === "1") {
      mkdirSync("tmp/pdfs", { recursive: true });
      writeFileSync("tmp/pdfs/solar-proposal-test.pdf", bytes);
    }
  });
});
