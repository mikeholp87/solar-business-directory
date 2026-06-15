export const locationPages: Record<string, { label: string; territoryIds: string[]; intro: string }> = {
  wales: { label: "Wales", territoryIds: ["north-wales", "south-wales", "mid-wales"], intro: "Compare BUS and MCS approved heat pump installers covering Welsh homes, including rural properties, coastal areas and urban retrofit projects." },
  "north-wales": { label: "North Wales", territoryIds: ["north-wales"], intro: "Find approved heat pump installers covering North Wales towns, counties and LL postcode areas." },
  "south-wales": { label: "South Wales", territoryIds: ["south-wales"], intro: "Search approved installers for Cardiff, Swansea, Newport, Bridgend and surrounding South Wales areas." },
  manchester: { label: "Manchester", territoryIds: ["north-west-england"], intro: "Request surveys from BUS and MCS approved installers covering Manchester and Greater Manchester." },
  liverpool: { label: "Liverpool", territoryIds: ["north-west-england"], intro: "Find territory-approved installers for Liverpool and Merseyside heat pump enquiries." },
  birmingham: { label: "Birmingham", territoryIds: ["midlands"], intro: "Compare Midlands installers for Birmingham homeowners considering air source heat pumps and BUS funding." },
  london: { label: "London", territoryIds: ["london"], intro: "Find London heat pump installers experienced with compact homes, terraces and fast survey turnaround." }
};

export function getLocationPageKeys() {
  return Object.keys(locationPages);
}
