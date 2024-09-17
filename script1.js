const app = new Vue({
  el: '#app',
    vuetify: new Vuetify(),
    data: {
      dataList1: [],
      dataList2: [],
      dataList3: [],
      Category: '',  // カテゴリー選択用のデータ
      Kidsgender: '',
      filteredList: [],  // フィルタリングされたデータのリスト
      cartdialog: false,  // カートダイアログの表示・非表示
      dialog: false,  // 商品詳細ダイアログの表示・非表示を管理
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
      
filterData() {
  if (this.Category === '' && this.Kidsgender === '') {
    this.filteredList = this.dataList2;
  } else {
    this.filteredList = this.dataList2.filter(item => {
      const matchesCategory = this.Category === '' || item.product_category === this.Category;
      const matchesGender = this.Kidsgender === 'All' || item.product_gender === this.Kidsgender;

      console.log("Item Category: ", item.product_category, "Matches Category: ", matchesCategory);
      console.log("Item Gender: ", item.product_gender, "Matches Gender: ", matchesGender);

      return matchesCategory && matchesGender;
    });
  }

  console.log("Filtered List after search: ", this.filteredList);
},



      
      mypage() {
        // マイページ遷移
        window.location.href = '/index2.html';
      },
      Logout() {
        // ログアウトページ遷移
        window.location.href = '/index.html';
      },
     
      readData2: async function () {
    try {
        const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
        const newData = response.data.List.map(item => {
            const existingItem = this.dataList2.find(oldItem => oldItem.Imageurl === item.Imageurl);
            return existingItem ? { ...item, liked: existingItem.liked, saved: existingItem.saved } : { ...item, liked: false, saved: false };
        });
        this.dataList2 = newData;
        // データ取得後にフィルタリングを適用
        this.filterData();
    } catch (error) {
        console.error('データの取得に失敗しました:', error);
    }
},
  
readData3: async function () {
  try {
      // APIからカートデータを取得
      const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4');
      
      const cartitems = response.data;
      console.log('API response:', cartitems);

      if (cartitems.List && Array.isArray(cartitems.List)) {
          console.log('Cart items (List):', cartitems.List);

          // user_idでカート内のユーザー情報をフィルター
          const userItems = cartitems.List.filter(item => item.user_id.toString().trim() === this.user_id.toString().trim());
          if (userItems.length > 0) {
              console.log('Found user items:', userItems);
          } else {
              console.log('User items not found');
          }

          // 新しいデータにマッピング
          const newData = userItems.map(item => {
              const existingItem = this.dataList3.find(oldItem => oldItem.product_id === item.product_id);
              return existingItem ? { 
                  ...item, 
                  liked: existingItem.liked, 
                  saved: existingItem.saved 
              } : { 
                  ...item, 
                  liked: false, 
                  saved: false 
              };
          });

          this.dataList3 = newData;

          // product_id リストを作成
          const productIds = userItems.map(item => item.product_id);

          // 各 product_id に基づき商品情報を取得
          const productResponses = await Promise.all(productIds.map(productId =>
              axios.get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT7?product_id=${productId}`)
          ));

          const productData = productResponses.map(res => res.data);
          console.log("Product data from subsc_product_table:", productData);

          // 商品データをカートアイテムに結合
         this.dataList3 = this.dataList3.map(item => {
  // productData の構造に合わせて、List の中から productInfo を探す
  const productInfo = productData.flatMap(data => data.List).find(p => p.product_id === item.product_id);

  console.log("Product info for each item:", productInfo);
  
  return productInfo ? { 
      ...item, 
      product_name: productInfo.product_name,
      product_category: productInfo.product_category,
      product_gender: productInfo.product_gender,
      URL: productInfo.URL
  } : item;
});




      } else {
          console.error('Listプロパティが存在しないか、配列ではありません。');
      }
  } catch (error) {
      console.error('データの取得に失敗しました:', error);
  }
},




      
      openCartDialog() {
      this.cartdialog = true;  // ダイアログを開く
      this.readData3();        // カートのデータを取得
    },
      
      watch: {
    cartdialog(val) {
      if (val) {
        this.readData3();  // ダイアログが開いたときにデータを取得
      }
    }
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

        // フィールドをリセット
        this.selectedSize = '';
        this.selectedQuantity = 1;
    } catch (error) {
        console.error('APIリクエストに失敗しました:', error);
    }
},
  //注文確定
  confirmOrder: async function() {
     // カートが空か確認
 if (!this.dataList3 || this.dataList3.length === 0) {
        console.error("カートが空です");
        return;
  }
      // 注文詳細を作成（order_idを追加）
  const orderDetails = this.dataList3.map(item => ({
    order_id: this.order_id,  // 自動生成または取得された order_id を使用
    product_id: item.product_id,
    user_id: this.user_id,
    product_size: item.product_size,
    quantity: item.quantity
  }));

    // デバッグログを追加
    console.log("注文詳細:", orderDetails);

  try {
    // 各注文詳細をAPIに送信
    for (const detail of orderDetails) {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT3', detail);
        console.log("注文詳細が送信されました:", response.data);
    }

    // カートの内容を削除 (DELETE2)
for (const item of this.dataList3) {
  const deleteParams = {
    order_id: this.order_id,  // このorder_idを使って削除
    product_id: item.product_id,
    user_id: this.user_id,
    product_size: item.product_size,
    quantity: item.quantity
  };

  // デバッグログを追加
  console.log("削除パラメーター:", deleteParams);

  await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/DELETE2', deleteParams);
  console.log(`商品ID: ${item.product_id} のカート内容が削除されました`);
  }



    // カートをクリア
        this.dataList3 = [];
        this.cartdialog = false;
        console.log("カートがリセットされました");


} catch (error) {
    // エラーハンドリング
    console.error("注文送信エラー:", error.message);
    if (error.response) {
        console.error("レスポンスエラー:", error.response.data);
    } else if (error.request) {
        console.error("リクエストエラー:", error.request);
    } else {
        console.error("設定エラー:", error.message);
    }
}
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
