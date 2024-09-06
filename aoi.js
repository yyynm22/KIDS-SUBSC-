new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            tab: 0, // 初期タブを設定
        };
    },
    methods: {
        addData() {
            // Home ボタンのクリック処理
            alert('Home ボタンがクリックされました。');
        },
    },
});