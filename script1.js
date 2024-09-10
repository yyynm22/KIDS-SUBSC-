const app = new Vue({
  el: '#app',
    vuetify: new Vuetify(),
    data: {
      dataList1: [],
      dataList2: [],
      Category: '',  // カテゴリー選択用のデータ
      Kidsgender: '',
      cartdialog: false,  // カートダイアログの表示・非表示
      dialog: false,  // 商品詳細ダイアログの表示・非表示を管理
      cartItems: [  // 仮のカートアイテムデータ
        { name: 'T-shirt', price: 1000 },
        { name: 'Pants', price: 1500 },
        { name: 'Skirt', price: 1200 }
      ],
      selectedItem: {},  // 選択された商品を保存
      selectedSize: '',  // 選択されたサイズ
      selectedQuantity: 1,  // 個数
      sizes: ['S', 'M', 'L', 'XL'],  // サイズのリスト
     user_id: '',  // ログインしているユーザーIDを保存
    },
  
  mounted() {
        // コンポーネントがマウントされたときに sessionStorage から user_id を取得
        this.user_id = sessionStorage.getItem('user_id');
        console.log("ユーザーIDが sessionStorage から取得されました:", this.user_id);
    },
  
    methods: {
      mypage() {
        // マイページ遷移
        window.location.href = '/index2.html';
      },
      Logout() {
        // ログアウトページ遷移
        window.location.href = '/index.html';
      },
      readData1: async function () {
        if (!this.Category || !this.Kidsgender) {
          console.log("CategoryまたはKidsgenderが入力されていません");
          return;
        }
        const param = {
          product_category: this.Category,
          product_gender: this.Kidsgender,
        };
        try {
          const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT5', param);
          this.dataList1 = response.data.List.map(item => ({ ...item, liked: false, saved: false }));
        } catch (error) {
          console.error("APIリクエストエラー: ", error);
        }
      },
      readData2: async function () {
        const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
        const newData = response.data.List.map(item => {
          const existingItem = this.dataList2.find(oldItem => oldItem.Imageurl === item.Imageurl);
          return existingItem ? { ...item, liked: existingItem.liked, saved: existingItem.saved } : { ...item, liked: false, saved: false };
        });
        this.dataList2 = newData;
      },
      // 商品を選択してダイアログを開く
      openDialog(item) {
        this.selectedItem = item;
        this.selectedSize = '';
        this.quantity = 1;
        this.dialog = true;
      },
      // 商品をカートに追加
     addToCart: async function (selectedItem, selectedSize, selectedQuantity) {
    // デバッグ用のログ出力
    console.log("ユーザーID:", this.user_id);
    console.log("選択された商品:", selectedItem);
    console.log("選択されたサイズ:", selectedSize);
    console.log("選択された個数:", selectedQuantity);

    // 必須パラメーターが設定されているかチェック
    if (!this.user_id || !selectedItem?.product_id || !selectedSize || !selectedQuantity) {
        console.log("パラメーターが設定されてない");
        if (!this.user_id) console.log("ユーザーIDが設定されていません");
        if (!selectedItem?.product_id) console.log("商品IDが設定されていません");
        if (!selectedSize) console.log("サイズが設定されていません");
        if (!selectedQuantity) console.log("数量が設定されていません");
        return;
    }

    // 数量を数値型に変換
    const params = {
        product_id: selectedItem.product_id,
        user_id: this.user_id,
        product_size: selectedSize,
        quantity: selectedQuantity
    };

    try {
        // パラメーターを含んだAPIリクエスト
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT2', params);
        console.log(response.data);

        // フィールドをリセット
        this.selectedSize = '';
        this.selectedQuantity = 1;
    } catch (error) {
        console.error('APIリクエストに失敗しました:', error);
    }
},



      toggleLike(item) {
        item.liked = !item.liked;
      },
      toggleSave(item) {
        item.saved = !item.saved;
      }
    }
});
