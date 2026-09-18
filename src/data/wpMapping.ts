export interface RolePermission {
  role: string;
  responsibilities: string[];
  wpMapping: string;
  accessLevel: 'Full' | 'High' | 'Medium' | 'Limited';
}

export interface WpSectionMapping {
  sectionName: string;
  elementorWidget: string;
  wooCommerceFunction: string;
  recommendedPlugin: string;
  tier: 'Free / Core' | 'Free Plugin' | 'Optional Paid / Gateway';
}

export const WP_ROLES: RolePermission[] = [
  {
    role: 'Super Admin',
    responsibilities: ['Full system control', 'Plugin/Theme updates', 'Financial settings', 'Staff user creation', 'Database backups'],
    wpMapping: 'WordPress Administrator (`administrator`)',
    accessLevel: 'Full'
  },
  {
    role: 'Store Manager',
    responsibilities: ['Manage WooCommerce settings', 'Inventory controls', 'Coupons & sales campaigns', 'View revenue analytics', 'Manage refunds'],
    wpMapping: 'WooCommerce Shop Manager (`shop_manager`)',
    accessLevel: 'High'
  },
  {
    role: 'Order Manager',
    responsibilities: ['Process incoming orders', 'Assign courier dispatch (Steadfast/Pathao)', 'Print invoices/shipping labels', 'Update order statuses'],
    wpMapping: 'Custom role via "User Role Editor" plugin (`order_manager`)',
    accessLevel: 'Medium'
  },
  {
    role: 'Product Manager',
    responsibilities: ['Add & edit products', 'Update descriptions, images, tags', 'Manage categories & stock alerts', 'Moderate pending reviews'],
    wpMapping: 'Custom role or Editor (`product_manager`)',
    accessLevel: 'Medium'
  },
  {
    role: 'Customer Support',
    responsibilities: ['View order statuses to answer customer inquiries', 'Look up customer phone numbers & tracking codes', 'Read customer support messages'],
    wpMapping: 'Restricted Shop Worker (`support_agent` with read-only orders)',
    accessLevel: 'Limited'
  },
  {
    role: 'Content Manager',
    responsibilities: ['Edit blog posts, legal policies, About Us page in Elementor', 'Update promotional hero banners', 'Manage homepage layout'],
    wpMapping: 'WordPress Editor (`editor`)',
    accessLevel: 'Limited'
  }
];

