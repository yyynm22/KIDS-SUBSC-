const app = new Vue({
    el: '#app',
      vuetify: new Vuetify(),
      data: {
        dialog: false,  // ダイアログの表示・非表示を管理
        cartItems: [  // 仮のカートアイテムデータ
          { name: 'T-shirt', price: 1000 },
          { name: 'Pants', price: 1500 },
          { name: 'Skirt', price: 1200 }
        ]
      },
      methods: {
        addData() {
          // ボタンのクリックイベントを処理する関数（必要に応じて追加）
        }
      }
    });