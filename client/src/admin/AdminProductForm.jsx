import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { generateSlug } from '../lib/utils';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Star,
  Check,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
} from 'lucide-react';

const AGE_OPTIONS = [
  { value: '0-1', label: '0 - 1 tuổi (Sơ sinh)' },
  { value: '1-3', label: '1 - 3 tuổi' },
  { value: '3-6', label: '3 - 6 tuổi' },
  { value: '6-10', label: '6 - 10 tuổi' },
];

export function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    ageRange: '1-3',
    gender: 'unisex',
    price: '',
    originalPrice: '',
    isNew: true,
    isBestSeller: false,
    isActive: true,
    description: '',
  });

  // Variants State
  const [variants, setVariants] = useState([
    { id: 1, size: 'Size 1 (8-10kg)', color: 'Mặc định', stock: 10 },
    { id: 2, size: 'Size 2 (11-13kg)', color: 'Mặc định', stock: 10 },
  ]);

  // Images State (array of { url, thumbnailUrl })
  const [images, setImages] = useState([]);

  // Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // 1. Fetch categories
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          setCategories(data.data);
          if (!isEdit && data.data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data.data[0].id }));
          }
        }
      });

    // 2. If editing, fetch product details
    if (isEdit) {
      setLoading(true);
      fetch(`/api/admin/products?limit=100`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.data) {
            const product = data.data.products.find((p) => p.id === Number(id));
            if (product) {
              setFormData({
                name: product.name,
                slug: product.slug,
                categoryId: product.categoryId || '',
                ageRange: product.ageRange || '1-3',
                gender: product.gender || 'unisex',
                price: product.price,
                originalPrice: product.originalPrice || '',
                isNew: product.isNew,
                isBestSeller: product.isBestSeller,
                isActive: product.isActive,
                description: product.description || '',
              });
              if (product.variants && product.variants.length > 0) {
                setVariants(product.variants);
              }
              if (product.images && product.images.length > 0) {
                setImages(product.images);
              }
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // Auto-generate slug when name changes (only in add mode or if user hasn't custom edited slug)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: !isEdit ? generateSlug(newName) : prev.slug,
    }));
  };

  // Add Variant Row
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { id: Date.now(), size: `Size ${prev.length + 1}`, color: 'Pastel', stock: 10 },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      showToast('Sản phẩm phải có ít nhất 1 biến thể!', 'error');
      return;
    }
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Handle Multi-image file upload via /api/admin/upload (sharp + multer)
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const body = new FormData();
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 5 * 1024 * 1024) {
        showToast(`File ${files[i].name} vượt quá 5MB.`, 'error');
        setUploading(false);
        return;
      }
      body.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setImages((prev) => [...prev, ...data.data]);
        showToast(`Đã tải lên ${data.data.length} ảnh và nén WebP thành công!`, 'success');
      } else {
        showToast(data.error || 'Lỗi khi upload ảnh.', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối khi tải ảnh lên.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Reorder Images
  const moveImage = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Set Primary Image (move to index 0)
  const setPrimaryImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
    showToast('Đã chọn làm ảnh đại diện chính!', 'success');
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Giá bán phải lớn hơn 0';
    if (
      formData.originalPrice &&
      Number(formData.originalPrice) <= Number(formData.price)
    ) {
      errs.originalPrice = 'Giá khuyến mãi (giá bán) phải nhỏ hơn giá gốc ban đầu';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Vui lòng kiểm tra lại các trường báo đỏ!', 'error');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      variants: variants.map((v) => ({
        size: v.size.trim(),
        color: (v.color || '').trim(),
        stock: parseInt(v.stock, 10) || 0,
      })),
      images: images.map((img) => ({
        url: img.url,
        thumbnailUrl: img.thumbnailUrl || img.url,
      })),
    };

    try {
      const url = isEdit ? `/api/admin/products/${id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(
          isEdit ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!',
          'success'
        );
        navigate('/admin/products');
      } else {
        showToast(data.error || 'Lỗi lưu sản phẩm', 'error');
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-pastel-border/60">
        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <button className="p-2 rounded-xl bg-white border border-pastel-border text-pastel-muted hover:text-pastel-text">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-pastel-text">
              {isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h1>
            <p className="text-xs text-pastel-muted">
              {isEdit ? `Mã sản phẩm: #${id}` : 'Nhập thông tin chi tiết, biến thể và tải ảnh'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          loading={submitting}
          onClick={handleSubmit}
          className="bg-emerald-600 hover:bg-emerald-700 font-bold"
        >
          {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        </Button>
      </div>

      {/* ═══ RESPONSIVE FORM: 2 COLUMNS ON PC, 1 COLUMN ON MOBILE ═══ */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols PC): Basic info, Variants, Description */}
        <div className="lg:col-span-8 space-y-6">
          {/* Box 1: Thông tin cơ bản */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-pastel-border/80 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-base text-pastel-text pb-2 border-b border-pastel-border/40">
              1. Thông Tin Chung
            </h3>

            <Input
              label="Tên sản phẩm"
              required
              placeholder="Ví dụ: Pijama Thô Cotton Hàn Quốc Họa Tiết Gấu Nâu"
              value={formData.name}
              onChange={handleNameChange}
              error={errors.name}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Đường dẫn URL (Slug tự sinh)"
                placeholder="pijama-tho-cotton-gau-nau"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="Tự sinh không dấu, có thể chỉnh sửa."
              />

              <div>
                <label className="text-sm font-medium text-pastel-text mb-1.5 block">
                  Danh mục sản phẩm <span className="text-brand-pink font-bold">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 min-h-[44px] focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 focus:outline-none cursor-pointer"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-pastel-text mb-1.5 block">
                  Độ tuổi của bé
                </label>
                <select
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  className="w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 min-h-[44px] focus:border-brand-pink focus:outline-none cursor-pointer"
                >
                  {AGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-pastel-text mb-1.5 block">
                  Phù hợp cho
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 min-h-[44px] focus:border-brand-pink focus:outline-none cursor-pointer"
                >
                  <option value="female">Bé Gái</option>
                  <option value="male">Bé Trai</option>
                  <option value="unisex">Cả Bé Trai & Gái</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-pastel-text mb-1.5 block">
                Mô tả chi tiết sản phẩm
              </label>
              <textarea
                rows={4}
                placeholder="Chất vải thô boi 100% cotton Hàn Quốc, cúc bọc mềm, thoáng khí..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Box 2: Biến thể Size, Màu & Tồn kho */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-pastel-border/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pastel-border/40">
              <div>
                <h3 className="font-display font-bold text-base text-pastel-text">
                  2. Biến Thể Size & Tồn Kho
                </h3>
                <p className="text-xs text-pastel-muted">
                  Tồn kho sẽ tự động trừ khi đơn hàng chuyển sang trạng thái "Đã xác nhận"
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={addVariant}
                className="text-xs"
              >
                Thêm size
              </Button>
            </div>

            <div className="space-y-2.5">
              {variants.map((v, idx) => (
                <div
                  key={v.id || idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-pastel-cream/50 border border-pastel-border/60"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Size (VD: Size 1 (8-10kg))"
                      value={v.size}
                      onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                      className="w-full bg-white text-sm rounded-xl px-3 py-2 border border-pastel-border focus:border-brand-pink focus:outline-none"
                    />
                  </div>

                  <div className="w-full sm:w-36">
                    <input
                      type="text"
                      placeholder="Màu sắc (VD: Hồng)"
                      value={v.color}
                      onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                      className="w-full bg-white text-sm rounded-xl px-3 py-2 border border-pastel-border focus:border-brand-pink focus:outline-none"
                    />
                  </div>

                  <div className="w-full sm:w-28 flex items-center gap-1.5">
                    <span className="text-xs text-pastel-muted sm:hidden">Tồn:</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Tồn kho"
                      value={v.stock}
                      onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                      className="w-full bg-white text-sm rounded-xl px-3 py-2 border border-pastel-border focus:border-brand-pink focus:outline-none text-center font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="p-2 text-pastel-muted hover:text-brand-danger self-end sm:self-center"
                    title="Xóa biến thể"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols PC): Pricing, Media Upload, Badges & Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Box 3: Giá bán */}
          <div className="bg-white p-5 rounded-3xl border border-pastel-border/80 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-base text-pastel-text pb-2 border-b border-pastel-border/40">
              3. Giá Bán (VNĐ)
            </h3>

            <Input
              label="Giá bán thực tế"
              required
              type="number"
              min="0"
              placeholder="VD: 189000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={errors.price}
              helperText="Số nguyên VNĐ (sẽ hiển thị dạng 189.000đ)"
            />

            <Input
              label="Giá gốc ban đầu (nếu có giảm giá)"
              type="number"
              min="0"
              placeholder="VD: 220000"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              error={errors.originalPrice}
              helperText="Phải lớn hơn giá bán thực tế để hiển thị badge -% giảm giá."
            />
          </div>

          {/* Box 4: Ảnh sản phẩm (Upload kéo-thả, đổi thứ tự, ảnh đại diện) */}
          <div className="bg-white p-5 rounded-3xl border border-pastel-border/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pastel-border/40">
              <h3 className="font-display font-bold text-base text-pastel-text">
                4. Ảnh Sản Phẩm
              </h3>
              <span className="text-xs text-pastel-muted">{images.length} ảnh</span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <label className="border-2 border-dashed border-pastel-border hover:border-brand-pink rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-pastel-cream/40 hover:bg-pastel-cream transition-all">
              <Upload className="w-6 h-6 text-brand-pink mb-1" />
              <span className="text-xs font-bold text-pastel-text">Tải ảnh lên (Tối đa 5MB)</span>
              <span className="text-[10px] text-pastel-muted mt-0.5">JPG, PNG, WebP (Tự động nén)</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {uploading && (
              <p className="text-xs text-brand-pink font-semibold text-center animate-pulse">
                Đang xử lý nén WebP và tạo thumbnail...
              </p>
            )}

            {/* Uploaded Images List with Reordering & Primary Selection */}
            <div className="space-y-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded-xl border ${
                    idx === 0
                      ? 'bg-brand-pink-light/40 border-brand-pink'
                      : 'bg-white border-pastel-border'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-pastel-cream shrink-0 border border-pastel-border/60">
                    <img src={img.url} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-pastel-text truncate block">
                      {idx === 0 ? '⭐ Ảnh đại diện' : `Ảnh #${idx + 1}`}
                    </span>
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(idx)}
                        className="text-[10px] text-brand-pink hover:underline"
                      >
                        Đặt làm ảnh chính
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, -1)}
                      className="p-1 rounded text-pastel-muted hover:text-pastel-text disabled:opacity-30"
                      title="Lên trên"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, 1)}
                      className="p-1 rounded text-pastel-muted hover:text-pastel-text disabled:opacity-30"
                      title="Xuống dưới"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded text-pastel-muted hover:text-brand-danger"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 5: Trạng thái & Huy hiệu */}
          <div className="bg-white p-5 rounded-3xl border border-pastel-border/80 shadow-soft space-y-3">
            <h3 className="font-display font-bold text-base text-pastel-text pb-2 border-b border-pastel-border/40">
              5. Trạng Thái & Nhãn
            </h3>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded text-brand-pink focus:ring-brand-pink"
              />
              <span className="text-xs font-semibold text-pastel-text">
                Hiển thị trên website (bỏ chọn để ẩn)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="rounded text-brand-pink focus:ring-brand-pink"
              />
              <span className="text-xs font-semibold text-pastel-text">
                Gắn nhãn "Mới về" (Hiển thị trang chủ)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded text-brand-pink focus:ring-brand-pink"
              />
              <span className="text-xs font-semibold text-pastel-text">
                Gắn nhãn "Bán chạy nhất"
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
