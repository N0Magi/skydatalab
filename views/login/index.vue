<template>
    <div class="login-wrap">
        <div class="login-container">
            <div class="logoTop">
                <img
                    src="../../assets/images/login/SkydataLab.png"
                >
                <span>{{ $t('login.Large_Data_Machine_Learning_Platform') }}</span>
            </div>
            <el-form
                auto-complete="on"
                :model="loginForm"
                ref="loginForm"
                :rules="rules"
                label-position="left"
                label-width="0px"
                class="card-box login-form"
            >
                <div class="login-logo">
                    <span class="wtitle">{{ $t('login.Welcome') }}</span>
                    <img
                        src="../../assets/images/login/SkydataLab.png"
                    >
                    <!-- <wscn-icon-svg icon-class="Discovery1"></wscn-icon-svg> -->
                </div>
                <el-form-item
                    prop="username"
                    tabindex="0"
                >
                    <el-input
                        name="username"
                        type="text"
                        v-model="loginForm.username"
                        tabindex="1"
                        :placeholder="$t('login.Please_enter_a_user_name')"
                    />
                </el-form-item>
                <el-form-item
                    prop="passwd"
                    tabindex="0"
                >
                    <el-input
                        name="passwd"
                        type="password"
                        tabindex="2"
                        @keyup.enter.native="handleLogin"
                        v-model="loginForm.passwd"
                        :placeholder="$t('login.Please_enter_the_password')"
                    />
                </el-form-item>
                <el-form-item class="remember">
                    <el-checkbox v-model="remember">
                        {{ $t('login.Remember_username_and_password') }}
                    </el-checkbox>
                </el-form-item>
                <el-form-item class="form-submit">
                    <el-button
                        type="primary"
                        style="width:100%;"
                        tabindex="3"
                        :loading="loading"
                        @click.native.prevent="handleLogin"
                    >
                        {{ $t('login.Login') }}
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="copy-right">
                Copyright © 2017-2019 {{ $t('corporateName') }}  {{ $t('login.Copyright') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                passwd: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                passwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            loading: false,
            showDialog: false,
            remember: false
        };
    },
    computed: {},
    methods: {
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch('login', { username: this.loginForm.username, password: this.loginForm.passwd })
                        .then(() => {
                            this.loading = false;
                            this.$store.commit('SET_EXPLICIT_LOGIN');
                            if (this.remember == true) {
                                let userAndPasswd = {
                                    username: this.loginForm.username,
                                    passwd: this.loginForm.passwd
                                };
                                localStorage.setItem('userAndPasswd', JSON.stringify(userAndPasswd));
                            } else {
                                window.localStorage.clear('userAndPasswd');
                            }
                            this.$router.push({ name: 'Home' });
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    },
    mounted() {
        if (localStorage.getItem('userAndPasswd')) {
            this.remember = true;
            let userAndPasswd = JSON.parse(localStorage.getItem('userAndPasswd'));
            this.loginForm.username = userAndPasswd.username;
            this.loginForm.passwd = userAndPasswd.passwd;
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/styles/base/mixin.scss";
    @import "../../assets/styles/base/colors.scss";
    @import "../../assets/styles/base/constants.scss";
.login-wrap {
    background: linear-gradient(47deg, #3e8ef5, #3b17d7);
    background-size: cover;
    height: 100%;
    .logoTop {
        top: 34px;
        left: 100px;
        position: absolute;
        @include flex;
        img{
           width:210px;
           margin-right: 20px;
        }
        span {
            font-size: 24px;
            font-family: siyuan;
            color: rgba(255, 255, 255, 1);
            position: relative;
            display: inline-block;
        }
    }
    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 5px;
    }
    .login-container {
        user-select: none;
        overflow: hidden;
        .bgn {
            position: absolute;
            width: 80vw;
            bottom: 0;
            min-width: 1500px;
        }
        @include relative;
        background-image: url('../../assets/images/login/login.svg');
        background-size: cover;
        background-position: left center;
        background-repeat: no-repeat;
        .copy-right {
            color: #dedede;
            font-size: 14px;
            position: absolute;
            bottom: 50px;
            width: max-content;
            left: 0;
            right: 0;
            margin: 0 auto;
            text-align: center;
        }
        input:-webkit-autofill {
            box-shadow: 0 0 0px 1000px #fff inset !important;
            -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        }
        .el-input {
            display: inline-block;
            .form-ico {
                font-size: 20px;
            }
            .iconicon-user {
                font-size: 26px;
            }
        }
        input:-webkit-autofill {
            background-color: transparent !important;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            color: #889aa4;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 0px auto;
            text-align: center;
            font-weight: bold;
        }
        .login-form {
            position: absolute;
            right: 10vw;
            width: 340px;
            height: 410px;
            bottom: 0;
            top: calc(50vh - 170px);
            .form-submit {
                border: none;
            }
            .login-logo {
                @include flex;
                height: 20px;
                margin-bottom: 80px;
                .wtitle {
                    font-size: 28px;
                    font-weight: 300;
                    color: $white;
                    font-family: siyuan-bd;
                }
                img{
                    width:194px;
                }
            }
        }

        .el-form-item {
            border-radius: 2px;
            background: transparent;
            color: #000;
            .el-input__inner {
                height: 36px;
                border-radius: 0;
                border: none;
                border-bottom: 1px solid #fff;
                background: none;
                color: #fff;
                padding:0 8px;
                font-family: siyuan-rg;
            }
            .el-input__prefix {
                left: 10px;
            }
            .el-checkbox{
                color:$white;
            }
            .el-checkbox__input.is-checked + .el-checkbox__label{
                color:#fff;
            }
            margin: 0 auto 25px;
        }
        .remember{
            margin-top:-20px;
        }
        .forget-pwd {
            color: #fff;
        }
        .form-submit {
            button {
                margin-top: 20px;
                background:none;
                border:1px solid #fff;
                &:hover{
                  background: #f2883d;
                }
            }
        }
    }
}
</style>
