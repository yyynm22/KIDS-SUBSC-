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
            // sessionStorageからユーザー情報を取得し、存在するか確認する
            this.userData.user_name = sessionStorage.getItem('user_name') || '';
            this.userData.user_pass = sessionStorage.getItem('user_pass') || '';
            this.userData.user_mail = sessionStorage.getItem('user_mail') || '';
            this.userData.user_postcode = sessionStorage.getItem('user_postcode') || '';
            this.userData.user_adress = sessionStorage.getItem('user_adress') || '';
            this.userData.user_telenum = sessionStorage.getItem('user_telenum') || '';
            
            // 任意でuser_idを設定（ここではメールアドレスを使用）
            this.userData.user_id = sessionStorage.getItem('user_mail') || '';

            // 取得したデータをコンソールで確認
            console.log('User Data:', this.userData);
        },
        fetchOrderHistory() {
            // 注文履歴のデータをAPIから取得
            const userId = this.userData.user_id; // ユーザーIDを使用して注文履歴を取得
            axios
                .get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT4?user_id=${userId}`)
                .then((response) => {
                    // APIから取得したデータを注文履歴に格納
                    const orders = response.data;
                    const orderDetailsPromises = orders.map((order) => {
                        return axios
                            .get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT6?order_id=${order.order_id}`)
                            .then((res) => {
                                const products = res.data.map((detail) => {
                                    return axios
                                        .get(`https://m3h-yuunaminagawa.azurewebsites.net/api/SELECT3?product_id=${detail.product_id}`)
                                        .then((productRes) => ({
                                            ...productRes.data[0],
                                            product_size: detail.product_size,
                                            quantity: detail.quantity
                                        }));
                                });
                                return Promise.all(products).then((products) => ({
                                    ...order,
                                    products,
                                    total_quantity: products.reduce((sum, prod) => sum + prod.quantity, 0)
                                }));
                            });
                    });
                    Promise.all(orderDetailsPromises).then((orderHistory) => {
                        this.orderHistory = orderHistory;
                    });
                })
                .catch((error) => {
                    console.error('注文履歴の取得に失敗しました:', error);
                });
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        addData() {
            // 商品の検索画面に遷移
            window.location.href = '/index1.html';
        },
    },
    mounted() {
        // マウント時にユーザーデータと注文履歴を取得
        this.fetchUserData();
        this.fetchOrderHistory();
    },
});
