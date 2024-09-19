new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      tab: 0,  // タブの状態
      orderHistory: [],  // 注文履歴のデータ
    };
  },
  methods: {
    // ユーザー情報を取得
    async fetchUserInfo(userId) {
      try {
        const response = await fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT9?user_id=${userId}`);
        const data = await response.json();
        console.log("ユーザー情報のレスポンス:", data);
        return data.List;  // 正しいプロパティ名に変更
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
      }
    },

    // 商品情報を取得
    async fetchProductInfo(productId) {
      try {
        const response = await fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT10?product_id=${productId}`);
        const data = await response.json();
        console.log("商品情報のレスポンス:", data);
        return data.List;  // 正しいプロパティ名に変更
      } catch (error) {
        console.error("商品情報取得エラー:", error);
      }
    },

    async fetchOrderHistory() {
      try {
        console.log("注文履歴の取得を開始します。");

        // 注文履歴の取得
        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT8');
        const orders = orderResponse.data.List; // `List` プロパティから配列を取得
        console.log("取得した注文履歴:", orders);

        if (!Array.isArray(orders)) {
          throw new TypeError('Orders data is not an array');
        }

        // user_id リストを作成
        const userIds = [...new Set(orders.map(order => order.user_id))]; // 重複排除
        console.log("取得したuser_idリスト:", userIds);

        // 顧客情報の取得 (user_passを除外)
        console.log("顧客情報の取得を開始します。");
        const userPromises = userIds.map(userId =>
          this.fetchUserInfo(userId)
        );

        // 全ての顧客情報を取得
        const userResponses = await Promise.all(userPromises);
        const users = userResponses.flat();  // 二重配列を平坦化
        console.log("取得した顧客情報:", users);

        // product_id リストを作成
        const productIds = [...new Set(orders.map(order => order.product_id))]; // 重複排除
        console.log("取得したproduct_idリスト:", productIds);

        // 商品情報の取得
        console.log("商品情報の取得を開始します。");
        const productPromises = productIds.map(productId =>
          this.fetchProductInfo(productId)
        );

        // 全ての商品情報を取得
        const productResponses = await Promise.all(productPromises);
        const products = productResponses.flat();  // 二重配列を平坦化
        console.log("取得した商品情報:", products);
        
        // 取得した注文履歴、顧客情報、商品情報を統合
        const ordersWithDetails = orders.map(order => {
  const product = products.find(product => product.product_id === order.product_id);
  const user = users.find(user => user.user_id === order.user_id);

  const orderWithDetails = {
    ...order,
    user_name: user ? user.user_name : '',
    user_mail: user ? user.user_mail : '',
    user_postcode: user ? user.user_postcode : '',
    user_adress: user ? user.user_adress : '',
    user_telenum: user ? user.user_telenum : '',
    product_name: product ? product.product_name : '',
    product_id: product ? product.product_id : '',
    product_size: order.product_size,  // ここで注文データからサイズを直接取得
    quantity: order.quantity,
    URL: product ? product.URL : ''
  };

  return orderWithDetails;
});


        // 統合したデータを `orderHistory` に設定
        this.orderHistory = ordersWithDetails;
        console.log("最終的な注文履歴データ:", this.orderHistory);

      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    },

    Logout() {
      // ログアウト処理
      sessionStorage.clear();
      window.location.href = './index.html';
    },

    addData() {
      // HOME ボタンの動作
      window.location.href = './index4.html';
    }
  },
  mounted() {
    // コンポーネントがマウントされたときに注文履歴を取得
    this.fetchOrderHistory();
  }
});
