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
            orderHistory: [], // 注文履歴を格納する配列
            showPassword: false // パスワードの表示・非表示を制御するフラグ
        };
    },
    methods: {
        fetchUserData() {
            // sessionStorageからユーザー情報を取得し、存在するか確認する
            this.userData.user_id = sessionStorage.getItem('user_id') || ''; // ユーザーIDを取得
            this.userData.user_name = sessionStorage.getItem('user_name') || '';
            this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
            this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
            this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
            this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        addData() {
            // 商品の検索画面に遷移
            window.location.href = '/index1.html';
        },
        fetchOrderHistory() {
            const userId = this.userData.user_id;

            // 注文履歴の取得
            axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4', {
                params: { user_id: userId } // ユーザーIDをパラメーターとして渡す
            })
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    const orderPromises = response.data.map(order => {
                        return axios.get('https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6', {
                            params: { order_id: order.order_id } // 注文IDをパラメーターとして渡す
                        }).then(orderDetailResponse => {
                            return {
                                ...order,
                                total_quantity: orderDetailResponse.data.total_quantity,
                                items: orderDetailResponse.data.items.map(item => ({
                                    product_id: item.product_id,
                                    product_name: item.product_name,
                                    product_category: item.product_category,
                                    product_size: item.product_size,
                                    product_gender: item.product_gender,
                                    quantity: item.quantity,
                                    product_image_url: item.URL
                                }))
                            };
                        });
                    });

                    Promise.all(orderPromises).then(orderHistory => {
                        this.orderHistory = orderHistory;
                    });
                } else {
                    console.error('期待する形式のデータが返されていません:', response.data);
                }
            })
            .catch(error => {
                console.error('注文履歴の取得に失敗しました:', error);
            });
        }
    },
    mounted() {
        // マウント時にユーザーデータを取得
        this.fetchUserData();
        
        // マウント時に注文履歴を取得
        this.fetchOrderHistory();
    },
});
