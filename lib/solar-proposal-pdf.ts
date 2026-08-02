import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { SolarProposal, SolarProposalInput } from "@/lib/solar-proposal";

const navy = rgb(16 / 255, 42 / 255, 67 / 255);
const green = rgb(0, 166 / 255, 81 / 255);
const paper = rgb(248 / 255, 246 / 255, 240 / 255);
const ink = rgb(31 / 255, 45 / 255, 54 / 255);
const muted = rgb(92 / 255, 105 / 255, 113 / 255);
const line = rgb(218 / 255, 222 / 255, 220 / 255);

type PdfInput = SolarProposalInput & { firstName: string; lastName: string; email: string };

export async function createSolarProposalPdf(input: PdfInput, proposal: SolarProposal, reference: string) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = [
    coverPage(pdf, regular, bold, input, proposal, reference),
    summaryPage(pdf, regular, bold, input, proposal),
    propertyPage(pdf, regular, bold, input),
    systemPage(pdf, regular, bold, input, proposal),
    savingsPage(pdf, regular, bold, proposal),
    nextStepsPage(pdf, regular, bold, input, proposal)
  ];

  pages.forEach((page, index) => footer(page, regular, index + 1, pages.length));
  return pdf.save();
}

function coverPage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, input: PdfInput, proposal: SolarProposal, reference: string) {
  const page = pdf.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: navy });
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 14, color: green });
  page.drawText("SOLAR DIRECT", { x: 52, y: 765, size: 14, font: bold, color: green });
  page.drawText("Your personalised", { x: 52, y: 605, size: 39, font: bold, color: rgb(1, 1, 1) });
  page.drawText("solar proposal", { x: 52, y: 558, size: 39, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Preliminary system design and savings forecast", { x: 54, y: 520, size: 14, font: regular, color: rgb(1, 1, 1), opacity: 0.72 });
  page.drawRectangle({ x: 52, y: 294, width: 491, height: 142, color: paper });
  page.drawText("PREPARED EXCLUSIVELY FOR", { x: 75, y: 398, size: 9, font: bold, color: green });
  page.drawText(`${input.firstName} ${input.lastName}`, { x: 75, y: 361, size: 25, font: bold, color: ink });
  drawParagraph(page, input.address, 75, 333, 410, regular, 12, muted, 17);
  page.drawText(`Reference ${reference}`, { x: 54, y: 102, size: 10, font: regular, color: rgb(1, 1, 1), opacity: 0.7 });
  page.drawText(`Indicative system: ${proposal.solarCapacityKwp} kWp solar / ${proposal.batteryCapacityKwh || 0} kWh battery`, { x: 54, y: 80, size: 10, font: regular, color: rgb(1, 1, 1), opacity: 0.7 });
  return page;
}

function summaryPage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, input: PdfInput, proposal: SolarProposal) {
  const page = basePage(pdf, regular, bold, "Executive summary", "A clear starting point for your solar decision.");
  drawParagraph(page, `Based on the information supplied for ${input.address}, we recommend an approximately ${proposal.solarCapacityKwp} kWp solar array with ${proposal.batteryCapacityKwh || "no"} kWh of battery storage. This configuration is intended to reduce grid usage, capture surplus solar electricity and provide more protection against future electricity-price increases.`, 52, 680, 491, regular, 12, ink, 19);
  statCard(page, 52, 485, 235, 112, "Recommended solar", `${proposal.solarCapacityKwp} kWp`, regular, bold);
  statCard(page, 307, 485, 236, 112, "Battery storage", proposal.batteryCapacityKwh ? `${proposal.batteryCapacityKwh} kWh` : "Not included", regular, bold);
  statCard(page, 52, 350, 235, 112, "Estimated first-year saving", `£${proposal.firstYearSaving.toLocaleString()}`, regular, bold);
  statCard(page, 307, 350, 236, 112, "Indicative installed price", `£${proposal.priceRange.min.toLocaleString()} - £${proposal.priceRange.max.toLocaleString()}`, regular, bold);
  page.drawText("Your recommendation", { x: 52, y: 280, size: 16, font: bold, color: navy });
  drawBulletList(page, [
    `${proposal.panelCount} x ${proposal.panelWattage} W solar panels`,
    `${proposal.annualGenerationKwh.toLocaleString()} kWh estimated annual generation`,
    `${proposal.paybackYears} year indicative payback period`,
    "Complimentary remote technical survey as the next step"
  ], 52, 250, regular, 11);
  return page;
}

