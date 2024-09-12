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
            this.userData.user_id = sessionStorage.getItem('user_id') || '';
            this.userData.user_name = sessionStorage.getItem('user_name') || '';
            this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
            this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
            this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
            this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
        },
        fetchOrderHistory() {
            // ユーザーIDに基づいて注文履歴を取得
            const userId = this.userData.user_id;
            
            if (userId) {
                axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4', {
                    params: {
                        user_id: userId // ユーザーIDをAPIに送信
                    }
                })
                .then(response => {
                    // ユーザーIDに紐付いた注文履歴を取得して表示
                    const orders = response.data.List.filter(order => order.user_id === Number(userId));
                    
                    // フィルタリングされた注文データを整形して表示
                    this.orderHistory = orders.map(order => ({
                        order_id: order.order_id,
                        total_quantity: order.quantity,
                        items: [{
                            product_id: order.product_id,
                            product_name: '', // 後で取得する商品情報
                            product_category: '',
                            product_size: order.product_size,
                            product_gender: '',
                            product_image_url: '' // 画像URLを後で設定
                        }]
                    }));
                    
                    // 商品情報を別APIから取得
                    this.orderHistory.forEach(order => {
                        order.items.forEach(item => {
                            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT5', {
                                params: {
                                    product_id: item.product_id
                                }
                            })
                            .then(response => {
                                const product = response.data.List[0];
                                item.product_name = product.product_name;
                                item.product_category = product.product_category;
                                item.product_gender = product.product_gender;
                                item.product_image_url = product.URL;
                            });
                        });
                    });
                })
                .catch(error => {
                    console.error('注文履歴の取得に失敗しました:', error);
                });
            } else {
                console.error('ユーザーIDがありません');
            }
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        Logout() {
            // ログアウト処理
            sessionStorage.clear();
            window.location.href = 'login.html'; // ログイン画面に遷移
        },
        addData() {
            // HOMEボタンの動作 (例: 注文ページに遷移)
            window.location.href = 'order.html';
        }
    },
    mounted() {
        this.fetchUserData(); // ユーザーデータをセッションから取得
        this.fetchOrderHistory(); // 注文履歴を取得
    }
});
