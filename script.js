const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        // ログイン機能用のデータ
        dialog: false,
        user_mail: '',
        user_pass: '',
        errorMessage: '',  // エラーメッセージ用のデータ
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

                // usersがオブジェクトであり、Listプロパティを持つか確認
                if (users.List && Array.isArray(users.List)) {
                    console.log('User data (List):', users.List);

                    // ユーザー情報を検索
                    const user = users.List.find(user => user.user_mail.trim() === this.user_mail.trim() && user.user_pass === this.user_pass);

                    if (user) {
                        console.log('Login successful');
                        
                        // ユーザー情報を sessionStorage に保存
                        sessionStorage.setItem('user_id', user.user_id);
                        sessionStorage.setItem('user_name', user.user_name);
                        sessionStorage.setItem('user_pass', user.user_pass);
                        sessionStorage.setItem('user_mail', user.user_mail);
                        sessionStorage.setItem('user_postcode', user.user_postcode);
                        sessionStorage.setItem('user_adress', user.user_adress);
                        sessionStorage.setItem('user_telenum', user.user_telenum);

                        // デバッグ用のログ出力
                        console.log("Saved user_id:", sessionStorage.getItem('user_id'));
                        console.log("Saved user_name:", sessionStorage.getItem('user_name'));
                        console.log("Saved user_pass:", sessionStorage.getItem('user_pass'));
                        console.log("Saved user_mail:", sessionStorage.getItem('user_mail'));
                        console.log("Saved user_postcode:", sessionStorage.getItem('user_postcode'));
                        console.log("Saved user_adress:", sessionStorage.getItem('user_adress'));
                        console.log("Saved user_telenum:", sessionStorage.getItem('user_telenum'));

                        // ログイン成功時の処理
                        this.dialog = false;  // ダイアログを閉じる
                        this.errorMessage = '';  // エラーメッセージをクリア

                        // メールアドレスに＠が含まれる場合とIDが数字である場合の処理
                        if (this.user_mail.includes('@')) {
                            window.location.href = '/index.html';
                        } else if (!isNaN(this.user_mail)) {
                            window.location.href = '/index4.html';
                        } else {
                            this.errorMessage = 'ログイン情報が無効です。';  // エラーメッセージを設定
                        }
                    } else {
                        console.log('Invalid user_mail or user_pass');
                        this.errorMessage = 'ユーザーIDまたはパスワードが間違っています。';  // エラーメッセージを設定
                    }
                } else {
                    console.error('User data is not an array:', users);
                    this.errorMessage = 'ユーザー情報の取得に失敗しました。';  // エラーメッセージを設定
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                this.errorMessage = 'サーバーエラーが発生しました。';  // エラーメッセージを設定
            }
        }
    }
});
