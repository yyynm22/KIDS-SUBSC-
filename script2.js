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
            // SELECT6の呼び出し
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6')
                .then(select6Response => {
                    const orderList = select6Response.data.List;
                    const orderIds = orderList.map(order => order.order_id);

                    // 各order_idに対してSELECT4を呼び出す
                    const select4Promises = orderIds.map(order_id =>
                        axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4', {
                            params: { order_id }
                        })
                    );

                    return Promise.all(select4Promises);
                })
                .then(select4Responses => {
                    const orderDetails = [];

                    select4Responses.forEach((response, index) => {
                        const order_id = response.config.params.order_id;
                        const cartItems = response.data.List;

                        // 各商品ごとにSELECT3を呼び出して商品情報を取得
                        const productPromises = cartItems.map(item =>
                            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3', {
                                params: { product_id: item.product_id }
                            })
                        );

                        orderDetails.push({
                            order_id,
                            cartItems
                        });

                        return Promise.all(productPromises).then(productResponses => {
                            productResponses.forEach((productResponse, index) => {
                                const productInfo = productResponse.data;
                                orderDetails[index].cartItems[index].productInfo = productInfo;
                            });
                        });
                    });

                    return orderDetails;
                })
                .then(orderHistory => {
                    // フロントエンドで取得したデータを使用して注文履歴を更新
                    this.orderHistory = orderHistory;
                    console.log('Order History:', this.orderHistory);
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
