import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Package,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/products?limit=100'),
        fetch('/api/admin/categories'),
      ]);

      const pData = await pRes.json();
      const cData = await cRes.json();

      if (pData.ok && pData.data) setProducts(pData.data.products);
      if (cData.ok && cData.data) setCategories(cData.data);
    } catch (err) {
      showToast('Lỗi tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        showToast(data.data?.message || 'Đã xóa sản phẩm thành công', 'success');
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        showToast(data.error || 'Lỗi khi xóa sản phẩm', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: product.isActive ? 0 : 1 }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(`Đã ${product.isActive ? 'ẩn' : 'hiển thị'} sản phẩm`, 'success');
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isActive: !product.isActive } : p))
        );
      }
    } catch (err) {
      showToast('Lỗi cập nhật trạng thái', 'error');
    }
  };

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    if (selectedCat && String(p.categoryId) !== selectedCat && p.categorySlug !== selectedCat) {
      return false;
    }
    if (search && search.trim()) {
      const s = search.toLowerCase();
      return p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button (Xanh lá) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-pastel-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-xs sm:text-sm text-pastel-muted mt-0.5">
            Tổng cộng {products.length} sản phẩm trong kho
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-soft"
          >
            Thêm sản phẩm mới
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-pastel-border/80 shadow-soft flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm hoặc slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-pastel-cream/60 rounded-xl pl-10 pr-4 py-2 text-sm border border-pastel-border/80 focus:bg-white focus:border-brand-pink focus:outline-none"
          />
          <Search className="w-4 h-4 text-pastel-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-pastel-cream/60 rounded-xl px-3 py-2 text-sm border border-pastel-border/80 text-pastel-text focus:outline-none cursor-pointer"
            aria-label="Chọn danh mục"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <Button variant="outline" size="sm" onClick={fetchData} icon={RefreshCw} title="Tải lại">
            Tải lại
          </Button>
        </div>
      </div>

      {/* ═══ RESPONSIVE DISPLAY ═══ */}
      {/* 1. PC: FULL TABLE (>=1024px) */}
      <div className="hidden lg:block bg-white rounded-3xl border border-pastel-border/80 shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-pastel-cream/80 text-pastel-text font-display font-bold border-b border-pastel-border">
              <th className="py-3.5 px-4 w-16">Ảnh</th>
              <th className="py-3.5 px-4">Tên Sản Phẩm & Slug</th>
              <th className="py-3.5 px-4">Danh Mục</th>
              <th className="py-3.5 px-4">Giá Bán</th>
              <th className="py-3.5 px-4">Tổng Tồn</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-border/50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-pastel-muted">
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-pastel-cream/30 transition-colors">
                  {/* Image */}
                  <td className="py-3 px-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-pastel-cream border border-pastel-border/60">
                      <img
                        src={p.images?.[0]?.url || p.images?.[0]?.thumbnailUrl || ''}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Name & Slug */}
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-semibold text-pastel-text block line-clamp-1">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-pastel-muted font-mono block">
                      /{p.slug}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="bg-pastel-cream px-2.5 py-1 rounded-full border border-pastel-border text-[11px] font-medium">
                      {p.categoryName || 'Chưa phân loại'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <strong className="text-brand-pink-deep font-display font-bold text-sm block">
                      {formatCurrency(p.price)}
                    </strong>
                    {p.originalPrice && (
                      <span className="text-[11px] text-pastel-muted line-through">
                        {formatCurrency(p.originalPrice)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`font-display font-bold text-xs px-2.5 py-1 rounded-full border ${
                        p.totalStock <= 5
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      {p.totalStock} bộ
                    </span>
                  </td>

                  {/* Active Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`p-1.5 rounded-full transition-colors ${
                        p.isActive
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-pastel-muted hover:bg-gray-100'
                      }`}
                      title={p.isActive ? 'Đang hiện (bấm để ẩn)' : 'Đang ẩn (bấm để hiện)'}
                    >
                      {p.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Actions: Edit (Vàng) + Delete (Đỏ) */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/admin/products/edit/${p.id}`}>
                        <button
                          className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
                          title="Sửa sản phẩm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-all"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE & TABLET: CARDS LIST (<1024px, KHÔNG TRÀN NGANG) */}
      <div className="lg:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl text-center text-pastel-muted text-sm border border-pastel-border">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-3xl border border-pastel-border/80 shadow-soft space-y-3"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-pastel-cream shrink-0 border border-pastel-border/60">
                  <img
                    src={p.images?.[0]?.url || p.images?.[0]?.thumbnailUrl || ''}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-sm text-pastel-text line-clamp-1">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-pastel-muted font-mono block truncate">
                    /{p.slug}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-pastel-cream px-2 py-0.5 rounded-full border border-pastel-border text-[10px] text-pastel-text">
                      {p.categoryName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        p.totalStock <= 5
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      Tồn: {p.totalStock}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-pastel-border/40">
                <div>
                  <strong className="text-brand-pink-deep font-display font-bold text-sm block">
                    {formatCurrency(p.price)}
                  </strong>
                  {p.originalPrice && (
                    <span className="text-[10px] text-pastel-muted line-through">
                      {formatCurrency(p.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`p-2 rounded-xl border text-xs flex items-center gap-1 ${
                      p.isActive
                        ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                        : 'border-gray-200 text-gray-500 bg-gray-50'
                    }`}
                  >
                    {p.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{p.isActive ? 'Hiện' : 'Ẩn'}</span>
                  </button>

                  <Link to={`/admin/products/edit/${p.id}`}>
                    <button
                      className="p-2 rounded-xl bg-amber-500 text-white shadow-sm"
                      title="Sửa"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="p-2 rounded-xl bg-rose-500 text-white shadow-sm"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Xóa sản phẩm này?"
        message={`Mẹ có chắc chắn muốn xóa vĩnh viễn sản phẩm "${deleteTarget?.name}" không? Thao tác này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        cancelText="Giữ lại"
      />
    </div>
  );
}

export default AdminProducts;
