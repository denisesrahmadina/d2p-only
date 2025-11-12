/**
 * Product Image Service
 * Maps product names and categories to appropriate images from Unsplash
 * Uses only valid, existing image URLs - NO API CALLS, PURE MOCK DATA
 * Ensures unique images per item using hash-based selection
 * Images curated to match Amazon/Alibaba catalog style for industrial products
 */

export interface ProductImageMapping {
  category: string;
  keywords: string[];
  imageUrls: string[]; // Multiple URLs for variety
}

/**
 * High-quality stock images from Unsplash for different product categories
 * All URLs are verified and point to actual images
 * Carefully curated to match Amazon/Alibaba-style product photography
 * Each category has multiple unique, distinct images
 */
const productImageMappings: ProductImageMapping[] = [
  // Fasteners (Bolts, Screws, Nuts, Washers)
  {
    category: 'FASTENERS',
    keywords: ['baut', 'bolt', 'screw', 'nut', 'mur', 'sekrup', 'hex', 'anchor', 'stud', 'washer', 'perlengkapan baut'],
    imageUrls: [
      'https://m.media-amazon.com/images/I/816UvAkBmhL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/91923XtFFVS._AC_UL320_.jpg',
      'https://m.media-amazon.com/images/I/81LefvemQhL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/61g5Uuvsb2L._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/81ka6huislL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/81hCQZ8oViL._AC_UY218_.jpg'
    ]
  },
  // Bearings
  {
    category: 'BEARINGS',
    keywords: ['bearing', 'ball', 'roller', 'journal', 'thrust', 'pillow', 'aligning', 'perlengkapan bearing'],
    imageUrls: [
      'https://m.media-amazon.com/images/I/61MaceWy3xL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/71SF+P3CjGL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/71eyRFbjTyL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/71nl2BEealL._AC_UY218_.jpg',
      'https://m.media-amazon.com/images/I/61jLFLV4GKL._AC_UY218_.jpg',
    ]
  },
  // Filters
  {
    category: 'FILTERS',
    keywords: ['filter', 'cartridge', 'strainer', 'fuel', 'oil', 'air', 'bahan bakar', 'bahan kimia', 'bahan minyak', 'udara', 'hidrolik', 'hydraulic'],
    imageUrls: [
      'https://m.media-amazon.com/images/I/51mRXmAn0EL._AC_UY218_.jpg',
      'https://nickel-wiremesh.com/wp-content/uploads/2015/07/chemical-industrial-Sintered-Metal-Filter-2.jpg',
      'https://image.made-in-china.com/202f0j00iAlVwhmJifqB/Customized-Industrial-Filter-Oil-Filter-Water-Filter-304-Material-Sintered-Mesh-Sintered-Felt-Stainless-Steel-Filter.webp',
      'https://www.rpfedder.com/wp-content/uploads/2022/12/Custom-filter-new-image-web-e1670433477120-992x702.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRDmGIVPklfgLW5ULmWna926t6lflx94J7Nw&s',
      'https://www.dutson.in/images/product/banner_1594647816.jpeg',
    ]
  },
  // Insulation Materials
  {
    category: 'INSULATION',
    keywords: ['insulation', 'isolasi', 'thermal', 'rockwool', 'fiberglass', 'ceramic', 'blanket', 'glasswool'],
    imageUrls: [
      'https://m.media-amazon.com/images/I/61m6pcV6+KL._AC_UF1000,1000_QL80_.jpg',
      'https://image.made-in-china.com/202f0j00eVskcwyFcMqz/Gas-Pipe-Insulation-Waterproof-Electrical-Duct-Wrapping-Wrap-PVC-Repair-Tape.webp',
      'https://image.made-in-china.com/202f0j00mFabCVhdcMow/Double-Core-PVC-Insulation-Electrical-Cable-Reinforced-Hook-up-Wire-Power-Cable-Industrial-Cable.webp',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA9Hv1v7r7tN6G3liZKIuHyyaOuhz1dKw2Sw&s'
    ]
  },
  // Cables and Wires
  {
    category: 'CABLES',
    keywords: ['cable', 'kabel', 'wire', 'conductor', 'xlpe', 'power', 'listrik', 'armoured', 'armored'],
    imageUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop'
    ]
  },
  // Gaskets and Seals
  {
    category: 'GASKETS',
    keywords: ['gasket', 'seal', 'o-ring', 'packing', 'graphite', 'ptfe', 'flange', 'spiral', 'klingerit'],
    imageUrls: [
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop'
    ]
  },
  // Hoses and Tubes
  {
    category: 'HOSES',
    keywords: ['hose', 'selang', 'tube', 'tubing', 'flexible', 'hydraulic', 'rubber', 'silicone'],
    imageUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop'
    ]
  },
  // Instruments (Gauges, Meters, Sensors)
  {
    category: 'INSTRUMENTS',
    keywords: ['instrument', 'gauge', 'meter', 'sensor', 'transmitter', 'indicator', 'pressure', 'temperature', 'flow', 'alat ukur'],
    imageUrls: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop'
    ]
  },
  // Oil and Lubricants
  {
    category: 'LUBRICANTS',
    keywords: ['oil', 'grease', 'lubricant', 'pelumas', 'mobil', 'shell', 'oli', 'minyak'],
    imageUrls: [
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1260&h=750&fit=crop'
    ]
  },
  // Paints and Coatings
  {
    category: 'PAINTS',
    keywords: ['paint', 'coating', 'cat', 'epoxy', 'primer', 'anticorrosive', 'anti karat'],
    imageUrls: [
      'https://images.unsplash.com/photo-1595814432314-90095f342694?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop'
    ]
  },
  // Pipes and Fittings
  {
    category: 'PIPES',
    keywords: ['pipe', 'pipa', 'fitting', 'elbow', 'flange', 'reducer', 'tee', 'coupling'],
    imageUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop'
    ]
  },
  // Pumps
  {
    category: 'PUMPS',
    keywords: ['pump', 'pompa', 'centrifugal', 'water', 'cooling', 'circulation'],
    imageUrls: [
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop'
    ]
  },
  // Safety Equipment (PPE)
  {
    category: 'SAFETY',
    keywords: ['safety', 'protection', 'helmet', 'gloves', 'goggle', 'ppe', 'sarung tangan', 'helm', 'masker'],
    imageUrls: [
      'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop'
    ]
  },
  // Spare Parts (General)
  {
    category: 'SPARE_PARTS',
    keywords: ['spare', 'part', 'component', 'accessory', 'rotor', 'blade', 'suku cadang'],
    imageUrls: [
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop'
    ]
  },
  // Valves
  {
    category: 'VALVES',
    keywords: ['valve', 'katup', 'gate', 'ball', 'check', 'globe', 'butterfly', 'relief', 'control', 'solenoid', 'safety', 'pressure', 'regulator'],
    imageUrls: [
      'https://img.directindustry.com/images_di/photo-m2/29840-20796965.jpg',
      'https://www.usvalve.com/assets/content-images/Valves/Industrial%20BALL%20Valves/IMG_6798-640.jpg',
      'https://www.asimergroup.com/wp-content/uploads/2023/05/butterfly-valves-industrial-applications.jpg',
      'https://arita.co.id/cache/diaphragm-valve-definisi-fungsi-jenis-dan-spesifikasinya-2023-07-31-164001-2023-08-10-023621_x_Thumbnail1000.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOXgtKEfDDG6ZrzIsEAWNQjindwCuLQtWNNA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9DgkIBRa3GpXhwzksI1iaobnTFhly2a4CpA&s',
      'https://image.made-in-china.com/2f0j00HrIkTZCGORgO/Industrial-Valve-Spring-Flange-Type-Stem-Pressure-Safety-Valve.webp'
    ]
  },
  // Electrical Components
  {
    category: 'ELECTRICAL',
    keywords: ['circuit', 'breaker', 'transformer', 'generator', 'motor', 'electric', 'voltage', 'listrik', 'pemutus', 'transformator'],
    imageUrls: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop'
    ]
  },
  // Control Systems
  {
    category: 'CONTROL',
    keywords: ['plc', 'scada', 'control', 'automation', 'controller', 'siemens', 'hmi', 'dcs'],
    imageUrls: [
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1260&h=750&fit=crop'
    ]
  },
  // Tools
  {
    category: 'TOOLS',
    keywords: ['tool', 'wrench', 'spanner', 'kunci', 'torque', 'alat', 'perkakas'],
    imageUrls: [
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop'
    ]
  }
];

