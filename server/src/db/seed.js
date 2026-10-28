import db, { initSchema, runTransaction } from './database.js';

function generateSvgImage(title, bgColor = '#FFD6E0', pattern = 'bear') {
  const safeTitle = (title || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  let patternSvg = '';

  if (pattern === 'bear') {
    patternSvg = `
      <circle cx="150" cy="140" r="45" fill="#5B4A4A"/>
      <circle cx="115" cy="105" r="18" fill="#5B4A4A"/>
      <circle cx="115" cy="105" r="9" fill="#FF8FAB"/>
      <circle cx="185" cy="105" r="18" fill="#5B4A4A"/>
      <circle cx="185" cy="105" r="9" fill="#FF8FAB"/>
      <ellipse cx="150" cy="155" rx="18" ry="14" fill="#FFF8F0"/>
      <polygon points="150,148 142,156 158,156" fill="#5B4A4A"/>
      <circle cx="135" cy="135" r="3.5" fill="#FFF8F0"/>
      <circle cx="165" cy="135" r="3.5" fill="#FFF8F0"/>
      <circle cx="128" cy="148" r="5" fill="#FF8FAB" opacity="0.8"/>
      <circle cx="172" cy="148" r="5" fill="#FF8FAB" opacity="0.8"/>
      <path d="M 125 190 Q 150 210 175 190 Q 150 225 125 190" fill="#C5F0DC"/>
    `;
  } else if (pattern === 'floral') {
    patternSvg = `
      <circle cx="150" cy="140" r="22" fill="#FFEFC7"/>
      <circle cx="150" cy="110" r="16" fill="#FF8FAB" opacity="0.9"/>
      <circle cx="150" cy="170" r="16" fill="#FF8FAB" opacity="0.9"/>
      <circle cx="120" cy="140" r="16" fill="#FF8FAB" opacity="0.9"/>
      <circle cx="180" cy="140" r="16" fill="#FF8FAB" opacity="0.9"/>
    `;
  } else if (pattern === 'cloud') {
    patternSvg = `
      <path d="M 110 150 A 25 25 0 0 1 150 130 A 30 30 0 0 1 190 150 A 20 20 0 0 1 180 180 L 120 180 A 20 20 0 0 1 110 150 Z" fill="#FFFFFF"/>
      <circle cx="138" cy="155" r="3" fill="#5B4A4A"/>
      <circle cx="162" cy="155" r="3" fill="#5B4A4A"/>
      <circle cx="130" cy="163" r="4" fill="#FF8FAB" opacity="0.7"/>
      <circle cx="170" cy="163" r="4" fill="#FF8FAB" opacity="0.7"/>
    `;
  } else {
    patternSvg = `
      <path d="M 120 110 L 105 130 L 125 145 L 132 128 L 132 175 L 168 175 L 168 128 L 175 145 L 195 130 L 180 110 Q 150 120 120 110 Z" fill="#FFFFFF" stroke="#5B4A4A" stroke-width="3"/>
      <path d="M 132 185 L 132 215 L 146 215 L 150 195 L 154 215 L 168 215 L 168 185 Z" fill="#FFFFFF" stroke="#5B4A4A" stroke-width="3"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="${bgColor}"/>
    <circle cx="50" cy="50" r="8" fill="#FFFFFF" opacity="0.4"/>
    <circle cx="250" cy="70" r="12" fill="#FFFFFF" opacity="0.4"/>
    <circle cx="230" cy="240" r="10" fill="#FFFFFF" opacity="0.4"/>
    <circle cx="70" cy="220" r="14" fill="#FFFFFF" opacity="0.4"/>
    ${patternSvg}
    <rect x="20" y="240" width="260" height="36" rx="18" fill="#FFFFFF" opacity="0.9"/>
    <text x="150" y="263" dominant-baseline="middle" text-anchor="middle" fill="#5B4A4A" font-family="sans-serif" font-weight="bold" font-size="13">${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function seedData() {
  console.log('[Seed] Khởi tạo dữ liệu mẫu...');
  initSchema();

  runTransaction((tx) => {
    // Clear existing data
    tx.exec(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM product_images;
      DELETE FROM product_variants;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM counters;
    `);

    // Reset counters
    tx.prepare("INSERT INTO counters (name, current_value) VALUES ('order_code', 100)").run();

    // 1. Seed Categories
    const insertCat = tx.prepare(
      'INSERT INTO categories (id, name, slug, icon, sort_order) VALUES (?, ?, ?, ?, ?)'
    );

    insertCat.run(1, 'Pijama Bé Gái', 'be-gai', '👧', 1);
    insertCat.run(2, 'Pijama Bé Trai', 'be-trai', '👦', 2);
    insertCat.run(3, 'Đồ Bộ Sơ Sinh', 'so-sinh', '🍼', 3);
    insertCat.run(4, 'Set Mẹ & Bé', 'me-va-be', '👩‍👧', 4);

    // 2. Seed 12 Products
    const insertProduct = tx.prepare(`
      INSERT INTO products (
        id, category_id, name, slug, description, age_range, gender,
        price, original_price, is_new, is_bestseller, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertImage = tx.prepare(`
      INSERT INTO product_images (product_id, image_url, thumbnail_url, sort_order, is_primary)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertVariant = tx.prepare(`
      INSERT INTO product_variants (product_id, size, color, stock)
      VALUES (?, ?, ?, ?)
    `);

    const products = [
      {
        id: 1,
        catId: 1,
        name: 'Pijama Thô Cotton Hàn Quốc Họa Tiết Gấu Nâu Cho Bé Gái',
        slug: 'pijama-tho-cotton-gau-nau-be-gai',
        desc: 'Chất liệu vải thô boi 100% cotton Hàn Quốc dệt mộc tự nhiên, siêu thoáng khí, thấm hút mồ hôi cực tốt. Họa tiết gấu nâu ngộ nghĩnh, cúc cài bọc vải mềm không gây cấn da bé khi ngủ.',
        age: '1-3',
        gender: 'female',
        price: 189000,
        originalPrice: 220000,
        isNew: 1,
        isBest: 1,
        pattern: 'bear',
        variants: [
          { size: 'Size 1 (8-10kg)', color: 'Hồng Phấn', stock: 12 },
          { size: 'Size 2 (11-13kg)', color: 'Hồng Phấn', stock: 8 },
          { size: 'Size 3 (14-16kg)', color: 'Hồng Phấn', stock: 3 }, // low stock <=5
          { size: 'Size 4 (17-19kg)', color: 'Vàng Kem', stock: 0 }, // out of stock
        ],
      },
      {
        id: 2,
        catId: 2,
        name: 'Set Pijama Bé Trai Họa Tiết Xe Bus & Động Vật Rừng Xanh',
        slug: 'pijama-be-trai-xe-bus-dong-vat',
        desc: 'Thiết kế cổ bẻ pijama sang chảnh, form rộng rãi thoải mái cho các bé trai tha hồ vận động. Vải cotton mềm mịn giặt máy không lo bai dão.',
        age: '3-6',
        gender: 'male',
        price: 195000,
        originalPrice: 230000,
        isNew: 1,
        isBest: 1,
        pattern: 'pajama',
        variants: [
          { size: 'Size 3 (13-15kg)', color: 'Xanh Mint', stock: 15 },
          { size: 'Size 4 (16-18kg)', color: 'Xanh Mint', stock: 6 },
          { size: 'Size 5 (19-22kg)', color: 'Xanh Mint', stock: 2 }, // low stock
        ],
      },
      {
        id: 3,
        catId: 3,
        name: 'Đồ Bộ Sơ Sinh Cài Lệch Cotton Organic Mềm Mại Cho Bé',
        slug: 'do-bo-so-sinh-cai-lech-cotton-organic',
        desc: 'Bộ cài lệch giữ ấm ngực và bụng cho bé sơ sinh, đường may lộn ngoài chống xước da non nớt của con. Vải đạt chứng nhận Organic an toàn tuyệt đối.',
        age: '0-1',
        gender: 'unisex',
        price: 149000,
        originalPrice: 175000,
        isNew: 0,
        isBest: 1,
        pattern: 'cloud',
        variants: [
          { size: '0-3 tháng (3-5kg)', color: 'Vàng Kem', stock: 10 },
          { size: '3-6 tháng (5-7kg)', color: 'Vàng Kem', stock: 9 },
          { size: '6-9 tháng (7-9kg)', color: 'Trắng Sữa', stock: 4 }, // low stock
        ],
      },
      {
        id: 4,
        catId: 4,
        name: 'Set Pijama Đôi Mẹ & Bé Gái Hoa Nhí Vintage Dễ Thương',
        slug: 'set-pijama-doi-me-va-be-hoa-nhi-vintage',
        desc: 'Gồm 1 bộ cho mẹ (freesize dưới 60kg) và 1 bộ cho bé gái. Họa tiết hoa nhí phong cách Hàn Quốc ngọt ngào, diện chụp hình cùng mẹ cực kỳ yêu kiều.',
        age: '3-6',
        gender: 'female',
        price: 360000,
        originalPrice: 420000,
        isNew: 1,
        isBest: 1,
        pattern: 'floral',
        variants: [
          { size: 'Mẹ (Freesize) + Bé 2-3T (11-13kg)', color: 'Hồng Hoa Nhí', stock: 5 },
          { size: 'Mẹ (Freesize) + Bé 4-5T (14-17kg)', color: 'Hồng Hoa Nhí', stock: 7 },
          { size: 'Mẹ (Freesize) + Bé 6-7T (18-22kg)', color: 'Vàng Hoa Nhí', stock: 3 },
        ],
      },
      {
        id: 5,
        catId: 1,
        name: 'Pijama Bé Gái Tay Bèo Họa Tiết Quả Đào Ngọt Ngào',
        slug: 'pijama-be-gai-tay-beo-qua-dao',
        desc: 'Thiết kế tay cánh tiên bèo nhẹ nhàng, họa tiết quả đào ngọt lịm. Quần đùi xòe nhẹ cho bé giấc ngủ mát mẻ trong những ngày hè.',
        age: '1-3',
        gender: 'female',
        price: 179000,
        originalPrice: 199000,
        isNew: 1,
        isBest: 0,
        pattern: 'floral',
        variants: [
          { size: 'Size 1 (9-11kg)', color: 'Hồng Đào', stock: 14 },
          { size: 'Size 2 (12-14kg)', color: 'Hồng Đào', stock: 8 },
          { size: 'Size 3 (15-17kg)', color: 'Hồng Đào', stock: 5 },
        ],
      },
      {
        id: 6,
        catId: 2,
        name: 'Đồ Bộ Pijama Bé Trai Thỏ Con Đội Mũ Len Xinh Xắn',
        slug: 'do-bo-pijama-be-trai-tho-con-doi-mu',
        desc: 'Chất vải thun cotton co giãn 4 chiều mềm mịn, cạp chun co giãn đa chiều không hằn bụng bé tròn trịa.',
        age: '1-3',
        gender: 'male',
        price: 185000,
        originalPrice: 185000,
        isNew: 0,
        isBest: 0,
        pattern: 'bear',
        variants: [
          { size: 'Size 1 (8-10kg)', color: 'Xanh Khói', stock: 11 },
          { size: 'Size 2 (11-13kg)', color: 'Xanh Khói', stock: 9 },
          { size: 'Size 3 (14-16kg)', color: 'Ghi Nhạt', stock: 4 },
        ],
      },
      {
        id: 7,
        catId: 3,
        name: 'Bộ Liền Quần Body Chíp Sơ Sinh Tai Gấu Dễ Thương',
        slug: 'body-chip-so-sinh-tai-gau-de-thuong',
        desc: 'Thiết kế body chíp bấm đũng tiện lợi cho mẹ thay bỉm trong tích tắc mà không làm con tỉnh giấc. Kèm mũ tai gấu siêu cưng.',
        age: '0-1',
        gender: 'unisex',
        price: 139000,
        originalPrice: 165000,
        isNew: 1,
        isBest: 0,
        pattern: 'bear',
        variants: [
          { size: 'Size 0-3M (3-5kg)', color: 'Be Sữa', stock: 16 },
          { size: 'Size 3-6M (5-7kg)', color: 'Be Sữa', stock: 12 },
          { size: 'Size 6-12M (7-10kg)', color: 'Be Sữa', stock: 2 },
        ],
      },
      {
        id: 8,
        catId: 4,
        name: 'Set Pijama Lụa Satin Mẹ & Bé Trai Họa Tiết Phi Hành Gia',
        slug: 'pijama-lua-satin-me-va-be-trai-phi-hanh-gia',
        desc: 'Chất lụa satin ngọc trai cao cấp mượt mà mát rượi, không nhăn nhàu. Đồ đôi cho mẹ và con trai diện ngủ hoặc dạo phố cực sành điệu.',
        age: '6-10',
        gender: 'male',
        price: 389000,
        originalPrice: 450000,
        isNew: 0,
        isBest: 1,
        pattern: 'cloud',
        variants: [
          { size: 'Mẹ + Bé 5-6T (18-22kg)', color: 'Xanh Navy Pastel', stock: 6 },
          { size: 'Mẹ + Bé 7-8T (23-27kg)', color: 'Xanh Navy Pastel', stock: 5 },
          { size: 'Mẹ + Bé 9-10T (28-33kg)', color: 'Xanh Navy Pastel', stock: 1 },
        ],
      },
      {
        id: 9,
        catId: 1,
        name: 'Pijama Dài Tay Mùa Thu Bé Gái Cổ Sen Ren Nhí Tiểu Thư',
        slug: 'pijama-dai-tay-be-gai-co-sen-ren-tieu-thu',
        desc: 'Kiểu dáng dài tay cổ sen đính ren tinh tế chuẩn phong cách công chúa Hàn Quốc. Giữ ấm vừa vặn trong phòng điều hòa.',
        age: '3-6',
        gender: 'female',
        price: 215000,
        originalPrice: 245000,
        isNew: 1,
        isBest: 0,
        pattern: 'floral',
        variants: [
          { size: 'Size 3 (13-16kg)', color: 'Hồng Pastel', stock: 9 },
          { size: 'Size 4 (17-20kg)', color: 'Hồng Pastel', stock: 7 },
          { size: 'Size 5 (21-24kg)', color: 'Trắng Kem', stock: 0 },
        ],
      },
      {
        id: 10,
        catId: 2,
        name: 'Đồ Bộ Pijama Bé Trai Cotton Kẻ Caro Phong Cách Hàn Quốc',
        slug: 'pijama-be-trai-cotton-ke-caro-han-quoc',
        desc: 'Họa tiết kẻ caro vintage nhã nhặn, chất thô đũi mát rượi bé trai mặc vừa nam tính vừa gọn gàng sạch sẽ.',
        age: '6-10',
        gender: 'male',
        price: 199000,
        originalPrice: 225000,
        isNew: 0,
        isBest: 1,
        pattern: 'pajama',
        variants: [
          { size: 'Size 5 (20-23kg)', color: 'Caro Xanh', stock: 12 },
          { size: 'Size 6 (24-27kg)', color: 'Caro Xanh', stock: 6 },
          { size: 'Size 7 (28-32kg)', color: 'Caro Be', stock: 3 },
        ],
      },
      {
        id: 11,
        catId: 3,
        name: 'Set Bao Chân Bao Tay & Mũ Sơ Sinh 100% Cotton Mềm',
        slug: 'set-bao-tay-bao-chan-mu-so-sinh',
        desc: 'Bộ phụ kiện cần thiết cho bé sơ sinh những tháng đầu đời, chun mềm không thít cổ tay, giữ ấm đôi bàn tay nhỏ của con.',
        age: '0-1',
        gender: 'unisex',
        price: 89000,
        originalPrice: 99000,
        isNew: 1,
        isBest: 0,
        pattern: 'cloud',
        variants: [
          { size: 'Freesize (0-6M)', color: 'Hồng Pastel', stock: 20 },
          { size: 'Freesize (0-6M)', color: 'Xanh Mint', stock: 18 },
          { size: 'Freesize (0-6M)', color: 'Vàng Kem', stock: 15 },
        ],
      },
      {
        id: 12,
        catId: 4,
        name: 'Set Pijama Đôi Gia Đình 3 Người (Bố - Mẹ - Bé) Cotton Cao Cấp',
        slug: 'set-pijama-doi-gia-dinh-bo-me-be',
        desc: 'Set đồng phục ngủ gia đình gồm 1 bộ cho Bố, 1 bộ cho Mẹ và 1 bộ cho Bé. Vải thô sợi tre kháng khuẩn, cực kỳ êm ái và gắn kết yêu thương.',
        age: '3-6',
        gender: 'unisex',
        price: 520000,
        originalPrice: 590000,
        isNew: 1,
        isBest: 1,
        pattern: 'pajama',
        variants: [
          { size: 'Bố L + Mẹ M + Bé 2-3T', color: 'Ghi Pastel', stock: 5 },
          { size: 'Bố XL + Mẹ L + Bé 4-5T', color: 'Ghi Pastel', stock: 4 },
          { size: 'Bố XXL + Mẹ XL + Bé 6-7T', color: 'Ghi Pastel', stock: 2 },
        ],
      },
    ];

    for (const p of products) {
      insertProduct.run(
        p.id,
        p.catId,
        p.name,
        p.slug,
        p.desc,
        p.age,
        p.gender,
        p.price,
        p.originalPrice,
        p.isNew,
        p.isBest,
        1
      );

      // 3 SVG images per product
      const img1 = generateSvgImage(`${p.name} (Ảnh 1)`, '#FFD6E0', p.pattern);
      const img2 = generateSvgImage(`${p.name} (Ảnh 2)`, '#FFEFC7', 'bear');
      const img3 = generateSvgImage(`${p.name} (Ảnh 3)`, '#C5F0DC', 'cloud');

      insertImage.run(p.id, img1, img1, 0, 1);
      insertImage.run(p.id, img2, img2, 1, 0);
      insertImage.run(p.id, img3, img3, 2, 0);

      // Variants
      for (const v of p.variants) {
        insertVariant.run(p.id, v.size, v.color, v.stock);
      }
    }

    // 3. Seed Sample Orders across statuses for Dashboard analytics
    const insertOrder = tx.prepare(`
      INSERT INTO orders (
        id, order_code, customer_name, customer_phone, shipping_address,
        note, payment_method, status, stock_deducted, total_amount, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertOrderItem = tx.prepare(`
      INSERT INTO order_items (
        order_id, product_id, variant_id, product_name, size, color, price, quantity, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const orders = [
      {
        id: 1,
        code: 'NGA-0095',
        name: 'Trần Thị Mai',
        phone: '0988123456',
        addr: 'Số 15 ngõ 84 Ngọc Khánh, Ba Đình, Hà Nội',
        note: 'Giao trong giờ hành chính giúp em ạ',
        pay: 'COD',
        status: 'completed',
        stockDeducted: 1,
        total: 378000,
        date: new Date(Date.now() - 4 * 86400000).toISOString(),
        items: [
          { prodId: 1, name: 'Pijama Thô Cotton Hàn Quốc Họa Tiết Gấu Nâu Cho Bé Gái', size: 'Size 1 (8-10kg)', color: 'Hồng Phấn', price: 189000, qty: 2 },
        ],
      },
      {
        id: 2,
        code: 'NGA-0096',
        name: 'Lê Hoàng Yến',
        phone: '0977234567',
        addr: 'Tòa Landmark 2, Vinhomes Central Park, Bình Thạnh, TP.HCM',
        note: 'Gọi trước khi giao',
        pay: 'BANK',
        status: 'shipping',
        stockDeducted: 1,
        total: 555000,
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        items: [
          { prodId: 2, name: 'Set Pijama Bé Trai Họa Tiết Xe Bus & Động Vật Rừng Xanh', size: 'Size 3 (13-15kg)', color: 'Xanh Mint', price: 195000, qty: 1 },
          { prodId: 4, name: 'Set Pijama Đôi Mẹ & Bé Gái Hoa Nhí Vintage Dễ Thương', size: 'Mẹ (Freesize) + Bé 4-5T (14-17kg)', color: 'Hồng Hoa Nhí', price: 360000, qty: 1 },
        ],
      },
      {
        id: 3,
        code: 'NGA-0097',
        name: 'Phạm Hồng Nhung',
        phone: '0903345678',
        addr: '45 Lê Duẩn, Hải Châu, Đà Nẵng',
        note: '',
        pay: 'COD',
        status: 'confirmed',
        stockDeducted: 1,
        total: 298000,
        date: new Date(Date.now() - 1 * 86400000).toISOString(),
        items: [
          { prodId: 3, name: 'Đồ Bộ Sơ Sinh Cài Lệch Cotton Organic Mềm Mại Cho Bé', size: '0-3 tháng (3-5kg)', color: 'Vàng Kem', price: 149000, qty: 2 },
        ],
      },
      {
        id: 4,
        code: 'NGA-0098',
        name: 'Vũ Minh Thu',
        phone: '0912456789',
        addr: 'Số 8 Hàng Tre, Hoàn Kiếm, Hà Nội',
        note: 'Đóng gói hộp quà giúp mình',
        pay: 'BANK',
        status: 'pending',
        stockDeducted: 0,
        total: 179000,
        date: new Date().toISOString(), // Today
        items: [
          { prodId: 5, name: 'Pijama Bé Gái Tay Bèo Họa Tiết Quả Đào Ngọt Ngào', size: 'Size 1 (9-11kg)', color: 'Hồng Đào', price: 179000, qty: 1 },
        ],
      },
      {
        id: 5,
        code: 'NGA-0099',
        name: 'Nguyễn Thị Hương',
        phone: '0988123456', // Same customer as order 1 to test customer aggregation
        addr: 'Số 15 ngõ 84 Ngọc Khánh, Ba Đình, Hà Nội',
        note: '',
        pay: 'COD',
        status: 'confirmed',
        stockDeducted: 1,
        total: 195000,
        date: new Date().toISOString(), // Today
        items: [
          { prodId: 2, name: 'Set Pijama Bé Trai Họa Tiết Xe Bus & Động Vật Rừng Xanh', size: 'Size 4 (16-18kg)', color: 'Xanh Mint', price: 195000, qty: 1 },
        ],
      },
      {
        id: 6,
        code: 'NGA-0100',
        name: 'Bùi Thị Lan',
        phone: '0933567890',
        addr: 'Khu Đô Thị Ecopark, Văn Giang, Hưng Yên',
        note: 'Khách đổi ý',
        pay: 'COD',
        status: 'canceled',
        stockDeducted: 0,
        total: 185000,
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        items: [
          { prodId: 6, name: 'Đồ Bộ Pijama Bé Trai Thỏ Con Đội Mũ Len Xinh Xắn', size: 'Size 1 (8-10kg)', color: 'Xanh Khói', price: 185000, qty: 1 },
        ],
      },
    ];

    for (const o of orders) {
      insertOrder.run(
        o.id,
        o.code,
        o.name,
        o.phone,
        o.addr,
        o.note,
        o.pay,
        o.status,
        o.stockDeducted,
        o.total,
        o.date
      );

      for (const it of o.items) {
        insertOrderItem.run(
          o.id,
          it.prodId,
          1,
          it.name,
          it.size,
          it.color,
          it.price,
          it.qty,
          it.price * it.qty
        );
      }
    }
  });

  console.log('✅ [Seed] Dữ liệu mẫu đã được nạp thành công vào database shop.db!');
}

// Run directly if invoked as script
seedData();
