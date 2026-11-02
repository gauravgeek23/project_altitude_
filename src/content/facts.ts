import type { Practical } from "./types";

/**
 * Practical facts found in published sources (official pages, news reports and rider guides),
 * checked online on 2 November 2026. They are not field-verified: each card says so and links
 * its sources. Where sources disagree, the text says so instead of picking one.
 */
export const CHECKED_ON = "2026-11-02";

export interface Source { label: string; url: string }

const S = {
  fuel: { label: "Discover with Dheeraj: fuel availability in Ladakh", url: "https://discoverwithdheeraj.com/fuel-availability-in-leh-ladakh-ladakh-self-drive-tips" },
  spareFuel: { label: "Vargis Khan: spare fuel for a Ladakh trip", url: "https://vargiskhan.com/log/?p=7641" },
  spitiFuel: { label: "TravelSetu: fuel and pit stops in Spiti", url: "https://travelsetu.com/apps/blog/fuel-and-pit-stops-a-guide-to-eating-and-sleeping-in-spiti-valley" },
  kazaPump: { label: "Global Geography: Kaza gas station", url: "https://global-geography.org/af/Geography/Asia/India/Pictures/Spiti_Valley/Kaza_-_Gas_Station_1" },
  ldma: { label: "Ladakh Disaster Management Authority: resource document", url: "https://ldma.ladakh.gov.in/docs/resource.pdf" },
  dh: { label: "Kashmir Life: five health centres get district hospital status", url: "https://kashmirlife.net/five-health-centres-get-district-hospital-status-in-ladakh-447175/" },
  padumDh: { label: "Reach Ladakh: CHC Padum to serve as district hospital", url: "https://reachladakh.com/news/social-news/community-health-centre-of-padum-zanskar-to-serve-as-new-district-hospital-advisor-ladakh" },
  kargilDh: { label: "Public Services Map: DH Kargil", url: "https://www.publicservicesmap.in/hospitals/centre/dh-kargil-kargil-ladakh-hosp1g16119" },
  lsFacilities: { label: "District Lahaul and Spiti: facilities", url: "https://hplahaulspiti.nic.in/facilities/" },
  ladakhAdvisory: { label: "Ladakh Tourism advisory", url: "https://ladakh.gov.in/tourism/" },
  hdsr: { label: "Indian Institute of Astrophysics: Hanle Dark Sky Reserve regulations", url: "https://www.iiap.res.in/outreach/hdsr/visit-hdsr/other-regulations/" },
  netLadakh: { label: "Discover with Dheeraj: mobile connectivity in Ladakh", url: "https://discoverwithdheeraj.com/mobile-phone-connectivity-in-leh-ladakh/" },
  netLadakh2: { label: "Vargis Khan: mobile network in Ladakh 2024", url: "https://vargiskhan.com/log/?p=15163" },
  jioPangong: { label: "Business Today: Jio 4G near Pangong", url: "https://www.businesstoday.in/industry/telecom/story/reliance-jio-expands-4g-services-in-ladakh-region-near-pangong-lake-336666-2022-06-07" },
  netSpiti: { label: "Discover with Dheeraj: mobile connectivity in Spiti", url: "https://discoverwithdheeraj.com/tips-mobile-phone-connectivity-in-spiti-valley/" },
  stayLadakh: { label: "Discover with Dheeraj: Ladakh FAQs, stay and eat", url: "https://discoverwithdheeraj.com/leh-ladakh-faqs-stay-eat-permits-others/" },
  hanleStay: { label: "Discover with Dheeraj: staying in Hanle", url: "https://discoverwithdheeraj.com/sonam-guest-house-hanle-detailed-review/" },
  spitiStay: { label: "Discover with Dheeraj: Spiti homestays", url: "https://discoverwithdheeraj.com/spiti-valley-homestays/" },
  langza: { label: "Responsible Tourism India: Langza homestay", url: "https://www.responsibletourismindia.com/stay/langza-homestaylaras-homestay/368" },
  ladakhHomestays: { label: "Leh Ladakh Taxis: homestays in Ladakh", url: "https://lehladakhtaxis.com/best-hotels-leh-ladakh/homestays-in-ladakh" },
};

