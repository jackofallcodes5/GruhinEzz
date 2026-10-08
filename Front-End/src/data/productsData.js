/**
 * Unified Product Catalog Data for GruhinEzz
 * Supporting Household Women Artisans & Entrepreneurs Across India.
 * 
 * Standard Product Data Structure:
 * Product
 * ├── id
 * ├── name
 * ├── images
 * ├── price
 * ├── originalPrice
 * ├── discount
 * ├── discountPercentage
 * ├── seller: { name, location, rating, verified, joinedYear, story }
 * ├── category
 * ├── description: { overview, features, benefits, usage, artisanStory }
 * ├── specifications: { [key: string]: string }
 * ├── variants: [ { type, name, options: [ { id, label, inStock, priceDelta } ] } ]
 * ├── stock
 * ├── rating
 * ├── reviewCount
 * ├── reviews: [ { id, userName, rating, date, title, comment, verifiedPurchase } ]
 * └── deliveryInformation: { estimatedDays, shippingFee, freeShippingThreshold, dispatchLocation, returnPolicy, codAvailable }
 */

export const PRODUCTS = [
  {
    id: 1,
    name: "Handcrafted Organic Mango Pickle (500g)",
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505253758473-96b3d5eb926f?w=800&auto=format&fit=crop&q=80",
    ],
    price: 249,
    originalPrice: 349,
    discount: "29% OFF",
    discountPercentage: 29,
    seller: {
      name: "Sunita Sharma",
      location: "Jaipur, Rajasthan",
      rating: 4.9,
      verified: true,
      joinedYear: "2023",
      storeName: "Sunita's Traditional Rasoi",
      artisanStory: "Sunita learned this sun-dried raw mango pickle recipe from her grandmother in Sikar. Every jar is traditionally sun-cured for 14 days in pure cold-pressed mustard oil with hand-ground Rajasthani spices.",
    },
    category: "Homemade Foods",
    description: {
      overview: "Authentic homemade Rajasthani Aam Ka Achaar made with hand-picked farm fresh raw mangoes, traditional whole spices, and cold-pressed mustard oil. Contains zero chemical preservatives or artificial colors.",
      features: [
        "Traditional slow sun-curing method for authentic flavour",
        "100% natural cold-pressed mustard oil base",
        "Zero artificial preservatives, zero vinegar, zero synthetic colors",
        "Hand-pounded fenugreek, fennel, nigella, and Rajasthani red chili",
      ],
      benefits: [
        "Rich in natural digestive enzymes and gut-friendly probiotics",
        "Prepared in hygienic, small home-kitchen batches",
        "Empowers rural women self-help cluster in Rajasthan",
      ],
      usage: "Enjoy with hot parathas, dal-chawal, khichdi, or mathri. Always use a dry, clean wooden spoon to maintain freshness.",
      artisanStory: "Crafted by Sunita Sharma and her sister-in-law in their Jaipur home. Every purchase supports Sunita in funding her daughter's collegiate education.",
    },
    specifications: {
      "Brand": "Sunita's Traditional Rasoi",
      "Main Ingredients": "Raw Mangoes, Cold-Pressed Mustard Oil, Fenugreek, Fennel, Kalonji, Turmeric, Rock Salt",
      "Net Weight": "500g",
      "Packaging": "Food-grade sterilized glass jar",
      "Shelf Life": "12 Months from dispatch",
      "Storage Instructions": "Store in a cool dry place, keep jar well sealed",
      "Diet Type": "100% Vegetarian & Vegan",
      "Country of Origin": "India (Rajasthan)",
    },
    variants: [
      {
        type: "pack",
        name: "Size / Weight",
        options: [
          { id: "250g", label: "250g Glass Jar", priceDelta: -80, inStock: true },
          { id: "500g", label: "500g Glass Jar (Popular)", priceDelta: 0, inStock: true },
          { id: "1kg", label: "1kg Value Family Pack", priceDelta: 180, inStock: true },
        ],
      },
      {
        type: "flavor",
        name: "Spice Level",
        options: [
          { id: "mild", label: "Mild & Tangy", priceDelta: 0, inStock: true },
          { id: "traditional", label: "Traditional Spicy (Authentic)", priceDelta: 0, inStock: true },
          { id: "extra-spicy", label: "Mathania Extra Hot", priceDelta: 15, inStock: true },
        ],
      },
    ],
    stock: 24,
    rating: 4.9,
    reviewCount: 168,
    reviews: [
      {
        id: 101,
        userName: "Ananya Deshmukh",
        rating: 5,
        date: "14 Feb 2026",
        title: "Tastes exactly like Dadi's pickle!",
        comment: "This transported me back to childhood summer vacations in Rajasthan. The mustard oil smell and crisp mango chunks are unmatched.",
        verifiedPurchase: true,
      },
      {
        id: 102,
        userName: "Ramesh Verma",
        rating: 5,
        date: "28 Jan 2026",
        title: "Flavourful without excessive salt",
        comment: "Unlike commercial store pickles that are drowned in salt and vinegar, this has genuine sun-dried texture and balanced spice.",
        verifiedPurchase: true,
      },
      {
        id: 103,
        userName: "Pooja Kulkarni",
        rating: 4,
        date: "10 Jan 2026",
        title: "Lovely aroma and packaging",
        comment: "The glass jar arrived wrapped securely in bubble wrap. Will definitely order the 1kg pack next time.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "3 - 5 business days",
      shippingFee: "₹40 (Free on orders above ₹499)",
      freeShippingThreshold: 499,
      dispatchLocation: "Jaipur, Rajasthan",
      returnPolicy: "Replacement guarantee if jar arrives damaged or seal is broken",
      codAvailable: true,
    },
  },
  {
    id: 2,
    name: "Hand-Embroidered Silk Chanderi Dupatta",
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80",
    ],
    price: 899,
    originalPrice: 1499,
    discount: "40% OFF",
    discountPercentage: 40,
    seller: {
      name: "Lakshmi Devi",
      location: "Indore, Madhya Pradesh",
      rating: 4.8,
      verified: true,
      joinedYear: "2023",
      storeName: "Malwa Weaves & Resham",
      artisanStory: "Lakshmi is a 4th-generation handloom weaver supporting a cooperative of 12 women artisans specializing in delicate Zari borders and Chanderi gossamer textures.",
    },
    category: "Apparel & Textiles",
    description: {
      overview: "Exquisite hand-woven Chanderi silk cotton dupatta featuring traditional floral booties and a rich golden zari temple border. Lightweight, sheer, and gracefully draped for festive celebrations.",
      features: [
        "Pure handloom Chanderi silk-cotton blend fabric",
        "Delicate hand-embroidered floral motifs (bootis)",
        "Shimmering zari pallu with hand-knotted tassels",
        "Soft against sensitive skin with lightweight drape",
      ],
      benefits: [
        "Adds effortless royal grace to plain kurtas, anarkalis, or lehengas",
        "Direct trade pricing eliminating middleman markups",
        "Supports traditional weaver households in Chanderi & Indore",
      ],
      usage: "Dry clean recommended for the first two washes; subsequently gentle cold hand wash with mild silk detergent.",
      artisanStory: "Hand-spun on traditional pit-looms by Lakshmi Devi's women collective over 18 hours of dedicated craftsmanship per dupatta.",
    },
    specifications: {
      "Brand": "Malwa Weaves",
      "Material": "Chanderi Silk Cotton Blend",
      "Length": "2.4 Meters",
      "Width": "36 Inches",
      "Work Type": "Zari Booti Hand Embroidery",
      "Occasion": "Festive, Wedding, Celebrations, Ethnic Office Wear",
      "Weave Type": "Traditional Handloom",
      "Country of Origin": "India (Madhya Pradesh)",
    },
    variants: [
      {
        type: "color",
        name: "Color",
        options: [
          { id: "royal-maroon", label: "Royal Maroon & Gold", priceDelta: 0, inStock: true },
          { id: "emerald-green", label: "Emerald Green & Gold", priceDelta: 0, inStock: true },
          { id: "dusty-rose", label: "Dusty Rose & Silver", priceDelta: 50, inStock: true },
        ],
      },
    ],
    stock: 12,
    rating: 4.8,
    reviewCount: 94,
    reviews: [
      {
        id: 201,
        userName: "Sneha Nair",
        rating: 5,
        date: "20 Feb 2026",
        title: "Breathtaking fabric quality!",
        comment: "The shimmer of the zari is subtle and classy, not cheap plastic shine. Paired it with a black kurti and received tons of compliments.",
        verifiedPurchase: true,
      },
      {
        id: 202,
        userName: "Kavita Rao",
        rating: 5,
        date: "04 Feb 2026",
        title: "Truly handmade gem",
        comment: "You can feel the artisan's care in every stitch and tassel. Very lightweight and comfortable to wear all evening.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "4 - 6 business days",
      shippingFee: "Free Shipping",
      freeShippingThreshold: 0,
      dispatchLocation: "Indore, Madhya Pradesh",
      returnPolicy: "7-day return policy for unused items with original tags",
      codAvailable: true,
    },
  },
  {
    id: 3,
    name: "Handpainted Terracotta Clay Tea Set (6 Cups + Kettle)",
    images: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80",
    ],
    price: 650,
    originalPrice: 999,
    discount: "35% OFF",
    discountPercentage: 35,
    seller: {
      name: "Radha Ben",
      location: "Kutch, Gujarat",
      rating: 5.0,
      verified: true,
      joinedYear: "2023",
      storeName: "Mitti Magic Kutchi Pottery",
      artisanStory: "Radha Ben molds natural riverbed clay on manual potter wheels and hand-paints intricate Kutchi mirror-work-inspired motifs using mineral clay pigments.",
    },
    category: "Home Decor & Pottery",
    description: {
      overview: "Complete handcrafted tea service including 1 insulated terracotta tea pot and 6 kulhad cups. Naturally imparts an earthy, authentic kulhad aroma to hot chai and herbal teas.",
      features: [
        "100% natural, unglazed earthenware clay",
        "Hand-painted with non-toxic herbal and mineral pigments",
        "Retains tea warmth naturally for longer periods",
        "Sturdy heat-resistant handles",
      ],
      benefits: [
        "Alkaline clay neutralizes acidity in beverages",
        "Zero chemicals, lead-free and eco-friendly",
        "Directly benefits Kutchi potter women artisans",
      ],
      usage: "Soak in plain water for 30 minutes before first use. Hand wash with mild warm water without harsh chemical detergents.",
      artisanStory: "Handmade by Radha Ben in Bhuj, Gujarat. Each set takes 4 days of sun drying and gentle kiln firing.",
    },
    specifications: {
      "Brand": "Mitti Magic",
      "Material": "Natural Terracotta Earthen Clay",
      "Set Contents": "1 Tea Kettle (650ml) + 6 Chai Kulhads (120ml each)",
      "Finish": "Matte Terracotta Hand-Painted",
      "Microwave Safe": "Yes (Gentle warm mode)",
      "Dishwasher Safe": "No (Hand wash only)",
      "Country of Origin": "India (Gujarat)",
    },
    variants: [
      {
        type: "design",
        name: "Motif Style",
        options: [
          { id: "kutchi-floral", label: "Kutchi Tribal Floral (Multicolor)", priceDelta: 0, inStock: true },
          { id: "terracotta-raw", label: "Rustic Terracotta Ochre", priceDelta: -50, inStock: true },
        ],
      },
    ],
    stock: 9,
    rating: 5.0,
    reviewCount: 82,
    reviews: [
      {
        id: 301,
        userName: "Deepak Joshi",
        rating: 5,
        date: "01 Mar 2026",
        title: "Authentic kulhad chai aroma at home!",
        comment: "Tea tastes completely different and sublime in these cups. Beautifully packed with thermocol and straw, zero breakage.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "4 - 5 business days",
      shippingFee: "Free Shipping",
      freeShippingThreshold: 499,
      dispatchLocation: "Bhuj, Gujarat",
      returnPolicy: "Fragile item replacement guarantee on unboxing video",
      codAvailable: true,
    },
  },
  {
    id: 4,
    name: "Artisanal Organic Honey & Neem Soap (Set of 3)",
    images: [
      "https://images.unsplash.com/photo-1607006482602-76ca0fd2f88d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    ],
    price: 320,
    originalPrice: 450,
    discount: "29% OFF",
    discountPercentage: 29,
    seller: {
      name: "Meena Kumari",
      location: "Dehradun, Uttarakhand",
      rating: 4.9,
      verified: true,
      joinedYear: "2024",
      storeName: "Himalayan Herbs & Soaps",
      artisanStory: "Meena leads a hill women self-help collective crafting cold-process artisan soaps using raw forest honey and cold-pressed Himalayan neem oil.",
    },
    category: "Organic & Herbal Care",
    description: {
      overview: "Hand-poured cold processed therapeutic bath bar with raw wild honey, cold-pressed neem seed oil, and soothing turmeric. Cured naturally for 6 weeks for a rich, gentle lather.",
      features: [
        "Cold processed to preserve skin-nourishing botanical oils",
        "Free from SLS, parabens, sulfates, and artificial fragrances",
        "Raw unpasteurized mountain honey naturally hydrates skin",
        "Neem and turmeric offer antibacterial and soothing defense",
      ],
      benefits: [
        "Gentle on sensitive, acne-prone, and dry skin",
        "Natural aromatherapy with pure essential oils",
        "Biodegradable and cruelty-free formulation",
      ],
      usage: "Lather with wet hands or loofah, apply across face and body, rinse with lukewarm water. Keep on a draining soap dish.",
      artisanStory: "Made by mountain women in rural Dehradun using ethically gathered forest ingredients.",
    },
    specifications: {
      "Brand": "Himalayan Herbs",
      "Ingredients": "Raw Wild Honey, Neem Oil, Turmeric Root, Coconut Oil, Castor Oil, Shea Butter, Essential Oils",
      "Weight": "3 Bars x 100g each (300g total)",
      "Skin Type": "All Skin Types, particularly Sensitive & Acne-prone",
      "Formulation": "Cold-Process Handmade Soap",
      "Country of Origin": "India (Uttarakhand)",
    },
    variants: [
      {
        type: "pack",
        name: "Combo Options",
        options: [
          { id: "set-3", label: "Set of 3 (Honey & Neem)", priceDelta: 0, inStock: true },
          { id: "set-5", label: "Set of 5 Assorted Himalayan Bars", priceDelta: 160, inStock: true },
        ],
      },
    ],
    stock: 35,
    rating: 4.9,
    reviewCount: 110,
    reviews: [
      {
        id: 401,
        userName: "Priya Menon",
        rating: 5,
        date: "12 Feb 2026",
        title: "Cleared up my skin flare-ups!",
        comment: "This doesn't strip your skin like commercial soaps. Smells calming and herbaceous.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "3 - 5 business days",
      shippingFee: "₹40 (Free on orders above ₹499)",
      freeShippingThreshold: 499,
      dispatchLocation: "Dehradun, Uttarakhand",
      returnPolicy: "Replacement if package is damaged in transit",
      codAvailable: true,
    },
  },
  {
    id: 5,
    name: "Homemade Bilona Pure A2 Cow Ghee (1 Litre)",
    images: [
      "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    ],
    price: 1150,
    originalPrice: 1550,
    discount: "26% OFF",
    discountPercentage: 26,
    seller: {
      name: "Kamla Bai",
      location: "Mathura, Uttar Pradesh",
      rating: 5.0,
      verified: true,
      joinedYear: "2023",
      storeName: "Braj Gauri Shuddh Ghee",
      artisanStory: "Kamla Bai manages an indigenous Gir and Sahiwal cow shelter in Braj. Her ghee is prepared strictly via the traditional Vedic Bilona method: curd churning on wooden bilona followed by gentle cow-dung slow boiling.",
    },
    category: "Homemade Foods",
    description: {
      overview: "Authentic Vedic A2 Desi Cow Ghee made from curd of grass-fed Gir cows, churned bidirectionally with a wooden churner (Bilona). Granular golden texture (danedaar) with divine nutty aroma.",
      features: [
        "100% pure A2 cultured curd churned ghee (Vedic Bilona)",
        "Zero chemicals, zero palm oil or machine blending",
        "Rich granular (Danedaar) golden texture with nutty fragrance",
        "High smoke point ideal for cooking, tadka, and ayurvedic remedies",
      ],
      benefits: [
        "Improves digestive fire (Agni) and nutrient absorption",
        "Natural source of butyric acid, Vitamin A, D, E, and K",
        "Boosts immunity and cognitive vitality for children and elders",
      ],
      usage: "Add one spoonful to warm rotis, steamed dal, or khichdi. Ideal for daily Ayurvedic consumption on empty stomach.",
      artisanStory: "Prepared in small earthen handi pots in Mathura. Pure devotion to indigenous cow care and ethical dairying.",
    },
    specifications: {
      "Brand": "Braj Gauri",
      "Milk Source": "Pure Free-Grazing Gir & Sahiwal Desi Cows",
      "Process": "Two-way Wooden Bilona Curd Churning",
      "Volume": "1000ml (1 Litre)",
      "Container": "Heavy sterilized glass jar with airtight seal",
      "Shelf Life": "12 Months from date of packaging",
      "Country of Origin": "India (Uttar Pradesh)",
    },
    variants: [
      {
        type: "pack",
        name: "Jar Size",
        options: [
          { id: "500ml", label: "500ml Glass Jar", priceDelta: -550, inStock: true },
          { id: "1000ml", label: "1000ml (1 Litre) Glass Jar", priceDelta: 0, inStock: true },
        ],
      },
    ],
    stock: 18,
    rating: 5.0,
    reviewCount: 230,
    reviews: [
      {
        id: 501,
        userName: "Vikram Singhania",
        rating: 5,
        date: "02 Mar 2026",
        title: "Heavenly aroma, genuine bilona ghee!",
        comment: "You open the jar and the entire kitchen smells wonderful. It has the real yellow granular texture you only get from desi cow curd churning.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "2 - 4 business days",
      shippingFee: "Free Shipping",
      freeShippingThreshold: 0,
      dispatchLocation: "Mathura, Uttar Pradesh",
      returnPolicy: "Replacement guarantee for any transit breakage",
      codAvailable: true,
    },
  },
  {
    id: 6,
    name: "Eco-Friendly Hand-Woven Jute Shopping Tote Bag",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    ],
    price: 450,
    originalPrice: 650,
    discount: "31% OFF",
    discountPercentage: 31,
    seller: {
      name: "Anita Devi",
      location: "Kolkata, West Bengal",
      rating: 4.7,
      verified: true,
      joinedYear: "2023",
      storeName: "Bengal Golden Fiber Crafts",
      artisanStory: "Anita leads an NGO-backed craft group of 25 women in Nadia district, West Bengal, turning local biodegradable golden jute fibers into chic everyday bags.",
    },
    category: "Handicrafts",
    description: {
      overview: "Sturdy and reusable biodegradable jute tote bag with reinforced cotton rope handles, water-resistant interior lining, and embroidered floral pocket detail. Holds up to 12kg comfortably.",
      features: [
        "100% natural, biodegradable high-density Bengal jute fiber",
        "Reinforced cross-stitch cotton padded shoulder handles",
        "Laminated interior to guard against spills and stains",
        "Spacious main compartment with magnetic snap closure",
      ],
      benefits: [
        "Replaces hundreds of single-use plastic grocery bags",
        "Heavy-duty load capacity (up to 12 kg)",
        "Directly generates fair wages for rural women weavers",
      ],
      usage: "Wipe clean with a damp cloth. Air dry in shade. Avoid submerging entire bag in water.",
      artisanStory: "Hand-braided and stitched by women in rural Bengal. Zero plastic waste produced in making.",
    },
    specifications: {
      "Brand": "Bengal Golden Fiber",
      "Material": "100% Natural Golden Jute with Cotton Handles",
      "Dimensions": "16 x 14 x 5.5 Inches",
      "Capacity": "Up to 12 kg weight",
      "Closure": "Magnetic Snap Button + Inner Zipper Pocket",
      "Color": "Natural Jute Tan with White Floral Embroidery",
      "Country of Origin": "India (West Bengal)",
    },
    variants: [
      {
        type: "pattern",
        name: "Embroidery Pattern",
        options: [
          { id: "lotus", label: "Lotus Blossom Embroidery", priceDelta: 0, inStock: true },
          { id: "mandala", label: "Kolkata Mandala Art", priceDelta: 30, inStock: true },
          { id: "plain", label: "Minimalist Plain Jute", priceDelta: -40, inStock: true },
        ],
      },
    ],
    stock: 28,
    rating: 4.7,
    reviewCount: 77,
    reviews: [
      {
        id: 601,
        userName: "Nandini Ghosh",
        rating: 5,
        date: "25 Jan 2026",
        title: "Very durable and stylish!",
        comment: "I carry this for grocery shopping and everyday errands. The padded straps make it comfortable even when loaded with heavy vegetables.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "3 - 5 business days",
      shippingFee: "₹40 (Free on orders above ₹499)",
      freeShippingThreshold: 499,
      dispatchLocation: "Kolkata, West Bengal",
      returnPolicy: "7-day return policy in original packaging",
      codAvailable: true,
    },
  },
  {
    id: 7,
    name: "Handmade Walnut Wooden Spice Box (Masala Dabba)",
    images: [
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
    ],
    price: 799,
    originalPrice: 1199,
    discount: "33% OFF",
    discountPercentage: 33,
    seller: {
      name: "Zareena Begum",
      location: "Srinagar, Kashmir",
      rating: 4.9,
      verified: true,
      joinedYear: "2023",
      storeName: "Kashmir Woodcraft Artisans",
      artisanStory: "Zareena and her women woodcraft guild in Srinagar hand-carve sustainable seasoned walnut wood into heirloom kitchen accents with brass latch fittings.",
    },
    category: "Home Decor & Pottery",
    description: {
      overview: "Heirloom handcrafted spice box carved from seasoned natural walnut wood. Features 7 removable spice compartments, a hand-carved floral glass lid, and a miniature wooden spice spoon.",
      features: [
        "100% natural seasoned walnut wood with natural beeswax polish",
        "Clear protective top lid with carved floral perimeter",
        "7 removable compartments for whole and ground spices",
        "Handmade brass latch lock prevents accidental spills",
      ],
      benefits: [
        "Wood naturally absorbs ambient moisture, keeping spices crisp",
        "Elegant centerpiece for traditional or modern Indian kitchens",
        "Provides steady livelihoods to Kashmiri artisan families",
      ],
      usage: "Wipe clean with a dry or slightly damp cotton cloth. Apply olive oil or beeswax once a year to preserve walnut wood lustre.",
      artisanStory: "Each box is individually carved and polished by Kashmiri women artisans over 3 working days.",
    },
    specifications: {
      "Brand": "Kashmir Woodcraft",
      "Material": "Seasoned Walnut Wood & Brass Accents",
      "Dimensions": "8.5 x 8.5 x 2.5 Inches",
      "Compartments": "7 Removable Wooden Bowls + 1 Small Spoon",
      "Finish": "Non-Toxic Natural Beeswax Buff",
      "Country of Origin": "India (Jammu & Kashmir)",
    },
    variants: [
      {
        type: "compartments",
        name: "Lid Style",
        options: [
          { id: "glass-top", label: "Clear Glass Top (See-Through)", priceDelta: 0, inStock: true },
          { id: "carved-wood", label: "Solid Hand-Carved Chinar Wood Top", priceDelta: 80, inStock: true },
        ],
      },
    ],
    stock: 15,
    rating: 4.9,
    reviewCount: 63,
    reviews: [
      {
        id: 701,
        userName: "Tanya Sen",
        rating: 5,
        date: "09 Feb 2026",
        title: "Heirloom quality item",
        comment: "This spice box is like a work of art in my kitchen. The wood grain is magnificent and the brass lock clicks shut tightly.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "4 - 7 business days",
      shippingFee: "Free Shipping",
      freeShippingThreshold: 0,
      dispatchLocation: "Srinagar, Jammu & Kashmir",
      returnPolicy: "Replacement guarantee on transit damage",
      codAvailable: true,
    },
  },
  {
    id: 8,
    name: "Pure Wild Kashmiri Saffron / Kesar (1 Gram A++ Grade)",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505253758473-96b3d5eb926f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    ],
    price: 499,
    originalPrice: 699,
    discount: "28% OFF",
    discountPercentage: 28,
    seller: {
      name: "Farida Bano",
      location: "Pampore, Kashmir",
      rating: 5.0,
      verified: true,
      joinedYear: "2023",
      storeName: "Pampore Zafran Farmers",
      artisanStory: "Farida cultivates purple saffron crocus flowers in the fertile Karewa fields of Pampore. Each crimson stigma is hand-plucked during sunrise by women farmers.",
    },
    category: "Homemade Foods",
    description: {
      overview: "Authentic, certified GI-tagged Pampore Mongra Grade Saffron (Kesar). Deep crimson whole filaments with unmatched aroma, high crocin color yield, and pure medicinal quality.",
      features: [
        "100% pure Grade A++ Mongra Kashmiri Saffron filaments",
        "Tested for zero artificial red dyes or starch adulteration",
        "Direct harvest from Pampore saffron farming families",
        "Sealed in an airtight tamper-evident acrylic jewel box",
      ],
      benefits: [
        "Imparts divine golden hue and delicate floral aroma to sweets & biryani",
        "Known in Ayurveda for radiant skin glow, mood uplift, and wellness",
        "Direct fair compensation to Pampore women harvesting workers",
      ],
      usage: "Soak 3-5 strands in 2 tablespoons of lukewarm milk or water for 20 minutes before adding to desserts, kheer, biryani, or face masks.",
      artisanStory: "Takes over 150 delicate flowers to produce just 1 gram of pure Mongra saffron.",
    },
    specifications: {
      "Brand": "Pampore Zafran",
      "Grade": "Mongra Grade A++ (Highest Crocin & Safranal content)",
      "Net Weight": "1 Gram",
      "Packaging": "Tamper-evident airtight jewel container",
      "Shelf Life": "24 Months from harvest",
      "Storage Instructions": "Keep in a cool, dark, dry place away from sunlight",
      "Country of Origin": "India (Jammu & Kashmir)",
    },
    variants: [
      {
        type: "pack",
        name: "Quantity",
        options: [
          { id: "1g", label: "1 Gram (Jewel Box)", priceDelta: 0, inStock: true },
          { id: "2g", label: "2 Grams (Double Pack - 10% Extra Off)", priceDelta: 430, inStock: true },
        ],
      },
    ],
    stock: 40,
    rating: 5.0,
    reviewCount: 312,
    reviews: [
      {
        id: 801,
        userName: "Dr. Arvind Patel",
        rating: 5,
        date: "18 Feb 2026",
        title: "Genuine certified Mongra kesar!",
        comment: "Tested with the warm water test: filaments stayed deep red and released a slow, rich saffron yellow without disintegrating. 100% genuine.",
        verifiedPurchase: true,
      },
    ],
    deliveryInformation: {
      estimatedDays: "3 - 5 business days",
      shippingFee: "Free Shipping",
      freeShippingThreshold: 0,
      dispatchLocation: "Pampore, Jammu & Kashmir",
      returnPolicy: "Replacement if safety seal is tampered",
      codAvailable: true,
    },
  },
];

/**
 * Helper search and filter utility
 */
export function getAllProducts() {
  return PRODUCTS;
}

export function getProductById(id) {
  const numId = Number(id);
  return PRODUCTS.find((p) => p.id === numId) || null;
}

export function searchProducts(query = "", category = "") {
  let list = PRODUCTS;
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (query && query.trim() !== "") {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.seller.name.toLowerCase().includes(q) ||
        p.seller.location.toLowerCase().includes(q) ||
        p.description.overview.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getRelatedProducts(productId, category, limit = 4) {
  const currentId = Number(productId);
  return PRODUCTS.filter((p) => p.id !== currentId && (!category || p.category === category)).slice(0, limit);
}

export function getRecommendedProducts(productId, limit = 4) {
  const currentId = Number(productId);
  return PRODUCTS.filter((p) => p.id !== currentId).slice(0, limit);
}
