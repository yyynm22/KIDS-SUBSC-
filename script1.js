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
        const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4');
        const cartitems = response.data;

        if (cartitems.List && Array.isArray(cartitems.List)) {
          const userItems = cartitems.List.filter(item => item.user_id.toString().trim() === this.user_id.toString().trim());

          const newData = userItems.map(item => {
            const existingItem = this.dataList3.find(oldItem => oldItem.product_id === item.product_id);
            return existingItem ? { ...item, liked: existingItem.liked, saved: existingItem.saved } : { ...item, liked: false, saved: false };
          });

          this.dataList3 = newData;
          const productIds = userItems.map(item => item.product_id);

          const productResponses = await Promise.all(productIds.map(productId =>
            fetch(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT7?product_id=${productId}`)
          ));

          const productData = await Promise.all(productResponses.map(async (res) => {
            if (res.ok) {
              return await res.json();
            } else {
              console.error("Failed to fetch product_id:", res.status);
              return null;
            }
          }));

          this.dataList3 = this.dataList3.map(item => {
            const productInfo = productData.find(p => p?.product_id === item.product_id);
            return productInfo ? { ...item, productInfo } : item;
          });
        } else {
          console.error('Listプロパティが存在しないか、配列ではありません。');
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    },

    openCartDialog() {
      this.cartdialog = true;
      this.readData3();
    },

    addToCart: async function (selectedItem, selectedSize, selectedQuantity) {
      if (!this.user_id || !selectedItem?.product_id || !selectedSize || !selectedQuantity) {
        console.log("パラメーターが不足しています");
        return;
      }

      const params = {
        product_id: selectedItem.product_id,
        user_id: this.user_id,
        product_size: selectedSize,
        quantity: selectedQuantity
      };

      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT2', params);
        console.log(response.data);
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
  },

  watch: {
    cartdialog(val) {
      if (val) {
        this.readData3();
      }
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
