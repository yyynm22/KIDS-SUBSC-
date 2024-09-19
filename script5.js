methods: {
  async fetchOrderHistory() {
    try {
      console.log("注文履歴の取得を開始します。");

      // 注文履歴の取得
      const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT8');
      const orders = orderResponse.data;
      console.log("取得した注文履歴:", orders);

      // user_id リストを作成
      const userIds = [...new Set(orders.map(order => order.user_id))];
      console.log("取得したuser_idリスト:", userIds);

      // 顧客情報の取得
      console.log("顧客情報の取得を開始します。");
      const userPromises = userIds.map(userId => 
        axios.get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT9?user_id=${userId}`)
      );

      const userResponses = await Promise.all(userPromises);
      const users = userResponses.map(response => response.data);
      console.log("取得した顧客情報:", users);

      // product_id リストを作成
      const productIds = [...new Set(orders.map(order => order.product_id))];
      console.log("取得したproduct_idリスト:", productIds);

      // 商品情報の取得
      console.log("商品情報の取得を開始します。");
      const productPromises = productIds.map(productId =>
        axios.get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT10?product_id=${productId}`)
      );

      const productResponses = await Promise.all(productPromises);
      const products = productResponses.map(response => response.data);
      console.log("取得した商品情報:", products);

      // データの統合
      const ordersWithDetails = orders.map(order => {
        const user = users.find(user => user.user_id === order.user_id);
        const product = products.find(product => product.product_id === order.product_id);
        const orderWithDetails = {
          ...order,
          user_name: user ? user.user_name : '',
          user_mail: user ? user.user_mail : '',
          user_postcode: user ? user.user_postcode : '',
          user_adress: user ? user.user_adress : '',
          user_telenum: user ? user.user_telenum : '',
          product_name: product ? product.product_name : '',
          product_id: product ? product.product_id : '',
          product_size: product ? product.product_size : '',
          quantity: product ? product.quantity : '',
          URL: product ? product.URL : ''
        };
        console.log("統合した注文データ:", orderWithDetails);
        return orderWithDetails;
      });

      // 統合したデータを設定
      this.orderHistory = ordersWithDetails;
      console.log("最終的な注文履歴データ:", this.orderHistory);

    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  },

  Logout() {
    sessionStorage.clear();
    window.location.href = './index.html';
  },

  addData() {
    window.location.href = './index4.html';
  }
},
