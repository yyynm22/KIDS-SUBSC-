new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      tab: 0,
      userData: {
        user_id: '',
        user_name: '',
        user_pass: '',
        user_postcode: '',
        user_adress: '',
        user_telenum: ''
      },
      orderHistory: [],
      showPassword: false
    };
  },
  methods: {
    fetchUserData() {
      this.userData.user_id = sessionStorage.getItem('user_id') || '';
      this.userData.user_name = sessionStorage.getItem('user_name') || '';
      this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
      this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
      this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
      this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
    },

    async fetchOrderHistory() {
      try {
        const userId = this.userData.user_id;

        if (!userId) {
          console.error('User ID is not available.');
          return;
        }

        // デバッグログで userId を確認
        console.log('Fetching order history for user ID:', userId);

        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4', {
          params: { user_id: userId }
        });

        const productResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');

        // デバッグログを追加してレスポンスを確認
        console.log('Order Response:', orderResponse.data);
        console.log('Product Response:', productResponse.data);

        // 注文履歴データをマッピング
        const orders = orderResponse.data.List || []; // デフォルト空の配列に修正
        const products = productResponse.data.List || []; // デフォルト空の配列に修正

        this.orderHistory = orders.map(order => {
          // 注文に関連する商品情報を結びつける
          const items = products
            .filter(product => product.product_id === order.product_id)
            .map(product => ({
              product_name: product.product_name,
              product_category: product.product_category,
              product_gender: product.product_gender,
              product_image_url: product.URL,
              product_size: order.product_size,
              quantity: order.quantity
            }));

          return {
            order_id: order.order_id,
            total_quantity: order.quantity,
            items
          };
        });

        // デバッグログで最終的な注文履歴を確認
        console.log('Final Order History:', this.orderHistory);

      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    Logout() {
      // ログアウト処理
      sessionStorage.clear();
      window.location.href = './login.html';
    },

    addData() {
      // HOME ボタンの動作
      window.location.href = './home.html';
    }
  },
  mounted() {
    this.fetchUserData();
    this.fetchOrderHistory();
  }
});
