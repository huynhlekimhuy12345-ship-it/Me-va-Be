import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import { Plus, Edit, Trash2, FolderTree, RefreshCw, AlertCircle } from 'lucide-react';

export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🧸');
  const [sortOrder, setSortOrder] = useState('0');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.ok && data.data) {
        setCategories(data.data);
      }
    } catch {
      showToast('Lỗi khi tải danh mục', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setName('');
    setIcon('🧸');
    setSortOrder(String(categories.length + 1));
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditItem(cat);
    setName(cat.name);
    setIcon(cat.icon || '🧸');
    setSortOrder(String(cat.sortOrder || 0));
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Vui lòng nhập tên danh mục');
      return;
    }

    setSubmitting(true);
    try {
      const url = editItem ? `/api/admin/categories/${editItem.id}` : '/api/admin/categories';
      const method = editItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon.trim(),
          sortOrder: parseInt(sortOrder, 10) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(
          editItem ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục mới thành công!',
          'success'
        );
        setModalOpen(false);
        fetchCategories();
      } else {
        setFormError(data.error || 'Có lỗi xảy ra');
      }
    } catch {
      setFormError('Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    // Client-side check before making request
    if (deleteTarget.productCount > 0) {
      showToast(
        `Không thể xóa danh mục "${deleteTarget.name}" vì đang có ${deleteTarget.productCount} sản phẩm liên kết!`,
        'error'
      );
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        showToast('Đã xóa danh mục thành công!', 'success');
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        showToast(data.error || 'Lỗi khi xóa danh mục', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-pastel-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
            Quản Lý Danh Mục
          </h1>
          <p className="text-xs sm:text-sm text-pastel-muted mt-0.5">
            Phân loại sản phẩm hiển thị trên menu và trang chủ
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Categories Table on PC / Cards on Mobile */}
      <div className="bg-white rounded-3xl border border-pastel-border/80 shadow-soft overflow-hidden">
        {/* Table for PC */}
        <div className="hidden sm:block">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-pastel-cream/80 text-pastel-text font-display font-bold border-b border-pastel-border">
                <th className="py-3 px-4 w-14">Icon</th>
                <th className="py-3 px-4">Tên Danh Mục & Slug</th>
                <th className="py-3 px-4">Thứ Tự</th>
                <th className="py-3 px-4">Số Sản Phẩm</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pastel-border/50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-pastel-cream/30 transition-colors">
                  <td className="py-3 px-4 text-2xl select-none">{cat.icon}</td>
                  <td className="py-3 px-4">
                    <strong className="font-semibold text-pastel-text text-sm block">
                      {cat.name}
                    </strong>
                    <span className="text-[11px] text-pastel-muted font-mono">
                      /{cat.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-pastel-text">{cat.sortOrder}</td>
                  <td className="py-3 px-4">
                    <span className="bg-pastel-cream px-2.5 py-1 rounded-full border border-pastel-border text-xs font-semibold">
                      {cat.productCount} sản phẩm
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                        title="Sửa"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for Mobile */}
        <div className="sm:hidden divide-y divide-pastel-border/60">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{cat.icon}</span>
                <div>
                  <h4 className="font-display font-bold text-sm text-pastel-text">{cat.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-pastel-muted mt-0.5">
                    <span>Thứ tự: {cat.sortOrder}</span>
                    <span>•</span>
                    <span className="text-brand-pink-deep font-semibold">
                      {cat.productCount} món
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-xl bg-amber-500 text-white"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="p-2 rounded-xl bg-rose-500 text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Tên danh mục"
            required
            placeholder="Ví dụ: Pijama Bé Gái"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formError) setFormError('');
            }}
            error={formError}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Biểu tượng (Emoji)"
              placeholder="Ví dụ: 👧, 👦, 🍼, 👩‍👧"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />

            <Input
              label="Thứ tự hiển thị"
              type="number"
              placeholder="1, 2, 3..."
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-pastel-border/60">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Lưu danh mục
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Xóa danh mục?"
        message={
          deleteTarget?.productCount > 0
            ? `Danh mục "${deleteTarget?.name}" đang có ${deleteTarget?.productCount} sản phẩm. Không thể xóa danh mục đang có sản phẩm!`
            : `Mẹ có chắc chắn muốn xóa danh mục "${deleteTarget?.name}" không?`
        }
        confirmText="Xóa danh mục"
        cancelText="Hủy bỏ"
      />
    </div>
  );
}

export default AdminCategories;
