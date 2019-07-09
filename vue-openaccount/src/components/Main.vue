<template>
<section>
  <el-container class="container">
    <!--左边-->
    <el-aside :width="collapsed? '65px' : '200px' ">
      <el-container>
        <el-header>
          <span class="menu-button" v-if="collapsed" @click.prevent="collapsed=!collapsed">
            <i class="el-icon-s-unfold"></i>
          </span>
          <span v-else class="system-name">{{systemName}}</span>
        </el-header>
        <el-main style="text-align:left;">
          <el-menu :collapse="collapsed" background-color="#F2F6FC" router :default-active='onRoutes'>
            <el-menu-item index="/user/home">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">我的账户</span>
            </el-menu-item>
            <el-menu-item index="/user/info">
              <i class="el-icon-user"></i>
              <span slot="title">个人信息</span>
            </el-menu-item>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <!--内容-->
    <el-container>
      <!--页眉-->
      <el-header class="header">
        <el-row>
          <el-col :span="17" class="header-title">
            <span v-if="collapsed" class="system-name">{{systemName}}</span>
            <span v-else class="menu-button" @click.prevent="collapsed=!collapsed">
              <i class="el-icon-s-fold"></i>
            </span>
          </el-col>
          <el-col :span="3"><span class="el-dropdown-link userinfo-inner">你好：{{userName}}</span></el-col>
          <el-col :span="1">
            <div class="user-avator"><img src='../assets/image/user.jpg'></div>
          </el-col>
          <el-col :span="3">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{userName}} <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled='true'>{{netName}}</el-dropdown-item>
                  <el-dropdown-item command="forget" icon="el-icon-key" :divided='true'>修改密码</el-dropdown-item>
                  <el-dropdown-item command="loginout" icon="el-icon-switch-button" :divided='false'>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <!--中间-->
      <el-main class="main">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>

        <el-dialog title="忘记密码" :visible.sync="dialogFormVisible" width="35%">
          <el-form :model="form" size="small" ref="form1" :rules="rules">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width:300px" @blur="handleConfirm(form.phone)"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input :disabled="buttonDis" v-model="form.code" style="width:300px">
                <el-button slot="append" v-show="!second" @click="handleSend(form.phone)">发送验证码</el-button>
                <el-button slot="append" v-show="second" :disabled="!resend" @click="handleSend(form.phone)">({{time}}s)重新发送</el-button>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleValid('form1')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog title="重设密码" :visible.sync="visible" width="35%">
          <el-form :model="newform" size="small" :rules="rules" ref="form2">
            <el-form-item label="新密码" prop="password">
              <el-input v-model="newform.password" type="password" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirm">
              <el-input v-model="newform.confirm" type="password" style="width:300px">
                <!-- <el-button slot="append">发送验证码</!-->
                <!-- <el-button slot="append">({{}})重新发送</el-button> -->
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit('form2')">确定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

      </el-main>
    </el-container>
  </el-container>
</section>
</template>

