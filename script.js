<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>kidssubsc</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css">
    <link rel="stylesheet" href="https://unpkg.com/@mdi/font@6.x/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900">
    <link rel="stylesheet" href="./style.css">
    <style>
        .slide-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }
        .slide {
            display: flex;
            overflow: hidden;
            scroll-behavior: smooth;
        }
        .slide img {
            width: 100%;
            height: auto;
        }
        .new-sections {
            padding: 20px;
            background: #f4f4f4;
            border-top: 1px solid #ddd;
        }
        .new-sections h2 {
            font-size: 1.5rem;
            margin-bottom: 10px;
        }
        .new-sections p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <!-- Vueで指定された"app"要素、この中でのみVueが有効 -->
    <div id="app">
        <v-app>
            <!-- ヘッダー -->
            <v-app-bar app class="custom-font" color="#FFF8DC">
                <v-spacer></v-spacer>
                <v-toolbar-title class="centered-title">Kids Sabsc</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn v-on:click="dialog3 = true" dark color="#90c8f0" rounded class="custom-font" style="margin-right: 5mm;">
                    Sign up
                    <v-icon start>
                        mdi-account-plus
                    </v-icon>
                </v-btn>
                
                <v-btn v-on:click="dialog1 = true" dark color="#f09199" rounded class="custom-font">
                    Login
                    <v-icon start>
                        mdi-pencil
                    </v-icon>
                </v-btn>
            </v-app-bar>
　　　　　　　
<!-- 新規登録-->
<!-- 新規登録-->
<v-dialog v-model="dialog3" max-width="400" class="custom-font">
    <v-card>
        <v-card-title class="headline1" class="custom-font">Sign Up</v-card-title>
        <v-card-text>
            <!-- エラーメッセージ表示 (配列ベースのエラーメッセージ) -->
            <v-alert v-if="registerErrorMessages.length" type="error" dismissible class="custom-font">
                <ul>
                    <li v-for="(message, index) in registerErrorMessages" :key="index">{{ message }}</li>
                </ul>
            </v-alert>

            <!-- Name入力フィールド -->
            <v-text-field v-model="register_name" label="Name" outlined class="custom-font"></v-text-field>

            <!-- メールアドレス入力フィールド -->
            <v-text-field v-model="register_mail" label="Email address" outlined class="custom-font"></v-text-field>
            <v-alert type="info" border="left" dense text class="custom-font">
                正しいメールアドレスの形式でご入力ください。
            </v-alert>
            
            <!-- パスワード入力フィールド -->
            <v-text-field 
                v-model="register_pass" 
                :type="showPassword ? 'text' : 'password'" 
                label="Password" 
                outlined
                append-icon="mdi-eye"
                @click:append="togglePasswordVisibility"
                class="custom-font"
            ></v-text-field>

            <!-- パスワード確認用フィールド -->
            <v-text-field 
                v-model="register_confirm_pass" 
                :type="showPassword ? 'text' : 'password'" 
                label="Confirm Password" 
                outlined
                append-icon="mdi-eye"
                @click:append="togglePasswordVisibility"
                class="custom-font"
            ></v-text-field>

            <v-alert type="info" border="left" dense text class="custom-font">
                パスワードは8文字以上で、英字と数字を含めてください。
            </v-alert>

            <!-- 郵便番号入力フィールド -->
            <v-text-field v-model="register_postcode" label="Postcode" outlined class="custom-font"></v-text-field>
            <v-alert type="info" border="left" dense text class="custom-font">
                ハイフンなしで7桁の数字をご入力ください。
            </v-alert>

            <!-- 住所入力フィールド -->
            <v-text-field v-model="register_adress" label="Address" outlined class="custom-font"></v-text-field>

            <!-- 電話番号入力フィールド -->
            <v-text-field v-model="register_telenum" label="Phone Number" outlined class="custom-font"></v-text-field>
            <v-alert type="info" border="left" dense text class="custom-font">
                ハイフンなしで10～11桁の数字をご入力ください。
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="register" class="custom-font" dark color="#f09199" rounded>Sign Up</v-btn>
            <v-btn @click="dialog3 = false" class="custom-font" color="#90c8f0" rounded dark>Cancel</v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
           
            <!-- ログインダイアログ -->
            <v-dialog v-model="dialog1" max-width="400">
            <v-card>
                <v-card-title class="headline1" class="custom-font">Login</v-card-title>
                <v-card-text>
                    <!-- エラーメッセージ表示 -->
                    <v-alert v-if="usererrorMessage" type="error" dismissible class="custom-font">
                        {{ usererrorMessage }}
                    </v-alert>
                    <v-text-field v-model="user_mail" label="Email　address" outlined class="custom-font"></v-text-field>
                    <v-text-field
                        v-model="user_pass"
                        label="Password"
                        type="password"
                        outlined
