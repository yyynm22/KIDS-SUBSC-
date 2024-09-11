const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        dialog: false,
        user_mail: '',
        user_pass: '',
        error_message: '',  // エラーメッセージ用のデータ
        slideIndex: 0, // スライドの現在のインデックス
    },
    methods: {
        async login() {
            console.log('Attempting to login with mail:', this.user_mail);
  
            try {
                const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT');
                const users = response.data;
                console.log('API response:', users);
  
                if (users.List && Array.isArray(users.List)) {
                    console.log('User data (List):', users.List);
  
                    const user = users.List.find(user => user.user_mail.trim() === this.user_mail.trim() && user.user_pass === this.user_pass);
  
                    if (user) {
                        console.log('Login successful');
                        sessionStorage.setItem('user_id', user.user_id);
                        sessionStorage.setItem('user_name', user.user_name);
                        sessionStorage.setItem('user_pass', user.user_pass);
                        sessionStorage.setItem('user_mail', user.user_mail);
                        sessionStorage.setItem('user_postcode', user.user_postcode);
                        sessionStorage.setItem('user_adress', user.user_adress);
                        sessionStorage.setItem('user_telenum', user.user_telenum);
  
                        console.log("Saved user_id:", sessionStorage.getItem('user_id'));
                        console.log("Saved user_name:", sessionStorage.getItem('user_name'));
                        console.log("Saved user_pass:", sessionStorage.getItem('user_pass'));
                        console.log("Saved user_mail:", sessionStorage.getItem('user_mail'));
                        console.log("Saved user_postcode:", sessionStorage.getItem('user_postcode'));
                        console.log("Saved user_adress:", sessionStorage.getItem('user_adress'));
                        console.log("Saved user_telenum:", sessionStorage.getItem('user_telenum'));
  
                        this.dialog = false;
                        window.location.href = '/index1.html';
                    } else {
                        console.log('Invalid user_mail or user_pass');
                        this.error_message = 'ユーザーIDまたはパスワードが間違っています。';
                    }
                } else {
                    console.error('User data is not an array:', users);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                this.error_message = 'ログイン中にエラーが発生しました。';
            }
        },
        // スライドを進める関数
        nextSlide() {
            this.slideIndex = (this.slideIndex + 1) % 3; // スライド数に応じて変更
            this.updateSlide();
        },
        // スライドを戻す関数
        prevSlide() {
            this.slideIndex = (this.slideIndex - 1 + 3) % 3; // スライド数に応じて変更
            this.updateSlide();
        },
        // スライドの表示を更新する関数
        updateSlide() {
            const slides = document.querySelector('.slide');
            slides.style.transform = `translateX(-${this.slideIndex * 100}%)`;
        },
        // 自動再生機能を開始する関数
        startSlideShow() {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 3000); // 3秒ごとにスライドを変更
        },
        // 自動再生機能を停止する関数
        stopSlideShow() {
            clearInterval(this.slideInterval);
        }
    },
    mounted() {
        // ページがロードされたときに自動再生を開始
        this.startSlideShow();
        
        // スライドの左右ボタンにイベントリスナーを追加
        document.getElementById('next').addEventListener('click', this.nextSlide);
        document.getElementById('prev').addEventListener('click', this.prevSlide);
    },
    beforeDestroy() {
        // コンポーネントが破棄される前に自動再生を停止
        this.stopSlideShow();
    }
});
