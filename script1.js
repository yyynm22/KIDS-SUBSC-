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
      selectedQuantity: '',  // 個数
      sizes: ['S', 'M', 'L', 'XL'],  // サイズのリスト
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
    if (!selectedSize || !selectedQuantity) {
        console.log("サイズまたは個数が入力されていません");
        return;
    }

    const params = {
        product_id: This.selectedItem.product_id,
        user_id: this.user_id,  // ログインしたユーザーのIDを使用
        product_size: selectedSize,
        quantity: selectedQuantity
    };

    try {
        const response = await axios.get('https://m3hminagawafunction.azurewebsites.net/api/INSERT2', { params });
        console.log(response.data);

        // フィールドをリセット
        this.selectedSize = '';
        this.quantity = '';
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