<script>
export default {
  data(){
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
  let confirmPassword = (rule, value, callback) => {
    if(value === ''){
      return callback(new Error('请输入确认密码'));
    }else if(value !== this.newform.password){
      return callback(new Error('两次密码输入不一致'));
    } else {
      callback();
    }
  };

  return {
    newform: {
      confirm: '',
      password: ''
    },
    c: null,
    form: {},
    time: 10,
    resend: false,
    second: false,
    visible: false,
    dialogFormVisible: false,
    collapsed: false,
    buttonDis: false,
    systemName: '金证开户平台',
    userName: 'xx用户',
    netName: 'xx营业网点',
    rules: {
      phone: [
        // {validator: validatePhone, trigger:'blur'}
      ],
      code: [
        // {required: true, message: '请输入验证码', trigger: 'blur'}
      ],
      password: [
        {required: true, message: '密码不能为空', trigger: 'blur'}
      ],
      confirm: [
        {validator: confirmPassword, trigger: 'blur'}
      ]
    }
  }
  },
  methods: {
    handleCommand(command) {
        var that = this;
        if(command == 'loginout'){
            this.$axios.post('/api/logout'
            ).then(function(response){
                if(response.data.code == '104'){
                    sessionStorage.removeItem('ms_username');
                    sessionStorage.removeItem('Flag');
                    sessionStorage.removeItem('Role');
                    sessionStorage.removeItem('status');
                    that.$router.push('/login');
                }else if (response.data.code == '105'){
                    that.$msgbox({
                        type: 'error',
                        title: '系统异常',
                        message: '注销失败'
                    })
                }else {
                    that.$msgbox({
                        type: 'error',
                        title: '系统异常',
                        message: '未知状态码'
                    })
                }
            }).catch(function(error){
                console.log(error);
                that.$msgbox({
                    type: 'error',
                    title: '系统异常',
                    message: '与后台服务器通讯失败'
                })
            })
        }
        if(command == 'forget'){
          this.dialogFormVisible = true;
        }
    },

    getUserInfo(){
        var that = this;
        this.$axios.post('/api/user'
        ).then(function(response){
            console.log(response);
            that.netName = response.data.netName;
            that.userName = response.data.username;
        }).catch(function(error){
            console.log(error);
            that.$msgbox({
              type:'error',
              title: '连接失败',
              message:'获取用户信息失败'
            })
        })
    },
    isValid(){
      var that = this;
      this.$axios.post('/api/checkInvalid').then(function(response){
        console.log('state', response.data)
        if(response.data == '801'){
          that.$message({
            message: '登录超时，请重新登录！',
            type: 'error'
          });
          that.$router.push({path: '/login'});
        }
      });
    },
    handleConfirm(value){
      var that = this;
      let postData = {
        phone: value
      }
      this.$axios.post('', postData).then(function(response){
        console.log(response.data);
        if(true){ // 用户不存在
          that.$msgbox({
            message: '账号不存在',
            type: 'error'
          })
        }else{
          that.buttonDis = false;
        }
      })
    },
    handleSend(value){
      this.time = 5;
      this.second = true;
      this.resend = false;
      var that = this;
      let postData = {
        phone: value
      }
      this.$axios.post('', postData).then(function(response){
        // console.log('send',response);
          that.c = window.setInterval(() => {
            if(that.time > 0){
              that.time = that.time - 1;
            }else{
              console.log('stop')
              clearTimeout(that.c);
              that.c = null;
              that.resend = true;
            }
          }, 1000)
      });
    },
    handleValid(form){
      this.$refs[form].validate((valid) => {
        if(valid){
          var that = this;
          let postData = {
            code: this.form.code
          }
          this.$axios.post('', postData).then(function(response){
            // 成功
            that.dialogFormVisible = false;
            that.visible = true;
            // 失败
            that.$msgbox({
              message: '验证码有误',
              type: 'error'
            })
          })
        }else{
          return false;
        }
      })
    },
    handleSubmit(form){
      this.$refs[form].validate((valid) => {
        if(valid){
          var that = this;
          let postData = {
            phone: this.form.phone,
            password: this.newform.password
          }
          this.$axios.post('', postData).then(function(response){
            // 成功
            that.$message({
              message: '修改成功',
              type: 'success'
            });
            // 失败
            that.$message({
              message: '修改失败',
              type: 'error'
            });
          })
        }
      })
    }

  },
  mounted: function() {
        // console.log(sessionStorage);
        // if(sessionStorage.getItem('Flag') != 'isLogin'
        // || sessionStorage.getItem('status') != '7'){
        //     this.$router.push({path: '/403'});
        // }
        this.isValid();
        this.getUserInfo();
  },
  computed: {
    onRoutes(){
      return this.$route.path;
    }
  }
}
</script>

<style scoped="scoped"
  lang="scss">
$width: 100%;
$height: 100%;
$background-color: #2b6aab;
$header-color: #fff;
$header-height: 60px;

.container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .el-aside {
        .el-header {
            line-height: $header-height;
            background-color: $background-color;
            color: $header-color;
            text-align: center;
        }
        .el-container {
            height: $height;
            .el-main {
                padding: 0;
            }
        }
    }

    .main {
        width: $width;
        height: $height;
    }

    .menu-button {
        width: 14px;
        cursor: pointer;
        font-size: 24px;
    }

    .userinfo-inner {
        cursor: pointer;
    }

    .el-menu {
        height: $height;
    }

    .header {
        background-color: $background-color;
        color: $header-color;
        text-align: center;
        line-height: $header-height;
        padding: 0;

        .header-title {
            text-align: left;
            span {
                padding: 0 20px;
            }
        }
    }

    .system-name {
        font-size: large;
        font-weight: bold;
    }
}

    .user-avator{
        margin-left: 20px;
        margin-top: 10px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }

        .user-name{
        margin-left: 10px;
    }

    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }

</style>