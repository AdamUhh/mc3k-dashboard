export const ROUTES = {
    DASHBOARD: '/',
    COLLECTIONS: '/collections',
    TAGS: '/tags',
    LABELS: '/labels',
    BRANDS: '/brands',
    MODELS: '/models',
    PRODUCTS: '/products',
    INVENTORY: '/inventory',
    DRAFTS: '/drafts',
} as const;

// Navigation configuration using constants
export const navigation: { href: string; name: string }[] = [
    { href: ROUTES.DASHBOARD, name: 'Dashboard' },
    { href: ROUTES.COLLECTIONS, name: 'Collections' },
    { href: ROUTES.TAGS, name: 'Tags' },
    { href: ROUTES.LABELS, name: 'Labels' },
    { href: ROUTES.BRANDS, name: 'Brands' },
    { href: ROUTES.MODELS, name: 'Models' },
    { href: ROUTES.PRODUCTS, name: 'Products' },
    { href: ROUTES.INVENTORY, name: 'Inventory' },
    { href: ROUTES.DRAFTS, name: 'Drafts' },
];
