export const explorerCategories = [
  {
    id: "cabinets",
    label: "Cabinets",
    title: "Cabinet Construction Explorer",
    description: "Compare framed American construction with frameless European cabinet systems, including access, reveals, toe kicks, drawers, shelves, and door behavior.",
    defaultVariant: "american",
    compareDefault: "european",
    variants: [
      {
        id: "american",
        name: "American Framed",
        cue: "Visible face frame, traditional overlay language",
        features: ["Face frame construction", "Overlay doors", "Visible rails and stiles", "Transitional profile"],
        attributes: { Construction: "Framed", Reveal: "Wider", Access: "Frame-restricted", Style: "Traditional / transitional" }
      },
      {
        id: "european",
        name: "European Frameless",
        cue: "Clean slab fronts with tight modern reveals",
        features: ["Frameless box", "Full interior access", "Tight reveals", "Handleless slab fronts"],
        attributes: { Construction: "Frameless", Reveal: "Tight", Access: "Open interior", Style: "Modern / architectural" }
      }
    ],
    modes: ["Closed", "Open doors", "Open drawers", "Cutaway", "Exploded"],
    detail: {
      what: "A cabinet system controls storage, sightlines, hardware, and how the kitchen feels in daily use.",
      best: "Use framed construction for a warmer transitional language; use frameless construction for precise modern interiors.",
      considerations: "Door gaps, hinge type, overlay, shelf access, and toe-kick detail all change the final feel."
    }
  },
  {
    id: "hinges",
    label: "Hinges",
    title: "Hinge Motion Lab",
    description: "Inspect hinge placement, swing angle, overlay behavior, soft-close housing, and exposed hardware differences on a cabinet door.",
    defaultVariant: "concealed-soft-close",
    compareDefault: "exposed-decorative",
    variants: [
      { id: "concealed", name: "Concealed", cue: "Hidden cup hinge", features: ["Cup mount", "Clean exterior", "Adjustable plate"], attributes: { Visibility: "Hidden", Swing: "110 degrees", Look: "Modern", Mount: "Interior cup" } },
      { id: "concealed-soft-close", name: "Soft-Close Concealed", cue: "Hidden hinge with damper", features: ["Integrated damper", "Quiet close", "Premium adjustment"], attributes: { Visibility: "Hidden", Swing: "110 degrees", Look: "Premium modern", Mount: "Interior cup + damper" } },
      { id: "inset", name: "Inset", cue: "Door sits inside the frame", features: ["Inset alignment", "Precise reveals", "Frame dependent"], attributes: { Visibility: "Low", Swing: "95 degrees", Look: "Furniture-like", Mount: "Frame edge" } },
      { id: "full-overlay", name: "Full Overlay", cue: "Door covers most of the face frame", features: ["Large overlay", "Reduced reveal", "Concealed hardware"], attributes: { Visibility: "Hidden", Swing: "105 degrees", Look: "Clean transitional", Mount: "Interior plate" } },
      { id: "partial-overlay", name: "Partial Overlay", cue: "More frame remains visible", features: ["Visible frame", "Classic spacing", "Simple alignment"], attributes: { Visibility: "Hidden", Swing: "100 degrees", Look: "Classic", Mount: "Interior plate" } },
      { id: "exposed-decorative", name: "Exposed Decorative", cue: "Visible barrel and leaf detail", features: ["Decorative barrel", "Visible fasteners", "Traditional detail"], attributes: { Visibility: "Visible", Swing: "95 degrees", Look: "Traditional", Mount: "Exterior leaves" } },
      { id: "wide-angle", name: "Wide-Angle Specialty", cue: "Extra swing for access", features: ["Wide opening", "Layered arms", "Specialty access"], attributes: { Visibility: "Hidden", Swing: "155 degrees", Look: "Technical", Mount: "Wide-angle cup" } }
    ],
    modes: ["Closed", "Partial open", "Fully open", "X-ray", "Exploded"],
    detail: {
      what: "Hinges decide how doors align, how far they open, and how refined the cabinet feels in motion.",
      best: "Concealed soft-close hinges are the quiet premium default; exposed hinges are best when the hardware is part of the design language.",
      considerations: "Inset, overlay, door thickness, and swing clearance should be chosen before ordering cabinetry."
    }
  },
  {
    id: "cooktops",
    label: "Cooktops",
    title: "Cooktop Surface Comparison",
    description: "Study gas, electric, and induction cooktops as built-in appliances mounted into a countertop cutout.",
    defaultVariant: "induction",
    compareDefault: "gas",
    variants: [
      { id: "gas", name: "Gas Cooktop", cue: "Burners, grates, knobs, visible flame", features: ["Cast grates", "Burner caps", "Physical controls", "Flame feedback"], attributes: { Heat: "Open flame", Surface: "Metal + grates", Cleaning: "More parts", Style: "Professional" } },
      { id: "electric", name: "Electric Cooktop", cue: "Radiant rings under smooth glass", features: ["Radiant zones", "Glass ceramic top", "Glow feedback", "Touch controls"], attributes: { Heat: "Radiant", Surface: "Smooth glass", Cleaning: "Simple wipe", Style: "Minimal" } },
      { id: "induction", name: "Induction Cooktop", cue: "Minimal top with digital controls", features: ["Magnetic zones", "Cooler surrounding surface", "Low profile", "Digital interface"], attributes: { Heat: "Induction", Surface: "Smooth glass", Cleaning: "Simple wipe", Style: "Modern premium" } }
    ],
    modes: ["Installed", "On", "Cutaway", "Detail"],
    detail: {
      what: "Cooktops affect the countertop cutout, appliance profile, control language, and kitchen visual rhythm.",
      best: "Induction is the clean modern option; gas keeps a professional, tactile cooking signal.",
      considerations: "Power, ventilation, cookware, cleaning, and countertop thickness should be coordinated early."
    }
  },
  {
    id: "flooring",
    label: "Flooring",
    title: "Flooring Material Library",
    description: "Compare plank layout, construction layers, seams, bevels, reflectivity, and wood grain behavior at sample and room scale.",
    defaultVariant: "engineered",
    compareDefault: "hardwood",
    variants: [
      { id: "vinyl", name: "Luxury Vinyl", cue: "Waterproof plank with printed wear layer", features: ["Wear layer", "Water-resistant core", "Tight seams", "Wood-look surface"], attributes: { Build: "Layered synthetic", Water: "High resistance", Texture: "Embossed print", Feel: "Practical" } },
      { id: "laminate", name: "Laminate", cue: "Printed surface over dense core", features: ["Printed visual layer", "Core board", "Click seams", "Durable top coat"], attributes: { Build: "Layered core", Water: "Moderate", Texture: "Printed grain", Feel: "Efficient" } },
      { id: "engineered", name: "Engineered Wood", cue: "Real veneer over stable core", features: ["Wood veneer", "Layered core", "Premium finish", "Stable construction"], attributes: { Build: "Veneer + core", Water: "Moderate", Texture: "Real wood top", Feel: "Premium" } },
      { id: "hardwood", name: "Hardwood", cue: "Solid plank with natural grain depth", features: ["Solid wood", "Natural variation", "Beveled edge", "Refinish potential"], attributes: { Build: "Solid plank", Water: "Low", Texture: "Natural grain", Feel: "Classic luxury" } }
    ],
    modes: ["Room plane", "Sample block", "Cross-section", "Exploded"],
    detail: {
      what: "Flooring changes acoustics, light reflection, maintenance, and how connected a renovation feels room to room.",
      best: "Engineered wood is a strong premium balance; vinyl works well where water resistance is the priority.",
      considerations: "Subfloor, transitions, plank direction, finish sheen, and moisture exposure matter as much as color."
    }
  },
  {
    id: "countertops",
    label: "Countertops",
    title: "Countertop Slab Studio",
    description: "Explore slab thickness, edge profile, backsplash, waterfall options, finish, cutouts, and material character.",
    defaultVariant: "quartz",
    compareDefault: "marble",
    variants: [
      { id: "quartz", name: "Quartz", cue: "Engineered consistency with refined veining", features: ["Consistent pattern", "Polished or matte", "Durable surface", "Modern edges"], attributes: { Type: "Engineered", Pattern: "Controlled", Care: "Low", Look: "Refined" } },
      { id: "granite", name: "Granite", cue: "Natural mineral variation", features: ["Speckled movement", "Natural stone", "High durability", "Unique slabs"], attributes: { Type: "Natural", Pattern: "Mineral variation", Care: "Sealing", Look: "Organic" } },
      { id: "marble", name: "Marble", cue: "Expressive natural veining", features: ["Dramatic veining", "Natural stone", "Cool elegance", "Classic luxury"], attributes: { Type: "Natural", Pattern: "Large veining", Care: "Higher", Look: "Elegant" } },
      { id: "butcher", name: "Butcher Block", cue: "Warm wood surface", features: ["Wood grain", "Thicker edge", "Warm tone", "Soft tactile feel"], attributes: { Type: "Wood", Pattern: "Linear grain", Care: "Oiling", Look: "Warm" } },
      { id: "laminate", name: "Laminate", cue: "Printed surface with efficient profile", features: ["Printed top", "Thin profile", "Integrated edge", "Budget-flexible"], attributes: { Type: "Manmade", Pattern: "Printed", Care: "Easy", Look: "Flexible" } },
      { id: "solid-surface", name: "Solid Surface", cue: "Seam-friendly manmade material", features: ["Soft matte finish", "Integrated shaping", "Repairable surface", "Quiet pattern"], attributes: { Type: "Manmade", Pattern: "Subtle", Care: "Moderate", Look: "Minimal" } },
      { id: "porcelain", name: "Porcelain Slab", cue: "Thin sintered premium surface", features: ["Thin slab", "High resistance", "Large format", "Crisp edge"], attributes: { Type: "Sintered", Pattern: "Printed mineral", Care: "Low", Look: "Architectural" } }
    ],
    modes: ["Slab", "Installation", "Edge detail", "Cutaway", "Waterfall"],
    detail: {
      what: "Countertops define the work surface, visual weight, edge detail, and how fixtures integrate.",
      best: "Quartz is the polished everyday luxury choice; marble is the dramatic natural statement.",
      considerations: "Thickness, edge profile, seams, sink type, cooktop cutout, finish, and maintenance should be decided together."
    }
  },
  {
    id: "bath",
    label: "Shower / Bathtub",
    title: "Bath Fixture Vignettes",
    description: "Switch between shower and tub systems, glass panels, doors, drains, niches, benches, faucets, and footprint views.",
    defaultVariant: "freestanding-tub",
    compareDefault: "walk-in-shower",
    variants: [
      { id: "walk-in-shower", name: "Walk-In Shower", cue: "Open shower with glass panel", features: ["Shower pan", "Glass return", "Linear drain", "Wall fixture"], attributes: { Footprint: "Open", Glass: "Single panel", Access: "Easy", Style: "Spa modern" } },
      { id: "alcove-tub", name: "Alcove Bathtub", cue: "Built-in tub with apron front", features: ["Apron front", "Wall surround", "Overflow", "Tub filler"], attributes: { Footprint: "Compact", Glass: "Optional", Access: "Step-in", Style: "Classic" } },
      { id: "freestanding-tub", name: "Freestanding Bathtub", cue: "Sculptural oval centerpiece", features: ["Oval shell", "Floor filler", "Soft radius", "Statement form"], attributes: { Footprint: "Open", Glass: "None", Access: "Soaking", Style: "Luxury spa" } },
      { id: "shower-tub-combo", name: "Shower-Tub Combo", cue: "Bathing and showering in one bay", features: ["Apron tub", "Glass screen", "Wall shower", "Shared drain"], attributes: { Footprint: "Efficient", Glass: "Screen", Access: "Multi-use", Style: "Practical" } },
      { id: "frameless-glass", name: "Frameless Glass Shower", cue: "Minimal enclosure with premium glass", features: ["Frameless panels", "Hinged door", "Bench", "Niche"], attributes: { Footprint: "Enclosed", Glass: "Frameless", Access: "Door", Style: "High-end" } },
      { id: "semi-frameless", name: "Semi-Frameless Shower", cue: "Lean framed detail with cleaner lines", features: ["Slim frame", "Glass door", "Pan base", "Wall fixture"], attributes: { Footprint: "Enclosed", Glass: "Slim frame", Access: "Door", Style: "Transitional" } }
    ],
    modes: ["Product", "Vignette", "Glass off", "Door open", "Footprint", "Exploded"],
    detail: {
      what: "Bath fixtures determine comfort, access, waterproofing strategy, and the room's sculptural center.",
      best: "Freestanding tubs create a calm statement; walk-in showers and frameless glass feel open and architectural.",
      considerations: "Drain location, waterproofing, glass swing, niche placement, and fixture clearance should be planned as one system."
    }
  },
  {
    id: "toilets",
    label: "Toilets",
    title: "Toilet Form + Bidet Explorer",
    description: "Inspect bowl shape, tank profile, seat and lid behavior, bidet equipment, controls, power detail, and footprint.",
    defaultVariant: "electric-bidet",
    compareDefault: "standard-elongated",
    variants: [
      { id: "standard-round", name: "Round Standard", cue: "Compact bowl without bidet", features: ["Round bowl", "Tank", "Standard seat", "Compact footprint"], attributes: { Bowl: "Round", Bidet: "None", Power: "No", Profile: "Compact" } },
      { id: "standard-elongated", name: "Elongated Standard", cue: "Oval comfort bowl without bidet", features: ["Elongated bowl", "Tank", "Comfort seat", "Classic base"], attributes: { Bowl: "Elongated", Bidet: "None", Power: "No", Profile: "Comfort" } },
      { id: "manual-bidet", name: "Manual Bidet Seat", cue: "Seat attachment with side control", features: ["Nozzle location", "Side dial", "Standard tank", "Retrofit seat"], attributes: { Bowl: "Elongated", Bidet: "Manual", Power: "No", Profile: "Practical" } },
      { id: "electric-bidet", name: "Electric Bidet Toilet", cue: "Integrated seat, panel, and power detail", features: ["Electric seat", "Control panel", "Nozzle cover", "Power lead"], attributes: { Bowl: "Elongated", Bidet: "Electric", Power: "Required", Profile: "Premium" } },
      { id: "square-modern", name: "Square Modern", cue: "Angular wall-hugging silhouette", features: ["Square seat", "Crisp base", "Modern tank", "Slim controls"], attributes: { Bowl: "Square", Bidet: "Optional", Power: "Optional", Profile: "Architectural" } }
    ],
    modes: ["Closed", "Seat open", "Lid open", "Bidet reveal", "Footprint", "Exploded"],
    detail: {
      what: "Toilet selection affects comfort, silhouette, cleaning, bidet planning, and utility requirements.",
      best: "Electric bidet toilets feel most premium when power and clearances are planned from the start.",
      considerations: "Bowl shape, seat thickness, control placement, outlet location, and base form all change the final bathroom feel."
    }
  }
];
