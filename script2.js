new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      tab: 0,
      userData: {
        user_id: '',
        user_name: '',
        user_mail: '',
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
    async fetchUserData() {
      this.userData.user_id = sessionStorage.getItem('user_id') || '';
      this.userData.user_name = sessionStorage.getItem('user_name') || '';
      this.userData.user_mail = sessionStorage.getItem('user_mail') || '';
      this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
      this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
      this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
      this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
    },

    async fetchOrderHistory() {
      try {
        const userId = this.userData.user_id;

        console.log('Fetching order history for user:', userId);

        // 注文履歴の取得 (確定した注文データ)
        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6', {
          params: { user_id: userId }
        });
        console.log('Order response:', orderResponse.data);

        // 商品情報の取得
        const productResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
        console.log('Product response:', productResponse.data);

        // 注文履歴データをマッピング
        const orders = orderResponse.data.List;
        const products = productResponse.data.List;

        console.log('Orders:', orders);
        console.log('Products:', products);

        // 注文番号ごとに商品情報を集約
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
            // 既存のアイテムを更新するために探す
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

        console.log('Order map:', orderMap);

        // 集約したデータをorderHistoryにセット
        this.orderHistory = Object.values(orderMap).map(order => ({
          order_id: order.order_id,
          total_quantity: order.items.reduce((total, item) => total + item.quantity, 0),
          items: order.items
        }));

        console.log('Order history:', this.orderHistory);
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
      window.location.href = './index.html';
    },

    addData() {
      // HOME ボタンの動作
      window.location.href = './index1.html';
    }
  },
  mounted() {
    this.fetchUserData();
    this.fetchOrderHistory();
  }
});
