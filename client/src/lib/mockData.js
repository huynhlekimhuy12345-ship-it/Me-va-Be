/**
 * Mock data for client demonstration and initial pages
 * Contains 12 realistic Vietnamese products across categories with real Pexels photos
 * (used as seed data for the frontend-only demo store, see demoStore.js)
 */

/* Ảnh sản phẩm dùng ảnh thật (Pexels, đã kiểm chứng tải được) thay cho ảnh SVG placeholder. */

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Pijama Bé Gái', slug: 'be-gai', icon: '👧', count: 18 },
  { id: 2, name: 'Pijama Bé Trai', slug: 'be-trai', icon: '👦', count: 16 },
  { id: 3, name: 'Đồ Bộ Sơ Sinh', slug: 'so-sinh', icon: '🍼', count: 12 },
  { id: 4, name: 'Set Mẹ & Bé', slug: 'me-va-be', icon: '👩‍👧', count: 8 },
];

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Pijama Thô Cotton Hàn Quốc Họa Tiết Gấu Nâu Cho Bé Gái',
    slug: 'pijama-tho-cotton-gau-nau-be-gai',
    categoryId: 1,
    categoryName: 'Pijama Bé Gái',
    categorySlug: 'be-gai',
    ageRange: '1-3',
    gender: 'female',
    price: 189000,
    originalPrice: 220000,
    isNew: true,
    isBestSeller: true,
    description: 'Chất liệu vải thô boi 100% cotton Hàn Quốc dệt mộc tự nhiên, siêu thoáng khí, thấm hút mồ hôi cực tốt. Họa tiết gấu nâu ngộ nghĩnh, cúc cài bọc vải mềm không gây cấn da bé khi ngủ.',
    images: [
      { id: 101, url: 'https://images.pexels.com/photos/4740562/pexels-photo-4740562.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 102, url: 'https://images.pexels.com/photos/3933069/pexels-photo-3933069.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 11, size: 'Size 1 (8-10kg)', color: 'Hồng Phấn', stock: 12 },
      { id: 12, size: 'Size 2 (11-13kg)', color: 'Hồng Phấn', stock: 8 },
      { id: 13, size: 'Size 3 (14-16kg)', color: 'Hồng Phấn', stock: 3 }, // low stock
      { id: 14, size: 'Size 4 (17-19kg)', color: 'Vàng Kem', stock: 0 }, // out of stock
    ],
  },
  {
    id: 2,
    name: 'Set Pijama Bé Trai Họa Tiết Xe Bus & Động Vật Rừng Xanh',
    slug: 'pijama-be-trai-xe-bus-dong-vat',
    categoryId: 2,
    categoryName: 'Pijama Bé Trai',
    categorySlug: 'be-trai',
    ageRange: '3-6',
    gender: 'male',
    price: 195000,
    originalPrice: 230000,
    isNew: true,
    isBestSeller: true,
    description: 'Thiết kế cổ bẻ pijama sang chảnh, form rộng rãi thoải mái cho các bé trai tha hồ vận động. Vải cotton mềm mịn giặt máy không lo bai dão.',
    images: [
      { id: 201, url: 'https://images.pexels.com/photos/13790575/pexels-photo-13790575.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 202, url: 'https://images.pexels.com/photos/28730996/pexels-photo-28730996.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 21, size: 'Size 3 (13-15kg)', color: 'Xanh Mint', stock: 15 },
      { id: 22, size: 'Size 4 (16-18kg)', color: 'Xanh Mint', stock: 6 },
      { id: 23, size: 'Size 5 (19-22kg)', color: 'Xanh Mint', stock: 2 }, // low stock
    ],
  },
  {
    id: 3,
    name: 'Đồ Bộ Sơ Sinh Cài Lệch Cotton Organic Mềm Mại Cho Bé',
    slug: 'do-bo-so-sinh-cai-lech-cotton-organic',
    categoryId: 3,
    categoryName: 'Đồ Bộ Sơ Sinh',
    categorySlug: 'so-sinh',
    ageRange: '0-1',
    gender: 'unisex',
    price: 149000,
    originalPrice: 175000,
    isNew: false,
    isBestSeller: true,
    description: 'Bộ cài lệch giữ ấm ngực và bụng cho bé sơ sinh, đường may lộn ngoài chống xước da non nớt của con. Vải đạt chứng nhận Organic an toàn tuyệt đối.',
    images: [
      { id: 301, url: 'https://images.pexels.com/photos/7578998/pexels-photo-7578998.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 302, url: 'https://images.pexels.com/photos/5791337/pexels-photo-5791337.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 31, size: '0-3 tháng (3-5kg)', color: 'Vàng Kem', stock: 10 },
      { id: 32, size: '3-6 tháng (5-7kg)', color: 'Vàng Kem', stock: 9 },
      { id: 33, size: '6-9 tháng (7-9kg)', color: 'Trắng Sữa', stock: 4 }, // low stock
    ],
  },
  {
    id: 4,
    name: 'Set Pijama Đôi Mẹ & Bé Gái Hoa Nhí Vintage Dễ Thương',
    slug: 'set-pijama-doi-me-va-be-hoa-nhi-vintage',
    categoryId: 4,
    categoryName: 'Set Mẹ & Bé',
    categorySlug: 'me-va-be',
    ageRange: '3-6',
    gender: 'female',
    price: 360000,
    originalPrice: 420000,
    isNew: true,
    isBestSeller: true,
    description: 'Gồm 1 bộ cho mẹ (freesize dưới 60kg) và 1 bộ cho bé gái. Họa tiết hoa nhí phong cách Hàn Quốc ngọt ngào, diện chụp hình cùng mẹ cực kỳ yêu kiều.',
    images: [
      { id: 401, url: 'https://images.pexels.com/photos/7880324/pexels-photo-7880324.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 402, url: 'https://images.pexels.com/photos/4473635/pexels-photo-4473635.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 41, size: 'Mẹ (Freesize) + Bé 2-3T (11-13kg)', color: 'Hồng Hoa Nhí', stock: 5 }, // low stock
      { id: 42, size: 'Mẹ (Freesize) + Bé 4-5T (14-17kg)', color: 'Hồng Hoa Nhí', stock: 7 },
      { id: 43, size: 'Mẹ (Freesize) + Bé 6-7T (18-22kg)', color: 'Vàng Hoa Nhí', stock: 3 }, // low stock
    ],
  },
  {
    id: 5,
    name: 'Pijama Bé Gái Tay Bèo Họa Tiết Quả Đào Ngọt Ngào',
    slug: 'pijama-be-gai-tay-beo-qua-dao',
    categoryId: 1,
    categoryName: 'Pijama Bé Gái',
    categorySlug: 'be-gai',
    ageRange: '1-3',
    gender: 'female',
    price: 179000,
    originalPrice: 199000,
    isNew: true,
    isBestSeller: false,
    description: 'Thiết kế tay cánh tiên bèo nhẹ nhàng, họa tiết quả đào ngọt lịm. Quần đùi xòe nhẹ cho bé giấc ngủ mát mẻ trong những ngày hè.',
    images: [
      { id: 501, url: 'https://images.pexels.com/photos/19646912/pexels-photo-19646912.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 502, url: 'https://images.pexels.com/photos/32039888/pexels-photo-32039888.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 51, size: 'Size 1 (9-11kg)', color: 'Hồng Đào', stock: 14 },
      { id: 52, size: 'Size 2 (12-14kg)', color: 'Hồng Đào', stock: 8 },
      { id: 53, size: 'Size 3 (15-17kg)', color: 'Hồng Đào', stock: 5 },
    ],
  },
  {
    id: 6,
    name: 'Đồ Bộ Pijama Bé Trai Thỏ Con Đội Mũ Len Xinh Xắn',
    slug: 'do-bo-pijama-be-trai-tho-con-doi-mu',
    categoryId: 2,
    categoryName: 'Pijama Bé Trai',
    categorySlug: 'be-trai',
    ageRange: '1-3',
    gender: 'male',
    price: 185000,
    originalPrice: 185000, // no discount
    isNew: false,
    isBestSeller: false,
    description: 'Chất vải thun cotton co giãn 4 chiều mềm mịn, cạp chun co giãn đa chiều không hằn bụng bé tròn trịa.',
    images: [
      { id: 601, url: 'https://images.pexels.com/photos/8013655/pexels-photo-8013655.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 602, url: 'https://images.pexels.com/photos/30437704/pexels-photo-30437704.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 61, size: 'Size 1 (8-10kg)', color: 'Xanh Khói', stock: 11 },
      { id: 62, size: 'Size 2 (11-13kg)', color: 'Xanh Khói', stock: 9 },
      { id: 63, size: 'Size 3 (14-16kg)', color: 'Ghi Nhạt', stock: 4 },
    ],
  },
  {
    id: 7,
    name: 'Bộ Liền Quần Body Chíp Sơ Sinh Tai Gấu Dễ Thương',
    slug: 'body-chip-so-sinh-tai-gau-de-thuong',
    categoryId: 3,
    categoryName: 'Đồ Bộ Sơ Sinh',
    categorySlug: 'so-sinh',
    ageRange: '0-1',
    gender: 'unisex',
    price: 139000,
    originalPrice: 165000,
    isNew: true,
    isBestSeller: false,
    description: 'Thiết kế body chíp bấm đũng tiện lợi cho mẹ thay bỉm trong tích tắc mà không làm con tỉnh giấc. Kèm mũ tai gấu siêu cưng.',
    images: [
      { id: 701, url: 'https://images.pexels.com/photos/11369379/pexels-photo-11369379.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 702, url: 'https://images.pexels.com/photos/6134643/pexels-photo-6134643.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 71, size: 'Size 0-3M (3-5kg)', color: 'Be Sữa', stock: 16 },
      { id: 72, size: 'Size 3-6M (5-7kg)', color: 'Be Sữa', stock: 12 },
      { id: 73, size: 'Size 6-12M (7-10kg)', color: 'Be Sữa', stock: 2 }, // low stock
    ],
  },
  {
    id: 8,
    name: 'Set Pijama Lụa Satin Mẹ & Bé Trai Họa Tiết Phi Hành Gia',
    slug: 'pijama-lua-satin-me-va-be-trai-phi-hanh-gia',
    categoryId: 4,
    categoryName: 'Set Mẹ & Bé',
    categorySlug: 'me-va-be',
    ageRange: '6-10',
    gender: 'male',
    price: 389000,
    originalPrice: 450000,
    isNew: false,
    isBestSeller: true,
    description: 'Chất lụa satin ngọc trai cao cấp mượt mà mát rượi, không nhăn nhàu. Đồ đôi cho mẹ và con trai diện ngủ hoặc dạo phố cực sành điệu.',
    images: [
      { id: 801, url: 'https://images.pexels.com/photos/4971309/pexels-photo-4971309.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 802, url: 'https://images.pexels.com/photos/7055885/pexels-photo-7055885.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 81, size: 'Mẹ + Bé 5-6T (18-22kg)', color: 'Xanh Navy Pastel', stock: 6 },
      { id: 82, size: 'Mẹ + Bé 7-8T (23-27kg)', color: 'Xanh Navy Pastel', stock: 5 },
      { id: 83, size: 'Mẹ + Bé 9-10T (28-33kg)', color: 'Xanh Navy Pastel', stock: 1 }, // low stock
    ],
  },
  {
    id: 9,
    name: 'Pijama Dài Tay Mùa Thu Bé Gái Cổ Sen Ren Nhí Tiểu Thư',
    slug: 'pijama-dai-tay-be-gai-co-sen-ren-tieu-thu',
    categoryId: 1,
    categoryName: 'Pijama Bé Gái',
    categorySlug: 'be-gai',
    ageRange: '3-6',
    gender: 'female',
    price: 215000,
    originalPrice: 245000,
    isNew: true,
    isBestSeller: false,
    description: 'Kiểu dáng dài tay cổ sen đính ren tinh tế chuẩn phong cách công chúa Hàn Quốc. Giữ ấm vừa vặn trong phòng điều hòa.',
    images: [
      { id: 901, url: 'https://images.pexels.com/photos/33995889/pexels-photo-33995889.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 902, url: 'https://images.pexels.com/photos/31771968/pexels-photo-31771968.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 91, size: 'Size 3 (13-16kg)', color: 'Hồng Pastel', stock: 9 },
      { id: 92, size: 'Size 4 (17-20kg)', color: 'Hồng Pastel', stock: 7 },
      { id: 93, size: 'Size 5 (21-24kg)', color: 'Trắng Kem', stock: 0 }, // out of stock
    ],
  },
  {
    id: 10,
    name: 'Đồ Bộ Pijama Bé Trai Cotton Kẻ Caro Phong Cách Hàn Quốc',
    slug: 'pijama-be-trai-cotton-ke-caro-han-quoc',
    categoryId: 2,
    categoryName: 'Pijama Bé Trai',
    categorySlug: 'be-trai',
    ageRange: '6-10',
    gender: 'male',
    price: 199000,
    originalPrice: 225000,
    isNew: false,
    isBestSeller: true,
    description: 'Họa tiết kẻ caro vintage nhã nhặn, chất thô đũi mát rượi bé trai mặc vừa nam tính vừa gọn gàng sạch sẽ.',
    images: [
      { id: 1001, url: 'https://images.pexels.com/photos/31809345/pexels-photo-31809345.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 1002, url: 'https://images.pexels.com/photos/20522169/pexels-photo-20522169.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 101, size: 'Size 5 (20-23kg)', color: 'Caro Xanh', stock: 12 },
      { id: 102, size: 'Size 6 (24-27kg)', color: 'Caro Xanh', stock: 6 },
      { id: 103, size: 'Size 7 (28-32kg)', color: 'Caro Be', stock: 3 }, // low stock
    ],
  },
  {
    id: 11,
    name: 'Set Bao Chân Bao Tay & Mũ Sơ Sinh 100% Cotton Mềm',
    slug: 'set-bao-tay-bao-chan-mu-so-sinh',
    categoryId: 3,
    categoryName: 'Đồ Bộ Sơ Sinh',
    categorySlug: 'so-sinh',
    ageRange: '0-1',
    gender: 'unisex',
    price: 89000,
    originalPrice: 99000,
    isNew: true,
    isBestSeller: false,
    description: 'Bộ phụ kiện cần thiết cho bé sơ sinh những tháng đầu đời, chun mềm không thít cổ tay, giữ ấm đôi bàn tay nhỏ của con.',
    images: [
      { id: 1101, url: 'https://images.pexels.com/photos/3875226/pexels-photo-3875226.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 1102, url: 'https://images.pexels.com/photos/4481726/pexels-photo-4481726.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 111, size: 'Freesize (0-6M)', color: 'Hồng Pastel', stock: 20 },
      { id: 112, size: 'Freesize (0-6M)', color: 'Xanh Mint', stock: 18 },
      { id: 113, size: 'Freesize (0-6M)', color: 'Vàng Kem', stock: 15 },
    ],
  },
  {
    id: 12,
    name: 'Set Pijama Đôi Gia Đình 3 Người (Bố - Mẹ - Bé) Cotton Cao Cấp',
    slug: 'set-pijama-doi-gia-dinh-bo-me-be',
    categoryId: 4,
    categoryName: 'Set Mẹ & Bé',
    categorySlug: 'me-va-be',
    ageRange: '3-6',
    gender: 'unisex',
    price: 520000,
    originalPrice: 590000,
    isNew: true,
    isBestSeller: true,
    description: 'Set đồng phục ngủ gia đình gồm 1 bộ cho Bố, 1 bộ cho Mẹ và 1 bộ cho Bé. Vải thô sợi tre kháng khuẩn, cực kỳ êm ái và gắn kết yêu thương.',
    images: [
      { id: 1201, url: 'https://images.pexels.com/photos/15816114/pexels-photo-15816114.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { id: 1202, url: 'https://images.pexels.com/photos/34889326/pexels-photo-34889326.jpeg?auto=compress&cs=tinysrgb&w=800' },
    ],
    variants: [
      { id: 121, size: 'Bố L + Mẹ M + Bé 2-3T', color: 'Ghi Pastel', stock: 5 }, // low stock
      { id: 122, size: 'Bố XL + Mẹ L + Bé 4-5T', color: 'Ghi Pastel', stock: 4 }, // low stock
      { id: 123, size: 'Bố XXL + Mẹ XL + Bé 6-7T', color: 'Ghi Pastel', stock: 2 }, // low stock
    ],
  },
];
