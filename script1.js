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
      cartItems: [],
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
    
    // ページ読み込み時に readData2 を呼び出し
    this.readData2();
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

      // カートに追加した商品情報を cartItems に追加
        this.cartItems.push({
            product_id: selectedItem.product_id,
            user_id: this.user_id,
            product_size: selectedSize,
            quantity: selectedQuantity,
            product_name: selectedItem.product_name,  // 商品名を追加
            product_category: selectedItem.product_category,  // カテゴリを追加
            product_gender: selectedItem.product_gender,  // 性別を追加
            URL: selectedItem.URL  // 画像のURLを追加
        });
        // フィールドをリセット
        this.selectedSize = '';
        this.selectedQuantity = 1;
    } catch (error) {
        console.error('APIリクエストに失敗しました:', error);
    }
},
//注文確定
  confirmOrder: async function() {
    
  //POSTメソッドで送るパラメーターを作成
  const param = {
    Table: 'subsc_detail_table',
    order_id : this.selectedOrder.OrderId,
     };
  
  //INSERT3用のAPIを呼び出し
    // きちんと格納がなされているか確認用
      console.log("送信するパラメーター:", param);
      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT3', param);

        // APIレスポンスをコンソールに表示
        console.log("APIレスポンス:", response.data);
        this.detailsDialog = false;  //カートに追加時点でオーバレイを閉じるfalse
      } catch (error) {
        // エラーの詳細をコンソール表示：開発用だが残しておく
        console.error("カート追加エラー:", error.message);
        if (error.response) {
          console.error("レスポンスエラー:", error.response.data);
        } else if (error.request) {
          console.error("リクエストエラー:", error.request);
        } else {
          console.error("設定エラー:", error.message);
        }
      }
  //結果をコンソールに出力
      console.log(response.data);
      this.order_id = '';

  },       
  toggleLike: function (index, listType = 'dataList') {
            const list = listType === 'dataList' ? this.dataList1 : this.dataList2;
            list[index].liked = !list[index].liked;
        },      


      toggleLike(item) {
        item.liked = !item.liked;
      },
      toggleSave(item) {
        item.saved = !item.saved;
      }
    }
});
