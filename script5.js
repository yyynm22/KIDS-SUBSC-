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
    async fetchOrderHistory() {
  try {
    // 注文履歴の取得 (確定した注文データ)
    const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT8');
    const orders = orderResponse.data;

    // user_id リストを作成
    const userIds = [...new Set(orders.map(order => order.user_id))]; // 重複排除
    
    // 顧客情報の取得 (user_passを除外)
    const userPromises = userIds.map(userId => 
      axios.get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT?user_id=${userId}`)
    );

    // 全ての顧客情報を取得
    const userResponses = await Promise.all(userPromises);
    const users = userResponses.map(response => response.data);

    // product_id リストを作成
    const productIds = [...new Set(orders.map(order => order.product_id))]; // 重複排除

    // 商品情報の取得
    const productPromises = productIds.map(productId =>
      axios.get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3?product_id=${productId}`)
    );

    // 全ての商品情報を取得
    const productResponses = await Promise.all(productPromises);
    const products = productResponses.map(response => response.data);

    // 取得したデータを統合する（例: orders にユーザー情報と商品情報を追加する）
    const ordersWithDetails = orders.map(order => {
      const user = users.find(user => user.user_id === order.user_id);
      const product = products.find(product => product.product_id === order.product_id);
      return {
        ...order,
        user_name: user ? user.user_name : '',
        user_mail: user ? user.user_mail : '',
        user_postcode: user ? user.user_postcode : '',
        user_adress: user ? user.user_adress : '',
        user_telenum: user ? user.user_telenum : '',
        product_name: product ? product.product_name : '',
        product_id: product ? product.product_id : '',
        product_size: product ? product.product_size : '',
        quantity : product ? product.quantity : '',
        URL: product ? product.URL : ''
      };
    });

    // 統合したデータを `orderHistory` に設定
    this.orderHistory = ordersWithDetails;
    console.log(this.orderHistory);

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
