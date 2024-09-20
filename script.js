const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        // ログイン機能用のデータ
        dialog1: false,
        dialog2: false,
        dialog3: false,  // 新規登録ダイアログ
        user_mail: '',
        user_pass: '',
        usererrorMessage: '',  // エラーメッセージ用のデータ
        employee_name: '',
        employee_pass: '',
        employeeerrorMessage: '',  // エラーメッセージ用のデータ
        errorMessage: '',

        // 登録用のデータ
        register_name: '',
        register_mail: '',
        register_pass: '',
        register_confirm_pass: '',  // パスワード確認用
        register_postcode: '',
        register_adress: '',
        register_telenum: '',
        registerErrorMessages: [],  // エラーメッセージの配列
        showPassword: false,  // パスワード表示切り替え用
    },
        methods: {
          
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
           
        validateEmail() {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // メールアドレスの基本形式
            if (!regex.test(this.register_mail)) {
                this.registerErrorMessages.push('メールアドレスの形式が正しくありません。');
                return false;
            }
            return true;
        },scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // スムーズにスクロール
    });
  },   
        validatePostcode() {
            const regex = /^[0-9]{7}$/; // 郵便番号は7桁の数字
            if (!regex.test(this.register_postcode)) {
                this.registerErrorMessages.push('郵便番号は7桁の数字で入力してください。');
                return false;
            }
            return true;
        },
        validateTelenum() {
            const regex = /^[0-9]{10,11}$/; // 電話番号は10～11桁の数字
            if (!regex.test(this.register_telenum)) {
                this.registerErrorMessages.push('電話番号は10～11桁の数字で入力してください。');
                return false;
            }
            return true;
        },
        validatePassword() {
            const pass = this.register_pass;
            const confirmPass = this.register_confirm_pass;
            const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;  // 8文字以上、アルファベットと数字を含むパスワード
            if (!regex.test(pass)) {
                this.registerErrorMessages.push('パスワードは8文字以上で、アルファベットと数字の両方を含める必要があります。');
                return false;
            }
            if (pass !== confirmPass) {
                this.registerErrorMessages.push('パスワードが一致しません。');
                return false;
            }
            return true;
        },
        validateForm() {
            this.registerErrorMessages = [];  // エラーメッセージをリセット
            let isValid = true;
            if (!this.validateEmail()) isValid = false;
            if (!this.validatePassword()) isValid = false;
            if (!this.validatePostcode()) isValid = false;
            if (!this.validateTelenum()) isValid = false;
            return isValid;
        },
        async register() {
            if (!this.validateForm()) {
                return;
            }

            console.log('Attempting to register new user:', this.register_mail);
            try {
                const response = await axios.post('https://m3h-yuunaminagawa.azurewebsites.net/api/INSERT', {
                    user_name: this.register_name,
                    user_pass: this.register_pass,
                    user_mail: this.register_mail,
                    user_postcode: this.register_postcode,
                    user_adress: this.register_adress,
                    user_telenum: this.register_telenum
                });
                console.log('Registration successful:', response.data);
                this.dialog3 = false;
                alert('登録が完了しました！');
            } catch (error) {
                console.error('Error during registration:', error);
                this.registerErrorMessages.push('登録に失敗しました。サーバーエラーが発生しました。');
            }
        },
        async login1() {
            console.log('Attempting to login with mail:', this.user_mail);

            try {
                // APIからユーザー情報を取得
                const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT');

                // レスポンスデータの内容を確認する
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

                        this.dialog1 = false;  // ダイアログを閉じる
                        this.usererrorMessage = '';  // エラーメッセージをクリア
                        window.location.href = '/index1.html';
                    } else {
                        console.log('Invalid user_mail or user_pass');
                        this.usererrorMessage = 'ユーザーIDまたはパスワードが間違っています。';  // エラーメッセージを設定
                    }
                } else {
                    console.error('User data is not an array:', users);
                    this.usererrorMessage = 'ユーザー情報の取得に失敗しました。';  // エラーメッセージを設定
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                this.usererrorMessage = 'サーバーエラーが発生しました。';  // エラーメッセージを設定
            }
        },

        async login2() {
            console.log('Attempting to login with name:', this.employee_name);

            try {
                const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT2');
                const employees = response.data;
                console.log('API response:', employees);

                if (employees.List && Array.isArray(employees.List)) {
                    console.log('Employee data (List):', employees.List);

                    const employee = employees.List.find(employee => employee.employee_name.trim() === this.employee_name.trim() && employee.employee_pass === this.employee_pass);

                    if (employee) {
                        console.log('Login successful');

                        sessionStorage.setItem('employee_id', employee.employee_id);
                        sessionStorage.setItem('employee_name', employee.employee_name);
                        sessionStorage.setItem('employee_pass', employee.employee_pass);

                        this.dialog2 = false;  // ダイアログを閉じる
                        this.employeeerrorMessage = '';  // エラーメッセージをクリア
                        window.location.href = '/index4.html';
                    } else {
                        console.log('Invalid employee_name or employee_pass');
                        this.employeeerrorMessage = 'ユーザーIDまたはパスワードが間違っています。';  // エラーメッセージを設定
                    }
                } else {
                    console.error('User data is not an array:', employees);
                    this.employeeerrorMessage = 'ユーザー情報の取得に失敗しました。';  // エラーメッセージを設定
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                this.employeeerrorMessage = 'サーバーエラーが発生しました。';  // エラーメッセージを設定
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

const slide = document.getElementById('slide');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const indicator = document.getElementById('indicator');
const lists = document.querySelectorAll('.list');
const totalSlides = lists.length;
let count = 0;
let autoPlayInterval;

function updateListBackground() {
    for (let i = 0; i < lists.length; i++) {
        lists[i].style.backgroundColor = i === count % totalSlides ? '#000' : '#fff';
    }
}

function nextClick() {
    slide.classList.remove(`slide${count % totalSlides + 1}`);
    count++;
    slide.classList.add(`slide${count % totalSlides + 1}`);
    updateListBackground();
}

function prevClick() {
    slide.classList.remove(`slide${count % totalSlides + 1}`);
    count--;
    if (count < 0) count = totalSlides - 1;
    slide.classList.add(`slide${count % totalSlides + 1}`);
    updateListBackground();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(nextClick, 3000);
}

function resetAutoPlayInterval() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

next.addEventListener('click', () => {
    nextClick();
    resetAutoPlayInterval();
});

prev.addEventListener('click', () => {
    prevClick();
    resetAutoPlayInterval();
});

indicator.addEventListener('click', (event) => {
    if (event.target.classList.contains('list')) {
        const index = Array.from(lists).indexOf(event.target);
        slide.classList.remove(`slide${count % totalSlides + 1}`);
        count = index;
        slide.classList.add(`slide${count % totalSlides + 1}`);
        updateListBackground();
        resetAutoPlayInterval();
    }
});

