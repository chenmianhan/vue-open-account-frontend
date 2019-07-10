<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">金证在线开户平台</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
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
                        <el-radio-button :label="0">用户</el-radio-button>
                        <el-radio-button :label="1">审核员</el-radio-button>
                        <el-radio-button :label="2">管理员</el-radio-button>
                        <el-radio-button :label="3">超级管理员</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <el-button type="text" class="login-tips" @click="isDialogShow = true">忘记密码？</el-button>
                <el-button type="text" class="login-tips" @click="$router.push({path: '/signup'})">新用户注册</el-button>
            </el-form>
        </div>
        <!-- 忘记密码 -->
        <div>
            <el-dialog
                title="忘记密码"
                :visible.sync="isDialogShow"
                width="30%"
                center>
                <el-form :model="changeForm" status-icon :rules="rules" ref="changeForm" label-width="0px" class="ms-change-content">
                    <el-form-item v-show="!isChecked" prop="phone">
                        <el-input v-model="changeForm.phone" placeholder="手机号码">
                            <el-button slot="prepend" icon="el-icon-mobile-phone"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="valCode" v-show="!isChecked">
                        <el-input
                        type="text" placeholder="验证码"
                        v-model="changeForm.valCode">
                            <el-button slot="prepend" icon="el-icon-s-promotion"></el-button>
                            <el-button slot="append" size="mini" :disabled="isDisabled" @click="sendValCode">{{buttonName}}</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="newPassword" v-show="isChecked">
                        <span>请输入新密码：</span>
                        <el-input show-password type="password" placeholder="新密码" 
                        v-model="changeForm.newPassword" 
                        @keyup.enter.native="submitChangeForm('changeForm')">
                            <el-button slot="prepend" icon="el-icon-lock"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div style="text-align: center;">
                    <el-button @click="isDialogShow = false">取消</el-button>
                    <el-button v-show="!isChecked" :disabled="!nextAllowed" type="primary" @click="isChecked=true">下一步</el-button>
                    <el-button v-show="isChecked" type="primary" :disabled="!submitAllowed" @click="submitChangeForm('changeForm')">提交</el-button>
                </div>
                <!-- <span slot="footer" class="dialog-footer">
                    <el-button @click="isDialogShow = false">取消</el-button>
                    <el-button type="primary" :disabled="!submitAllowed" @click="submitChangeForm('changeForm')">提交</el-button>
                </span> -->
            </el-dialog>
        </div>
    </div>
</template>

