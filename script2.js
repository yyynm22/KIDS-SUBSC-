new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            tab: 0,
            userData: {
                user_id: '',
                user_name: '',
                user_pass: '',
                user_postcode: '',
                user_adress: '',
                user_telenum: ''
            },
            orderHistory: [],
            showPassword: false
        };
    },
    methods: {
        fetchUserData() {
            this.userData.user_name = sessionStorage.getItem('user_name') || '';
            this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
            this.userData.user_mail = sessionStorage.getItem('user_mail') || '';
            this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
            this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
            this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
            this.userData.user_id = sessionStorage.getItem('user_mail') || '';
            console.log('User Data:', this.userData);
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        addData() {
            window.location.href = '/index1.html';
        },
        fetchOrderHistory() {
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6')
                .then(response => {
                    console.log('API Response:', response.data);
                    if (response.data && Array.isArray(response.data)) {
                        this.orderHistory = response.data.map(order => ({
                            order_id: order.order_id,
                            total_quantity: order.total_quantity,
                            items: order.items.map(item => ({
                                product_id: item.product_id,
                                product_name: item.product_name,
                                product_category: item.product_category,
                                product_size: item.product_size,
                                product_gender: item.product_gender,
                                quantity: item.quantity,
                                product_image_url: item.URL
                            }))
                        }));
                        console.log('Order History:', this.orderHistory);
                    } else {
                        console.error('期待する形式のデータが返されていません:', response.data);
                    }
                })
                .catch(error => {
                    console.error('注文履歴の取得に失敗しました:', error);
                });
        },
        Logout() {
            window.location.href = '/index.html';
        }
    },
    mounted() {
        this.fetchUserData();
        this.fetchOrderHistory();
        console.log('Methods in Vue instance:', this.$options.methods);
    },
});
