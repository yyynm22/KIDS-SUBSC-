new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      product_name: '',
      product_category: '',
      product_gender: '',
      URL: '',
      productList: [], // 商品リストを追加
      employee_id: '',
    };
  },

  methods: {
    Logout() {
      // ログアウト処理
      window.location.href = '/index.html';  // ログインページにリダイレクト
    },

    async addData() {
      // 必要な項目が全て入力されていることを確認
      if (!this.product_category ||!this.product_gender || !this.product_name || !this.URL) {
        console.log("必要な項目が入力されていません");
        return;
      }

      const param = {
        product_category: this.product_category,
        product_gender: this.product_gender,
        product_name: this.product_name,
        URL: this.URL,
      };

      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT1', param);
        console.log(response.data);
        this.product_category = '';
        this.product_gender = '';
        this.product_name = '';
        this.URL = '';
        // データを再取得または追加する処理
        this.readData();
      } catch (error) {
        console.error("データの追加に失敗しました", error);
      }
    },
    
    async deleteData(data) {
      if (!data.product_category || !data.product_gender || !data.product_name || !data.URL) {
        console.log("必須項目が不足しています");
        return;
      }
    
      const param = {
        product_category: data.product_category,
        product_gender: data.product_gender,
        product_name: data.product_name,
        URL: data.URL,
      };
    
      try {
        const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/DELETE1', param);
        console.log(response.data);
    
        // 削除が成功した場合、商品リストから削除した商品を除外
        if (response.data.result) {
          this.productList = this.productList.filter(item => item.product_category !== data.product_category ||
            item.product_gender !== data.product_gender || item.product_name !== data.product_name || item.URL !== data.URL);
        } else {
          console.log("削除に失敗しました");
        }
      } catch (error) {
        console.error("データの削除に失敗しました:", error);
      }
    },
    
    async readData() {
      try {
        const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
        this.productList = response.data; // データリストを更新
      } catch (error) {
        console.error("データの読み込みに失敗しました", error);
      }
    },
    
    readData: async function () {
      try {
          const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3');
          console.log(response.data);
          this.productList = response.data.List.sort((a, b) => a.product_category - b.product_category);
      } catch (error) {
          console.error("データの取得に失敗しました:", error);
      }
  },

  toggleExpand(card) {
      if (card.isExpanded) {
          card.isExpanded = false;
      } else {
          // 他のカードの拡大を解除
          this.productList.forEach(item => {
              item.isExpanded = false;
          });
          card.isExpanded = true;
      }
  }


},
});

document.addEventListener('DOMContentLoaded', function () {
const tabs = document.getElementsByClassName('tab');
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener('click', tabSwitch, false);
}

function tabSwitch() {
  document.getElementsByClassName('is-active')[0].classList.remove('is-active');
  this.classList.add('is-active');
  document.getElementsByClassName('is-show')[0].classList.remove('is-show');
  const arrayTabs = Array.prototype.slice.call(tabs);
  const index = arrayTabs.indexOf(this);
  document.getElementsByClassName('panel')[index].classList.add('is-show');
};
}, false);
