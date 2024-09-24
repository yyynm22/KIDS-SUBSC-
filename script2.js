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
    fetchUserData() {
      this.userData.user_id = sessionStorage.getItem('user_id') || '';
      this.userData.user_name = sessionStorage.getItem('user_name') || '';
      this.userData.user_mail = sessionStorage.getItem('user_mail') || '';
      this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
      this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
      this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
      this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
    },

    // 注文履歴の取得
    async fetchOrderHistory() {
      try {
        const userId = this.userData.user_id;
        
        // 注文履歴の取得 (確定した注文データ)
        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6', {
          params: { user_id: userId }
        });
  
        // 商品情報の取得
        const productResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
  
        // 注文履歴データをマッピング
        const orders = orderResponse.data.List;
        const products = productResponse.data.List;
  
        // 注文履歴を集約するためのマップ
        const orderMap = {};
  
        // 注文データを集約
        orders.forEach(order => {
          if (!orderMap[order.order_id]) {
            orderMap[order.order_id] = {
              order_id: order.order_id,
              items: []
            };
          }
  
          const product = products.find(p => p.product_id === order.product_id);
          if (product) {
            orderMap[order.order_id].items.push({
              product_name: product.product_name,
              product_category: product.product_category,
              product_gender: product.product_gender,
              product_image_url: product.URL,
              product_size: order.product_size,
              quantity: order.quantity
            });
          }
        });
  
        // 集約したデータをorderHistoryにセット
        this.orderHistory = Object.values(orderMap).map(order => ({
          order_id: order.order_id,
          total_quantity: order.items.reduce((total, item) => total + item.quantity, 0),
          items: order.items
        }));
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
    scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // スムーズにスクロール
    });
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
