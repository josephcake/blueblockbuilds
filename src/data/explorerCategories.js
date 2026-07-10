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
  }
];
