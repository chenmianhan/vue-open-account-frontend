<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">在线开户平台</div>
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
                <el-button type="text" class="login-tips">忘记密码？</el-button>
                <el-button type="text" class="login-tips" @click="$router.push({path: '/user/home'})">点击这里看审核通过界面</el-button>
            </el-form>
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
                    if (this.ruleForm.role == 1){//用户检查手机号合法性
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
                    callback();
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
                else
                    callback();
            };
            return {
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
                        { validator: validatePass, trigger: 'blur'}
                    ],
                    role: [
                        { required: !null, message: '请选择您的账号类别', trigger: 'blur'}
                    ]
                },
                isLogin: false //登录状态变量
            }
        },
        methods: {
            //表单验证，主要验证输入格式是否正确；验证正确后向后端传输数据
            submitForm(formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //前->后端传输
                        const postData = {//打包传输数据，类型均为string
                            phone: that.ruleForm.username,
                            password: that.ruleForm.password,
                            role: String(that.ruleForm.role)
                        }
                        console.log(postData);
                        console.log(this.$Qs.stringify(postData));
                        //在这里给后台传输数据-
                        this.$axios.post('/api/login',this.$Qs.stringify(postData), {
                            headers: {'Content-Type':'application/x-www-form-urlencoded'}}
                        ).then(function(response){
                            console.log(response);
                            //成功登录后根据不同的身份标签跳转页面
                            if (response.data.code == '100' || response.data.code == '102'){
                                localStorage.setItem('Flag', 'isLogin');//存储登录状态
                                localStorage.setItem('Role', postData.role); //存储身份标识
                                console.log(localStorage.getItem('Flag'));
                                console.log(localStorage.getItem('Role'));

                                switch(postData.role){
                                    case '0'://用户成功登录
                                        if (response.data.code == '102')//新
                                            that.$router.push('/login/warning');
                                        else//旧
                                            that.$router.push('/user/home');
                                        break;
                                    case '1'://审核员成功登录
                                        that.$router.push('');
                                        break;
                                    case '2'://管理员成功登录
                                        that.$router.push('/admin/home');
                                        break;
                                    case '3'://超管成功登录
                                        that.$router.push('');
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
                            console.log(error);
                        })
                        //将用户名缓存
                        localStorage.setItem('ms_username',this.ruleForm.phone);
                        //this.$router.push('/login/warning');//暂时直接跳转风险提示界面
                        //console.log('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        },
        //登录即注册提示
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