import type { Service } from "../api/types";

export const services: Service[] = [
  {
    slug: "balinese-signature-massage",
    pillar: "relaxation",
    name: "Balinese Signature Massage",
    tagline: "A deeply restorative therapy combining long fluid strokes and gentle stretching.",
    description: "This signature treatment honors traditional Balinese healing techniques to release deep-seated physical tension. Using custom-blended organic oils infused with local botanicals, our therapists work mindfully to restore harmony and flow to the body. A concluding warm compress leaves you grounded and refreshed.",
    benefits: [
      "Releases chronic muscular tension",
      "Improves blood and lymphatic circulation",
      "Promotes profound mental clarity",
      "Restores energy flow and balance"
    ],
    durationMinutes: 90,
    priceIdr: 750000,
    image: "/images/services/balinese-signature-massage.webp"
  },
  {
    slug: "warm-stone-ritual",
    pillar: "relaxation",
    name: "Warm Stone Ritual",
    tagline: "Harness the grounding energy of heated river stones and therapeutic touch.",
    description: "Smooth, heated basalt stones are placed on key energy pathways and used as extensions of the hands to melt away tension. The penetrating warmth reaches deep into muscle layers, calming the nervous system and easing stiff joints. It is a slow, deeply comforting experience that encourages complete surrender.",
    benefits: [
      "Deeply relaxes tight muscle fibers",
      "Alleviates physical and mental stress",
      "Enhances localized circulation",
      "Supports restorative sleep patterns"
    ],
    durationMinutes: 90,
    priceIdr: 950000,
    image: "/images/services/warm-stone-ritual.webp"
  },
  {
    slug: "head-scalp-sanctuary",
    pillar: "relaxation",
    name: "Head & Scalp Sanctuary",
    tagline: "A soothing botanical therapy dedicated to releasing tension from the shoulders upward.",
    description: "Targeting the delicate pressure points of the scalp, neck, and shoulders, this treatment uses warm, nutrient-rich botanical oils to nourish the hair and scalp. Through rhythmic acupressure and gentle stretching, it coaxes the mind into a state of quiet stillness. Ideal for relieving mental fatigue and digital strain.",
    benefits: [
      "Relieves tension headaches and neck stiffness",
      "Nourishes the hair roots and scalp",
      "Reduces overall mental stress and anxiety",
      "Promotes a sense of light, quiet focus"
    ],
    durationMinutes: 60,
    priceIdr: 450000,
    image: "/images/services/head-scalp-sanctuary.webp"
  },
  {
    slug: "face-sculpting-ritual",
    pillar: "sculpting",
    name: "Face Sculpting Ritual",
    tagline: "Define and lift the natural contours of the face through precise manual manipulation.",
    description: "A non-invasive, highly technical facial massage that works the deeper muscle groups of the face and neck. By combining deep tissue lifting, buccal techniques, and light gua sha movements, we stimulate collagen production and tone facial contours. This ritual releases jaw tension and reveals a naturally sculpted, elevated silhouette.",
    benefits: [
      "Defines jawline and cheekbone structure",
      "Reduces puffiness and fluid retention",
      "Softens mimic lines and releases jaw tension",
      "Improves muscular tone and elasticity"
    ],
    durationMinutes: 75,
    priceIdr: 1200000,
    image: "/images/services/face-sculpting-ritual.webp"
  },
  {
    slug: "body-contour-flow",
    pillar: "sculpting",
    name: "Body Contour Flow",
    tagline: "A firm, stimulating therapy designed to tone, smooth, and redefine the silhouette.",
    description: "Using dynamic rolling and kneading techniques, this specialized massage targets areas of concern to assist in smoothing skin texture. A firming botanical balm is integrated to improve skin elasticity and support natural detoxification. Your body feels lighter, firmer, and beautifully realigned.",
    benefits: [
      "Assists in smoothing skin texture and cellulite",
      "Enhances skin firmness and elasticity",
      "Stimulates circulation and tissue renewal",
      "Supports the body's natural contouring process"
    ],
    durationMinutes: 90,
    priceIdr: 1350000,
    image: "/images/services/body-contour-flow.webp"
  },
  {
    slug: "lymphatic-drainage",
    pillar: "sculpting",
    name: "Lymphatic Drainage",
    tagline: "Gentle, rhythmic strokes to support the body's natural detoxification pathways.",
    description: "This highly specialized, light-touch therapy follows the natural pathways of the lymphatic system to encourage the movement of lymph fluids. By reducing water retention and promoting detoxification, it relieves feelings of heaviness and bloating. A soothing treatment that leaves you feeling lighter, revitalized, and balanced from within.",
    benefits: [
      "Reduces systemic swelling and fluid retention",
      "Accelerates the elimination of metabolic waste",
      "Supports and strengthens the immune system",
      "Promotes a light, energized physical state"
    ],
    durationMinutes: 75,
    priceIdr: 1100000,
    image: "/images/services/lymphatic-drainage.webp"
  },
  {
    slug: "signature-glow-facial",
    pillar: "aesthetic",
    name: "Signature Glow Facial",
    tagline: "A bespoke botanical facial designed to restore radiant vitality and deep hydration.",
    description: "Customized to address your skin's immediate needs, this facial combines gentle exfoliation, active botanical serums, and a nourishing mask. We focus on feeding the skin barrier with essential lipids, vitamins, and antioxidants to promote a healthy, dewy complexion. The treatment concludes with a relaxing hand and arm massage.",
    benefits: [
      "Restores immediate radiance and brightness",
      "Deeply hydrates and plumps the skin barrier",
      "Calms redness and balances skin tone",
      "Protects against environmental stressors"
    ],
    durationMinutes: 75,
    priceIdr: 1500000,
    image: "/images/services/signature-glow-facial.webp"
  },
  {
    slug: "radiance-peel",
    pillar: "aesthetic",
    name: "Radiance Peel",
    tagline: "A gentle yet effective resurfacing treatment to refine texture and clarify the tone.",
    description: "Formulated with mild natural acids and soothing botanical enzymes, this professional-grade peel gently dissolves dull surface cells to accelerate cellular renewal. We follow the exfoliation with a calming cooling mask to replenish hydration and prevent irritation. The skin emerges remarkably soft, luminous, and refined.",
    benefits: [
      "Improves skin texture and minimizes pores",
      "Brightens dark spots and evens skin tone",
      "Stimulates cellular turn-over and collagen",
      "Restores a soft, velvet-like finish to the skin"
    ],
    durationMinutes: 60,
    priceIdr: 1800000,
    image: "/images/services/radiance-peel.webp"
  },
  {
    slug: "skin-revival-therapy",
    pillar: "aesthetic",
    name: "Skin Revival Therapy",
    tagline: "An advanced nourishing ritual designed to target signs of aging and environmental stress.",
    description: "This premium aesthetic therapy delivers concentrated doses of peptides, hyaluronic acid, and botanical stem cells deep into the epidermis. Combining ultrasonic infusion with a lifting facial massage, it supports cellular health and firms the skin structure. A luxurious treatment that leaves the face plumped, deeply nourished, and visibly revived.",
    benefits: [
      "Fades fine lines and improves structural firmness",
      "Delivers intense, long-lasting cellular hydration",
      "Boosts natural collagen and elastin synthesis",
      "Provides a comprehensive, youthful skin reset"
    ],
    durationMinutes: 90,
    priceIdr: 2400000,
    image: "/images/services/skin-revival-therapy.webp"
  }
];
