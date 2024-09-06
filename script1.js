const app = new Vue({
  el: '#app',
    vuetify: new Vuetify(),
    data: {
      dataList1: [],
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
if (!this.Category || !this.Kidsgender) {
  console.log("CategoryまたはKidsgenderが入力されていません");
  return;
}

const param = {
  product_category: this.Category,   // APIのパラメータ名に合わせる
  product_gender: this.Kidsgender,   // APIのパラメータ名に合わせる
};

try {
  // APIエンドポイントにPOSTリクエストを送信
  const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT5', param);

  // レスポンスデータを処理し、likedとsavedプロパティを追加
  this.dataList1 = response.data.List.map(item => ({ ...item, liked: false, saved: false }));
} catch (error) {
  console.error("APIリクエストエラー: ", error);
}
},
      
      
     
    }
  });