type Fact = Partial<Practical> & { sources: Source[] };

const LADAKH_NET = "Only postpaid SIMs from outside Ladakh work. BSNL has the widest coverage, then Airtel and Jio.";

export const FACTS: Record<string, Fact> = {
  // ------------------------------------------------------------ Ladakh
  leh: { fuel: "Several fuel stations in and around Leh.", medical: "SNM Hospital, Leh (the main hospital in Ladakh).", network: LADAKH_NET + " Postpaid BSNL, Jio and Airtel work in Leh.",
    sources: [S.fuel, S.ladakhAdvisory, S.hdsr, S.netLadakh] },
  karu: { fuel: "Fuel station at Karu, about 35 km from Leh: the main refuelling point for Pangong and Tso Moriri.", sources: [S.fuel, S.spareFuel] },
  diskit: { fuel: "Fuel pump at Diskit, reported as the only one in the Nubra Valley.", medical: "Hospital at Diskit (30 beds listed); CHC Nubra has been designated District Hospital, Nubra.",
    network: "Airtel reportedly covers Diskit; BSNL is the most widespread. Postpaid only.", sources: [S.fuel, S.ldma, S.dh, S.netLadakh2] },
  hunder: { fuel: "No pump reported; nearest is Diskit.", sources: [S.fuel] },
  turtuk: { fuel: "No pump reported; refuel at Diskit.", stay: "Family-run homestays are available.", network: "Reports conflict: BSNL works but slowly; Airtel has reportedly expanded to Turtuk.",
    sources: [S.fuel, S.ladakhHomestays, S.netLadakh, S.netLadakh2] },
  panamik: { fuel: "No pump reported; refuel at Diskit.", sources: [S.fuel] },
  sumur: { fuel: "No pump reported; refuel at Diskit.", sources: [S.fuel] },
  tangtse: { fuel: "A newer fuel pump is reported (opened around 2023), about 34 km before Pangong.", medical: "PHC Tangtse has been designated District Hospital, Changthang.",
    network: "BSNL reported to work at Tangtse.", sources: [S.fuel, S.dh, S.netLadakh] },
  lukung: { network: "BSNL reported to work at Lukung; connections around Pangong are not fully reliable.", sources: [S.netLadakh] },
  spangmik: { network: "Jio launched 4G near Pangong at Spangmik in 2022; later reports say coverage is still patchy.", sources: [S.jioPangong, S.netLadakh2] },
  "pangong-tso": { fuel: "No pump at the lake; the nearest reported are Tangtse and Karu.", network: "Reports conflict. BSNL around Lukung and Tangtse; Jio 4G at Spangmik since 2022; don't count on data.",
    sources: [S.fuel, S.netLadakh, S.jioPangong] },
  nyoma: { fuel: "A newer fuel pump is reported (opened around 2024), useful for Tso Moriri and Hanle.", medical: "Hospital at Nyoma (16 beds listed).", sources: [S.fuel, S.ldma] },
  hanle: { fuel: "No retail fuel pump reported. Carry spare fuel (a 20-litre can is commonly advised); fuel sold informally may be of doubtful quality.",
    stay: "A handful of guesthouses and homestays, many with shared bathrooms or dry toilets.", network: "Only BSNL postpaid, on 2G, without mobile data.",
    sources: [S.spareFuel, S.fuel, S.hanleStay, S.hdsr] },
  "umling-la": { fuel: "No fuel on the approach; the last reported pumps are at Nyoma and Karu.", sources: [S.fuel] },
  "tso-moriri": { fuel: "No retail fuel pump reported.", network: "Reported to have no mobile reception at the lake.", sources: [S.spareFuel, S.netLadakh] },
  karzok: { fuel: "No retail fuel pump reported.", network: "Reported to have no mobile reception at the lake.", sources: [S.spareFuel, S.netLadakh] },
  darcha: { fuel: "No pump. The last pump before Karu is at Tandi near Keylong, a gap of about 320–330 km on the Manali–Leh road.", medical: "Civil dispensary at Darcha.",
    sources: [S.fuel, S.lsFacilities] },
  "baralacha-la": { fuel: "Inside the Tandi–Karu gap of about 320–330 km with no fuel.", sources: [S.fuel] },
  "taglang-la": { fuel: "Inside the Tandi–Karu gap with no fuel; Karu is the next pump towards Leh.", sources: [S.fuel] },

  // ------------------------------------------------------------ Kargil and Zanskar
  kargil: { fuel: "Fuel stations in Kargil; on the Srinagar–Leh road, pumps are roughly every 100 km, including Kargil and Khalsi.", medical: "District Hospital Kargil (100 beds listed, with a blood bank).",
    sources: [S.fuel, S.ldma, S.kargilDh] },
  sankoo: { medical: "Community Health Centre, Sankoo.", sources: [S.ldma] },
  padum: { fuel: "A pump is reported in Padum, but sources disagree on whether it works. Carry enough fuel from Kargil.", medical: "Community Health Centre, Padum, being developed as District Hospital, Zanskar.",
    sources: [S.fuel, S.spareFuel, S.padumDh, S.dh] },
  lamayuru: { fuel: "The nearest reported pump is at Khalsi on the Srinagar–Leh road.", sources: [S.fuel] },

  // ------------------------------------------------------------ Spiti and Kinnaur
  "reckong-peo": { fuel: "Pump at Powari near Reckong Peo: the last dependable fuel before Spiti. One rider found it closed and advises filling at Rampur too.", sources: [S.spitiFuel] },
  nako: { fuel: "No pump reported; fill at Reckong Peo before and Kaza after.", sources: [S.spitiFuel] },
  tabo: { fuel: "No pump reported; nearest are Kaza and Reckong Peo.", medical: "Primary Health Centre, Tabo.", network: "Jio data reported in Tabo; BSNL has the widest coverage in Spiti.",
    sources: [S.spitiFuel, S.lsFacilities, S.netSpiti] },
  kaza: { fuel: "Indian Oil pump at Kaza, one of the highest in the world. Queues or stock-outs are reported, and it is said to close around 8 pm.", medical: "Community Health Centre (Civil Hospital), Kaza.",
    stay: "Homestays and guesthouses; a base for the high villages.", network: "BSNL has the widest coverage; Jio data reported in Kaza.", sources: [S.kazaPump, S.spitiFuel, S.lsFacilities, S.spitiStay, S.netSpiti] },
  kibber: { medical: "Civil dispensary at Kibber.", sources: [S.lsFacilities] },
  langza: { stay: "A popular homestay village about 14 km from Kaza, with family-run homestays.", sources: [S.spitiStay, S.langza] },
  losar: { fuel: "No pump between Kaza and Tandi (about 180 km): carry 5–10 litres extra.", medical: "Civil dispensary at Losar.", sources: [S.spitiFuel, S.lsFacilities] },
  "kunzum-la": { fuel: "No pump between Kaza and Tandi or Manali.", network: "No mobile connectivity from Gramphu to Kunzum Pass.", sources: [S.spitiFuel, S.netSpiti] },
  batal: { fuel: "No pump between Kaza and Tandi or Manali.", network: "No mobile connectivity between Gramphu and Kunzum Pass.", sources: [S.spitiFuel, S.netSpiti] },
  chandratal: { fuel: "No pump between Kaza and Tandi or Manali.", network: "No mobile connectivity in this stretch.", sources: [S.spitiFuel, S.netSpiti] },
};
