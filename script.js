const app = new Vue({
  el: '#app', // Vueが管理する一番外側のDOM要素
  vuetify: new Vuetify(),
  data: {
    // Vue内部で使いたい変数は全てこの中に定義する
    temperature: '', // パラメーター「temperature」格納変数
    season: '', // パラメータ「season」格納変数
    dress: '', // パラメーター「dress」格納変数
    dressimg: '', // パラメータ「dressimg」格納変数
    mark: '',//パラメータ「mark」格納変数
    
    dataList: [], // データ表示用配列
  },
  methods: {
    // DBにデータを追加する関数
    addData: async function() {
      // temperatureの入力チェック（空白か数字以外なら終了）
      if(!this.temperature || isNaN(this.temperature)){
        console.log("temperatureに数値が入力されていません");
        return;
      }
      
      // POSTメソッドで送るパラメーターを作成
      const param = {
        temperature: this.temperature,
        season: this.season,
        dress: this.dress,
        dressimg: this.dressimg,
        mark: this.mark,
      };
      
      // INSERT用のAPIを呼び出し
      const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT', param);
      
      // 結果をコンソールに出力
      console.log(response.data);
      
      // 保存が完了したらフィールドをクリア
      this.temperature = '';
      this.season = '';
      this.dress = '';
      this.dressimg = '';
      this.mark = '';
    },
    
    // データベースからデータを取得する関数
    readData: async function() {
      // SELECT用のAPIを呼び出し      
      const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT');
      
      // 結果をコンソールに出力
      console.log(response.data);
      
      // 結果リストを表示用配列に代入
      this.dataList = response.data.List;
    },

    // データを削除する関数（deleteメソッド）
    deleteData: function(index) {
      if (this.dataList[index].isDone) {
        this.doneTodos.push(this.dataList[index]);
      }
      this.dataList.splice(index, 1); // リストから項目を削除
    }
  },
});

document.addEventListener('DOMContentLoaded', function() {
  // タブに対してクリックイベントを適用
  const tabs = document.getElementsByClassName('tab');
  for(let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', tabSwitch, false);
  }

  // タブをクリックすると実行する関数
  function tabSwitch() {
    // タブのclassの値を変更
    document.getElementsByClassName('is-active')[0].classList.remove('is-active');
    this.classList.add('is-active');
    
    // コンテンツのclassの値を変更
    document.getElementsByClassName('is-show')[0].classList.remove('is-show');
    const arrayTabs = Array.prototype.slice.call(tabs);
    const index = arrayTabs.indexOf(this);
    document.getElementsByClassName('panel')[index].classList.add('is-show');
  };
}, false);