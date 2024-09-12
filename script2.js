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
            this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
            this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
            this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
            this.userData.user_id = sessionStorage.getItem('user_id') || ''; // 修正
            console.log('User Data:', this.userData);
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        addData() {
            window.location.href = '/index1.html';
        },
        fetchOrderHistory() {
            const userId = this.userData.user_id; // ログインユーザーのIDを取得
            
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6')
                .then(select6Response => {
                    const orderList = select6Response.data.List;
                    const orderIds = orderList.map(order => order.order_id);

                    // 各order_idに対してSELECT4を呼び出す
                    const select4Promises = orderIds.map(order_id =>
                        axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4', {
                            params: { order_id, user_id: userId } // ユーザーIDをパラメーターとして追加
                        })
                    );

                    return Promise.all(select4Promises).then(select4Responses => {
                        const orderDetails = select4Responses.map((response, index) => {
                            const order_id = orderIds[index];
                            const cartItems = response.data.List || []; // カートのアイテムがない場合は空配列

                            let totalQuantity = 0;
                            cartItems.forEach(item => {
                                totalQuantity += item.quantity;
                            });

                            // 各カートアイテムに対応する商品情報を取得する
                            const productPromises = cartItems.map(item =>
                                axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3', {
                                    params: { product_id: item.product_id }
                                }).then(productResponse => {
                                    const productData = productResponse.data.List[0]; // 商品情報の1件目を使用
                                    return {
                                        ...item,
                                        product_name: productData.product_name,
                                        product_category: productData.product_category,
                                        product_gender: productData.product_gender,
                                        product_image_url: productData.URL
                                    };
                                })
                            );

                            return Promise.all(productPromises).then(itemsWithProductInfo => {
                                return {
                                    order_id,
                                    total_quantity: totalQuantity,
                                    items: itemsWithProductInfo
                                };
                            });
                        });

                        return Promise.all(orderDetails);
                    });
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
