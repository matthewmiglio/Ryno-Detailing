// Shared site data. ponytail: one source so pages don't duplicate copy.

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
