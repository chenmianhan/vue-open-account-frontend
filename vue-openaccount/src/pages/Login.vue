<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">在线开户平台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop='role'>
                    <el-radio-group v-model="ruleForm.role" border size="mini">
                        <el-radio-button :label="1">用户</el-radio-button>
                        <el-radio-button :label="2">审核员</el-radio-button>
                        <el-radio-button :label="3">管理员</el-radio-button>
                        <el-radio-button :label="4">超级管理员</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <el-button type="text" class="login-tips">忘记密码？</el-button>
                <el-button type="text" class="login-tips" @click="$router.push({path: '/user/home'})">点击这里看审核通过界面</el-button>
            </el-form>
        </div>
        <!--所有的警告弹窗-->
        <transition name="logInAlert" v-if="alertTitle != '' ">
            <div class="login-btn">
                <div class="alert alert-danger" role="alert"><p>{{alertTitle}}</p></div>
            </div>
        </transition>
    </div>
</template>

<script>
    /*import {AxiosInstance as axios} from "axios";*/
    export default {
        data: function(){
            return {
                ruleForm: {//表单格式
                    username: '',//用户名
                    password: '',//密码
                    alertTitle:'',//弹窗标题
                    showAlert: false,//是否显示警告弹窗
                    isSignup: false,//是否已经注册；是否为旧用户
                    role: null//角色标签：用户1；审核员2；管理员3；超管4
                },
                rules: {//表单验证，验证用户输入格式是否正确
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    role: [
                        { required: !null, message: '请选择您的账号类别', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //表单验证，主要验证输入格式是否正确
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //将用户名保存到ruleForm.username
                        localStorage.setItem('ms_username',this.ruleForm.username);
                        this.$router.push('/login/warning');
                        console.log('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //老用户登录
            login: function () {
                var that = this;
                var router = this.$router;
                //向后台传输数据-用户登录信息
                axios.post('/api/login',{
                    'user_id': this.username,
                    'user_password': this.password,
                    'user_role':this.role
                }).then(function (response) {//从后端得到数据-用户登录是否成功/错误信息
                if (response.data == 'user_success') {//登录成功跳转用户个人信息界面
                    router.push({
                        path: '/user/home'
                    });
                    /*
                    userInfo.store({//把数据封装为json格式
                    userId:that.user_id,
                    hasLogin:true
                    });*/
                    console.log("login success");//终端显示登录成功
                }
                else {
                    that.alertTitle = '登录失败！请检查账号或密码'
                }
                }).catch(function (err) {
                    that.alertTitle = '网络连接失败！可能是服务器故障！'
                });
            },
            //新用户注册
            signup: function(){
                this.$refs[formName].validate((valid) => {
                    if (valid) {//跳转到风险提示界面
                        //将用户名保存到ruleForm.username
                        localStorage.setItem('ms_username',this.ruleForm.username);
                        this.$router.push('/login/warning');
                        console.log('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //管理员登录
            admin: function () { 
                var that = this;
                var router = this.$router;
                console.log("Admin post begin");
                //向后端传输数据-管理员登录信息
                axios.post('/api/login',{
                    'user_id': this.username,
                    'user_password': this.password,
                    'user_role':this.role
                }).then(function (response) {//从后端得到数据-管理员是否登录成功/错误信息
                if (response.data == 'admin_success') {//管理员成功登录
                    /*
                    userInfo.store({
                        userId:that.user_id,
                        hasLogin:true
                    });
                    */
                    router.push({//进入管理员界面
                        path: '/admin/home'
                    });
                } else {//其他异常情况警告
                    that.alertTitle = '登录失败！请检查账号或密码'
                }
                }).catch(function (error) {
                    that.alertTitle = '网络连接失败！可能是服务器故障！'
                });
            }
        },
        mounted: function(){
            if(this.notifyInstance) {
                this.notifyInstance.close();
            }
            this.notifyInstance=this.$notify({
                title: '提示',
                message: '初次登录用户会自动创建账号，账号名为手机号，初始密码为用户输入密码！',
                type: 'info'
            });
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: absolute;
        width:100%;
        height:100%;
        background-image: url(../assets/image/login4.jpg);
        background-size: 100%;
        /* opacity: 0.8; */
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #606266;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.5);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#909399;
    }
</style>