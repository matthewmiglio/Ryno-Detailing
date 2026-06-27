// Shared site data. ponytail: one source so pages don't duplicate copy.

// Canonical production origin for metadata/sitemap/robots/JSON-LD. Override per
// environment with NEXT_PUBLIC_SITE_URL (set it in Vercel). Trailing slash stripped.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rynodetailing.com"
).replace(/\/$/, "");

export const contact = {
  phone: "989 884 7661",
  phoneHref: "tel:+19898847661",
  email: "detailingryno@gmail.com",
  emailHref: "mailto:detailingryno@gmail.com",
};

// Package tiers. Prices fabricated to sensible market rates (brief allows this).
export const packages = [
  {
    name: "Express Interior",
    price: "$89",
    desc: "Vacuum, wipe-down, glass, and a fast reset for the daily driver.",
  },
  {
    name: "Deep Detail",
    price: "$179",
    desc: "Full extraction, leather conditioning, vents, seams, the works.",
  },
  {
    name: "The Full Send",
    price: "$299",
    desc: "Showroom-grade reset, inside and out. Nothing left behind.",
  },
];

// The 18 individual services from the brief.
export const services = [
  "Full interior",
  "Vacuum",
  "Exterior wash",
  "Pet hair removal",
  "Waxing",
  "Shining",
  "Window cleaning",
  "Tire shine",
  "Rim cleaning",
  "Foam cannon wash",
  "Bug and tar removal",
  "Carpet shampoo",
  "Leather cleaning",
  "Leather conditioner",
  "Vinyl cleaning",
  "Stain removal",
  "Odor removal",
  "Plastic protection",
];

// 7 sub-service pages (consolidated from the 18 services). Rendered by
// app/services/[slug]/page.tsx. `pairs` reference before/after images that are
// verified present in /public/images. ponytail: only interior photos exist, so
// exterior/wax/wheels/window pages run copy-only (no gallery) until we shoot
// exterior assets.
export const subServices = [
  {
    slug: "interior-detailing",
    lead: "Interior",
    accent: "detailing",
    intro:
      "A full interior reset. Every vent, seam, and floor mat gets attention until the cabin feels factory-fresh.",
    body: "We vacuum top to bottom, shampoo the carpets, clean and protect every plastic and vinyl surface, and finish the dash and console. The kind of clean you feel the second you sit down.",
    includes: ["Full interior", "Vacuum", "Carpet shampoo", "Vinyl cleaning", "Plastic protection"],
    pairs: [
      { label: "Cloth seats & dash", before: "front-cloth-seats-dashboard-dirty-before.jpg", after: "front-cloth-seat-dashboard-clean-after.jpg" },
      { label: "Driver floor mat", before: "driver-floor-mat-before.jpg", after: "driver-floor-mat-after.jpg" },
      { label: "Carpet floor mat", before: "black-carpet-floor-mat-maxima-before.jpg", after: "black-carpet-floor-mat-maxima-after.jpg" },
      { label: "Longhorn cockpit", before: "longhorn-cockpit-interior-before.jpg", after: "longhorn-cockpit-interior-after.jpg" },
    ],
  },
  {
    slug: "leather-care",
    lead: "Leather",
    accent: "care",
    intro:
      "Clean, condition, and protect. We bring tired leather back to life and keep it from cracking down the road.",
    body: "Leather is the first thing to show wear and the first thing buyers notice. We deep clean every panel, then condition to restore suppleness and add a protective layer against UV and daily use.",
    includes: ["Leather cleaning", "Leather conditioner"],
    pairs: [
      { label: "Front leather seats", before: "black-leather-front-seats-before.jpg", after: "black-leather-front-seats-after.jpg" },
      { label: "Rear leather seat", before: "black-leather-rear-seat-before.jpg", after: "black-leather-rear-seat-after.jpg" },
      { label: "Driver footwell", before: "black-leather-driver-seat-footwell-before.jpg", after: "black-leather-driver-seat-footwell-after.jpg" },
      { label: "Front cab overview", before: "black-leather-front-cab-overview-before.jpg", after: "black-leather-front-cab-overview-after.jpg" },
    ],
  },
  {
    slug: "exterior-wash",
    lead: "Exterior",
    accent: "wash",
    intro:
      "A proper hand wash, not a drive-through scratch machine. Foam, rinse, and a contaminant-free finish.",
    body: "We pre-soak with a foam cannon to lift grit before a soft hand wash, then knock out bonded bug splatter and road tar so the paint is genuinely clean and ready to shine.",
    includes: ["Exterior wash", "Foam cannon wash", "Bug and tar removal"],
    pairs: [],
  },
  {
    slug: "wax-and-shine",
    lead: "Wax &",
    accent: "shine",
    intro:
      "Lock in the gloss. A wax layer that protects the paint and makes the color pop.",
    body: "After the wash we lay down wax for depth, gloss, and a slick barrier that beads water and shrugs off the next round of road grime. The finish that turns heads in the parking lot.",
    includes: ["Waxing", "Shining"],
    pairs: [],
  },
  {
    slug: "wheels-and-tires",
    lead: "Wheels &",
    accent: "tires",
    intro:
      "The detail most shops rush. We clean the rims down to the barrel and dress the tires for a deep, even finish.",
    body: "Brake dust and road film get scrubbed off every rim, then the tires get a clean satin dressing. Nothing makes a car look finished faster than wheels done right.",
    includes: ["Rim cleaning", "Tire shine"],
    pairs: [],
  },
  {
    slug: "stain-and-odor-removal",
    lead: "Stain & odor",
    accent: "removal",
    intro:
      "Spills, smells, and stubborn pet hair, gone. We treat the source, not just the surface.",
    body: "Set-in stains get extracted, odors get neutralized at the source instead of masked, and embedded pet hair gets pulled out of every fiber. Your cabin smells and looks like new.",
    includes: ["Stain removal", "Odor removal", "Pet hair removal"],
    pairs: [
      { label: "Rear bench cleanout", before: "gray-cloth-rear-bench-seat-trash-before.jpg", after: "gray-cloth-rear-bench-seat-clean-after.jpg" },
      { label: "Cloth seats & dash", before: "front-cloth-seats-dashboard-dirty-before.jpg", after: "front-cloth-seat-dashboard-clean-after.jpg" },
    ],
  },
  {
    slug: "window-cleaning",
    lead: "Glass &",
    accent: "windows",
    intro:
      "Streak-free glass, inside and out. Clear views and no greasy film on the windshield.",
    body: "Interior glass picks up a haze you only notice when the sun hits it. We clean every window and mirror to a streak-free finish so the whole car feels sharper.",
    includes: ["Interior glass", "Exterior glass", "Mirrors"],
    pairs: [],
  },
];