append-icon="mdi-eye"
                @click:append="togglePasswordVisibility"
                        class="custom-font"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="login1" class="custom-font" dark color="#f09199" rounded>Login</v-btn>
                    <v-btn @click="dialog1 = false" class="custom-font" color="#90c8f0" rounded dark>Cancel</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>


            <!-- スライドの外枠 -->
            <div class="slide-wrapper">
                <!-- スライド（コンテンツ） -->
                <div id="slide" class="slide">
                  <div>
                        <img src="https://i.gyazo.com/a1ddf4148c23793c1d808bc0cdd4c44d.png">  
                  </div>
                  <div>
                       <img src="https://i.gyazo.com/5d7c20184878cde19b60220038b72003.png">  
                  </div>
                  <div>
                       <img src="https://i.gyazo.com/ebd7cebf83b85c1718ce7ae671532fe6.jpg">  
                  </div>
                </div>
                <!-- 左右のボタン -->
                <span id="prev" class="prev"></span>
                <span id="next" class="next"></span>
                <!-- インジケーター -->
                <ul class="indicator" id="indicator">
                  <li class="list"></li>
                  <li class="list"></li>
                  <li class="list"></li>
                </ul>
            </div>

            <!-- 新しいセクション -->
            <div class="explanation" class="custom-font">
                <h2>「毎日がもっと楽しく、もっと便利に。お子様の成長をサポートするサブスクリプションサービス」</h2>
                <p>私たちのサブスクリプションサービスは、<br>
                    お子様の成長に合わせた高品質な用品を毎月お届けします。<br>
                    忙しいパパママにも安心してご利用いただけるよう、厳選された商品をお手元にお届け。<br>
                    お子様にぴったりのアイテムが、自動で届く便利さを是非体験してください。
                </p>
            </div>
            
            <!--利用フロー-->
             <ul class="flow" class="custom-font">
                <li>
                  <dl>
                    <dt><span class="icon">STEP.01</span>借りたい服を注文</dt>
                    <dd>各種ボタン押下によりログインが必要！新規会員登録もできるよ！</dd>
                  </dl>
                </li>
              
                <li>
                  <dl>
                    <dt><span class="icon">STEP.02</span>好きなだけ着る</dt>
                    <dd>返却期限はないので飽きるまで着てください！</dd>
                  </dl>
                </li>
              
                <li>
                  <dl>
                    <dt><span class="icon">STEP.03</span>返却し、新しい洋服を借りる</dt>
                    <dd>新しいお洋服を着て、たくさんお出かけしてね！</dd>
                  </dl>
                </li>
              
              </ul>
            
            <div class="plan" class="custom-font">
                <h2>借りられる商品数: 1回のご利用で最大5点まで<br>
                    配送: 月に1回、お手元にお届けします<br>
                    交換: ご希望の商品を新しいものと交換することができます
                </h2>
                <p>
                    注意事項<br>
                    商品は返却後、次のお客様に再利用されます。清潔で良好な状態でご返却ください。<br>
                    借りられる商品数は、1回のご利用で最大5点までです。<br>
                    返却期限を守ってください。遅延が発生した場合、追加料金が発生することがあります。<br>
                    商品の破損や紛失にはご注意ください。補償が必要な場合は別途費用が発生することがあります。<br>
                    シンプルなプランで、お子様の成長に合わせたアイテムを手軽にお試しください。<br>
                    ご不明な点がございましたら、お気軽にお問い合わせください。
                </p>
            </div>

            <!-- フッター -->
            <v-footer app padless class="custom-font" color="#FFF8DC">
                <v-row class="d-flex align-center justify-space-between" cols="12">
                    <v-col>
                        <v-btn v-on:click="dialog2 = true" class="empllogin" color="#FFF8DC">
                            employee login
                            <v-icon start>
                                mdi-pencil
                            </v-icon>  
                    </v-col>

                    <v-col class="text-center"  style="position: absolute; left: 50%; transform: translateX(-50%);">
                        © 2024 TeamA
                    </v-col>
                </v-row>
            </v-footer>

            <!-- ログインダイアログ -->
            <v-dialog v-model="dialog2" max-width="400">
                <v-card>
                    <v-card-title class="headline1"class="custom-font">Login<br>こちらは従業員のログインページです</v-card-title>
                    <v-card-text>
                        <!-- エラーメッセージ表示 -->
                        <v-alert v-if="employeeerrorMessage" type="error" dismissible class="custom-font">
                            {{ employeeerrorMessage }}
                        </v-alert>
                        <v-text-field v-model="employee_name" label="name" outlined class="custom-font"></v-text-field>
                        <v-text-field
                            v-model="employee_pass"
                            label="Password"
                            type="password"
                            outlined
                            class="custom-font"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="login2" class="custom-font" dark color="#f09199" rounded>Login</v-btn>
                        <v-btn @click="dialog2 = false" class="custom-font" color="#90c8f0" rounded dark>Cancel</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-app>
    </div>

    <!-- Vue.js、Vuetify、Axiosのスクリプトを読み込む -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js"></script>
    <script src="./script.js"></script>
</body>
</html>
