Vue.config.devtools = true;

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      tab: null,
      orderHistory: [], // 初期値を空の配列に変更
      loading: true // データ読み込み中を示すフラグ
    };
  },
  computed: {
    sortedOrderHistory() {
      return this.orderHistory.sort((a, b) => {
        // チェックボックスの状態でソート
        if (a.checked && !b.checked) return 1; // aがチェックされている場合、bより下に
        if (!a.checked && b.checked) return -1; // bがチェックされている場合、aより上に
        return a.order_id - b.order_id; // 注文番号でソート（昇順）
      });
    },
  },
  methods: {
    // ユーザー情報を取得
    async fetchUserInfo(userId) {
      try {
        const response = await fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT9?user_id=${userId}`);
        const data = await response.json();
        console.log("ユーザー情報のレスポンス:", data);
        return data.List;  // 正しいプロパティ名に変更
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
      }
    },

    // 商品情報を取得
    async fetchProductInfo(productId) {
      try {
        const response = await fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT10?product_id=${productId}`);
        const data = await response.json();
        console.log("商品情報のレスポンス:", data);
        return data.List;  // 正しいプロパティ名に変更
      } catch (error) {
        console.error("商品情報取得エラー:", error);
      }
    },

    async fetchOrderHistory() {
      try {
        console.log("注文履歴の取得を開始します。");

        // 注文履歴の取得
        const orderResponse = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT8');
        const orders = orderResponse.data.List;
        console.log("取得した注文履歴:", orders);

        if (!Array.isArray(orders)) {
          throw new TypeError('Orders data is not an array');
        }

        // 顧客情報と商品情報の取得
        const userIds = [...new Set(orders.map(order => order.user_id))];
        const userPromises = userIds.map(userId => this.fetchUserInfo(userId));
        const userResponses = await Promise.all(userPromises);
        const users = userResponses.flat();

        const productIds = [...new Set(orders.map(order => order.product_id))];
        const productPromises = productIds.map(productId => this.fetchProductInfo(productId));
        const productResponses = await Promise.all(productPromises);
        const products = productResponses.flat();

        // 統合データの作成
        const ordersWithDetails = orders.map(order => {
          const product = products.find(product => product.product_id === order.product_id);
          const user = users.find(user => user.user_id === order.user_id);

          return {
            ...order,
            user_name: user ? user.user_name : '',
            user_mail: user ? user.user_mail : '',
            user_postcode: user ? user.user_postcode : '',
            user_adress: user ? user.user_adress : '',
            user_telenum: user ? user.user_telenum : '',
            product_name: product ? product.product_name : '',
            product_id: product ? product.product_id : '',
            product_size: order.product_size,
            detail_id: order.detail_id,
            quantity: order.quantity,
            URL: product ? product.URL : '',
            checked: order.checked // データベースからの値を反映
          };
        });

        // `orderHistory`にデータを設定
        this.orderHistory = ordersWithDetails;
        console.log("最終的な注文履歴データ:", this.orderHistory); // ここで確認

      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        this.loading = false; // データ取得完了時にloadingをfalseに
      }
    },

    // サブスクリプションの詳細を更新
    async updateSubscriptionDetail(detailId, isChecked) {
       console.log(`Updating detail_id: ${detailId}, checked: ${isChecked}`);
      try {
        const response = await fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/Update?detail_id=${detailId}&checked=${isChecked}`, {
          method: 'POST'
        });
        const data = await response.json();
        console.log("サブスクリプション詳細更新のレスポンス:", data);
      } catch (error) {
        console.error("サブスクリプション詳細更新エラー:", error);
      }
    },

    // チェックボックスの状態を変更
    toggleChecked(order) {
      order.checked = !order.checked; // チェック状態を切り替え
      this.updateSubscriptionDetail(order.detail_id, order.checked); // 更新APIを呼び出す
      this.sortOrders(); // 並べ替え
    },

    sortOrders() {
      // チェックボックスが変更されたときに再ソート
      this.orderHistory.sort((a, b) => {
        if (a.checked && !b.checked) return 1;
        if (!a.checked && b.checked) return -1;
        return a.order_id - b.order_id;
      });
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
      window.location.href = './index4.html';
    }
  },

  mounted() {
    // コンポーネントがマウントされたときに注文履歴を取得
    this.fetchOrderHistory();
  }
});
