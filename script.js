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
        async login() {
            console.log('Attempting to login with mail:', this.user_mail);

            try {
                // APIからユーザー情報を取得
                const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT');
                
                // レスポンスデータの内容を確認する
                const users = response.data;
                console.log('API response:', users);

                // `users`がオブジェクトであり、`List`プロパティを持つか確認
                if (users.List && Array.isArray(users.List)) {
                    // ユーザー情報を検索
                    const user = users.List.find(user => user.user_mail === this.user_mail && user.user_pass === this.user_pass);

                    if (user) {
                        console.log('Login successful');
                        
                        // ユーザー情報を sessionStorage に保存
                        sessionStorage.setItem('user_name', user.user_name);
                        sessionStorage.setItem('user_pass', user.user_pass);
                        sessionStorage.setItem('user_mail', user.user_mail);
                        sessionStorage.setItem('user_postcode', user.user_postcode);
                        sessionStorage.setItem('user_adress', user.user_adress);
                        sessionStorage.setItem('user_telenum', user.user_telenum);

                        // デバッグ用のログ出力
                        console.log("Saved user_name:", sessionStorage.getItem('user_name'));
                        console.log("Saved user_pass:", sessionStorage.getItem('user_pass'));
                        console.log("Saved user_mail:", sessionStorage.getItem('user_mail'));
                        console.log("Saved user_postcode:", sessionStorage.getItem('user_postcode'));
                        console.log("Saved user_adress:", sessionStorage.getItem('user_adress'));
                        console.log("Saved user_telenum:", sessionStorage.getItem('user_telenum'));

                        // ログイン成功時の処理
                        this.dialog = false;  // ダイアログを閉じる
                        // 次のページにリダイレクト
                        window.location.href = 'https://www.google.co.jp/';
                    } else {
                        console.log('Invalid user_mail or user_pass');
                        // エラーメッセージを表示するなどの処理
                    }
                } else {
                    console.error('User data is not an array:', users);
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
