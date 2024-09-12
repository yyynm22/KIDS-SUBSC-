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
      orderHistory: [],  // 注文履歴データ
      showPassword: false
    };
  },
  mounted() {
    this.fetchUserData();   // ユーザー情報を取得
    this.fetchOrderHistory();  // 注文履歴を取得
  },
  methods: {
    // ログインしたユーザーのデータを取得
    fetchUserData() {
      const storedUserData = JSON.parse(sessionStorage.getItem('loggedInUser'));  // セッションストレージから取得
      if (storedUserData) {
        this.userData = storedUserData;
      }
    },
    
    // 注文履歴を取得し、ログインユーザーのデータをフィルタリング
    fetchOrderHistory() {
      axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4')
        .then(response => {
          const allOrders = response.data.List;
          // ログインしているユーザーの注文履歴のみを抽出
          this.orderHistory = allOrders.filter(order => order.user_id === this.userData.user_id);
        })
        .catch(error => {
          console.error('注文履歴の取得に失敗しました:', error);
        });
    },
    
    // パスワード表示のトグル
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    // ログアウト処理（例）
    Logout() {
      sessionStorage.removeItem('loggedInUser');  // セッションストレージから削除
      window.location.href = 'login.html';  // ログインページにリダイレクト
    }
  }
});
