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
      orderHistory: [],  // 注文履歴のデータを保持
      showPassword: false
    };
  },
  methods: {
    // ログインユーザーの情報を取得する
    fetchUserData() {
      this.userData.user_id = sessionStorage.getItem('user_id') || '';
      this.userData.user_name = sessionStorage.getItem('user_name') || '';
      this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
      this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
      this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
      this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';

      // 注文履歴を取得する
      this.fetchOrderHistory();
    },
    
    // 注文履歴を取得
    fetchOrderHistory() {
      const userId = this.userData.user_id;  // ログインしたユーザーのID
      axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4')
        .then(response => {
          const allOrders = response.data.List;
          // ログインしたユーザーの注文履歴をフィルタリング
          const userOrders = allOrders.filter(order => order.user_id === Number(userId));

          if (userOrders.length > 0) {
            // 商品テーブルから詳細情報を取得して注文履歴を構築
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3')
              .then(productResponse => {
                const products = productResponse.data.List;

                // 注文履歴を詳細な商品情報と組み合わせる
                this.orderHistory = userOrders.map(order => {
                  const product = products.find(p => p.product_id === order.product_id);
                  return {
                    order_id: order.order_id,
                    total_quantity: order.quantity, // 合計個数
                    items: [{
                      product_name: product.product_name,
                      product_category: product.product_category,
                      product_gender: product.product_gender,
                      product_size: order.product_size,
                      product_image_url: product.URL,
                      quantity: order.quantity
                    }]
                  };
                });
              })
              .catch(error => {
                console.error("商品情報の取得エラー:", error);
              });
          } else {
            this.orderHistory = [];
          }
        })
        .catch(error => {
          console.error("注文履歴の取得エラー:", error);
        });
    },

    // パスワード表示/非表示の切り替え
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    // ログアウト処理
    Logout() {
      sessionStorage.clear();
      window.location.href = 'login.html';
    }
  },
  mounted() {
    this.fetchUserData();  // 初期化時にユーザー情報と注文履歴を取得
  }
});
