// Service-by-area data for the layer-3 programmatic SEO pages
// (/services/[service]/[area]). System lifted from
// pxb-development/georgia-natural-scapes (src/data/city-data.ts): a
// Record<slug, AreaInfo> that the [service]/[area] page cross-products against
// the 7 services in data.ts (`subServices`). The page filters projects/reviews/
// faqs by `serviceTypes` so each of the 7 x 5 = 35 combos renders its own copy.
//
// serviceTypes use the subService slugs:
//   interior-detailing | leather-care | exterior-wash | wax-and-shine
//   wheels-and-tires | stain-and-odor-removal | window-cleaning
//
// ponytail: image-bearing `projects` only exist for the 3 photographed services
// (interior-detailing, leather-care, stain-and-odor-removal) — all 60 assets in
// /public/images are interior shots. The 4 imageless services (exterior-wash,
// wax-and-shine, wheels-and-tires, window-cleaning) still get reviews + faqs +
// popularProjects, just no project gallery, until exterior/wheel/glass photos
// are shot. Reviews/projects are demo content per the owner's call.

export interface LocalProject {
  title: string;
  neighborhood: string;
  description: string;
  images: string[];
  serviceTypes: string[];
  completedDate?: string;
}

export interface LocalReview {
  reviewerName: string;
  neighborhood?: string;
  text: string;
  rating: number;
  source: string;
  serviceTypes: string[];
}

export interface LocalFaq {
  question: string;
  answer: string;
  serviceTypes: string[];
}

export interface AreaInfo {
  name: string;
  slug: string;
  county: string;
  intro: string;
  neighborhoods: string[];
  climate: string;
  population: string;
  uniqueFact: string;
  projects: LocalProject[];
  reviews: LocalReview[];
  faqs: LocalFaq[];
  localConstraints: {
    winterConditions?: string;
    commonVehicles?: string;
    terrainNotes?: string;
    serviceNotes?: string;
  };
  popularProjects: {
    serviceSlug: string;
    projectTypes: string[];
  }[];
}

