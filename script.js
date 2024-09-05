const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        // ログイン機能用のデータ
        dialog: false,
        user_mail: '',
        user_pass: '',
    },
    methods: {
        // ログインメソッド
        async login() {
            console.log('Attempting to login with mail:', this.user_mail);

            try {
                // APIからユーザー情報を取得
                const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT');
                const users = response.data;

                // ユーザー情報を検索
                const user = users.find(user => user.user_mail === this.user_mail && user.user_pass === this.user_pass);

                if (user) {
                    console.log('Login successful');
                    // ログイン成功時の処理
                    this.dialog = false;  // ダイアログを閉じる
                    // 次のページにリダイレクト
                    window.location.href = 'https://www.google.co.jp/';
                } else {
                    console.log('Invalid user_mail or user_pass');
                    // エラーメッセージを表示するなどの処理
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // エラーメッセージを表示するなどの処理
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
