/* 商品追加セクションのスタイル */
.product-section {
  margin-top: 100px; /* 商品追加セクションの上部に100pxのスペースを追加 */
}

/* フッター、ヘッダーのフォント設定 */
.custom-font {
  font-family: 'Times New Roman', sans-serif !important;
}

.custom-font {
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.v-app {
  flex: 1;
}

.v-app-bar {
  height: 64px; /* ヘッダーの高さ */
}

.v-footer {
  height: 56px; /* フッターの高さ */
  position: fixed;
  bottom: 0;
  width: 100%;
}

.v-container {
  padding-top: 64px; /* ヘッダーの高さ分 */
  padding-bottom: 56px; /* フッターの高さ分 */
  box-sizing: border-box; /* パディングがサイズに影響しないように */
}

/* style.css */


/* 全体の背景色とフォント設定 */
body {
  background-color: #fce4ec; /* 淡いピンク */
  color: #333;
  margin: 0;
  padding: 0;
}


/* フッター、ヘッダーのフォント設定 */
.custom-font {
  font-family: 'Times New Roman', sans-serif !important;
}

/* 他のスタイルはそのまま */

/* タブグループのスタイル */
.tab-group {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tab {
  font-family: 'Times New Roman', sans-serif;
  flex: 1;
  padding: 15px;
  list-style: none;
  border: solid 1px #ff80ab; /* ピンク色 */
  text-align: center;
  cursor: pointer;
  background-color: #f8bbd0; /* 淡いピンク */
  color: #d81b60; /* ピンク色 */
  font-size: 18px;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
  border-radius: 15px;
  margin: 5px;
  margin-top:100px;
}


  .tab.is-active {
      background-color: #d81b60; /* ピンク色 */
      color: #fff;
      transform: scale(1.05); /* ホバー時に拡大 */
  }

.tab-B v-btn1 {
  font-family: 'Times New Roman', sans-serif;
  width: 100%; /* タブBの幅に合わせる */
  height: 100%; /* タブBの高さに合わせる */
  padding: 10px 20px; /* ボタン内のパディングを調整 */
  font-size: 16px; /* 文字サイズを調整 */
  background-color: transparent; /* 背景を透明にする */
  border: none; /* ボーダーを削除 */
  color: #c2185b; /* 文字色をピンクにする */
}


.panel-group {
  font-family: 'Times New Roman', sans-serif;
  border: solid 1px #ff80ab; /* 薄いピンク */
  border-top: none;
  background: #f8bbd0; /* 淡いピンク */
}

.panel {
  display: none;
}

  .panel.is-show {
      display: block;
  }

/* セレクトボックスのスタイル */
select {
  font-family: 'Times New Roman', sans-serif;
  padding: 10px;
  border: 1px solid #ff80ab; /* ピンク色 */
  border-radius: 4px;
  font-size: 16px;
  color: #d81b60; /* ピンク色 */
  width: 150px;
  box-sizing: border-box;
  margin: 5px;
  background-color: #fff;
}

  select:hover {
      border-color: #d81b60; /* ホバー時にピンク色に */
  }

/* テキストフィールドのスタイル */
.v-text-field {
  margin: 10px 0;
}

.v-btn {
  font-family: 'Times New Roman', sans-serif;
  margin: 10px;
  font-size: 16px;
}
/* v-btn1 のスタイル変更 */
v-btn1 {
  font-family: 'Times New Roman', sans-serif;
  color: white; /* ピンク色 */
}

/* v-btn1 の選択状態のスタイル変更 */
.tab-B.is-active v-btn1 {
color: white; /* 白色 */
}

/* タブとv-btn1のアクティブ状態のスタイル変更 */
.tab-group .tab.is-active + .tab-B v-btn1 {
  color: #c2185b; /* 白色 */
}
  .v-btn:hover {
  background-color: #c2185b; /* ホバー時に少し濃いピンク色 */
}

/* データリストアイテムのスタイル */
.v-row {
  margin: 20px 0;
}

img {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px;
}

/* Fashion List Styles */
.fashion-list {
  font-family: 'Times New Roman', sans-serif;
  margin: 0;
  padding: 0;
}

.v-card {
  border-radius: 15px; /* Rounded corners */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: transform 0.3s ease-in-out;
}

  .v-card:hover {
      transform: scale(1.05); /* Slight zoom on hover */
  }

.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.v-card-subtitle {
  color: #555;
}

.v-card-text {
  font-size: 14px;
  color: #333;
}

.v-card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* カードの拡大アニメーション */
.expand {
  transform: scale(1.5); /* 拡大率を指定 */
  transition: transform 0.3s ease-in-out; /* 拡大アニメーションの速度 */
  z-index: 50; /* 前面に表示 */
}

.v-card {
  cursor: pointer; /* カーソルをポインターに */
}
