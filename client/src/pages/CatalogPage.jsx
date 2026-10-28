import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Drawer from '../components/common/Drawer';
import Button from '../components/common/Button';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../lib/mockData';
import { removeAccents } from '../lib/utils';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';

const AGE_OPTIONS = [
  { value: '0-1', label: '0 - 1 tuổi (Sơ sinh)' },
  { value: '1-3', label: '1 - 3 tuổi' },
  { value: '3-6', label: '3 - 6 tuổi' },
  { value: '6-10', label: '6 - 10 tuổi' },
];

const PRICE_OPTIONS = [
  { value: 'under-150', label: 'Dưới 150.000đ', min: 0, max: 150000 },
  { value: '150-250', label: '150.000đ - 250.000đ', min: 150000, max: 250000 },
  { value: 'above-250', label: 'Trên 250.000đ', min: 250000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
];

const ITEMS_PER_PAGE = 8;

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  // Extract query filters
  const currentCat = searchParams.get('cat') || '';
  const currentAge = searchParams.get('age') || '';
  const currentPrice = searchParams.get('price') || '';
  const currentQuery = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch live categories and products
  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data && isMounted) {
          setCategories(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/products?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data && data.data.products && isMounted) {
          setProducts(data.data.products);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Update query params helper
  const updateFilter = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    // Reset page to 1 when changing filters other than page
    if (!('page' in updates)) {
      nextParams.delete('page');
    }

    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      if (currentCat && product.categorySlug !== currentCat && String(product.categoryId) !== currentCat) {
        return false;
      }

      // 2. Age Filter
      if (currentAge && product.ageRange !== currentAge) {
        return false;
      }

      // 3. Price Filter
      if (currentPrice) {
        const option = PRICE_OPTIONS.find((p) => p.value === currentPrice);
        if (option) {
          if (product.price < option.min || product.price > option.max) {
            return false;
          }
        }
      }

      // 4. Accent-insensitive & Case-insensitive Name Search
      if (currentQuery) {
        const normalizedQuery = removeAccents(currentQuery);
        const normalizedName = removeAccents(product.name);
        const normalizedCat = removeAccents(product.categoryName || '');
        if (!normalizedName.includes(normalizedQuery) && !normalizedCat.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === 'price-asc') return a.price - b.price;
      if (currentSort === 'price-desc') return b.price - a.price;
      if (currentSort === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      // 'newest' default
      return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    });
  }, [currentCat, currentAge, currentPrice, currentQuery, currentSort]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const hasActiveFilters = Boolean(currentCat || currentAge || currentPrice || currentQuery);

  // Render Filter Form Component (Reusable for Sidebar and Mobile Bottom Sheet)
  const FilterContent = () => (
    <div className="space-y-6 text-sm">
      {/* Category Section */}
      <div>
        <h4 className="font-display font-bold text-pastel-text mb-3 flex items-center justify-between">
          <span>Danh Mục</span>
          {currentCat && (
            <button
              onClick={() => updateFilter({ cat: '' })}
              className="text-xs text-brand-pink hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </h4>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => updateFilter({ cat: '' })}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
              !currentCat
                ? 'bg-brand-pink-light text-brand-pink-deep font-bold'
                : 'text-pastel-text hover:bg-pastel-cream'
            }`}
          >
            <span>Tất cả đồ xinh</span>
            {!currentCat && <Check className="w-4 h-4 text-brand-pink" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter({ cat: cat.slug })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentCat === cat.slug
                  ? 'bg-brand-pink-light text-brand-pink-deep font-bold'
                  : 'text-pastel-text hover:bg-pastel-cream'
              }`}
            >
              <span>{cat.name}</span>
              {currentCat === cat.slug && <Check className="w-4 h-4 text-brand-pink" />}
            </button>
          ))}
        </div>
      </div>

      {/* Age Section */}
      <div className="pt-4 border-t border-pastel-border/60">
        <h4 className="font-display font-bold text-pastel-text mb-3 flex items-center justify-between">
          <span>Độ Tuổi Của Bé</span>
          {currentAge && (
            <button
              onClick={() => updateFilter({ age: '' })}
              className="text-xs text-brand-pink hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {AGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter({ age: currentAge === opt.value ? '' : opt.value })}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                currentAge === opt.value
                  ? 'bg-brand-pink text-white border-brand-pink shadow-soft'
                  : 'bg-white text-pastel-text border-pastel-border hover:border-brand-pink'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="pt-4 border-t border-pastel-border/60">
        <h4 className="font-display font-bold text-pastel-text mb-3 flex items-center justify-between">
          <span>Khoảng Giá</span>
          {currentPrice && (
            <button
              onClick={() => updateFilter({ price: '' })}
              className="text-xs text-brand-pink hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </h4>
        <div className="flex flex-col gap-1.5">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter({ price: currentPrice === opt.value ? '' : opt.value })}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                currentPrice === opt.value
                  ? 'bg-brand-pink-light text-brand-pink-deep font-bold'
                  : 'text-pastel-text hover:bg-pastel-cream'
              }`}
            >
              <span>{opt.label}</span>
              {currentPrice === opt.value && <Check className="w-4 h-4 text-brand-pink" />}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-4 border-t border-pastel-border/60">
          <Button variant="outline" size="sm" fullWidth onClick={clearAllFilters} icon={X}>
            Xóa tất cả bộ lọc
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Page Title & Search Term Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-pastel-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
            {currentCat
              ? categories.find((c) => c.slug === currentCat)?.name || 'Bộ Sưu Tập Pijama'
              : 'Bộ Sưu Tập Pijama Trẻ Em'}
          </h1>
          <p className="text-xs sm:text-sm text-pastel-muted mt-1">
            Hiển thị {filteredProducts.length} sản phẩm phù hợp cho bé
            {currentQuery && (
              <span className="font-semibold text-pastel-text"> với từ khóa "{currentQuery}"</span>
            )}
          </p>
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button (<1024px) */}
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsMobileFilterOpen(true)}
            icon={SlidersHorizontal}
            className="lg:hidden relative"
          >
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-pink absolute -top-1 -right-1" />
            )}
          </Button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-pastel-border shadow-soft min-h-[44px]">
            <ArrowUpDown className="w-4 h-4 text-pastel-muted shrink-0" />
            <select
              value={currentSort}
              onChange={(e) => updateFilter({ sort: e.target.value })}
              className="bg-transparent text-xs sm:text-sm font-semibold text-pastel-text focus:outline-none cursor-pointer pr-1"
              aria-label="Sắp xếp sản phẩm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-pastel-muted">Đang lọc:</span>
          {currentQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pastel-pink/60 text-pastel-text">
              Từ khóa: "{currentQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter({ q: '' })} />
            </span>
          )}
          {currentCat && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pastel-mint text-pastel-mint-deep">
              {categories.find((c) => c.slug === currentCat)?.name}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter({ cat: '' })} />
            </span>
          )}
          {currentAge && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pastel-yellow text-amber-900">
              Độ tuổi: {currentAge} tuổi
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter({ age: '' })} />
            </span>
          )}
          {currentPrice && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-800">
              {PRICE_OPTIONS.find((p) => p.value === currentPrice)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter({ price: '' })} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-brand-pink underline hover:text-brand-pink-hover font-medium ml-1"
          >
            Xóa hết
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar (PC >=1024px) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Fixed Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white p-5 rounded-3xl border border-pastel-border/70 shadow-soft">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-pastel-border/60">
              <h3 className="font-display font-bold text-base text-pastel-text flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-pink" />
                <span>Bộ Lọc Sản Phẩm</span>
              </h3>
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid Area (4 cols on PC, 3 on tablet, 2 on mobile) */}
        <section className="lg:col-span-3">
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-pastel-border/70 shadow-soft">
              <EmptyState
                type="search"
                title="Không tìm thấy sản phẩm nào"
                description="Mẹ hãy thử tìm với từ khóa khác hoặc xóa bớt các bộ lọc để xem nhiều đồ xinh hơn nhé!"
                actionText="Xóa tất cả bộ lọc"
                onAction={clearAllFilters}
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateFilter({ page })}
              />
            </div>
          )}
        </section>
      </div>

      {/* Mobile Bottom Sheet Filter Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Bộ lọc sản phẩm"
        position="bottom"
        footer={
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setIsMobileFilterOpen(false)}
          >
            Xem {filteredProducts.length} sản phẩm
          </Button>
        }
      >
        <FilterContent />
      </Drawer>
    </div>
  );
}

export default CatalogPage;
