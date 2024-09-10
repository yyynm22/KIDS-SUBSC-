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
        
        const users = response.data;
        console.log('API response:', users);

        if (users.List && Array.isArray(users.List)) {
            console.log('User data (List):', users.List);

            const user = users.List.find(user => user.user_mail.trim() === this.user_mail.trim() && user.user_pass === this.user_pass);

            if (user) {
                console.log('Login successful');
                
                // ユーザー情報を sessionStorage に保存
                sessionStorage.setItem('user_id', user.user_id);
                console.log("Saved user_id:", sessionStorage.getItem('user_id'));  // 保存された user_id を確認

                // 他のユーザー情報も保存
                sessionStorage.setItem('user_name', user.user_name);
                sessionStorage.setItem('user_pass', user.user_pass);
                sessionStorage.setItem('user_mail', user.user_mail);
                sessionStorage.setItem('user_postcode', user.user_postcode);
                sessionStorage.setItem('user_adress', user.user_adress);
                sessionStorage.setItem('user_telenum', user.user_telenum);

                // ログイン成功時の処理
                this.dialog = false;
                window.location.href = '/index1.html';
            } else {
                console.log('Invalid user_mail or user_pass');
            }
        } else {
            console.error('User data is not an array:', users);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
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
