new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      tab: 0,  // タブの状態
      orderHistory: [],  // 注文履歴のデータ
      userData: {  // ユーザーデータを保持するオブジェクト
        user_id: '',
        user_name: '',
        user_mail: '',
        user_pass: '',
        user_postcode: '',
        user_adress: '',
        user_telenum: ''
      }
    };
  },
  methods: {
    async fetchOrderHistory() {
      try {
        // 注文履歴の取得 (確定した注文データ)
        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT8');

        // 顧客情報の取得
        const userResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT1');

        // 商品情報の取得
        const productResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');

        // 注文履歴データをマッピング
        const orders = orderResponse.data.List;
        const users = userResponse.data.List;
        const products = productResponse.data.List;

        // 注文履歴に関連する商品情報とユーザー情報を結びつける
        this.orderHistory = orders.map(order => {
          // 注文に関連するユーザー情報を取得
          const user = users.find(user => user.user_id === order.user_id);

          // 注文に関連する商品情報を取得
          const items = products
            .filter(product => product.product_id === order.product_id)
            .map(product => ({
              product_id: product.product_id,
              product_name: product.product_name,
              product_image_url: product.URL,
              product_size: order.product_size,
              quantity: order.quantity
            }));

          return {
            order_id: order.order_id,
            total_quantity: order.quantity,
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              user_mail: user.user_mail,
              user_postcode: user.user_postcode,
              user_adress: user.user_adress,
              user_telenum: user.user_telenum
            },
            items
          };
        });
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
    this.fetchOrderHistory();
  }
});
