import { Product } from '../types';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'cm-101',
    name: "Women's Elegant Kurti",
    slug: 'womens-elegant-kurti',
    category: "Women's Fashion",
    subcategory: 'Kurtis',
    price: 1850,
    oldPrice: 2450,
    rating: 4.8,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Gracefully stitched breathable cotton-viscose blend kurti featuring subtle artisan embroidery along the neckline.',
    description: 'Designed for effortless everyday wear and festive family gatherings in Bangladesh weather. Crafted with pre-shrunk premium breathable cotton weave that stays comfortable even in peak summer humid days. Tailored with neat side slits and fine thread detailing.',
    sku: 'CM-WF-001',
    inStock: true,
    stockCount: 24,
    isFeatured: true,
    isTrending: true,
    badge: 'Trending',
    tags: ['cotton', 'kurti', 'festive', 'traditional', 'casual'],
    specifications: {
      'Fabric': 'Breathable Cotton-Viscose Blend',
      'Pattern': 'Subtle Artisan Embroidery',
      'Fit': 'Regular Straight Cut',
      'Care': 'Gentle Hand Wash or Machine Wash Cold',
      'Origin': 'Dhaka, Bangladesh'
    },
    variations: [
      { name: 'Color', options: ['Powder Blue', 'Sage Green', 'Dusty Rose'] },
      { name: 'Size', options: ['M (38")', 'L (40")', 'XL (42")', 'XXL (44")'] }
    ],
    reviewsList: [
      {
        id: 'r-1',
        userName: 'Nusrat Jahan',
        rating: 5,
        date: '14 Sep 2026',
        comment: 'Color and stitching quality match the photos very closely. The fabric is quite light and comfortable for Dhaka heat.',
        verifiedPurchase: true
      },
      {
        id: 'r-2',
        userName: 'Sadia Rahman',
        rating: 4,
        date: '02 Sep 2026',
        comment: 'Fitting is accurate to the size chart. Delivery took only 2 days in Mirpur.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-102',
    name: "Premium Women's Crossbody Bag",
    slug: 'premium-womens-crossbody-bag',
    category: "Women's Fashion",
    subcategory: 'Bags',
    price: 2150,
    oldPrice: 2800,
    rating: 4.9,
    reviewCount: 47,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Structured vegan leather crossbody with magnetic clasp, metallic chain-accent strap, and phone organizer slots.',
    description: 'A versatile bag tailored for modern women on the move. Fits large smartphones, compact makeup items, card holder, keys, and a compact powerbank securely with reinforced stitching and smooth gold-tone zippers.',
    sku: 'CM-WF-008',
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isSpecialOffer: true,
    badge: 'Popular',
    tags: ['bag', 'crossbody', 'vegan leather', 'office', 'lifestyle'],
    specifications: {
      'Material': 'High-Grade Textured PU Vegan Leather',
      'Dimensions': '22cm x 15cm x 7cm',
      'Strap Length': 'Adjustable up to 120cm',
      'Closure': 'Secure Magnetic Snap + Zippered Main Compartment'
    },
    variations: [
      { name: 'Color', options: ['Caramel Brown', 'Onyx Black', 'Cream Taupe'] }
    ],
    reviewsList: [
      {
        id: 'r-3',
        userName: 'Tasnim Ahmed',
        rating: 5,
        date: '10 Sep 2026',
        comment: 'Looks far more expensive than 2150 taka. Very sturdy magnetic button and well-divided compartments.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-103',
    name: 'Minimal Gold-Tone Necklace',
    slug: 'minimal-gold-tone-necklace',
    category: "Women's Jewelry",
    subcategory: 'Necklaces',
    price: 950,
    oldPrice: 1350,
    rating: 4.7,
    reviewCount: 62,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Anti-tarnish 18K PVD gold-coated stainless steel chain with subtle geometric pendant.',
    description: 'Designed for daily office or college wear without worrying about rapid discoloration. Anti-allergenic finish that is gentle on sensitive skin. Layerable with other chains.',
    sku: 'CM-WJ-014',
    inStock: true,
    stockCount: 40,
    isTrending: true,
    badge: 'Best Value',
    tags: ['jewelry', 'necklace', 'gold tone', 'anti tarnish', 'minimal'],
    specifications: {
      'Base Metal': 'Surgical Grade 316L Stainless Steel',
      'Plating': 'Vacuum PVD 18K Gold Plated',
      'Chain Length': '40cm + 5cm extension extender',
      'Skin Friendly': 'Lead & Nickel Free'
    },
    variations: [
      { name: 'Pendant Style', options: ['Minimal Bar', 'Dainty Disc', 'Crescent Moon'] }
    ],
    reviewsList: [
      {
        id: 'r-4',
        userName: 'Farzana Chowdhury',
        rating: 5,
        date: '11 Sep 2026',
        comment: 'Been wearing it daily for 3 weeks, no color fading even with sweat. Great packaging too.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-104',
    name: 'Classic Pearl Earrings',
    slug: 'classic-pearl-earrings',
    category: "Women's Jewelry",
    subcategory: 'Earrings',
    price: 750,
    oldPrice: 1100,
    rating: 4.6,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Refined freshwater imitation shell pearls set on hypoallergenic surgical steel posts.',
    description: 'Timeless stud earrings that elevate ethnic saris, salwar suits, and modern western shirts alike. Secure silicone backs included with metal pushers.',
    sku: 'CM-WJ-021',
    inStock: true,
    stockCount: 35,
    isNewArrival: true,
    badge: 'Under ৳999',
    tags: ['pearls', 'earrings', 'studs', 'jewelry', 'classic'],
    specifications: {
      'Pearl Type': 'Shell Pearl (High Luster)',
      'Diameter': '8mm / 10mm options',
      'Post Material': 'Hypoallergenic Surgical Steel',
      'Weight': '2.4g pair'
    },
    variations: [
      { name: 'Pearl Diameter', options: ['8mm (Delicate)', '10mm (Statement)'] }
    ],
    reviewsList: [
      {
        id: 'r-5',
        userName: 'Ayesha Siddika',
        rating: 4,
        date: '28 Aug 2026',
        comment: 'Very clean shine and didn’t irritate my sensitive ears. Recommend for everyday wear.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-105',
    name: 'Sunflower Spinning Ring',
    slug: 'sunflower-spinning-ring',
    category: "Women's Jewelry",
    subcategory: 'Rings',
    price: 680,
    oldPrice: 950,
    rating: 4.9,
    reviewCount: 74,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Interactive fidget meditation ring featuring a smooth rotating micro-pave sunflower head.',
    description: 'Anxiety-relieving rotating design with an adjustable band suitable for any finger size. High polish with clear cubic zirconia insets.',
    sku: 'CM-WJ-035',
    inStock: true,
    stockCount: 50,
    isTrending: true,
    isSpecialOffer: true,
    badge: 'Viral Pick',
    tags: ['ring', 'fidget', 'spinning ring', 'sunflower', 'anxiety relief'],
    specifications: {
      'Size': 'Adjustable Open Band (Fits ring size 5 to 9)',
      'Movement': 'Dual Micro-Bearing Smooth 360 Spin',
      'Inlay': 'AAA Grade Cubic Zirconia'
    },
    variations: [
      { name: 'Finish', options: ['Golden Glow', 'Silver Shine'] }
    ],
    reviewsList: [
      {
        id: 'r-6',
        userName: 'Maliha Haque',
        rating: 5,
        date: '05 Sep 2026',
        comment: 'The spin is super smooth and silent. It actually helps calm down during long desk hours.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-106',
    name: 'Adjustable Aluminum Laptop Stand',
    slug: 'adjustable-aluminum-laptop-stand',
    category: 'Computer Accessories',
    subcategory: 'Laptop Stands',
    price: 1450,
    oldPrice: 1950,
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Foldable ergonomic laptop riser with 6-level tilt adjustment and heat dissipation hollow layout.',
    description: 'Supports laptops from 10" to 15.6" including MacBooks, ThinkPads, and Dell XPS. Made from sandblasted anodized aluminum alloy with non-slip silicone pads on top and base.',
    sku: 'CM-CA-012',
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isTrending: true,
    badge: 'Best Seller',
    tags: ['laptop stand', 'ergonomic', 'aluminum', 'desk accessories', 'wfh'],
    specifications: {
      'Material': 'Precision Anodized Aluminum Alloy',
      'Angles': '6 Configurable Elevation Angles (15° to 45°)',
      'Load Capacity': 'Up to 20 kg',
      'Compatibility': '10 to 15.6 inch laptops and tablets',
      'Pouch Included': 'Free Velvet Carrying Sleeve'
    },
    variations: [
      { name: 'Color', options: ['Space Gray', 'Silver Metallic'] }
    ],
    reviewsList: [
      {
        id: 'r-7',
        userName: 'Tanvir Hasan',
        rating: 5,
        date: '12 Sep 2026',
        comment: 'Very solid build. Neck pain has reduced a lot since using this with an external keyboard.',
        verifiedPurchase: true
      },
      {
        id: 'r-8',
        userName: 'Kazi Mahbub',
        rating: 5,
        date: '08 Sep 2026',
        comment: 'Doesn’t shake while typing. Easy to pack into my office backpack.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-107',
    name: 'USB Desk Light with Clamp',
    slug: 'usb-desk-light-with-clamp',
    category: 'Electronics',
    subcategory: 'Lighting',
    price: 1250,
    oldPrice: 1650,
    rating: 4.7,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Flexible gooseneck LED task light with 3 color temperatures, stepless dimmer, and sturdy table clamp.',
    description: 'Provides flicker-free eye-protective light for late night study, work sessions, or reading. Powered via standard USB port, power bank, or mobile charger.',
    sku: 'CM-EL-009',
    inStock: true,
    stockCount: 22,
    isFeatured: true,
    badge: 'Popular',
    tags: ['lighting', 'desk lamp', 'usb light', 'study', 'workstation'],
    specifications: {
      'Power Source': '5V 2A USB (1.5m braided cable)',
      'Color Temp': '3000K Warm / 4500K Natural / 6000K Cool White',
      'Brightness': '10 Dimming Steps',
      'Clamp Width': 'Fits up to 5cm desktop thickness'
    },
    variations: [
      { name: 'Color', options: ['Matte Black', 'Minimal White'] }
    ],
    reviewsList: [
      {
        id: 'r-9',
        userName: 'Dr. Anisur Rahman',
        rating: 5,
        date: '09 Sep 2026',
        comment: 'The 3 color modes are great. Warm mode is very easy on eyes during midnight reading.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-108',
    name: 'Wireless Mini Speaker',
    slug: 'wireless-mini-speaker',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 1350,
    oldPrice: 1850,
    rating: 4.8,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Compact Bluetooth 5.3 pocket speaker with deep bass radiator, splash resistance, and 6hr battery.',
    description: 'Crisp sound in an ultra-portable cylindrical metal housing. Fits into your pocket or bike mount easily. Includes built-in mic for hands-free speakerphone calls.',
    sku: 'CM-EL-017',
    inStock: true,
    stockCount: 25,
    isTrending: true,
    isNewArrival: true,
    badge: 'Top Audio',
    tags: ['speaker', 'bluetooth', 'audio', 'gadgets', 'portable'],
    specifications: {
      'Bluetooth Version': '5.3 (Up to 10m range)',
      'Battery Life': '6-8 hours playback on medium volume',
      'Charging Time': '1.5 hours via USB-C',
      'Water Resistance': 'IPX4 Splash Proof'
    },
    variations: [
      { name: 'Color', options: ['Midnight Black', 'Forest Green', 'Navy Blue'] }
    ],
    reviewsList: [
      {
        id: 'r-10',
        userName: 'Zubair Hossain',
        rating: 5,
        date: '13 Sep 2026',
        comment: 'Loud enough to fill a standard bedroom with noticeable bass. Connects immediately to phone.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-109',
    name: 'Smart USB-C Multiport Hub',
    slug: 'smart-usbc-multiport-hub',
    category: 'Computer Accessories',
    subcategory: 'USB Hubs',
    price: 1750,
    oldPrice: 2300,
    rating: 4.9,
    reviewCount: 65,
    images: [
      'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: '5-in-1 Type-C aluminum adapter with 4K HDMI, 100W PD charging pass-through, and 3x USB 3.0 ports.',
    description: 'Essential expansion dongle for MacBook Air/Pro, iPad, and modern Windows laptops with limited ports. Integrated thermal chip prevents overheating.',
    sku: 'CM-CA-025',
    inStock: true,
    stockCount: 28,
    isFeatured: true,
    badge: 'Office Must',
    tags: ['usb hub', 'usb-c', 'hdmi', 'adapter', 'macbook'],
    specifications: {
      'Video Output': 'HDMI 4K @ 30Hz / 1080p @ 60Hz',
      'Power Delivery': 'Up to 100W Pass-through charging',
      'Data Transfer': '5 Gbps high speed USB 3.0',
      'Body': 'Shielded Aluminum Alloy Heat Sink'
    },
    variations: [
      { name: 'Configuration', options: ['5-in-1 Compact', '7-in-1 with SD Card Reader (+৳400)'] }
    ],
    reviewsList: [
      {
        id: 'r-11',
        userName: 'Imtiaz Ahmed',
        rating: 5,
        date: '06 Sep 2026',
        comment: 'Worked out of the box with my MacBook M2. HDMI output to monitor is crisp with zero lag.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-110',
    name: 'Foldable Desktop Phone Holder',
    slug: 'foldable-desktop-phone-holder',
    category: 'Mobile Accessories',
    subcategory: 'Phone Holders',
    price: 450,
    oldPrice: 650,
    rating: 4.8,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Dual-hinge pocket-sized adjustable stand with weighted anti-slip metal base and charging slot cutout.',
    description: 'Keep your smartphone at eye level for video calls, YouTube cooking guides, or Zoom conferences. Folds flat to fit in your pocket or purse.',
    sku: 'CM-MA-003',
    inStock: true,
    stockCount: 65,
    isSpecialOffer: true,
    badge: 'Super Deal',
    tags: ['phone stand', 'mobile holder', 'desk', 'folding', 'under 500'],
    specifications: {
      'Weight': '160g weighted base for phone stability',
      'Compatibility': 'All iPhones, Android smartphones & up to 10" tablets',
      'Angle Adjustment': 'Dual 270° rotating hinges',
      'Charging Friendly': 'Reserved cable opening'
    },
    variations: [
      { name: 'Color', options: ['Pure Black', 'Pearl White', 'Rose Pink'] }
    ],
    reviewsList: [
      {
        id: 'r-12',
        userName: 'Nazmul Islam',
        rating: 5,
        date: '15 Sep 2026',
        comment: 'Value for money is unmatched. Heavy enough that tapping the screen doesn’t flip the phone over.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-111',
    name: 'Electric Kitchen Chopper & Processor',
    slug: 'electric-kitchen-chopper',
    category: 'Kitchen & Household',
    subcategory: 'Electric Kitchen Items',
    price: 1950,
    oldPrice: 2600,
    rating: 4.8,
    reviewCount: 53,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Quick 2L stainless steel multi-blade vegetable and meat mincer with dual speed motor pulse control.',
    description: 'Chops onions, garlic, chillies, ginger, and minces boneless chicken in just 8 to 15 seconds. Food-grade rust-resistant stainless steel bowl that is easy to wash.',
    sku: 'CM-KH-015',
    inStock: true,
    stockCount: 16,
    isFeatured: true,
    isTrending: true,
    badge: 'Kitchen Hero',
    tags: ['kitchen', 'chopper', 'food processor', 'appliance', 'cooking'],
    specifications: {
      'Capacity': '2.0 Liters Thick Stainless Steel Bowl',
      'Power': '300W High-Torque Pure Copper Motor',
      'Blade': '4-Leaf S-Shape Bi-Level Blades',
      'Speed': '2 Push-Button Settings (Soft Veg / Hard Meat)'
    },
    variations: [
      { name: 'Bowl Type', options: ['Stainless Steel 2L', 'Thick Glass Bowl 2L (+৳150)'] }
    ],
    reviewsList: [
      {
        id: 'r-13',
        userName: 'Roksana Begum',
        rating: 5,
        date: '04 Sep 2026',
        comment: 'Chops 500g onions in 10 seconds without any tears! Cleaned easily under tap water.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-112',
    name: 'Ceramic Ultrasonic Aroma Diffuser',
    slug: 'ceramic-ultrasonic-aroma-diffuser',
    category: 'Home & Living',
    subcategory: 'Decor',
    price: 1650,
    oldPrice: 2200,
    rating: 4.9,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Handcrafted ceramic ultrasonic mist humidifier with 7 ambient LED glow moods and auto-shutoff.',
    description: 'Fill your bedroom, living space, or office with soothing essential oil fragrances. Ultra-quiet operation under 25dB with waterless safety turn-off mechanism.',
    sku: 'CM-HL-005',
    inStock: true,
    stockCount: 19,
    isNewArrival: true,
    badge: 'New Arrival',
    tags: ['diffuser', 'aromatherapy', 'home decor', 'humidifier', 'peaceful'],
    specifications: {
      'Material': 'Frosted Matte Ceramic Shell + BPA-Free Tank',
      'Tank Capacity': '160ml (Up to 7 hours continuous mist)',
      'Timer Modes': '1H / 3H / Continuous / Intermittent',
      'Noise Level': '<25dB whisper quiet'
    },
    variations: [
      { name: 'Color', options: ['Warm Sand Stone', 'Nordic White', 'Basalt Charcoal'] }
    ],
    reviewsList: [
      {
        id: 'r-14',
        userName: 'Shabnam Parveen',
        rating: 5,
        date: '07 Sep 2026',
        comment: 'Looks like a luxury art piece on my bedside table. The gentle mist makes the room smell amazing.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-113',
    name: 'Pure Organic Rose Water Facial Mist',
    slug: 'pure-organic-rose-water-facial-mist',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    price: 550,
    oldPrice: 750,
    rating: 4.8,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1608248597359-0a67f0855263?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: '100% steam-distilled damask rose floral hydrosol for instant hydration, pore tightening, and refreshing glow.',
    description: 'Alcohol-free and preservative-free daily toner and refreshing mist. Balances pH levels of Bangladeshi skin facing heat and humidity. Can be used under makeup or as a bedtime soothing toner.',
    sku: 'CM-BP-001',
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isNewArrival: true,
    badge: 'Hot Seller',
    tags: ['rose water', 'skincare', 'toner', 'facial mist', 'organic', 'glow'],
    specifications: {
      'Volume': '120ml fine mist spray bottle',
      'Extraction': 'Hydro-steam distilled from fresh rose petals',
      'Skin Suitability': 'All skin types, including acne-prone & sensitive',
      'Free From': 'Parabens, Alcohol, Artificial Fragrances'
    },
    variations: [
      { name: 'Bottle Size', options: ['120ml Travel Size', '200ml Family Pack'] }
    ],
    reviewsList: [
      {
        id: 'r-15',
        userName: 'Sadia Afrin',
        rating: 5,
        date: '12 Sep 2026',
        comment: 'Very soothing, fresh natural scent and zero stickiness in this humid weather. Absolutely love it!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-114',
    name: 'Natural Herbal Red Onion & Kalonji Hair Oil',
    slug: 'natural-herbal-red-onion-kalonji-hair-oil',
    category: 'Beauty & Personal Care',
    subcategory: 'Hair Care',
    price: 680,
    oldPrice: 950,
    rating: 4.7,
    reviewCount: 48,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Cold-pressed hair growth blend enriched with red onion extract, black seed (kalonji), and pure almond oil.',
    description: 'Formulated to reduce hair fall, combat scalp dandruff, and encourage natural volume. Comes with an easy-to-use root applicator comb cap for mess-free scalp application.',
    sku: 'CM-BP-002',
    inStock: true,
    stockCount: 38,
    isTrending: true,
    badge: 'Under ৳999',
    tags: ['hair oil', 'onion oil', 'kalonji', 'hair care', 'scalp nourishment'],
    specifications: {
      'Net Weight': '150ml with comb cap',
      'Key Actives': 'Red Onion Bulb Extract, Kalonji Oil, Castor & Almond Oil',
      'Usage': 'Apply 2-3 times a week, leave for 1 hour before wash',
      'Texture': 'Non-sticky light absorption'
    },
    variations: [
      { name: 'Pack Variant', options: ['Single 150ml Bottle', 'Duo Value Pack (2 x 150ml)'] }
    ],
    reviewsList: [
      {
        id: 'r-16',
        userName: 'Nuzhat Tabassum',
        rating: 5,
        date: '08 Sep 2026',
        comment: 'Noticeable reduction in hair fall after just two weeks of use. The comb applicator is so convenient.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-115',
    name: 'Natural Jade Facial Roller & Gua Sha Sculpting Set',
    slug: 'natural-jade-facial-roller-gua-sha-sculpting-set',
    category: 'Beauty & Personal Care',
    subcategory: 'Beauty Tools',
    price: 850,
    oldPrice: 1200,
    rating: 4.9,
    reviewCount: 62,
    images: [
      'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f02e1b12b2a?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Authentic cool Xiuyan jade stone face massage roller and heart-shaped gua sha tool for lymphatic drainage.',
    description: 'Promotes blood circulation, reduces morning facial puffiness, and aids deep serum absorption. Smooth noiseless silicone-cushioned rolling mechanism.',
    sku: 'CM-BP-003',
    inStock: true,
    stockCount: 27,
    isSpecialOffer: true,
    badge: 'Special Deal',
    tags: ['jade roller', 'gua sha', 'face massage', 'beauty tool', 'skincare routine'],
    specifications: {
      'Stone Type': '100% Genuine Natural Xiuyan Jade',
      'Set Includes': 'Dual-ended Jade Roller + Heart-shaped Gua Sha Stone',
      'Hardware': 'Reinforced zinc alloy frame with silent buffer',
      'Packaging': 'Velvet travel pouch included'
    },
    variations: [
      { name: 'Stone Color', options: ['Emerald Green Jade', 'Rose Quartz Pink'] }
    ],
    reviewsList: [
      {
        id: 'r-17',
        userName: 'Fariha Yasmin',
        rating: 5,
        date: '14 Sep 2026',
        comment: 'Real cool stone feel. Keeps puffiness away every morning, high quality finish.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-116',
    name: 'Rechargeable Portable Desk & Clip-on Fan',
    slug: 'rechargeable-portable-desk-clip-on-fan',
    category: 'Gadgets',
    subcategory: 'Desk Gadgets',
    price: 1150,
    oldPrice: 1550,
    rating: 4.8,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Quiet 4000mAh battery-operated fan with 360-degree rotation and heavy-duty desktop clamp.',
    description: 'Lifesaver during load-shedding and study/work desk sessions in Bangladesh. Offers 4 speed settings, whisper quiet brushless motor, and up to 10 hours runtime on a single Type-C charge.',
    sku: 'CM-GD-001',
    inStock: true,
    stockCount: 40,
    isFeatured: true,
    isTrending: true,
    badge: 'Summer Essential',
    tags: ['fan', 'rechargeable', 'portable fan', 'desk fan', 'gadgets', 'usb fan'],
    specifications: {
      'Battery Capacity': '4000mAh Lithium Rechargeable',
      'Charging Port': 'USB Type-C (5V/2A Fast Input)',
      'Speeds': '4 Wind Speeds (Low, Med, High, Natural Breeze)',
      'Runtime': '4 to 10 hours depending on speed setting'
    },
    variations: [
      { name: 'Color', options: ['Matte Navy Blue', 'Pure Pearl White', 'Forest Green'] }
    ],
    reviewsList: [
      {
        id: 'r-18',
        userName: 'Mahmudul Hasan',
        rating: 5,
        date: '10 Sep 2026',
        comment: 'Outstanding airflow and surprisingly quiet. Works great clipped onto my work table during power cuts.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-117',
    name: 'Smart Magnetic Wireless Bluetooth Neckband',
    slug: 'smart-magnetic-wireless-bluetooth-neckband',
    category: 'Gadgets',
    subcategory: 'Smart Gadgets',
    price: 1250,
    oldPrice: 1750,
    rating: 4.7,
    reviewCount: 81,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Ultra-low latency neckband earphones with 35 hours playback, IPX5 sweat resistance, and deep bass boost.',
    description: 'Designed for daily commute and long work calls. Features fast Type-C charging (10 mins charge = 8 hours playtime), vibration call alert, and snap magnetic ear-tips.',
    sku: 'CM-GD-002',
    inStock: true,
    stockCount: 32,
    isNewArrival: true,
    badge: '35H Battery',
    tags: ['neckband', 'wireless earphones', 'bluetooth', 'gadgets', 'audio'],
    specifications: {
      'Bluetooth Version': 'Bluetooth 5.3 Low Energy',
      'Battery Life': 'Up to 35 Hours non-stop playtime',
      'Water Resistance': 'IPX5 Sweat & Splash Proof',
      'Drivers': '12mm Dynamic Titanium Drivers'
    },
    variations: [
      { name: 'Color', options: ['Carbon Black', 'Steel Silver'] }
    ],
    reviewsList: [
      {
        id: 'r-19',
        userName: 'Ahsan Habib',
        rating: 5,
        date: '06 Sep 2026',
        comment: 'Crystal clear call quality even on busy Dhaka streets. Battery lasted me 4 full days of work.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-118',
    name: 'Electric Portable Fabric Shaver & Lint Remover',
    slug: 'electric-portable-fabric-shaver-lint-remover',
    category: 'Gadgets',
    subcategory: 'Utility Gadgets',
    price: 650,
    oldPrice: 900,
    rating: 4.8,
    reviewCount: 37,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'USB rechargeable clothes defuzzer with 6-leaf rotary precision blades for winter sweaters and kurtis.',
    description: 'Revives pills, fuzz, and lint from winter woolens, blankets, and embroidered kurtis safely without cutting or snagging fabric. Transparent removable collection chamber.',
    sku: 'CM-GD-003',
    inStock: true,
    stockCount: 50,
    isSpecialOffer: true,
    badge: 'Under ৳999',
    tags: ['lint remover', 'fabric shaver', 'gadgets', 'clothing care', 'utility'],
    specifications: {
      'Blade System': '6-leaf stainless steel floating razor head',
      'Power Source': 'Rechargeable USB lithium battery',
      'Safety': 'Auto-cutoff lock when mesh cover is open',
      'Dimensions': '13.5cm x 7.5cm compact ergonomic grip'
    },
    variations: [
      { name: 'Color', options: ['Pearl White', 'Rose Gold'] }
    ],
    reviewsList: [
      {
        id: 'r-20',
        userName: 'Zannat Ara',
        rating: 5,
        date: '15 Sep 2026',
        comment: 'Made my old winter shawls look brand new in 5 minutes! Super easy to clean.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-119',
    name: 'Vitamin C 20% Glow Brightening Face Serum',
    slug: 'vitamin-c-glow-brightening-face-serum',
    category: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    price: 750,
    oldPrice: 1100,
    rating: 4.9,
    reviewCount: 44,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-593b4a242c30?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Potent 20% Vitamin C serum with Hyaluronic Acid and Ferulic Acid for sun damage repair and radiant glow.',
    description: 'Formulated specifically for tropical climate skin needs. Diminishes hyperpigmentation, acne scars, and uneven skin tones. Light, non-sticky water-gel texture that absorbs in seconds without clogging pores.',
    sku: 'CM-BP-004',
    inStock: true,
    stockCount: 40,
    isFeatured: true,
    isNewArrival: true,
    badge: 'Glow Formula',
    tags: ['skincare', 'vitamin c', 'face serum', 'brightening', 'hyaluronic acid'],
    specifications: {
      'Volume': '30 ml Amber Dropper Glass Bottle',
      'Key Actives': '20% Ethyl Ascorbic Acid + 1% Pure Hyaluronic Acid',
      'Skin Compatibility': 'Suitable for All Skin Types (Dermatologically Tested)',
      'Free From': 'Parabens, Sulfates, Mineral Oils, Artificial Fragrance'
    },
    variations: [
      { name: 'Bottle Size', options: ['30 ml (Standard)', '50 ml (Value Pack)'] }
    ],
    reviewsList: [
      {
        id: 'r-21',
        userName: 'Tania Ahmed',
        rating: 5,
        date: '12 Sep 2026',
        comment: 'Very lightweight and non-greasy. My dark spots from sun exposure started fading within two weeks.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-120',
    name: 'Sonic Silicone Waterproof Facial Cleansing Brush',
    slug: 'sonic-silicone-facial-cleansing-brush',
    category: 'Beauty & Personal Care',
    subcategory: 'Beauty Tools',
    price: 950,
    oldPrice: 1450,
    rating: 4.8,
    reviewCount: 31,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Ultra-hygienic soft silicone deep pore cleanser with 6 sonic vibration speeds and USB charging.',
    description: 'Provides 8,000 sonic pulsations per minute to gently dislodge dirt, oil, makeup residue, and dead skin cells 6x better than washing with hands alone. IPX7 100% waterproof for safe in-shower use.',
    sku: 'CM-BP-005',
    inStock: true,
    stockCount: 26,
    isTrending: true,
    badge: 'Top Rated',
    tags: ['beauty tools', 'facial brush', 'cleanser', 'skincare device', 'sonic'],
    specifications: {
      'Material': 'Food-Grade Antibacterial Silicone',
      'Waterproof Rating': 'IPX7 Fully Submersible Waterproof',
      'Vibration Speeds': '6 Adjustable Intensity Levels',
      'Charging': 'Magnetic USB Fast Rechargeable (Lasts 90 Days/Charge)'
    },
    variations: [
      { name: 'Color', options: ['Blush Pink', 'Mint Green', 'Sky Blue'] }
    ],
    reviewsList: [
      {
        id: 'r-22',
        userName: 'Mehnaz Khan',
        rating: 5,
        date: '08 Sep 2026',
        comment: 'Gentle on sensitive skin and leaves your face feeling so smooth and deeply cleaned.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-123',
    name: 'Moroccan Argan Leave-in Hair Serum & Heat Protectant',
    slug: 'moroccan-argan-leave-in-hair-serum',
    category: 'Beauty & Personal Care',
    subcategory: 'Hair Care',
    price: 680,
    oldPrice: 950,
    rating: 4.7,
    reviewCount: 28,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Silky non-greasy Moroccan Argan oil elixir that controls humidity frizz and protects hair from heat styling.',
    description: 'Enriched with pure cold-pressed argan oil, vitamin E, and natural camellia extract. Protects strands up to 230°C from blow dryers and straighteners while restoring mirror shine to dull, heat-damaged ends.',
    sku: 'CM-BP-006',
    inStock: true,
    stockCount: 35,
    isSpecialOffer: true,
    badge: 'Anti-Frizz',
    tags: ['hair serum', 'argan oil', 'hair care', 'anti frizz', 'heat protectant'],
    specifications: {
      'Volume': '100 ml Pump Bottle',
      'Formulation': 'Lightweight Weightless Dry Oil',
      'Hair Type': 'Dry, Frizzy, Treated, or Color-Dyed Hair'
    },
    variations: [
      { name: 'Volume', options: ['100 ml'] }
    ],
    reviewsList: [
      {
        id: 'r-23',
        userName: 'Farzana Yesmin',
        rating: 5,
        date: '11 Sep 2026',
        comment: 'Controls Dhaka monsoon frizz like magic. Does not weigh down hair or look greasy.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-124',
    name: 'Arabian White Musk & Vanilla Body Mist & Spray',
    slug: 'arabian-white-musk-vanilla-body-mist',
    category: 'Beauty & Personal Care',
    subcategory: 'Fragrance / Body Care',
    price: 850,
    oldPrice: 1200,
    rating: 4.9,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Long-lasting soft floral musk mist with notes of warm vanilla, lily of the valley, and gentle amber.',
    description: 'An enchanting, everyday clean fragrance spray crafted with premium cosmetic-grade essences. Subtle, calming, and alcohol-balanced to avoid drying skin. Leaves a pleasant lingering sillage for 8+ hours.',
    sku: 'CM-BP-007',
    inStock: true,
    stockCount: 42,
    isFeatured: true,
    badge: '8H Sillage',
    tags: ['fragrance', 'body mist', 'white musk', 'vanilla', 'perfume'],
    specifications: {
      'Volume': '250 ml Fine Mist Spray Bottle',
      'Fragrance Family': 'Soft Oriental Floral Musk',
      'Longevity': '6 to 8 hours on skin and fabrics'
    },
    variations: [
      { name: 'Scent Variant', options: ['White Musk & Vanilla', 'Velvet Rose & Amber'] }
    ],
    reviewsList: [
      {
        id: 'r-24',
        userName: 'Nadia Chowdhury',
        rating: 5,
        date: '10 Sep 2026',
        comment: 'Smells luxurious and soft, not overwhelming at all. Received compliments on the first day wearing it.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-125',
    name: 'Ultra Nourishing Shea Butter & Sweet Almond Body Lotion',
    slug: 'shea-butter-almond-body-lotion',
    category: 'Beauty & Personal Care',
    subcategory: 'Fragrance / Body Care',
    price: 590,
    oldPrice: 820,
    rating: 4.8,
    reviewCount: 39,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608248597359-593b4a242c30?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Deep hydration body moisturiser with African shea butter, sweet almond oil, and soothing provitamin B5.',
    description: 'Quick-absorbing body lotion that locks in 48-hour moisture barrier without greasy residue. Restores softness to dry elbows, knees, and winter-chapped hands with a gentle honey-almond scent.',
    sku: 'CM-BP-008',
    inStock: true,
    stockCount: 50,
    isNewArrival: true,
    badge: '48H Moisture',
    tags: ['body lotion', 'shea butter', 'body care', 'moisturizer', 'skincare'],
    specifications: {
      'Volume': '400 ml Economy Pump Dispenser',
      'Ingredients': 'Pure Shea Butter, Cold Pressed Almond Oil, Vitamin E',
      'Absorption': 'Fast absorbing non-greasy lotion'
    },
    variations: [
      { name: 'Size', options: ['400 ml Pump Bottle'] }
    ],
    reviewsList: [
      {
        id: 'r-25',
        userName: 'Ayesha Siddika',
        rating: 5,
        date: '05 Sep 2026',
        comment: 'Very moisturizing and the smell is so gentle. Perfect for everyday body care.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-121',
    name: 'Foldable Aluminum MagSafe Phone & Tablet Desk Stand',
    slug: 'foldable-aluminum-magsafe-phone-tablet-desk-stand',
    category: 'Gadgets',
    subcategory: 'Mobile Accessories',
    price: 790,
    oldPrice: 1150,
    rating: 4.9,
    reviewCount: 63,
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Heavy-duty aircraft grade CNC aluminum stand with 360° rotating dual axes and anti-slip silicone pads.',
    description: 'Ergonomic multi-angle desktop holder engineered for smartphones and tablets up to 12.9 inches. Dual heavy damping hinges hold any viewing position securely without sliding or shaking during typing or video calls.',
    sku: 'CM-GD-004',
    inStock: true,
    stockCount: 48,
    isFeatured: true,
    badge: 'Best Seller',
    tags: ['phone stand', 'tablet holder', 'mobile accessories', 'gadgets', 'desk accessory'],
    specifications: {
      'Material': 'Aviation-Grade Anodized Aluminum Alloy',
      'Compatibility': 'All Phones (iPhone, Samsung, Xiaomi) & Tablets up to 12.9"',
      'Foldability': 'Folds completely flat into pocket size (12cm x 7.5cm)',
      'Weight': '185 grams with weighted stable base'
    },
    variations: [
      { name: 'Color', options: ['Space Gray', 'Silver Metallic'] }
    ],
    reviewsList: [
      {
        id: 'r-26',
        userName: 'Rashedul Karim',
        rating: 5,
        date: '14 Sep 2026',
        comment: 'Very solid build. My heavy iPad Pro sits on it without any wobble. Best desk stand at this price in BD.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-126',
    name: 'Ultra-Thin Bluetooth Smart Key & Luggage Finder Tracker',
    slug: 'bluetooth-smart-key-luggage-finder-tracker',
    category: 'Gadgets',
    subcategory: 'Smart Gadgets',
    price: 890,
    oldPrice: 1350,
    rating: 4.7,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Compact anti-loss tracker with bidirectional chime, real-time map location, and 1-year replaceable battery.',
    description: 'Never misplace your house keys, wallet, or backpack again. Ring the tracker directly from your iOS or Android smartphone app, or double-press the tracker to make your lost phone ring even when set on silent mode.',
    sku: 'CM-GD-005',
    inStock: true,
    stockCount: 30,
    isNewArrival: true,
    badge: 'Smart Find',
    tags: ['smart tracker', 'anti loss', 'bluetooth tag', 'gadgets', 'key finder'],
    specifications: {
      'Range': 'Up to 50 meters outdoor / 25 meters indoor',
      'Sound Output': '90 dB High-Decibel Buzzer',
      'Battery': 'Standard CR2032 Coin Cell (User Replaceable, 1-Year Life)',
      'App Support': 'Compatible with iOS & Android'
    },
    variations: [
      { name: 'Color', options: ['Matte Black', 'Glacier White'] }
    ],
    reviewsList: [
      {
        id: 'r-27',
        userName: 'Tanvir Mahmud',
        rating: 5,
        date: '09 Sep 2026',
        comment: 'Super accurate! I put one in my motorcycle key and one in my laptop bag. Gives peace of mind.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-127',
    name: '65W GaN Fast Charger Dual USB-C + USB-A Power Adapter',
    slug: '65w-gan-fast-charger-dual-usbc-usba',
    category: 'Gadgets',
    subcategory: 'Mobile Accessories',
    price: 1450,
    oldPrice: 1950,
    rating: 4.9,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Gallium Nitride (GaN III) high-speed triple-port wall charger for MacBooks, laptops, iPhones, and Android.',
    description: '50% smaller than traditional laptop power bricks. Smart dynamic power allocation charges your laptop at full 65W speed, or simultaneously fast-charges 2 smartphones and 1 earbud set without overheating.',
    sku: 'CM-GD-006',
    inStock: true,
    stockCount: 38,
    isFeatured: true,
    badge: '65W GaN III',
    tags: ['charger', 'fast charger', 'gan', 'usb-c', 'mobile accessories', 'laptop charger'],
    specifications: {
      'Maximum Output': '65W Power Delivery 3.0 & Quick Charge 4.0+',
      'Ports': '2 x USB-C + 1 x USB-A 3.0',
      'Technology': 'Advanced GaN III Semiconductor Architecture',
      'Safety Protections': 'Over-voltage, over-current, and temperature protection'
    },
    variations: [
      { name: 'Plug Style', options: ['EU / BD Round 2-Pin Plug'] }
    ],
    reviewsList: [
      {
        id: 'r-28',
        userName: 'Mahmudur Rahman',
        rating: 5,
        date: '13 Sep 2026',
        comment: 'Charges both my M2 MacBook Air and iPhone 15 at top speed without heating up. Essential travel brick.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-128',
    name: 'True Wireless Stereo (TWS) ANC Earbuds with Deep Bass',
    slug: 'tws-anc-earbuds-deep-bass',
    category: 'Gadgets',
    subcategory: 'Audio',
    price: 1850,
    oldPrice: 2600,
    rating: 4.8,
    reviewCount: 47,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Bluetooth 5.4 wireless earbuds with Active Noise Cancellation (ANC), 4-mic ENC call clarity, and 30-hour playback.',
    description: 'Engineered with 13mm composite graphene drivers for punchy bass and crystalline vocal highs. Quad-microphone Environmental Noise Cancellation eliminates background traffic and wind noise for seamless call quality.',
    sku: 'CM-GD-007',
    inStock: true,
    stockCount: 34,
    isTrending: true,
    badge: 'Active Noise Cancel',
    tags: ['earbuds', 'tws', 'wireless audio', 'bluetooth', 'gadgets', 'anc'],
    specifications: {
      'Active Noise Cancellation': '-28 dB Ambient Noise Reduction',
      'Playtime': '7 hours per charge / 30 hours total with pocket case',
      'Bluetooth Version': 'Bluetooth 5.4 with Low Latency Gaming Mode (45ms)',
      'Waterproof Rating': 'IPX5 Sweat and Rain Resistant'
    },
    variations: [
      { name: 'Color', options: ['Midnight Black', 'Ivory White'] }
    ],
    reviewsList: [
      {
        id: 'r-29',
        userName: 'Shakil Anwar',
        rating: 5,
        date: '07 Sep 2026',
        comment: 'ANC works noticeably well in office and bus rides. Bass is warm and powerful without distortion.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-129',
    name: 'Waterproof Mini Bluetooth Speaker with 360° Bass',
    slug: 'waterproof-mini-bluetooth-speaker-360-bass',
    category: 'Gadgets',
    subcategory: 'Audio',
    price: 1250,
    oldPrice: 1750,
    rating: 4.8,
    reviewCount: 36,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Pocket-sized portable speaker with rugged woven fabric mesh, passive subwoofer radiator, and lanyard strap.',
    description: 'Delivers surprisingly loud room-filling sound and deep bass from an ultra-compact cylinder. IPX6 water resistance makes it ideal for kitchen countertops, rooftop gatherings, picnics, and bathroom showers.',
    sku: 'CM-GD-008',
    inStock: true,
    stockCount: 40,
    isSpecialOffer: true,
    badge: 'IPX6 Waterproof',
    tags: ['speaker', 'bluetooth speaker', 'portable audio', 'waterproof', 'gadgets'],
    specifications: {
      'Sound Output': '8W RMS with dedicated passive bass radiator',
      'Battery Life': '10 to 12 Hours continuous music playback',
      'Connectivity': 'Bluetooth 5.3 + MicroSD Card Slot + AUX Input',
      'Dimensions': '8.5cm x 7.5cm palm-fit diameter'
    },
    variations: [
      { name: 'Color', options: ['Forest Green', 'Matte Black', 'Navy Blue'] }
    ],
    reviewsList: [
      {
        id: 'r-30',
        userName: 'Rifat Hossain',
        rating: 5,
        date: '04 Sep 2026',
        comment: 'Very loud and clear for its size! Build quality feels premium with the fabric mesh exterior.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-130',
    name: 'LED Eye-Care ScreenBar Monitor Light with Touch Dimmer',
    slug: 'led-eye-care-screenbar-monitor-light',
    category: 'Gadgets',
    subcategory: 'Desk Gadgets',
    price: 1650,
    oldPrice: 2300,
    rating: 4.9,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Asymmetric optical desktop light bar that eliminates screen glare, saves desk space, and protects tired eyes.',
    description: 'Clamps securely to the top edge of any flat or curved computer monitor. Illuminates your desk work area without reflecting light onto your display, drastically relieving eye fatigue during late-night work or study sessions.',
    sku: 'CM-GD-009',
    inStock: true,
    stockCount: 28,
    isFeatured: true,
    badge: 'Zero Screen Glare',
    tags: ['monitor light', 'screenbar', 'desk gadgets', 'eye care lamp', 'gadgets'],
    specifications: {
      'Light Source': 'Asymmetric Optical LED Bar (40cm Length)',
      'Color Temperature': '3 Modes (3000K Warm, 4500K Natural, 6500K Cool White)',
      'Dimming': 'Stepless Touch Brightness Control',
      'Power': 'USB-A 5V Powered (Plugs into monitor, laptop, or phone charger)'
    },
    variations: [
      { name: 'Color', options: ['Anodized Aluminum Black'] }
    ],
    reviewsList: [
      {
        id: 'r-31',
        userName: 'Zubair Al Mamun',
        rating: 5,
        date: '16 Sep 2026',
        comment: 'Zero reflections on screen! Completely cleared up my desk since I do not need a bulky table lamp anymore.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'cm-122',
    name: 'Digital High-Precision Backlit Luggage & Hanging Scale',
    slug: 'digital-high-precision-backlit-luggage-hanging-scale',
    category: 'Gadgets',
    subcategory: 'Utility Gadgets',
    price: 580,
    oldPrice: 850,
    rating: 4.8,
    reviewCount: 35,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ],
    shortDescription: 'Heavy-duty 50kg digital weighing scale with LCD blue backlight, tare function, and stainless steel hook.',
    description: 'Avoid airport overweight baggage fees and accurately weigh courier parcels, household grocery bags, and gas cylinders. Ergonomic curved grip with steel woven strap.',
    sku: 'CM-GD-010',
    inStock: true,
    stockCount: 55,
    isNewArrival: true,
    badge: '50kg Max',
    tags: ['luggage scale', 'digital scale', 'utility gadgets', 'gadgets', 'travel accessory'],
    specifications: {
      'Maximum Capacity': '50 kg / 110 lbs (10g Precision Resolution)',
      'Display': 'Bright Blue Backlit LCD Screen',
      'Features': 'Auto-Lock Reading, Tare Zero Reset, Low Battery Warning',
      'Battery': '1 x CR2032 Lithium Cell (Included in package)'
    },
    variations: [
      { name: 'Color', options: ['Silver & Black Grip'] }
    ],
    reviewsList: [
      {
        id: 'r-32',
        userName: 'Kamrul Hassan',
        rating: 5,
        date: '10 Sep 2026',
        comment: 'Checked it against my international flight luggage at Dhaka airport — weight was 100% exact. Great tool to have.',
        verifiedPurchase: true
      }
    ]
  }
];