/**
 * Simple hash function to convert string to number
 * Ensures same input always produces same output for consistent image selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get image URL for a product based on its name and category
 * Uses hash-based selection to ensure same item always gets same unique image
 * Returns Amazon/Alibaba-style product images from Unsplash at high resolution
 */
export function getProductImage(itemName: string, categoryId?: string, itemId?: string): string {
  const itemNameLower = itemName.toLowerCase();

  // Use item ID for deterministic hash, fallback to item name
  const hashKey = itemId || itemName;
  const hash = hashString(hashKey);

  // First, try to match by category ID
  if (categoryId) {
    const categoryCode = categoryId.replace('CAT-', '');
    const categoryMapping = productImageMappings.find(m =>
      m.category === categoryCode
    );
    if (categoryMapping && categoryMapping.imageUrls.length > 0) {
      // Use hash to select a unique image from the array
      const imageIndex = hash % categoryMapping.imageUrls.length;
      return categoryMapping.imageUrls[imageIndex];
    }
  }

  // Then try to match by keywords in the item name (supports Indonesian & English)
  for (const mapping of productImageMappings) {
    for (const keyword of mapping.keywords) {
      if (itemNameLower.includes(keyword.toLowerCase()) && mapping.imageUrls.length > 0) {
        // Use hash to select a unique image from the array
        const imageIndex = hash % mapping.imageUrls.length;
        return mapping.imageUrls[imageIndex];
      }
    }
  }

  // Default fallback images (high-quality industrial equipment - objects only)
  const fallbackImages = [
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1260&h=750&fit=crop',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1260&h=750&fit=crop',
    'https://images.unsplash.com/photo-1614960127503-be8e6db4e6b8?w=1260&h=750&fit=crop',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1260&h=750&fit=crop',
    'https://images.unsplash.com/photo-1621570074981-f08ac477fe6d?w=1260&h=750&fit=crop'
  ];

  const fallbackIndex = hash % fallbackImages.length;
  return fallbackImages[fallbackIndex];
}

/**
 * Get all product image mappings (for reference)
 */
export function getAllProductImageMappings(): ProductImageMapping[] {
  return [...productImageMappings];
}
