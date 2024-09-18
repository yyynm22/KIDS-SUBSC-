async fetchOrderHistory() {
  try {
    const userId = this.userData.user_id;

    // 注文履歴の取得
    const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6', {
      params: { user_id: userId }
    });

    // 商品情報の取得
    const productResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');

    // データをマッピングする
    const orders = orderResponse.data.List;
    const products = productResponse.data.List;

    // 注文履歴データを集約するためのマップ
    const orderMap = {};

    orders.forEach(order => {
      if (!orderMap[order.order_id]) {
        orderMap[order.order_id] = {
          order_id: order.order_id,
          items: []
        };
      }

      const product = products.find(p => p.product_id === order.product_id);
      if (product) {
        // 既存のアイテムを探す
        const existingItem = orderMap[order.order_id].items.find(item => item.product_id === order.product_id && item.product_size === order.product_size);
        if (existingItem) {
          existingItem.quantity += order.quantity; // 数量を追加
        } else {
          orderMap[order.order_id].items.push({
            product_id: order.product_id,
            product_name: product.product_name,
            product_category: product.product_category,
            product_gender: product.product_gender,
            product_image_url: product.URL,
            product_size: order.product_size,
            quantity: order.quantity
          });
        }
      }
    });

    // 集約したデータをorderHistoryにセット
    this.orderHistory = Object.values(orderMap).map(order => ({
      order_id: order.order_id,
      total_quantity: order.items.reduce((total, item) => total + item.quantity, 0),
      items: order.items
    }));

    // デバッグ用にコンソール出力
    console.log('Aggregated Order History:', this.orderHistory.map(order => ({
      order_id: order.order_id,
      total_quantity: order.total_quantity,
      items: order.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity
      }))
    })));

  } catch (error) {
    console.error('Error fetching order history:', error);
  }
}