<script>
    //import {AxiosInstance as axios} from "axios";

    export default {
        data: function(){
            //校验用户输入数据格式是否正确
            var validateId = (rule, value, callback) => {
                if (!value)
                    return callback(new Error('请输入用户ID或手机号'));
                else{
                    if (this.ruleForm.role == 0){//用户检查手机号合法性
                        validatePhone(rule, value, callback);
                    }else{//非用户检查账号合法性
                        validateAdminId(rule, value, callback);
                    }
                }
            };
            var validatePhone = (rule, value, callback) => {
                //验证手机号格式是否正确
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {//格式正确
                    var that = this;
                    this.$axios.get('/api/checkPhone',{params:{phone: value}})
                    .then(function(response){
                        console.log(response);
                        var code = response.data.code;
                        if (code == '300'){
                            that.isDisabled = false;
                            return callback();
                        }else if (code =='301'){
                            return callback(new Error('该手机号未注册！请先注册'));
                        }else{
                            return callback(new Error('服务器异常'));
                        }
                    }).catch(function(error){
                        console.log(error);
                        return callback(new Error('服务器异常'));
                    });
                } else {//格式错误
                    return callback(new Error('请输入格式正确的手机号（长度11位）'));
                }
            };

            var validateAdminId = (rule, value, callback) => {
                //验证非用户账号格式是否正确
                const reg = /^[A-Za-z0-9]{1,12}$/;
                console.log(reg.test(value));
                if (reg.test(value)){
                    callback();
                }else{
                    return callback(new Error('请输入格式正确的ID（数字或字母且长度不超过12位）'))
                }
                callback();
            };

            var validatePass = (rule, value, callback) => {
                //验证密码格式是否正确
                if (!value)
                    return callback(new Error('请输入密码'));
                else if (value.length > 12)
                    return callback(new Error('长度不超过12位'))
                else{
                    callback();
                }
            };

            var validateNewPass = (rule, value, callback) => {
                //验证密码格式是否正确
                if (!value)
                    return callback(new Error('请输入密码'));
                else if (value.length > 12)
                    return callback(new Error('长度不超过12位'))
                else{
                    this.submitAllowed = true;
                    callback();
                }
            };
            //验证码检查
            var validateCode = (rule, value, callback) => {
                var that = this;
                if (value != ''){
                    const postData = {
                        checkNum: value,
                    }
                    this.$axios.get('/api/checkNum', {params:{checkNum: value}})
                    .then(function(response){
                        console.log(response);
                        if (response.data.code == '302'){
                            that.nextAllowed = true;
                            that.$message({
                                message:'验证码正确',
                                type: 'success'
                            })
                            callback();
                        }else if(response.data.code == '303'){
                            return callback(new Error('验证码错误'));
                        }else{
                            return callback(new Error('服务器异常'));
                        }
                    }).catch(function(error){
                        console.log(error);
                    })
                }
            };

            return {
                isDialogShow: false,
                isChecked: false,
                isDisabled: true,
                nextAllowed: false,
                submitAllowed:true,

                buttonName: "发送验证码",

                changeForm:{
                    phone: '',//用户手机号
                    valCode: '', //短信验证码
                    newPassword: '',//密码
                },
                //表单格式
                ruleForm: {
                    username: '',//用户id||手机号
                    password: '',//密码
                    //isSignup: false,//是否已经注册；是否为旧用户
                    role: 0//角色标签（默认为用户）：用户1；审核员2；管理员3；超管4
                },
                rules: {//表单验证规则，验证用户输入格式是否正确
                    username: [
                        { validator: validateId, trigger: 'blur'}    
                    ],
                    password: [
                        { validator: validatePass, trigger: 'change'}
                    ],
                    newPassword: [
                        { validator: validateNewPass, trigger: 'change'}
                    ],
                    role: [
                        { required: !null, message: '请选择您的账号类别', trigger: 'blur'}
                    ],
                    phone: [
                        { validator: validatePhone, trigger:'blur'}
                    ],
                    valCode:[
                        { validator: validateCode, trigger: 'change'}
                    ]
                },
                isLogin: false //登录状态变量
            }
        },
        methods: {
            sendValCode(){//60秒计时器以及发送验证码
                var that = this;
                const postData = {
                    phone: this.ruleForm.username,
                }
                console.log(postData);

                this.$axios.post('/api/askForCheckSum', this.$Qs.stringify(postData)
                ).then(function(response){
                    console.log(response);
                    if (response.data.code == '308'){
                        const TIME_COUNT = 60;
                        that.count = TIME_COUNT;
                        that.timer = window.setInterval(() => {
                            if (that.count > 0 && that.count <= TIME_COUNT){
                                that.isDisabled = true;
                                that.count--;
                                that.buttonName = that.count + 's后重新获取';
                            }else{
                                that.isDisabled = false;
                                that.buttonName = '发送验证码';
                                clearInterval(that.timer);
                                that.timer = null;
                            }
                        }, 1000)
                    }else if(response.data.code =='100015'){
                        that.$msgbox({
                            type: 'error',
                            message:'手机号不合法'
                        });
                    }else{
                        that.$msgbox({
                            type:'error',
                            message:'服务器异常'
                        })
                    }
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type:'error',
                        title:'连接失败',
                        message:'发送短信验证码失败！'
                    })
                });
            },
            //表单验证，主要验证输入格式是否正确；验证正确后向后端传输数据
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //前->后端传输
                        var that = this;
                        
                        const postData = {//打包传输数据，类型均为string
                            account: that.ruleForm.username,
                            password: that.ruleForm.password,
                            role: String(that.ruleForm.role)
                        }
                        console.log(postData);
                        console.log(this.$Qs.stringify(postData));
                        //在这里给后台传输数据-
                        this.$axios.post('/api/login',that.$Qs.stringify(postData)).then(function(response){
                            console.log('response', response);
                            //成功登录后根据不同的身份标签跳转页面
                            if (response.data.code == '100' || response.data.code == '102'){
                                sessionStorage.setItem('Flag', 'isLogin');//存储登录状态
                                sessionStorage.setItem('Role', postData.role); //存储身份标识
                                console.log(sessionStorage.getItem('Flag'));
                                console.log(sessionStorage.getItem('Role'));

                                switch(postData.role){
                                    case '0'://用户成功登录
                                        if (response.data.code == '102'){//新
                                            sessionStorage.setItem('status', 0);
                                            that.$router.push('/login/warning');
                                        }
                                        else{  //旧用户
                                            that.goPage();
                                        }
                                        break;
                                    case '1'://审核员成功登录
                                        that.$router.push('/reviewer/home');
                                        break;
                                    case '2'://管理员成功登录
                                        that.$router.push('/admin/home');
                                        break;
                                    case '3'://超管成功登录
                                        that.$router.push('/superadmin/home');
                                }
                            }
                            //登录失败密码或用户名错误
                            else if (response.data.code == '101'){
                                that.$message({//消息提示请先登录
                                    showClose: true,
                                    message: '用户名或密码错误！',
                                    duration: 5000,
                                    type: 'error'
                                    });
                                //console.log('error');
                            }
                        }).catch(function(error){
                            that.$msgbox({
                                message: error.message,
                                type: 'error'
                            });
                            console.log('error', error);
                        })
                    } else {
                        // console.log('error submit!!');
                        // return false;
                    }
                });
            },

            submitChangeForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var that = this;
                        const postData = {
                            phone: this.changeForm.phone,
                            newPassword: this.changeForm.newPassword
                        }
                        console.log(this.$Qs.stringify(postData));
                        this.$axios.get('/api/updatePassword',
                        {params:{phone: this.changeForm.phone,newPassword: this.changeForm.newPassword}}
                        ).then(function(response){
                            console.log('response', response);
                            if (response.data.code =='306'){
                                that.$message({
                                    type:'success',
                                    message:'修改成功！'
                                });
                                that.isDialogShow = false;
                            }else if (response.data.code == '307'){
                                that.$message({
                                    type:'error',
                                    message:'系统异常！'
                                })
                            }else{
                                that.$message({
                                    type:'error',
                                    message:'未知状态码'
                                })
                            }
                        }).catch(function(error){
                            console.log(error);
                            that.$msgbox({
                                type:'error',
                                title:'连接失败',
                                message:'与后台服务器通讯失败！'
                            })
                        });
                    }
                });
            },

            goPage(){
                var that = this;
                this.$axios.post('/api/getReviewResult').then(function(response){
                    console.log(response.data);
                    switch(response.data.status){
                        case '0':
                            sessionStorage.setItem('status', 0)
                            that.$router.push({path: '/login/warning'});
                            break;
                        case '1':
                            sessionStorage.setItem('status', 1)
                            that.$router.push({path: '/login/evaluation'});
                            break;
                        case '2':
                            sessionStorage.setItem('status', 2)
                            that.$router.push({path: '/login/choose'});
                            break;
                        case '3':
                            sessionStorage.setItem('status', 3)
                            that.$router.push({path: '/login/chooseBank'});
                            break;
                        case '4':
                        case '5':
                            sessionStorage.setItem('status', 4)
                            that.$router.push({path: '/login/loading'});
                            break;
                        case '6':
                            sessionStorage.setItem('status', 5)
                            that.$router.push({path: '/login/notPass'});
                            break;
                        case '7':
                            sessionStorage.setItem('status', 7)
                            that.$router.push({path: '/user/home'});
                    }
                });
            }
        },
        //登录即注册提示
        mounted: function(){
            // console.log(sessionStorage);
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
    .ms-change-content{
        padding: 10px;
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
        font-size:14px;
        line-height:15px;
        color:dimgrey;
    }
</style>