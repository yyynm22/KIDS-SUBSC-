const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        // ログイン機能用のデータ
        dialog1: false,
        dialog2: false,
        user_mail: '',
        user_pass: '',
        usererrorMessage: '',  // エラーメッセージ用のデータ
        employee_name:'',
        employee_pass:'',
        employeeerrorMessage: '',  // エラーメッセージ用のデータ
        errorMessage: ''
    },
    methods: {
        async login1() {
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
                        this.dialog1 = false;  // ダイアログを閉じる
                        this.usererrorMessage = '';  // エラーメッセージをクリア
                        // 次のページにリダイレクト
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
                // APIからユーザー情報を取得
                const response = await axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT2');
                
                // レスポンスデータの内容を確認する
                const employees = response.data;
                console.log('API response:', employees);
  
                // usersがオブジェクトであり、Listプロパティを持つか確認
                if (employees.List && Array.isArray(employees.List)) {
                    console.log('Employee data (List):', employees.List);
  
                    // ユーザー情報を検索
                    const employee = employees.List.find(employee => employee.employee_name.trim() === this.employee_name.trim() && employee.employee_pass === this.employee_pass);
  
                    if (employee) {
                        console.log('Login successful');
                        
                        // ユーザー情報を sessionStorage に保存
                        sessionStorage.setItem('employee_id', employee.employee_id);
                        sessionStorage.setItem('employee_name', employee.employee_name);
                        sessionStorage.setItem('employee_pass', employee.employee_pass);
                        
  
                        // デバッグ用のログ出力
                        console.log("Saved employee_id:", sessionStorage.getItem('employee_id'));
                        console.log("Saved employee_name:", sessionStorage.getItem('employee_name'));
                        console.log("Saved employee_pass:", sessionStorage.getItem('employee_pass'));
                        
                        // ログイン成功時の処理
                        this.dialog2 = false;  // ダイアログを閉じる
                        this.employeeerrorMessage = '';  // エラーメッセージをクリア
                        // 次のページにリダイレクト
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
  startAutoPlay();
