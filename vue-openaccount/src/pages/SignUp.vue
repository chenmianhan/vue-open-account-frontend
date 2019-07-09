<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">新用户注册</div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="手机号码">
                        <el-button slot="prepend" icon="el-icon-mobile-phone"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="valCode" v-show="!isChecked">
                    <el-input
                    type="text" placeholder="验证码" v-model="ruleForm.valCode">
                        <el-button slot="prepend" icon="el-icon-s-promotion"></el-button>
                        <el-button slot="append" size="mini" :disabled="isDisabled" @click="sendValCode">{{buttonName}}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" v-show="isChecked">
                    <el-input
                    show-password
                    type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop='checkPassword' v-show="isChecked">
                    <el-input 
                    show-password
                    type="password" placeholder="确认密码" v-model="ruleForm.checkPassword" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" 
                    @click="submitForm('ruleForm')" 
                    v-show="isChecked"
                    :disabled="!signUpAllowed">注册</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            var validatePhone = (rule, value, callback) => {
                //验证手机号格式是否正确以及是否已注册
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(reg.test(value));
                
                var that = this;
                if (reg.test(value)) {//格式正确
                    // const postData = {
                    //     phone: value
                    // }
                    this.$axios.get('/api/checkPhone',{params:{phone: value}})
                    .then(function(response){
                        console.log(response);
                        var code = response.data.code;
                        if (code == '300'){
                            that.isDisabled = false;
                            return callback();
                        }else if (code =='301'){
                            return callback(new Error('该手机号已注册！请直接登录或输入新的手机号'));
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
                            that.isChecked = true;
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

            var validatePass = (rule, value, callback) => {
                //验证密码格式是否正确
                if (!value)
                    return callback(new Error('请输入密码'));
                else if (value.length > 12)
                    return callback(new Error('长度不超过12位'))
                else
                    callback();
            };

            var checkPass = (rule, value, callback) => {
                //验证二次输入密码是否相同
                if (value === ''){
                    return callback(new Error('请再次输入密码'));
                }else if (value != this.ruleForm.password){
                    return callback(new Error('两次密码输入不一致'));
                }else{
                    this.signUpAllowed = true;
                    callback();
                }
            };

            return {
                isChecked: false,
                isDisabled: true,
                signUpAllowed: false,

                buttonName: '发送验证码',
                timer: null,
                count: '',
                //表单格式
                ruleForm: {
                    username: '',//用户手机号
                    valCode: '', //短信验证码
                    password: '',//密码
                    checkPassword: '',
                    //isSignup: false,//是否已经注册；是否为旧用户、
                },
                rules: {//表单验证规则，验证用户输入格式是否正确
                    username: [
                        { validator: validatePhone, trigger: 'blur'}    
                    ],
                    valCode:[
                        { validator: validateCode, trigger: 'blur'}
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur'}
                    ],
                    checkPassword: [
                        { validator: checkPass, trigger:'blur'}
                    ]
                },
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
            //表单验证，主要验证输入格式是否正确；验证正确后向后端传输数据注册新用户
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //前->后端传输
                        var that = this;
                        const postData = {//打包传输数据，类型均为string
                            account: that.ruleForm.username,
                            password: that.ruleForm.password
                        }
                        console.log(this.$Qs.stringify(postData));
                        //在这里给后台传输数据-
                        this.$axios.post('/api/addUser',this.$Qs.stringify(postData)
                        ).then(function(response){
                            console.log('response', response);
                            if (response.data.code =='102'){
                                that.$message({
                                    type:'success',
                                    message:'注册成功！'
                                });
                                that.$router.push({path: '/login'});
                            }else if (response.data.code == '103'){
                                that.$message({
                                    type:'error',
                                    message:'注册失败！'
                                })
                            }else{
                                that.$message({
                                    type:'error',
                                    message:'未知状态码'
                                })
                            }
                        }).catch(function(error){
                            console.log(error);
                            that.$$msgbox({
                                type:'error',
                                title:'连接失败',
                                message:'与后台服务器通讯失败！'
                            })
                        });
                    }
                });
            },
        },

        mounted: function(){

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