const app = new Vue({
  el: '#app',
    vuetify: new Vuetify(),
    data: {
      dataList1: [],
      dataList2: [],
      Category: '',  // カテゴリー選択用のデータ
      Kidsgender: '',
      cartdialog: false,  // ダイアログの表示・非表示を管理
      
      cartItems: [  // 仮のカートアイテムデータ
        { name: 'T-shirt', price: 1000 },
        { name: 'Pants', price: 1500 },
        { name: 'Skirt', price: 1200 }
      ],
      
    },
    methods: {
      mypage() {
        // マイページ遷移を実行
  window.location.href = '/index2.html';
        // ボタンのクリックイベントを処理する関数（必要に応じて追加）
      },
      Logout() {
        // ログアウトページ遷移を実行
  window.location.href = '/index.html';
        // ボタンのクリックイベントを処理する関数（必要に応じて追加）
      },
      
      readData1: async function () {
  console.log("Category: ", this.Category);
  console.log("Kidsgender: ", this.Kidsgender);

  if (!this.Category || !this.Kidsgender) {
    console.log("CategoryまたはKidsgenderが入力されていません");
    return;
  }

  const param = {
    product_category: this.Category,   // APIのパラメータ名に合わせる
    product_gender: this.Kidsgender,   // APIのパラメータ名に合わせる
  };

  try {
    console.log("APIリクエストを送信中...");

    // APIエンドポイントにPOSTリクエストを送信
    const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT5', param);

    console.log("APIリクエストが成功しました。レスポンス: ", response.data);

    // レスポンスデータを処理し、likedとsavedプロパティを追加
    this.dataList1 = response.data.List.map(item => ({ ...item, liked: false, saved: false }));

    console.log("dataList1: ", this.dataList1);
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
//カート追加確定
addCart: async function() {
  
//POSTメソッドで送るパラメーターを作成
const param = {
  Table: 'subsc_ordercart_table',
  product_id : this.product_id,
  user_id : this.user_id,
  product_size : this.product_size,
  quantity : this.quantity
   };

//INSERT2用のAPIを呼び出し
  // きちんと格納がなされているか確認用
    console.log("送信するパラメーター:", param);
  
    try {
      const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT2', param);

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
    this.product_id = '';
    this.user_id = '';
    this.product_size = '';
    this.quantity = '';

},      
 //注文確定 未修正
addOrder: async function() {
  
//POSTメソッドで送るパラメーターを作成
const param = {
  Table: 'subsc_ordercart_table',
  product_id : this.product_id,
  user_id : this.user_id,
  product_size : this.product_size,
  quantity : this.quantity
   };

//INSERT2用のAPIを呼び出し
  // きちんと格納がなされているか確認用
    console.log("送信するパラメーター:", param);
    try {
      const response = await axios.post('', param);

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
    this.product_id = '';
    this.user_id = '';
    this.product_size = '';
    this.quantity = '';

},       
toggleLike: function (index, listType = 'dataList') {
          const list = listType === 'dataList' ? this.dataList : this.dataList2;
          list[index].liked = !list[index].liked;
      },      
     
    }
  });
