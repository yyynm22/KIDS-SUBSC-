new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      tab: 0,
      orderHistory: [],
      loading: true // ローディングフラグ
    };
  },
  methods: {
    // 注文履歴の取得
    async fetchOrderHistory() {
      try {
        this.loading = true; // データ取得開始時にローディング状態を設定
        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT8');
        const productResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
        const userResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT');
        
        console.log("Orders:", orderResponse.data);
    console.log("Products:", productResponse.data);
    console.log("Users:", userResponse.data);
        
        const orders = orderResponse.data.List;
        const products = productResponse.data.List;
        const users = userResponse.data.List;

       const orderMap = {};

orders.forEach(order => {
  if (!orderMap[order.order_id]) {
    orderMap[order.order_id] = {
      order_id: order.order_id,
      items: []
    };
  }

           const user = users.find(u => u.user_id === order.user_id);
  const product = products.find(p => p.product_id === order.product_id);

  if (product) {
    const existingItem = orderMap[order.order_id].items.find(item => item.product_id === order.product_id && item.product_size === order.product_size);
    if (existingItem) {
      existingItem.quantity += order.quantity;
    } else {
              orderMap[order.order_id].items.push({
        user_name: user ? user.user_name : '',
        user_mail: user ? user.user_mail : '',
        user_postcode: user ? user.user_postcode : '',
        user_adress: user ? user.user_adress : '',
        user_telenum: user ? user.user_telenum : '',
        product_name: product ? product.product_name : '',
        product_id: product ? product.product_id : '',
        product_size: order.product_size,
        quantity: order.quantity,
        product_image_url: product ? product.URL : ''
      });
           }
  }
});

this.orderHistory = Object.values(orderMap).map(order => ({
  order_id: order.order_id,
  total_quantity: order.items.reduce((total, item) => total + item.quantity, 0),
  items: order.items
}));

      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        this.loading = false; // データ取得完了時にローディング状態を解除
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
  mounted() {
    this.fetchOrderHistory();
  }
});
