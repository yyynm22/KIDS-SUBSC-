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

                        this.dialog1 = false;  // ダイアログを閉じる
                        this.usererrorMessage = '';  // エラーメッセージをクリア
                        window.location.href = '/index1.html';
                    } else {
                        console.log('Invalid user_mail or user_pass');
                        this.usererrorMessage = 'ユーザーIDまたはパスワードが間違っています。';
                    }
                } else {
                    console.error('User data is not an array:', users);
                    this.usererrorMessage = 'ユーザー情報の取得に失敗しました。';
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                this.usererrorMessage = 'サーバーエラーが発生しました。';
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
                        this.employeeerrorMessage = 'ユーザーIDまたはパスワードが間違っています。';
                    }
                } else {
                    console.error('User data is not an array:', employees);
                    this.employeeerrorMessage = 'ユーザー情報の取得に失敗しました。';
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                this.employeeerrorMessage = 'サーバーエラーが発生しました。';
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
const indicatorLi = indicator.getElementsByTagName('li');

let count = 0;
const imageLength = slide.children.length - 1;
let isChanging = false;
let slideTimer;

function playSlider() {
    slideTimer = setInterval(showNext, 5000);
}

function stopSlider() {
    clearInterval(slideTimer);
}

function showNext() {
    if (isChanging) return;
    isChanging = true;
    slide.children[count].classList.remove('show');
    indicatorLi[count].classList.remove('active');
    count++;
    if (count > imageLength) {
        count = 0;
    }
    slide.children[count].classList.add('show');
    indicatorLi[count].classList.add('active');
    setTimeout(function () {
        isChanging = false;
    }, 600);
}

function showPrev() {
    if (isChanging) return;
    isChanging = true;
    slide.children[count].classList.remove('show');
    indicatorLi[count].classList.remove('active');
    count--;
    if (count < 0) {
        count = imageLength;
    }
    slide.children[count].classList.add('show');
    indicatorLi[count].classList.add('active');
    setTimeout(function () {
        isChanging = false;
    }, 600);
}

next.addEventListener('click', showNext, false);
prev.addEventListener('click', showPrev, false);

indicator.addEventListener('click', function (e) {
    if (isChanging) return;
    isChanging = true;
    slide.children[count].classList.remove('show');
    indicatorLi[count].classList.remove('active');

    const indicators = Array.prototype.slice.call(indicatorLi);
    count = indicators.indexOf(e.target);
    slide.children[count].classList.add('show');
    indicatorLi[count].classList.add('active');
    setTimeout(function () {
        isChanging = false;
    }, 600);
});

slide.addEventListener('mouseenter', stopSlider, false);
slide.addEventListener('mouseleave', playSlider, false);

playSlider();