export const areaData: Record<string, AreaInfo> = {
  // ============== MONTMORENCY COUNTY ==============
  atlanta: {
    name: "Atlanta",
    slug: "atlanta",
    county: "Montmorency County",
    intro:
      "Atlanta is our home base, so local trucks and SUVs get priority scheduling and quick turnarounds. As the Elk Capital of Michigan, this is hunting and back-road country, and we know exactly what a fall season does to a truck cab.",
    neighborhoods: ["Downtown Atlanta", "Clear Lake", "Thunder Bay River", "M-32 / M-33 junction", "Lake Avalon"],
    climate:
      "Long lake-effect winters mean months of road salt and brine slurry tracked into every footwell, then sandy, dusty two-tracks all summer.",
    population: "700+",
    uniqueFact:
      "Known as the Elk Capital of Michigan, so a huge share of local vehicles are work trucks and hunting rigs that see real mud and field debris.",
    projects: [
      {
        title: "Hunting Truck Full Interior Reset",
        neighborhood: "Lake Avalon",
        description:
          "A lifted F-250 that spent elk season hauling gear and dogs. We pulled the mats, shampooed the carpet, scrubbed the cloth seats, and detailed the cockpit back to factory-clean.",
        images: ["/images/longhorn-cockpit-interior-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-11",
      },
      {
        title: "Post-Season Cab Cleanout",
        neighborhood: "Clear Lake",
        description:
          "Rear bench was buried under months of trash, mud, and shells. Full extraction, stain treatment, and an odor neutralize left the back seat usable again.",
        images: ["/images/gray-cloth-rear-bench-seat-clean-after.jpg"],
        serviceTypes: ["stain-and-odor-removal", "interior-detailing"],
        completedDate: "2025-12",
      },
      {
        title: "Leather Front Seats Restored",
        neighborhood: "Downtown Atlanta",
        description:
          "Daily-driver SUV with sun-faded, dried-out leather. We deep cleaned every panel and conditioned the seats back to a soft, even finish.",
        images: ["/images/black-leather-front-seats-after.jpg"],
        serviceTypes: ["leather-care"],
        completedDate: "2025-09",
      },
      {
        title: "Salt-Stained Carpet & Mats",
        neighborhood: "Thunder Bay River",
        description:
          "Winter salt had left white rings across the driver floor. Shampoo extraction and a protectant pass brought the carpet and mats back to black.",
        images: ["/images/driver-floor-mat-after.jpg"],
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
        completedDate: "2026-02",
      },
    ],
    reviews: [
      {
        reviewerName: "Dale R.",
        neighborhood: "Lake Avalon",
        text: "Ryder got the dog hair and field mud out of my truck after elk season. Looked better than the day I bought it. Being right here in Atlanta, he had it done fast.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        reviewerName: "Karen W.",
        neighborhood: "Clear Lake",
        text: "The salt stains in my floor carpet were brutal this winter. They came out completely. Highly recommend for anyone up here dealing with the roads.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing"],
      },
      {
        reviewerName: "Mike T.",
        neighborhood: "Downtown Atlanta",
        text: "My leather seats were cracking and faded. After the conditioning they look and feel new again. Great work and fair price.",
        rating: 5,
        source: "Facebook",
        serviceTypes: ["leather-care"],
      },
      {
        reviewerName: "Steph L.",
        neighborhood: "Lewiston",
        text: "Had the truck washed and waxed before selling it. The shine made the photos pop and it sold in a week. Worth every dollar.",
        rating: 5,
        source: "Google",
        serviceTypes: ["exterior-wash", "wax-and-shine"],
      },
      {
        reviewerName: "Brian K.",
        neighborhood: "Thunder Bay River",
        text: "Rims were caked in brake dust and the tires looked gray. They came back black and clean. Small thing that made the whole truck look finished.",
        rating: 5,
        source: "Google",
        serviceTypes: ["wheels-and-tires"],
      },
    ],
    faqs: [
      {
        question: "Do you remove salt stains from carpet up here in Atlanta?",
        answer:
          "Yes, that is one of our most common winter jobs. We hot-water extract the salt, treat the white rings, and finish with a protectant so they are easier to wipe next time.",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        question: "Can you get dog hair and field debris out of a hunting truck?",
        answer:
          "Absolutely. Embedded pet hair gets pulled out of every fiber and seam, not just vacuumed off the surface. It is one of the most common requests we get during and after season.",
        serviceTypes: ["stain-and-odor-removal", "interior-detailing"],
      },
      {
        question: "My leather is cracking from the cold. Can it be saved?",
        answer:
          "If it is dried out but not torn, conditioning restores most of the suppleness and slows further cracking. We clean first, then condition every panel evenly.",
        serviceTypes: ["leather-care"],
      },
      {
        question: "Do you wash trucks in the winter?",
        answer:
          "We do. Getting the salt and brine off the paint over winter is exactly when a wash and wax matter most for protecting the finish.",
        serviceTypes: ["exterior-wash", "wax-and-shine"],
      },
      {
        question: "How long does a full interior take?",
        answer:
          "A standard full interior runs a few hours; heavily soiled trucks with stain and odor work can take most of a day. We will give you a straight timeline when we see it.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "Can you get the smoke or pet smell out for good?",
        answer:
          "We neutralize odor at the source rather than masking it, treating the carpet, seats, and headliner. Heavy smoke jobs may need a second pass, which we will tell you up front.",
        serviceTypes: ["stain-and-odor-removal"],
      },
      {
        question: "Do you clean rims and tires as part of a wash?",
        answer:
          "Wheels and tires are their own service, and we recommend adding them to any exterior wash. We scrub the rims down and dress the tires for an even, satin finish.",
        serviceTypes: ["wheels-and-tires", "exterior-wash"],
      },
      {
        question: "Will a wax actually help with our winters?",
        answer:
          "Yes. A wax layer beads water and brine and makes the next wash easier, which is exactly what you want with this much salt on the roads.",
        serviceTypes: ["wax-and-shine"],
      },
    ],
    localConstraints: {
      winterConditions: "Heavy lake-effect snow and months of road salt and brine; salt-stain extraction is a constant winter request.",
      commonVehicles: "Work trucks, lifted pickups, and hunting rigs that see field mud, blood, and dog hair.",
      terrainNotes: "Sandy two-tracks and gravel roads track fine dust into the cabin all summer.",
      serviceNotes: "Priority scheduling for local Atlanta vehicles since this is our home base.",
    },
    popularProjects: [
      { serviceSlug: "interior-detailing", projectTypes: ["Full interior resets", "Salt-stain carpet extraction", "Truck cab cleanouts"] },
      { serviceSlug: "stain-and-odor-removal", projectTypes: ["Pet hair removal", "Mud and field-debris cleanup", "Odor neutralizing"] },
      { serviceSlug: "leather-care", projectTypes: ["Conditioning cracked leather", "Seat deep cleans"] },
      { serviceSlug: "exterior-wash", projectTypes: ["Winter salt washes", "Foam cannon hand washes"] },
      { serviceSlug: "wax-and-shine", projectTypes: ["Pre-sale wax", "Paint protection"] },
      { serviceSlug: "wheels-and-tires", projectTypes: ["Brake-dust rim cleaning", "Tire dressing"] },
      { serviceSlug: "window-cleaning", projectTypes: ["Streak-free glass", "Interior haze removal"] },
    ],
  },

  hillman: {
    name: "Hillman",
    slug: "hillman",
    county: "Montmorency County",
    intro:
      "Hillman sits on the Thunder Bay River near Fletcher Pond, so we see a lot of fishing rigs, farm trucks, and lake vehicles that carry sand, tackle, and the occasional spilled bait. We bring the same detail-shop results to this quiet corner of Montmorency County.",
    neighborhoods: ["Downtown Hillman", "Fletcher Pond", "Thunder Bay River", "Jacks Landing", "Hillman Township"],
    climate:
      "Rural snow-belt winters load vehicles with salt and slush, while spring thaw turns the back roads to mud well into May.",
    population: "700+",
    uniqueFact:
      "Fletcher Pond is one of the best bass and pike fisheries in the state, so boat-haulers and tackle-loaded SUVs are everyday customers.",
    projects: [
      {
        title: "Fishing SUV Interior Detail",
        neighborhood: "Fletcher Pond",
        description:
          "A family hauler that lives at the boat launch all summer. We cleared the sand, wiped down every panel, and detailed the dash and console back to clean.",
        images: ["/images/front-passenger-door-dashboard-clean-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-08",
      },
      {
        title: "Leather Footwell Restoration",
        neighborhood: "Downtown Hillman",
        description:
          "Driver footwell leather was scuffed and dull from years of muddy boots. Deep clean and conditioning brought the panel back to an even, soft finish.",
        images: ["/images/black-leather-driver-seat-footwell-after.jpg"],
        serviceTypes: ["leather-care"],
        completedDate: "2025-10",
      },
      {
        title: "Bait & Mud Odor Removal",
        neighborhood: "Jacks Landing",
        description:
          "Rear bench had taken on a strong bait-and-mud smell over the season. Extraction plus an odor neutralize treatment left the cabin fresh again.",
        images: ["/images/gray-cloth-rear-bench-seat-clean-after.jpg"],
        serviceTypes: ["stain-and-odor-removal"],
        completedDate: "2025-09",
      },
      {
        title: "Cargo Area Deep Clean",
        neighborhood: "Hillman Township",
        description:
          "Trunk and cargo area were packed with sand, leaves, and tackle residue. We vacuumed, shampooed, and protected the liner so it is ready for the next haul.",
        images: ["/images/cargo-area-trunk-clean.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-07",
      },
    ],
    reviews: [
      {
        reviewerName: "Tom B.",
        neighborhood: "Fletcher Pond",
        text: "My SUV lives at the launch all summer. They got every bit of sand out of the carpet and it smelled brand new. Couldn't be happier.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing"],
      },
      {
        reviewerName: "Linda S.",
        neighborhood: "Downtown Hillman",
        text: "The bait smell in my back seat was embarrassing. After their odor treatment it was completely gone, not just covered up. Amazing.",
        rating: 5,
        source: "Facebook",
        serviceTypes: ["stain-and-odor-removal"],
      },
      {
        reviewerName: "Gary P.",
        neighborhood: "Jacks Landing",
        text: "Leather in my truck looked rough. Ryder cleaned and conditioned it and now it looks years younger. Great attention to detail.",
        rating: 5,
        source: "Google",
        serviceTypes: ["leather-care"],
      },
      {
        reviewerName: "Donna M.",
        neighborhood: "Hillman Township",
        text: "Had the whole truck washed, waxed, and the wheels done before a family wedding. It looked showroom-ready. Fast and professional.",
        rating: 5,
        source: "Google",
        serviceTypes: ["exterior-wash", "wax-and-shine", "wheels-and-tires"],
      },
      {
        reviewerName: "Rick H.",
        neighborhood: "Thunder Bay River",
        text: "Inside of my windshield always had a haze I couldn't get off. They cleaned all the glass streak-free. Big difference driving into the sun.",
        rating: 5,
        source: "Google",
        serviceTypes: ["window-cleaning"],
      },
    ],
    faqs: [
      {
        question: "Can you get lake sand out of carpet and mats?",
        answer:
          "Yes. Sand works deep into the fibers, so we extract rather than just vacuum, then treat the mats so they are easier to keep clean.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "How do you remove a bait or fish smell?",
        answer:
          "We neutralize the odor at the source in the carpet and seats instead of masking it with fragrance. Strong cases may need a second pass, which we will flag.",
        serviceTypes: ["stain-and-odor-removal"],
      },
      {
        question: "Do you detail boats or just vehicles?",
        answer:
          "We focus on vehicle interiors and exteriors. If you have a specific job in mind, call us and we will tell you straight whether we can take it.",
        serviceTypes: ["interior-detailing", "exterior-wash"],
      },
      {
        question: "Can you clean a cargo area or truck bed liner?",
        answer:
          "Cargo areas and trunks are part of a full interior. We vacuum, shampoo, and protect the liner so it holds up to the next load of gear.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "Will conditioning fix scuffed leather from muddy boots?",
        answer:
          "Cleaning lifts the scuffs and ground-in dirt, and conditioning evens out the finish. It will not repair tears, but it restores most worn-but-intact leather.",
        serviceTypes: ["leather-care"],
      },
      {
        question: "Do you offer wax to protect against the salt?",
        answer:
          "Yes. A wax layer helps the paint shed brine and makes winter washes easier, which matters on these rural salted roads.",
        serviceTypes: ["wax-and-shine", "exterior-wash"],
      },
      {
        question: "Can you get the inside of my windshield clear?",
        answer:
          "That interior haze is film from off-gassing and grime. We clean every window and mirror to a streak-free finish, inside and out.",
        serviceTypes: ["window-cleaning"],
      },
      {
        question: "Do you come out to Hillman or do I bring it to you?",
        answer:
          "Give us a call and we will work out the easiest option for you. We serve Hillman and the surrounding Montmorency County area regularly.",
        serviceTypes: ["interior-detailing", "exterior-wash"],
      },
    ],
    localConstraints: {
      winterConditions: "Snow-belt winters with heavy salt; spring thaw brings weeks of mud on the back roads.",
      commonVehicles: "Fishing rigs, boat-haulers, and farm trucks carrying sand, tackle, and bait residue.",
      terrainNotes: "Proximity to Fletcher Pond and the Thunder Bay River means lake sand is the most common interior offender.",
      serviceNotes: "Regular service across Hillman and the surrounding Montmorency County area.",
    },
    popularProjects: [
      { serviceSlug: "interior-detailing", projectTypes: ["Sand extraction", "Cargo-area deep cleans", "Full interior resets"] },
      { serviceSlug: "stain-and-odor-removal", projectTypes: ["Bait and mud odor removal", "Stain treatment"] },
      { serviceSlug: "leather-care", projectTypes: ["Footwell restoration", "Seat conditioning"] },
      { serviceSlug: "exterior-wash", projectTypes: ["Foam cannon washes", "Winter salt washes"] },
      { serviceSlug: "wax-and-shine", projectTypes: ["Protective wax", "Pre-event shine"] },
      { serviceSlug: "wheels-and-tires", projectTypes: ["Rim cleaning", "Tire dressing"] },
      { serviceSlug: "window-cleaning", projectTypes: ["Interior haze removal", "Streak-free glass"] },
    ],
  },

  // ============== ALPENA COUNTY ==============
  alpena: {
    name: "Alpena",
    slug: "alpena",
    county: "Alpena County",
    intro:
      "Alpena is the largest city on Lake Huron's Thunder Bay and the regional hub, so we serve everything from daily commuters to lakefront SUVs here. Lake sand and heavy road salt are the two things every Alpena interior fights, and we handle both.",
    neighborhoods: ["Downtown Alpena", "US-23 corridor", "Long Lake", "Hubbard Lake", "Devils Lake"],
    climate:
      "Lake Huron drives heavy lake-effect snow and a long salting season, then summer beach trips track fine sand into every vehicle.",
    population: "10,000+",
    uniqueFact:
      "Home to the Thunder Bay National Marine Sanctuary; beach and boat days mean sand is the number-one thing we pull out of local interiors.",
    projects: [
      {
        title: "Commuter Dashboard & Cockpit Detail",
        neighborhood: "US-23 corridor",
        description:
          "A high-mileage Subaru daily driver with a dusty, sun-baked dash. We cleaned and protected every surface and reset the cockpit to a clean matte finish.",
        images: ["/images/subaru-dashboard-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-06",
      },
      {
        title: "Full Leather Cabin Restoration",
        neighborhood: "Long Lake",
        description:
          "Lakefront SUV with leather throughout. We deep cleaned and conditioned the full front cabin, restoring an even, soft finish across every panel.",
        images: ["/images/black-leather-front-cab-overview-after.jpg"],
        serviceTypes: ["leather-care", "interior-detailing"],
        completedDate: "2025-07",
      },
      {
        title: "Beach-Sand Stain Cleanup",
        neighborhood: "Hubbard Lake",
        description:
          "Cloth seats and dash were coated in beach sand and sunscreen film after a summer of lake trips. Extraction and surface cleaning brought it all back to clean.",
        images: ["/images/front-cloth-seat-dashboard-clean-after.jpg"],
        serviceTypes: ["stain-and-odor-removal", "interior-detailing"],
        completedDate: "2025-08",
      },
      {
        title: "Forester Cargo Reset",
        neighborhood: "Devils Lake",
        description:
          "A wagon cargo area packed with beach and boating gear all season. We vacuumed, shampooed, and protected the liner so it is ready for the next haul.",
        images: ["/images/subaru-forester-cargo-trunk-clean-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-09",
      },
    ],
    reviews: [
      {
        reviewerName: "Jennifer L.",
        neighborhood: "Long Lake",
        text: "Our leather seats hadn't been touched in years. The full conditioning made the whole cabin feel like a new car. Worth the drive into Alpena.",
        rating: 5,
        source: "Google",
        serviceTypes: ["leather-care", "interior-detailing"],
      },
      {
        reviewerName: "Mark D.",
        neighborhood: "US-23 corridor",
        text: "Daily commuter was filthy inside. They detailed the whole thing and the dash looks brand new. Fast turnaround too.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing"],
      },
      {
        reviewerName: "Amy R.",
        neighborhood: "Hubbard Lake",
        text: "Beach sand and sunscreen were all over the seats. They got it spotless and it smells amazing now. Will be back every summer.",
        rating: 5,
        source: "Facebook",
        serviceTypes: ["stain-and-odor-removal"],
      },
      {
        reviewerName: "Chris and Beth N.",
        neighborhood: "Downtown Alpena",
        text: "Washed, waxed, and the wheels detailed before we listed the car. The shine was incredible and it sold quick. Highly recommend.",
        rating: 5,
        source: "Google",
        serviceTypes: ["exterior-wash", "wax-and-shine", "wheels-and-tires"],
      },
      {
        reviewerName: "Paul S.",
        neighborhood: "Devils Lake",
        text: "Glass was always smudged and hazy inside. They cleaned every window perfectly. Such a simple thing that makes a big difference.",
        rating: 5,
        source: "Google",
        serviceTypes: ["window-cleaning"],
      },
    ],
    faqs: [
      {
        question: "Can you get beach sand out of my seats and carpet?",
        answer:
          "Yes, it is our most common summer job in Alpena. We extract sand from deep in the fibers and seams rather than just vacuuming the surface.",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        question: "Do you handle full leather interiors?",
        answer:
          "We do. We clean and condition every leather panel for an even, soft finish, and we will tell you honestly what conditioning can and cannot bring back.",
        serviceTypes: ["leather-care"],
      },
      {
        question: "How often should I wash off the road salt in winter?",
        answer:
          "Every couple of weeks through the salting season keeps it off the paint and out of the wheel wells. A wax layer makes each wash easier.",
        serviceTypes: ["exterior-wash", "wax-and-shine"],
      },
      {
        question: "Can you remove sunscreen and lake film from surfaces?",
        answer:
          "Yes. Sunscreen leaves a greasy film on dashes and seats that normal wiping smears around. We cut it properly and protect the surface after.",
        serviceTypes: ["stain-and-odor-removal", "interior-detailing"],
      },
      {
        question: "Do you clean cargo areas and wagon liners?",
        answer:
          "Cargo areas are included in a full interior. We vacuum, shampoo, and protect the liner so it stands up to gear and beach hauls.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "Can you get my glass streak-free inside and out?",
        answer:
          "Yes. Interior glass picks up a haze you only notice in the sun. We clean every window and mirror to a streak-free finish.",
        serviceTypes: ["window-cleaning"],
      },
      {
        question: "Do you do rims and tires too?",
        answer:
          "We scrub the rims down to the barrel and dress the tires for a clean, even finish. It is a great add-on to any exterior wash.",
        serviceTypes: ["wheels-and-tires", "exterior-wash"],
      },
      {
        question: "How far out from Alpena do you serve?",
        answer:
          "We cover Alpena and the surrounding lakes and towns regularly. Call us with your location and we will sort out the details.",
        serviceTypes: ["interior-detailing", "exterior-wash"],
      },
    ],
    localConstraints: {
      winterConditions: "Lake Huron lake-effect snow and a long salting season; regular salt washes recommended.",
      commonVehicles: "Daily commuters and lakefront SUVs and wagons loaded with beach and boating gear.",
      terrainNotes: "Beach and boat access means fine lake sand is the most common interior contaminant.",
      serviceNotes: "Regional hub; we serve Alpena and the surrounding lakes and towns.",
    },
    popularProjects: [
      { serviceSlug: "interior-detailing", projectTypes: ["Beach-sand extraction", "Cargo resets", "Full interior details"] },
      { serviceSlug: "leather-care", projectTypes: ["Full-cabin leather conditioning", "Seat deep cleans"] },
      { serviceSlug: "stain-and-odor-removal", projectTypes: ["Sunscreen film removal", "Odor neutralizing"] },
      { serviceSlug: "exterior-wash", projectTypes: ["Winter salt washes", "Foam cannon hand washes"] },
      { serviceSlug: "wax-and-shine", projectTypes: ["Pre-sale wax", "Paint protection"] },
      { serviceSlug: "wheels-and-tires", projectTypes: ["Rim cleaning", "Tire dressing"] },
      { serviceSlug: "window-cleaning", projectTypes: ["Streak-free glass", "Haze removal"] },
    ],
  },

  lachine: {
    name: "Lachine",
    slug: "lachine",
    county: "Alpena County",
    intro:
      "Lachine is farm country west of Alpena, where work trucks and field vehicles do the heavy lifting. Grain dust, hay chaff, and dirt-road grime are the daily reality out here, and we get interiors back to clean no matter how rough they start.",
    neighborhoods: ["Lachine", "Long Rapids", "Spratt", "US-23 farm corridor", "Hubbard Lake Road"],
    climate:
      "Open farm country gets the full brunt of winter wind and salt, then dry summer fieldwork fills cabins with fine dust and chaff.",
    population: "Rural community",
    uniqueFact:
      "An unincorporated farming community, so a large share of local vehicles are work trucks that haul feed, tools, and the occasional load of hay.",
    projects: [
      {
        title: "Work Truck Cockpit Detail",
        neighborhood: "US-23 farm corridor",
        description:
          "A farm pickup with a dust-caked dash, steering wheel, and console. We cleaned and protected every surface and reset the cockpit to clean.",
        images: ["/images/dashboard-steering-wheel-center-console-clean-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-10",
      },
      {
        title: "Rear Leather Bench Restoration",
        neighborhood: "Long Rapids",
        description:
          "A crew-cab with worn rear leather. We deep cleaned and conditioned the bench back to a clean, even finish for the family hauler.",
        images: ["/images/maxima-black-leather-rear-seats-clean.jpg"],
        serviceTypes: ["leather-care"],
        completedDate: "2025-09",
      },
      {
        title: "Mud & Field-Debris Cleanup",
        neighborhood: "Spratt",
        description:
          "Driver door and interior were packed with dried mud and chaff from fieldwork. Full clean-out and surface detail brought the cabin back to usable.",
        images: ["/images/front-driver-door-interior-clean-after.jpg"],
        serviceTypes: ["stain-and-odor-removal", "interior-detailing"],
        completedDate: "2025-08",
      },
      {
        title: "Floor Mat Shampoo & Reset",
        neighborhood: "Hubbard Lake Road",
        description:
          "Carpet floor mats ground down with dirt-road dust. Shampoo extraction and a protectant pass restored them to a clean, dark finish.",
        images: ["/images/passenger-floor-mat-longhorn-clean.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-11",
      },
    ],
    reviews: [
      {
        reviewerName: "Wayne H.",
        neighborhood: "Long Rapids",
        text: "My farm truck was a disaster inside after harvest. Ryder got the dust and chaff out of every corner. Looked like a different truck.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        reviewerName: "Carol B.",
        neighborhood: "Spratt",
        text: "The rear leather in our crew cab was worn and dirty. After cleaning and conditioning it looks great again. Very happy with the work.",
        rating: 5,
        source: "Facebook",
        serviceTypes: ["leather-care"],
      },
      {
        reviewerName: "Doug M.",
        neighborhood: "US-23 farm corridor",
        text: "Dirt-road dust gets into everything out here. They shampooed my mats and carpet and it was spotless. Will use them again.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing"],
      },
      {
        reviewerName: "Nancy and Jim T.",
        neighborhood: "Lachine",
        text: "Had the truck washed and waxed for the county fair. The wheels and shine looked fantastic. Great local service.",
        rating: 5,
        source: "Google",
        serviceTypes: ["exterior-wash", "wax-and-shine", "wheels-and-tires"],
      },
      {
        reviewerName: "Earl S.",
        neighborhood: "Hubbard Lake Road",
        text: "Inside windows were always filmed over from the dust. They cleaned the glass perfectly. Much better visibility now.",
        rating: 5,
        source: "Google",
        serviceTypes: ["window-cleaning"],
      },
    ],
    faqs: [
      {
        question: "Can you get harvest dust and chaff out of a work truck?",
        answer:
          "Yes, that is routine for us out in Lachine. We extract the dust from the carpet and seams and detail every surface, not just blow it around.",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        question: "Do you clean dried mud out of door panels and footwells?",
        answer:
          "We do. Dried field mud gets fully cleaned out of the door panels, footwells, and seams, then the surfaces are wiped down and protected.",
        serviceTypes: ["stain-and-odor-removal", "interior-detailing"],
      },
      {
        question: "Will conditioning help worn leather in an older truck?",
        answer:
          "If the leather is worn but intact, cleaning and conditioning restores most of the look and feel. We will tell you straight if it is past saving.",
        serviceTypes: ["leather-care"],
      },
      {
        question: "Can you shampoo dirt-road dust out of carpet and mats?",
        answer:
          "Yes. Fine dust grinds deep into carpet, so we hot-water extract rather than just vacuum, then add a protectant to make upkeep easier.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "Do you wash and wax work trucks?",
        answer:
          "We do. A wash knocks the field grime and salt off, and a wax layer protects the paint and makes the next wash easier.",
        serviceTypes: ["exterior-wash", "wax-and-shine"],
      },
      {
        question: "Can you clean rims caked with mud and brake dust?",
        answer:
          "Yes. We scrub the rims down to the barrel and dress the tires. It makes a rough work truck look finished again.",
        serviceTypes: ["wheels-and-tires"],
      },
      {
        question: "Can you clear the dust film off my interior glass?",
        answer:
          "Dust leaves a haze on the inside of the glass that smears when wiped dry. We clean every window streak-free, inside and out.",
        serviceTypes: ["window-cleaning"],
      },
      {
        question: "Do you serve the Lachine and Long Rapids area?",
        answer:
          "Yes, we cover Lachine and the surrounding farm communities in Alpena County. Give us a call to set it up.",
        serviceTypes: ["interior-detailing", "exterior-wash"],
      },
    ],
    localConstraints: {
      winterConditions: "Open farm country takes the full winter wind and salt; salt washes are recommended.",
      commonVehicles: "Work trucks and field vehicles hauling feed, tools, and hay.",
      terrainNotes: "Dry summer fieldwork and dirt roads fill cabins with fine dust and chaff.",
      serviceNotes: "We serve Lachine, Long Rapids, and the surrounding Alpena County farm communities.",
    },
    popularProjects: [
      { serviceSlug: "interior-detailing", projectTypes: ["Harvest-dust extraction", "Work-truck cockpit details", "Mat shampoo"] },
      { serviceSlug: "stain-and-odor-removal", projectTypes: ["Field-mud cleanup", "Odor neutralizing"] },
      { serviceSlug: "leather-care", projectTypes: ["Worn-leather conditioning", "Bench seat cleaning"] },
      { serviceSlug: "exterior-wash", projectTypes: ["Field-grime washes", "Winter salt washes"] },
      { serviceSlug: "wax-and-shine", projectTypes: ["Protective wax", "Pre-event shine"] },
      { serviceSlug: "wheels-and-tires", projectTypes: ["Mud and brake-dust rim cleaning", "Tire dressing"] },
      { serviceSlug: "window-cleaning", projectTypes: ["Dust-film removal", "Streak-free glass"] },
    ],
  },

  // ============== OSCODA COUNTY ==============
  mio: {
    name: "Mio",
    slug: "mio",
    county: "Oscoda County",
    intro:
      "Mio is the gateway to the Au Sable River and the Huron National Forest, so kayaks, fishing gear, and trail dust come standard around here. We bring full detail-shop results to Oscoda County, from river-soaked carpets to dusty trail rigs.",
    neighborhoods: ["Downtown Mio", "Au Sable River", "Mio Pond", "M-33 / M-72 junction", "McKinley"],
    climate:
      "Snowbelt winters bring salt and slush, while a long paddling and off-road season fills vehicles with river damp, sand, and trail dust.",
    population: "1,800+",
    uniqueFact:
      "Mio is a launch point for the Au Sable River, so wet gear, sand, and the damp that comes with it are everyday interior challenges.",
    projects: [
      {
        title: "River Rig Carpet Shampoo",
        neighborhood: "Au Sable River",
        description:
          "A paddling vehicle with carpet floor mats soaked and stained from wet gear all season. Shampoo extraction restored them to a clean, dark finish.",
        images: ["/images/black-carpet-floor-mat-maxima-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-08",
      },
      {
        title: "Rear Leather Seat Restoration",
        neighborhood: "Downtown Mio",
        description:
          "Rear leather seat had dried out and dulled. We deep cleaned and conditioned it back to a soft, even finish for the daily driver.",
        images: ["/images/black-leather-rear-seat-after.jpg"],
        serviceTypes: ["leather-care"],
        completedDate: "2025-07",
      },
      {
        title: "Trail-Dust Interior Reset",
        neighborhood: "McKinley",
        description:
          "An off-road SUV interior coated in trail dust and damp. We cleaned every surface and reset the cabin and open-door areas to clean.",
        images: ["/images/rear-interior-open-door-clean.jpg"],
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
        completedDate: "2025-09",
      },
      {
        title: "Dashboard Detail & Protect",
        neighborhood: "Mio Pond",
        description:
          "A sun-baked dash gone dull and dusty. We cleaned and applied a protectant for a clean matte finish that resists fading.",
        images: ["/images/black-dashboard-after.jpg"],
        serviceTypes: ["interior-detailing"],
        completedDate: "2025-06",
      },
    ],
    reviews: [
      {
        reviewerName: "Greg M.",
        neighborhood: "Au Sable River",
        text: "My carpet mats were soaked and stained from a summer of paddling trips. They came back looking brand new. Great work, fair price.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing"],
      },
      {
        reviewerName: "Sandra K.",
        neighborhood: "Downtown Mio",
        text: "The leather in my back seat was cracking and dull. After conditioning it looks and feels years younger. Highly recommend.",
        rating: 5,
        source: "Facebook",
        serviceTypes: ["leather-care"],
      },
      {
        reviewerName: "Jeff R.",
        neighborhood: "McKinley",
        text: "Trail dust gets into everything off-road. Ryder reset the whole interior and it was spotless. Worth every penny.",
        rating: 5,
        source: "Google",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        reviewerName: "Lisa and Dan W.",
        neighborhood: "M-33 / M-72 junction",
        text: "Washed, waxed, and detailed the wheels before a road trip. The car looked incredible and the shine lasted. Will be back.",
        rating: 5,
        source: "Google",
        serviceTypes: ["exterior-wash", "wax-and-shine", "wheels-and-tires"],
      },
      {
        reviewerName: "Carl T.",
        neighborhood: "Mio Pond",
        text: "They got the haze off the inside of my windshield that I could never clean. Streak-free and clear. Big difference.",
        rating: 5,
        source: "Google",
        serviceTypes: ["window-cleaning"],
      },
    ],
    faqs: [
      {
        question: "Can you clean carpet soaked from wet paddling gear?",
        answer:
          "Yes. We hot-water extract the moisture and staining, then treat the carpet so it dries clean and does not hold a musty smell.",
        serviceTypes: ["interior-detailing", "stain-and-odor-removal"],
      },
      {
        question: "Do you handle musty or damp odors from river gear?",
        answer:
          "We neutralize damp and musty odors at the source in the carpet and seats rather than masking them. Strong cases may need a second pass.",
        serviceTypes: ["stain-and-odor-removal"],
      },
      {
        question: "Can you get trail dust out of an off-road interior?",
        answer:
          "Absolutely. Fine trail dust settles into every seam and vent. We detail the full cabin, not just the obvious surfaces.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "Will conditioning bring back dried-out leather?",
        answer:
          "If it is dried but not torn, conditioning restores most of the suppleness and look. We clean first, then condition each panel evenly.",
        serviceTypes: ["leather-care"],
      },
      {
        question: "Can you protect my dash from sun fading?",
        answer:
          "Yes. After cleaning we apply a protectant that leaves a clean matte finish and helps slow UV fading on the dash and trim.",
        serviceTypes: ["interior-detailing"],
      },
      {
        question: "Do you wash and wax in Mio?",
        answer:
          "We do. A hand wash clears the trail grime and salt, and a wax layer protects the paint and adds gloss.",
        serviceTypes: ["exterior-wash", "wax-and-shine"],
      },
      {
        question: "Can you clean the inside of my glass streak-free?",
        answer:
          "Yes. Interior glass builds a haze you notice in the sun. We clean every window and mirror to a streak-free finish.",
        serviceTypes: ["window-cleaning"],
      },
      {
        question: "How far do you travel in Oscoda County?",
        answer:
          "We serve Mio and the surrounding Oscoda County area, including the river and forest access points. Call us to set it up.",
        serviceTypes: ["interior-detailing", "exterior-wash"],
      },
    ],
    localConstraints: {
      winterConditions: "Snowbelt winters with salt and slush; salt-stain extraction is a common winter job.",
      commonVehicles: "Paddling vehicles, fishing rigs, and off-road SUVs carrying wet gear and trail dust.",
      terrainNotes: "Au Sable River and Huron National Forest access bring river damp, sand, and fine trail dust into cabins.",
      serviceNotes: "We serve Mio and the surrounding Oscoda County river and forest access points.",
    },
    popularProjects: [
      { serviceSlug: "interior-detailing", projectTypes: ["Wet-gear carpet shampoo", "Trail-dust resets", "Dashboard detail"] },
      { serviceSlug: "stain-and-odor-removal", projectTypes: ["Musty/damp odor removal", "Stain treatment"] },
      { serviceSlug: "leather-care", projectTypes: ["Dried-leather conditioning", "Seat deep cleans"] },
      { serviceSlug: "exterior-wash", projectTypes: ["Trail-grime washes", "Foam cannon hand washes"] },
      { serviceSlug: "wax-and-shine", projectTypes: ["Protective wax", "Gloss enhancement"] },
      { serviceSlug: "wheels-and-tires", projectTypes: ["Rim cleaning", "Tire dressing"] },
      { serviceSlug: "window-cleaning", projectTypes: ["Haze removal", "Streak-free glass"] },
    ],
  },
};

export const areaKeys = Object.keys(areaData);
