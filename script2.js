new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            tab: 0, // 初期タブ
            userData: {
                user_id: '',
                user_name: '',
                user_pass: '',
                user_postcode: '',
                user_adress: '',
                user_telenum: ''
            }, // ログインユーザーの会員登録情報を格納するオブジェクト
            showPassword: false, // パスワードの表示・非表示を制御するフラグ
            orderHistory: [] // 注文履歴を格納する配列
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

            this.fetchOrderHistory();
        },
        fetchOrderHistory() {
            const userId = this.userData.user_id;
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4', {
                params: { user_id: userId }
            })
            .then(response => {
                const orders = response.data;

                orders.forEach(order => {
                    axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6', {
                        params: { order_id: order.order_id }
                    })
                    .then(detailResponse => {
                        const details = detailResponse.data;

                        details.forEach(detail => {
                            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3', {
                                params: { product_id: detail.product_id }
                            })
                            .then(productResponse => {
                                const product = productResponse.data[0];
                                this.orderHistory.push({
                                    order_id: order.order_id,
                                    total_quantity: detail.quantity,
                                    product_name: product.product_name,
                                    product_category: product.product_category,
                                    product_size: order.product_size,
                                    product_gender: product.product_gender,
                                    quantity: detail.quantity,
                                    product_url: product.URL
                                });
                            });
                        });
                    });
                });
            })
            .catch(error => {
                console.error('注文履歴の取得に失敗しました:', error);
            });
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        addData() {
            window.location.href = '/index1.html';
        },
    },
    mounted() {
        this.fetchUserData();
    },
});
