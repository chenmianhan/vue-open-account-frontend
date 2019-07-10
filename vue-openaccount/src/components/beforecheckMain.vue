<template>
<section>
  <el-container class="container">
    <!--内容-->
    <el-container>
      <!--页眉-->
      <el-header class="header">
        <el-row>
          <el-col :span="21" class="header-title"><span class="system-name">{{systemName}}</span></el-col>
          <el-col :span="3" justify="end">
            <el-button size='medium' @click='handleCommand("loginout")'>退出登录</el-button>
          </el-col>
        </el-row>
      </el-header>
      <!--中间-->
      <el-main class="main">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container> 
  </el-container>
</section>
</template>

<script>
let data = () => {
  return {
    collapsed: false,
    systemName: '金证开户平台',
    userName: 'xx用户'
  }
}

export default {
  data: data,
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
                    sessionStorage.clear();
                    that.$store.state.haveSubmit = false;
                    that.$store.commit('modifySubmit', that.$store.state.haveSubmit);
                    that.$router.push('/login');
                }else if (response.data.code == '105'){
                    that.$msgbox({
                        type: 'error',
                        title: '系统异常',
                        message: '注销失败'
                    })
                }else if(response.data.code == '20011'){
                    that.$msgbox({
                      type:'error',
                      title:'状态失效',
                      message:'登录状态失效！请重新登录'
                    });
                    that.$router.push('/login');
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
    },
    isValid(){
      var that = this;
      this.$axios.post('/api/checkInvalid').then(function(response){
        if(response.data == '801'){
          that.$message({
            message: '登录超时，请重新登录！',
            type: 'error'
          });
          that.$router.push({path: '/login'});
        }
      });
    }

  },
  mounted: function() {
    if(sessionStorage.getItem('Flag') != 'isLogin'){
      this.$router.push({path: '/403'});
    }
    this.isValid();
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