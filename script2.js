new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
      return {
          tab: 0, // 初期タブ
          dataList: [], // 会員登録情報を格納するリスト
        user_id: sessionStorage.getItem('user_id'), // ログインセッションからユーザーIDを取得
      };
  },
  methods: {
      
      addData() {
        // 商品の検索画面に遷移
        window.location.href = '/index1.html';
      },
  },
  mounted() {
      // マウント時にデータを取得
      this.fetchData();
  },
});