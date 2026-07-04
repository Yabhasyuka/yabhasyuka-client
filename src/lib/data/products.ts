import type { Product } from "../api/types";

export const products: Product[] = [
  {
    id: "botanical-cleanser",
    name: "Botanical Gel Cleanser",
    category: "Face",
    description: "A gentle, low-foaming cleanser infused with active extracts of chamomile and green tea. It removes daily impurities and light makeup without stripping the skin's natural lipid barrier, leaving the face soft, clean, and balanced.",
    priceIdr: 450000,
    image: "/images/products/botanical-cleanser.webp"
  },
  {
    id: "radiance-serum",
    name: "Active Radiance Serum",
    category: "Face",
    description: "A highly concentrated botanical blend of vitamin C, niacinamide, and hyaluronic acid. Formulated to target dullness and uneven skin tone, this lightweight serum absorbs quickly to restore a vibrant, dew-kissed glow.",
    priceIdr: 850000,
    image: "/images/products/radiance-serum.webp"
  },
  {
    id: "clay-mask",
    name: "Clarifying Clay Mask",
    category: "Face",
    description: "A refining mineral-rich French pink clay mask blended with soothing colloidal oatmeal and calendula. It gently draws out impurities, refines the appearance of pores, and calms irritated skin for a smooth, matte finish.",
    priceIdr: 580000,
    image: "/images/products/clay-mask.webp"
  },
  {
    id: "body-oil",
    name: "Nourishing Body Oil",
    category: "Body",
    description: "A luxurious, fast-absorbing blend of cold-pressed jojoba, sweet almond, and evening primrose oils. Scented with delicate notes of jasmine and sandalwood, it provides long-lasting hydration and a silky, radiant finish.",
    priceIdr: 650000,
    image: "/images/products/body-oil.webp"
  },
  {
    id: "bath-soak",
    name: "Mineral Bath Soak",
    category: "Bath",
    description: "A relaxing blend of Epsom and Himalayan pink salts infused with organic lavender and eucalyptus essential oils. Designed to soothe tired muscles, soften the skin, and ease the mind after a long day.",
    priceIdr: 380000,
    image: "/images/products/bath-soak.webp"
  },
  {
    id: "hand-balm",
    name: "Restorative Hand Balm",
    category: "Body",
    description: "A rich, protective cream formulated with shea butter, sea buckthorn oil, and vitamin E. It deeply repairs dry, weathered hands and conditions cuticles without leaving a greasy residue, leaving a delicate scent of orange peel.",
    priceIdr: 280000,
    image: "/images/products/hand-balm.webp"
  }
];
