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
    // ユーザーデータを取得する
    fetchUserData() {
      this.userData.user_id = sessionStorage.getItem('user_id') || '';
      this.userData.user_name = sessionStorage.getItem('user_name') || '';
      this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
      this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
      this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
      this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
    },

    // ログインしたユーザーの注文履歴を取得する
    fetchOrderHistory() {
      const userId = this.userData.user_id; // sessionStorageから取得したuser_idを使用
      axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4')
        .then(response => {
          const allOrders = response.data.List;
          // ログインしているユーザーの注文データだけをフィルタリング
          const userOrders = allOrders.filter(order => order.user_id == userId);

          if (userOrders.length) {
            this.orderHistory = userOrders.map(order => ({
              order_id: order.order_id,
              total_quantity: order.quantity, // 合計個数
              items: [] // 商品詳細は後ほどマッピング
            }));

            // 商品情報を取得して注文履歴に追加
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3')
              .then(productResponse => {
                const products = productResponse.data.List;
                this.orderHistory.forEach(order => {
                  order.items = products
                    .filter(product => product.product_id === order.product_id)
                    .map(product => ({
                      product_name: product.product_name,
                      product_category: product.product_category,
                      product_gender: product.product_gender,
                      product_image_url: product.URL,
                      product_size: order.product_size,
                      quantity: order.quantity
                    }));
                });
              });
          } else {
            this.orderHistory = []; // 注文履歴がない場合
          }
        })
        .catch(error => {
          console.error('注文履歴の取得に失敗しました', error);
        });
    },

    // パスワード表示の切り替え
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  },
  created() {
    this.fetchUserData();
    this.fetchOrderHistory();
  }
});