export const team = [
  {
    name: "Ryder Helms",
    initials: "RH",
    role: "Owner",
    bio: "Ryder started Ryno Detailing out of a simple belief: every car deserves to feel new again. He runs every deep detail personally and treats each interior like it is his own.",
  },
  {
    name: "Noah Pickelhaupt",
    initials: "NP",
    role: "Co-Owner",
    bio: "Noah keeps the operation moving, from booking to the final wipe-down. If your detail is dialed in and on time, that is Noah's doing.",
  },
];

// Before/after pairs (all verified present in /public/images).
export const gallery = [
  { label: "Cloth seats & dash", before: "front-cloth-seats-dashboard-dirty-before.jpg", after: "front-cloth-seat-dashboard-clean-after.jpg" },
  { label: "Rear bench cleanout", before: "gray-cloth-rear-bench-seat-trash-before.jpg", after: "gray-cloth-rear-bench-seat-clean-after.jpg" },
  { label: "Carpet floor mat", before: "black-carpet-floor-mat-maxima-before.jpg", after: "black-carpet-floor-mat-maxima-after.jpg" },
  { label: "Dashboard", before: "black-dashboard-before.jpg", after: "black-dashboard-after.jpg" },
  { label: "Front cab overview", before: "black-leather-front-cab-overview-before.jpg", after: "black-leather-front-cab-overview-after.jpg" },
  { label: "Front leather seats", before: "black-leather-front-seats-before.jpg", after: "black-leather-front-seats-after.jpg" },
  { label: "Rear leather seat", before: "black-leather-rear-seat-before.jpg", after: "black-leather-rear-seat-after.jpg" },
  { label: "Driver floor mat", before: "driver-floor-mat-before.jpg", after: "driver-floor-mat-after.jpg" },
  { label: "Longhorn cockpit", before: "longhorn-cockpit-interior-before.jpg", after: "longhorn-cockpit-interior-after.jpg" },
  { label: "Door panel & wood trim", before: "rear-door-panel-wood-trim-before.jpg", after: "rear-door-panel-wood-trim-after.jpg" },
  { label: "Subaru dashboard", before: "subaru-dashboard-before.jpg", after: "subaru-dashboard-after.jpg" },
  { label: "Driver footwell", before: "black-leather-driver-seat-footwell-before.jpg", after: "black-leather-driver-seat-footwell-after.jpg" },
];