function propertyPage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, input: PdfInput) {
  const page = basePage(pdf, regular, bold, "Property assessment", "The starting assumptions used for this preliminary design.");
  const rows = [
    ["Property address", input.address], ["Postcode", input.postcode.toUpperCase()], ["Property type", input.propertyType],
    ["Ownership", input.ownership], ["Roof type", input.roofType], ["Roof covering", input.roofCovering],
    ["Roof orientation", input.orientation], ["Shading", input.shading]
  ];
  rows.forEach(([label, value], index) => {
    const y = 682 - index * 48;
    page.drawLine({ start: { x: 52, y: y - 12 }, end: { x: 543, y: y - 12 }, thickness: 1, color: line });
    page.drawText(label, { x: 52, y, size: 10, font: bold, color: muted });
    drawParagraph(page, value.replaceAll("_", " "), 220, y, 315, regular, 11, ink, 15);
  });
  noteBox(page, 52, 214, 491, 86, "Technical verification", "Final panel quantity, roof suitability, structural requirements and price are subject to a remote or physical technical survey.", regular, bold);
  return page;
}

function systemPage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, input: PdfInput, proposal: SolarProposal) {
  const page = basePage(pdf, regular, bold, "Recommended solar system", "A practical preliminary configuration based on your energy profile.");
  statCard(page, 52, 520, 150, 116, "Panel quantity", `${proposal.panelCount}`, regular, bold);
  statCard(page, 222, 520, 150, 116, "Panel wattage", `${proposal.panelWattage} W`, regular, bold);
  statCard(page, 392, 520, 151, 116, "Array size", `${proposal.solarCapacityKwp} kWp`, regular, bold);
  const rows = [["Estimated annual output", `${proposal.annualGenerationKwh.toLocaleString()} kWh`], ["Inverter", "Hybrid inverter - final model subject to survey"], ["Mounting", "Roof mounting system - final specification subject to survey"], ["Monitoring", "System monitoring application"], ["Battery", proposal.batteryCapacityKwh ? `${proposal.batteryCapacityKwh} kWh usable capacity` : "No battery selected"]];
  rows.forEach(([label, value], index) => {
    const y = 460 - index * 43;
    page.drawText(label, { x: 52, y, size: 10, font: bold, color: muted });
    drawParagraph(page, value, 220, y, 320, regular, 11, ink, 15);
    page.drawLine({ start: { x: 52, y: y - 13 }, end: { x: 543, y: y - 13 }, thickness: 1, color: line });
  });
  page.drawText("Battery purpose", { x: 52, y: 218, size: 15, font: bold, color: navy });
  drawParagraph(page, input.batteryPreference === "none" ? "Solar-only configuration focused on reducing daytime grid purchases." : "The battery is intended to store surplus solar electricity for use later in the day and increase self-consumption.", 52, 192, 491, regular, 11, ink, 17);
  return page;
}

function savingsPage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, proposal: SolarProposal) {
  const page = basePage(pdf, regular, bold, "Energy and savings forecast", "Indicative figures using conservative assumptions.");
  statCard(page, 52, 532, 150, 112, "Year 1", `£${proposal.firstYearSaving.toLocaleString()}`, regular, bold);
  statCard(page, 222, 532, 150, 112, "Year 10", `£${proposal.tenYearSaving.toLocaleString()}`, regular, bold);
  statCard(page, 392, 532, 151, 112, "Year 20", `£${proposal.twentyYearSaving.toLocaleString()}`, regular, bold);
  page.drawText("How the estimate is formed", { x: 52, y: 470, size: 17, font: bold, color: navy });
  drawBulletList(page, [
    `${proposal.annualGenerationKwh.toLocaleString()} kWh estimated annual solar generation`,
    "Solar electricity used directly in the home reduces grid purchases",
    "Battery storage increases the share of generation used on site",
    "Remaining surplus is modelled as exported electricity",
    "Savings use an assumed blended purchase rate of £0.30/kWh and export rate of £0.075/kWh"
  ], 52, 440, regular, 11);
  noteBox(page, 52, 174, 491, 95, "Important", "Savings depend on your usage pattern, tariffs, weather, system performance and future energy prices. These figures are estimates and are not guaranteed.", regular, bold);
  return page;
}

