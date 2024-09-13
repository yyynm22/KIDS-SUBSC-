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
        // APIからデータを取得
        const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4');
        
        // レスポンスデータの内容を確認
        const cartitems = response.data;
        console.log('API response:', cartitems);

        // cartitemsがオブジェクトであり、Listプロパティを持つか確認
        if (cartitems.List && Array.isArray(cartitems.List)) {
            console.log('Cart items (List):', cartitems.List);

            // user_idでカート内のユーザー情報を検索 (複数のアイテムを取得)
            const userItems = cartitems.List.filter(item => item.user_id.toString().trim() === this.user_id.toString().trim()); console.log('Filtered user items:', userItems); // デバッグログ追加
          
            if (userItems.length > 0) {
                console.log('Found user items:', userItems);
               // order_id を設定
                this.order_id = userItems[0].order_id;
                console.log('取得した order_id:', this.order_id); // デバッグログ追加
            } else {
                console.log('User items not found');
            }

            // 新しいデータを処理
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
　　　　　　　console.log('New data:', newData); // デバッグログ追加
          
            // dataList3に新しいデータを反映
            this.dataList3 = newData;

            // userItemsからproduct_idのリストを作成
            const productIds = userItems.map(item => item.product_id);

            // product_idリストを用いてsubsc_product_tableから情報を取得
            const productResponses = await Promise.all(productIds.map(productId =>
                fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT7?product_id=${productId}`)
            ));

            const productData = await Promise.all(productResponses.map(res => res.json()));
            console.log("Product data from subsc_product_table:", productData);
          
// productDataが空でないことを確認
            if (productData.length > 0 && productData[0].List.length > 0) {
            // productDataを新しいデータに結合
            this.dataList3 = this.dataList3.map(item => {
                const productInfo = productData.find(p => p.List && p.List.some(prod => prod.product_id === item.product_id));
                if (productInfo) {
                    const productDetails = productInfo.List.find(prod => prod.product_id === item.product_id);
                    console.log("Product info for item:", item.product_id, productDetails);
                    return { ...item, ...productDetails };
                }
                return item;
            });

        } else {
            console.error('Product data is empty or invalid.');
            }

            console.log("Updated dataList3:", this.dataList3);

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
     // selectedOrder が存在するかチェック
 if (!this.dataList3 || this.dataList3.length === 0) {
        console.error("カートが空です");
        return;
  }
     // 注文のパラメーターを作成
    const orderDetails = this.dataList3.map(item => ({
        product_id: item.product_id,
        user_id: this.user_id,
        product_size: item.product_size,
        quantity: item.quantity
    }));

    const params = {
    user_id: this.user_id,
    order_details: orderDetails,
    order_id: this.order_id // order_id を追加
};
    // デバッグ用に params をコンソールに出力
    console.log("送信するパラメーター:", params);

 
      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT3', params);
        console.log("注文が正常に送信されました:", response.data);

        // APIレスポンスをコンソールに表示
        console.log("APIレスポンス:", response.data);
        
         // カートの中身を削除
        for (const item of this.dataList3) {
            const deleteParams = {
                order_id: this.order_id,
                product_id: item.product_id,
                user_id: this.user_id,
                product_size: item.product_size,
                quantity: item.quantity
            };
            await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/DELETE2', deleteParams);
        }

        //カートダイヤログを閉じる
        this.detailsDialog = false; 
        // カート情報をリセット
        this.dataList3 = [];  // カートをクリア
        this.cartdialog = false;
        
        //結果をコンソールに出力
        console.log(response.data);
        this.order_id = '';
      
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