export const WP_MAPPING = {
  plugins: [
    { role: 'Core E-Commerce', name: 'WooCommerce Core', purpose: 'Products, catalog, cart, customer accounts, order processing' },
    { role: 'Theme Builder & Layout', name: 'Elementor Pro / Free', purpose: 'Visual layout builder for Header, Footer, and template sections' },
    { role: 'Customer Wishlist', name: 'TI WooCommerce Wishlist', purpose: 'Heart icon toggle, wishlist drawer, and shareable list' },
    { role: 'Custom Checkout Fields', name: 'Checkout Field Editor (ThemeHigh)', purpose: 'Add Bangladesh district dropdown, thana, and mobile phone validation' },
    { role: 'Product Variations', name: 'Variation Swatches for WooCommerce', purpose: 'Visual color circles and button pills for size selection' },
    { role: 'Bangladesh Mobile Payments', name: 'bKash / SSLCommerz Payment Gateway', purpose: 'Official bKash merchant tokenized checkout, cards, and mobile banking' },
    { role: 'Automated Courier Shipping', name: 'Steadfast Courier / Pathao Plugin', purpose: 'Automated order dispatch, tracking numbers, and delivery sync' },
    { role: 'Performance Caching', name: 'LiteSpeed Cache', purpose: 'Server-side caching, CSS/JS minification, and WebP image optimization' },
    { role: 'Search Engine Optimization', name: 'Rank Math SEO', purpose: 'Product Schema.org rich snippets, XML sitemaps, and OpenGraph tags' },
    { role: 'Email Deliverability', name: 'WP Mail SMTP', purpose: 'Ensure order confirmation emails arrive in customer inboxes' }
  ],
  pages: [
    {
      name: 'Global Header & Navigation',
      type: 'Elementor Theme Builder (Header)',
      sections: [
        { section: 'Top Announcement Bar', elementorWidget: 'Flex Container + Text Editor', notes: 'Delivery promo & contact' },
        { section: 'Search Bar with live suggestions', elementorWidget: 'Search Form / Ivory Search widget', notes: 'Instant product search' },
        { section: 'Wishlist & Cart Counters', elementorWidget: 'WooCommerce Mini-Cart + TI Wishlist Counter', notes: 'Shows real-time badge count' },
        { section: 'Category Mega Navigation', elementorWidget: 'Elementor Nav Menu / Mega Menu widget', notes: '10+ multi-category links' }
      ]
    },
    {
      name: 'Homepage (Front Page)',
      type: 'Elementor Page Template',
      sections: [
        { section: 'Hero Section with Dual CTAs', elementorWidget: 'Flexbox Container + Heading + Buttons', notes: 'Everyday Finds. Better Choices.' },
        { section: 'Shop by Category Grid', elementorWidget: 'Loop Grid or Icon Box Grid (4 cols)', notes: 'Visual cards with Bengali names' },
        { section: 'Featured Products Grid', elementorWidget: 'WooCommerce Products / Loop Grid', notes: 'Query: Featured = Yes' },
        { section: 'Special Offers Banner', elementorWidget: 'Container with Call to Action', notes: 'CHOLTI10 voucher promo' },
        { section: 'Why Shop with Us (4 Trust Blocks)', elementorWidget: 'Icon Box / Feature List widget', notes: 'COD, Inspection, 7-Day return' },
        { section: 'FAQ Accordion', elementorWidget: 'Toggle or Accordion widget', notes: 'Interactive FAQ drops' },
        { section: 'Newsletter Signup', elementorWidget: 'Form widget or Mailchimp block', notes: 'Customer email subscription' }
      ]
    },
    {
      name: 'Shop Catalog Page',
      type: 'Elementor Archive Template (Product Archive)',
      sections: [
        { section: 'Sidebar Filters', elementorWidget: 'Product Categories, Filter by Price, In-stock filter', notes: 'Left column filters' },
        { section: 'Product Loop Grid', elementorWidget: 'Archive Products / Loop Grid widget', notes: 'Responsive 4-3-2 column layout' },
        { section: 'Sort & Pagination', elementorWidget: 'WooCommerce Result Count & Catalog Ordering', notes: 'Price, popularity, rating' }
      ]
    },
    {
      name: 'Single Product Page',
      type: 'Elementor Single Product Template',
      sections: [
        { section: 'Image Gallery with Thumbnails', elementorWidget: 'Product Images widget / Woo Product Gallery', notes: 'Lightroom zoom support' },
        { section: 'Pricing, Stock, & Variations', elementorWidget: 'Product Price, Stock, Add to Cart widget', notes: 'Color & size buttons' },
        { section: 'Instant Cash on Delivery CTA', elementorWidget: 'Custom Add to Cart Button redirecting to /checkout/', notes: 'Buy Now instant checkout' },
        { section: 'Tabbed Specs & Customer Reviews', elementorWidget: 'Product Data Tabs widget', notes: 'Specs, Delivery terms, reviews' },
        { section: 'Related Products Section', elementorWidget: 'Product Related widget (4 cols)', notes: 'Cross-sell related products' }
      ]
    },
    {
      name: 'Cart & Checkout Pages',
      type: 'WooCommerce Core Pages',
      sections: [
        { section: 'Cart Page with Delivery Calculator', elementorWidget: 'WooCommerce Cart Block `[woocommerce_cart]`', notes: 'Dhaka vs Outside Dhaka rates' },
        { section: 'Checkout Page', elementorWidget: 'WooCommerce Checkout Block `[woocommerce_checkout]`', notes: 'COD & bKash options' },
        { section: 'Order Received Confirmation', elementorWidget: 'WooCommerce Thank You template', notes: 'Order ID & Courier dispatch note' }
      ]
    },
    {
      name: 'Customer Account & Order Tracking',
      type: 'Elementor My Account Template',
      sections: [
        { section: 'My Account Dashboard', elementorWidget: 'WooCommerce My Account `[woocommerce_my_account]`', notes: 'Past orders, addresses' },
        { section: 'Order Tracking System', elementorWidget: 'Order Tracking Shortcode `[woocommerce_order_tracking]`', notes: 'Track by Order ID & Phone' }
      ]
    }
  ]
};