function nextStepsPage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, input: PdfInput, proposal: SolarProposal) {
  const page = basePage(pdf, regular, bold, "Your next steps", "Move from an indicative design to a confirmed quotation.");
  const steps = [["1", "Book your complimentary remote survey", "We review the roof, access, electrical details and your priorities."], ["2", "Confirm the final system design", "We refine the panel layout, battery choice and installation specification."], ["3", "Receive your fixed quotation", "You can then decide whether Solar Direct is the right installer for your home."]];
  steps.forEach(([number, title, body], index) => {
    const y = 610 - index * 130;
    page.drawCircle({ x: 80, y: y + 12, size: 24, color: green });
    page.drawText(number, { x: 76, y: y + 5, size: 14, font: bold, color: rgb(1, 1, 1) });
    page.drawText(title, { x: 125, y: y + 16, size: 15, font: bold, color: navy });
    drawParagraph(page, body, 125, y - 6, 390, regular, 11, muted, 17);
  });
  noteBox(page, 52, 175, 491, 110, "Book your remote survey", `Reply to your proposal email or contact Solar Direct to arrange the next step for ${input.postcode.toUpperCase()}. Your reference is ${proposal.solarCapacityKwp} kWp / ${input.postcode.toUpperCase()}.`, regular, bold);
  page.drawText("Solar Direct Limited", { x: 52, y: 112, size: 12, font: bold, color: navy });
  page.drawText("EMSCOTE, HIGHFIELD DRIVE, BALDRINE, IM4 6EE, Isle of Man", { x: 52, y: 92, size: 9, font: regular, color: muted });
  return page;
}

function basePage(pdf: PDFDocument, regular: PDFFont, bold: PDFFont, title: string, subtitle: string) {
  const page = pdf.addPage([595, 842]);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: paper });
  page.drawRectangle({ x: 0, y: 828, width: 595, height: 14, color: green });
  page.drawText("SOLAR DIRECT", { x: 52, y: 778, size: 11, font: bold, color: green });
  page.drawText(title, { x: 52, y: 725, size: 28, font: bold, color: navy });
  page.drawText(subtitle, { x: 52, y: 697, size: 11, font: regular, color: muted });
  return page;
}

function footer(page: PDFPage, font: PDFFont, number: number, total: number) {
  page.drawLine({ start: { x: 52, y: 49 }, end: { x: 543, y: 49 }, thickness: 1, color: line });
  page.drawText("Indicative proposal - subject to technical assessment", { x: 52, y: 30, size: 8, font, color: muted });
  page.drawText(`${number} / ${total}`, { x: 508, y: 30, size: 8, font, color: muted });
}

function statCard(page: PDFPage, x: number, y: number, width: number, height: number, label: string, value: string, regular: PDFFont, bold: PDFFont) {
  page.drawRectangle({ x, y, width, height, color: rgb(1, 1, 1), borderColor: line, borderWidth: 1 });
  page.drawText(label.toUpperCase(), { x: x + 15, y: y + height - 26, size: 8, font: bold, color: green });
  drawParagraph(page, value, x + 15, y + height - 57, width - 30, bold, 18, navy, 23);
  page.drawText("estimated", { x: x + 15, y: y + 15, size: 8, font: regular, color: muted });
}

function noteBox(page: PDFPage, x: number, y: number, width: number, height: number, title: string, body: string, regular: PDFFont, bold: PDFFont) {
  page.drawRectangle({ x, y, width, height, color: rgb(232 / 255, 247 / 255, 238 / 255), borderColor: rgb(185 / 255, 224 / 255, 199 / 255), borderWidth: 1 });
  page.drawText(title, { x: x + 17, y: y + height - 25, size: 11, font: bold, color: navy });
  drawParagraph(page, body, x + 17, y + height - 46, width - 34, regular, 10, ink, 15);
}

function drawBulletList(page: PDFPage, items: string[], x: number, y: number, font: PDFFont, size: number) {
  items.forEach((item, index) => {
    const rowY = y - index * 29;
    page.drawCircle({ x: x + 4, y: rowY + 4, size: 3, color: green });
    drawParagraph(page, item, x + 17, rowY, 460, font, size, ink, 15);
  });
}

function drawParagraph(page: PDFPage, text: string, x: number, y: number, width: number, font: PDFFont, size: number, color: ReturnType<typeof rgb>, lineHeight: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let lineText = "";
  for (const word of words) {
    const candidate = lineText ? `${lineText} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && lineText) {
      lines.push(lineText);
      lineText = word;
    } else lineText = candidate;
  }
  if (lineText) lines.push(lineText);
  lines.forEach((lineText, index) => page.drawText(lineText, { x, y: y - index * lineHeight, size, font, color }));
  return lines.length;
}
