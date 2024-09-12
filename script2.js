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
                        const cartItems = response.data.List || [];  // cartItemsが存在しない場合は空配列を使用
        
                        let totalQuantity = 0;
                        cartItems.forEach(item => {
                            totalQuantity += item.quantity;
                        });
        
                        orderDetails.push({
                            order_id,
                            total_quantity: totalQuantity,
                            cartItems
                        });
        
                        const productPromises = cartItems.map(item =>
                            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3', {
                                params: { product_id: item.product_id }
                            })
                        );
        
                        return Promise.all(productPromises).then(productResponses => {
                            productResponses.forEach((productResponse, i) => {
                                cartItems[i].productInfo = productResponse.data;
                            });
                        });
                    });
        
                    return orderDetails;
                })
                .then(orderHistory => {
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
