const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    product_name: '',
    product_category: '',
    product_gender: '',
    URL: '',
    products: [], // 商品リスト
    employee_id: ''
  },
  mounted() {
    // sessionStorageからemployee_idを取得
    this.employee_id = sessionStorage.getItem('employee_id');
    console.log("ユーザーIDが sessionStorage から取得されました:", this.employee_id);

    // 初期データの取得
    this.loadProducts();
  },
  methods: {
    Logout() {
      // ログアウト処理
      window.location.href = '/index.html';
    },
    
    addData: async function () {
      // 各フィールドが入力されているかを確認
      if (!this.product_name || !this.product_category || !this.product_gender || !this.product_URL) {
          console.log("すべての項目が入力されていません");
          return;
      }
  
      // 送信するパラメータの定義
      const param = {
          product_name: this.product_name,
          product_category: this.product_category,
          product_gender: this.product_gender,
          URL: this.product_URL,
      };
  
      try {
          // APIにPOSTリクエストを送信
          const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT1', param);
          console.log(response.data);
  
          // フォームのフィールドをリセット
          this.product_name = '';
          this.product_category = '';
          this.product_gender = '';
          this.product_URL = '';
      } catch (error) {
          // エラーメッセージをコンソールに表示
          console.error("データの追加に失敗しました:", error);
      }
  }}
  
});
