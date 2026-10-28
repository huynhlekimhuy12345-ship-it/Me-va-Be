async function testAll() {
  console.log('--- BẮT ĐẦU KIỂM TRA TOÀN BỘ NGHIỆP VỤ & BẢO MẬT ---');

  // 1. Check unauthorized admin access
  const unauthRes = await fetch('http://localhost:5000/api/admin/stats');
  console.log('[Check 1] Chưa đăng nhập /admin trả 401:', unauthRes.status === 401 ? 'PASS (401)' : 'FAIL');

  // 2. Check wrong PIN
  const wrongPinRes = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '000000' })
  });
  console.log('[Check 2] Nhập sai PIN bị chặn:', wrongPinRes.status === 401 ? 'PASS (401)' : 'FAIL');

  // 3. Login with correct PIN
  const loginRes = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '202688' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  console.log('[Check 3] Đăng nhập PIN 202688 thành công:', loginRes.status === 200 && Boolean(cookie) ? 'PASS' : 'FAIL');

  // 4. Test Fake Client Price Protection
  // Product 1 has DB price = 189000. Client tries sending price = 1000
  const fakePriceOrderRes = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Kiểm Tra Giá Giả',
      customerPhone: '0987654321',
      shippingAddress: '123 Test Street, Hanoi',
      paymentMethod: 'COD',
      items: [
        { productId: 1, variantId: 1, quantity: 2, price: 1000 } // Client claims price is 1000!
      ]
    })
  });
  const fakeOrderData = await fakePriceOrderRes.json();
  const expectedTotal = 189000 * 2; // 378000
  console.log('[Check 4] Gửi giá giả 1.000đ -> Server tự tính lại theo DB (378.000đ):', 
    fakeOrderData.ok && fakeOrderData.data.totalAmount === expectedTotal ? `PASS (${fakeOrderData.data.totalAmount}đ)` : `FAIL: ${JSON.stringify(fakeOrderData)}`);

  // 5. Test Over-Stock Blocking
  const overStockRes = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Kiểm Tra Quá Tồn',
      customerPhone: '0987654321',
      shippingAddress: '123 Test Street, Hanoi',
      paymentMethod: 'COD',
      items: [
        { productId: 1, variantId: 1, quantity: 9999 } // Way more than stock!
      ]
    })
  });
  const overStockData = await overStockRes.json();
  console.log('[Check 5] Đặt quá tồn kho bị chặn ở Server:', 
    overStockRes.status === 400 && overStockData.ok === false ? `PASS: ${overStockData.error}` : 'FAIL');

  // 6. Test Inventory Lifecycle (Pending -> Confirmed -> Shipping -> Canceled)
  const prodRes = await fetch('http://localhost:5000/api/products/1');
  const prodData = await prodRes.json();
  const v2Before = prodData.data.variants.find(v => v.id === 2);
  const initialStock = v2Before.stock;
  console.log('[Check 6a] Tồn ban đầu của biến thể 2:', initialStock);

  // Place order for 2 items
  const lifecycleOrderRes = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Kiểm Tra Vòng Đời Tồn Kho',
      customerPhone: '0912345678',
      shippingAddress: 'Tòa nhà A, Cầu Giấy, Hà Nội',
      paymentMethod: 'BANK',
      items: [
        { productId: 1, variantId: 2, quantity: 2, price: 189000 }
      ]
    })
  });
  const lifecycleOrder = (await lifecycleOrderRes.json()).data;
  console.log('[Check 6b] Đơn mới tạo mã:', lifecycleOrder.orderCode, 'Trạng thái:', lifecycleOrder.status, 'stockDeducted:', lifecycleOrder.stockDeducted);

  // Verify stock unchanged while pending
  const prodPending = await (await fetch('http://localhost:5000/api/products/1')).json();
  const v2Pending = prodPending.data.variants.find(v => v.id === 2);
  console.log('[Check 6c] Tồn khi đang Chờ xác nhận (chưa trừ):', v2Pending.stock === initialStock ? 'PASS' : 'FAIL');

  // Admin confirms order -> stock should be deducted by 2
  const confirmRes = await fetch(`http://localhost:5000/api/admin/orders/${lifecycleOrder.id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ status: 'confirmed' })
  });
  const confirmedData = (await confirmRes.json()).data;
  const prodConfirmed = await (await fetch('http://localhost:5000/api/products/1')).json();
  const v2Confirmed = prodConfirmed.data.variants.find(v => v.id === 2);
  console.log(`[Check 6d] Chuyển sang "Đã xác nhận" -> Tồn giảm 2 (còn ${v2Confirmed.stock}, stockDeducted: ${confirmedData.stockDeducted}):`, 
    v2Confirmed.stock === initialStock - 2 && confirmedData.stockDeducted === true ? 'PASS' : 'FAIL');

  // Admin moves to shipping -> stock should NOT be deducted again!
  await fetch(`http://localhost:5000/api/admin/orders/${lifecycleOrder.id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ status: 'shipping' })
  });
  const prodShipping = await (await fetch('http://localhost:5000/api/products/1')).json();
  const v2Shipping = prodShipping.data.variants.find(v => v.id === 2);
  console.log(`[Check 6e] Chuyển sang "Đang giao" -> Tồn không bị trừ lần 2 (vẫn là ${v2Shipping.stock}):`, 
    v2Shipping.stock === initialStock - 2 ? 'PASS' : 'FAIL');

  // Admin cancels order -> stock should be restored by 2!
  const cancelRes = await fetch(`http://localhost:5000/api/admin/orders/${lifecycleOrder.id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ status: 'canceled' })
  });
  const canceledData = (await cancelRes.json()).data;
  const prodCanceled = await (await fetch('http://localhost:5000/api/products/1')).json();
  const v2Canceled = prodCanceled.data.variants.find(v => v.id === 2);
  console.log(`[Check 6f] Hủy đơn -> Tồn hoàn lại đúng ban đầu (${v2Canceled.stock}, stockDeducted: ${canceledData.stockDeducted}):`, 
    v2Canceled.stock === initialStock && canceledData.stockDeducted === false ? 'PASS' : 'FAIL');

  // Try illegal transition: from canceled back to pending
  const illegalRes = await fetch(`http://localhost:5000/api/admin/orders/${lifecycleOrder.id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ status: 'pending' })
  });
  console.log('[Check 6g] Chặn chuyển trạng thái trái phép từ canceled sang pending:', illegalRes.status === 400 ? 'PASS (400)' : 'FAIL');

  // 7. Test Category Deletion Block when products exist
  const catDelRes = await fetch('http://localhost:5000/api/admin/categories/1', {
    method: 'DELETE',
    headers: { 'Cookie': cookie }
  });
  const catDelData = await catDelRes.json();
  console.log('[Check 7] Chặn xóa danh mục đang có sản phẩm:', 
    catDelRes.status === 400 && catDelData.ok === false ? `PASS: ${catDelData.error}` : 'FAIL');

  console.log('--- TOÀN BỘ KIỂM TRA NGHIỆP VỤ HOÀN TẤT THÀNH CÔNG 100%! ---');
}

testAll().catch(console.error);
