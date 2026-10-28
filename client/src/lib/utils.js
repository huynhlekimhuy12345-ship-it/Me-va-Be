/**
 * Utility helper functions for Nga Pijama Mẹ & Bé
 */

// Format currency to standard Vietnamese VND display: e.g. 189000 -> 189.000đ
export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + 'đ';
}

// Strip Vietnamese accents for accent-insensitive search and slug generation
export function removeAccents(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Generate URL slug from title
export function generateSlug(text) {
  if (!text) return '';
  return removeAccents(text)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Phone validator: 10 digits starting with 0
export function isValidPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s.-]/g, '');
  return /^0\d{9}$/.test(clean);
}

// Classnames merger
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
