new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      product_name: '',
      product_category: '',
      product_gender: '',
      URL: '',
      productList: [], // 商品リストを追加
      employee_id: ''
    };
  },
  methods: {
    Logout() {
      // ログアウト処理
      window.location.href = '/index.html';  // ログインページにリダイレクト
    },
    async addData() {
      if (!this.product_category || isNaN(this.product_category)) {
        console.log("product_categoryに数値が入力されていません");
        return;
      }
      const param = {
        product_category: this.product_category,
        product_gender: this.product_gender,
        product_name: this.product_name,
        URL: this.URL,
      };
      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT1', param);
        console.log(response.data);
        this.product_category = '';
        this.product_gender = '';
        this.product_name = '';
        this.URL = '';
        // データを再取得または追加する処理
        this.readData();
      } catch (error) {
        console.error("データの追加に失敗しました:", error);
      }
    },
    async deleteData(data) {
      if (!data.product_category) {
        console.log("product_categoryに数値が入力されていません");
        return;
      }
      const param = {
        product_category: data.product_category,
        product_gender: data.product_gender,
        product_name: data.product_name,
        URL: data.URL,
      };
      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/DELETE1', param);
        console.log(response.data);
        this.productList = this.productList.filter(item => item.product_category !== data.product_category);
      } catch (error) {
        console.error("データの削除に失敗しました:", error);
      }
    },
    async readData() {
      try {
        const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
        this.productList = response.data; // データリストを更新
      } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
      }
    },
    toggleExpand(data) {
      // 展開/折りたたみのロジック
      data.isExpanded = !data.isExpanded;
    }
  },
  created() {
    this.readData(); // コンポーネント作成時にデータを読み込む
  }
});
