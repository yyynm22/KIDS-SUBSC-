new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      product_name: '',
      product_category: '',
      product_gender: '',
      URL: '',
      productList: [],
      employee_id: '',
      errorMessage: '', // エラーメッセージを格納する変数を追加
      dialog: false, // ダイアログ表示フラグ
    selectedData: null // 削除対象のデータを保持
    };
  },

  methods: {
    Logout() {
      window.location.href = '/index.html';
    },
    
    orderdetail() {
      window.location.href = '/index5.html';
    },

    async addData() {
      // 必要な項目が全て入力されていることを確認
      if (!this.product_category) {
        this.errorMessage = "categoryの入力をしてください";
        return;
      }
      if (!this.product_gender) {
        this.errorMessage = "genderの入力をしてください";
        return;
      }
      if (!this.product_name) {
        this.errorMessage = "product nameの入力をしてください";
        return;
      }
      if (this.product_name.length > 9) {
        this.errorMessage = "product nameを9文字以内で入力してください";
        return;
      }
      if (!this.URL) {
        this.errorMessage = "URLの入力をしてください";
        return;
      }

      // URLが正しい形式かを検証
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!urlPattern.test(this.URL)) {
    this.errorMessage = "正しいURLを入力してください (例: http://example.com)";
    return;
  }

      this.errorMessage = ''; // 全ての項目が入力されている場合はエラーメッセージをクリア
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
        this.readData();
      } catch (error) {
        console.error("データの追加に失敗しました", error);
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    // 削除確認ダイアログを表示するためのメソッド
  confirmDelete(data) {
    // 削除対象のデータを設定
    this.selectedData = data;
    // ダイアログを表示
    this.dialog = true;
  },
    // データ削除処理を行うメソッド
  async deleteData() {
    const data = this.selectedData;
    
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

      if (response.data.result) {
        this.productList = this.productList.filter(item => item.product_category !== data.product_category ||
          item.product_gender !== data.product_gender || item.product_name !== data.product_name || item.URL !== data.URL);
        this.dialog = false; // ダイアログを閉じる
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
        this.productList.forEach(item => {
          item.isExpanded = false;
        });
        card.isExpanded = true;
      }
    }
  }
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
