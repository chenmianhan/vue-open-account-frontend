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
            <el-menu-item index="/admin/home">
              <i class="el-icon-notebook-1"></i>
              <span slot="title">客户管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/manageReviewer">
              <i class="el-icon-user"></i>
              <span slot="title">审核员管理</span>
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
          <el-col :span="20" class="header-title">
            <span v-if="collapsed" class="system-name">{{systemName}}</span>
            <span v-else class="menu-button" @click.prevent="collapsed=!collapsed">
              <i class="el-icon-s-fold"></i>
            </span>
          </el-col>
           <el-col :span="1">
            <div class="user-avator"><img src='../assets/image/admin.png'></div>
          </el-col>
          <el-col :span="3">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{adminName}} <i class="el-icon-caret-bottom"></i>
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled='true'>{{netName}}</el-dropdown-item>
                <el-dropdown-item command="loginout" icon="el-icon-switch-button" :divided='true'>退出登录</el-dropdown-item>
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
    netName: 'xx营业网点',
    adminName: 'xx管理员'
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

    getAdminInfo(){
        var that = this;
        this.$axios.get('/api/admin'
        ).then(function(response){
            that.netName = response.data.netName;
            that.adminName = response.data.adminName;
        }).catch(function(error){
            console.log(error);
            that.$msgbox({
              type:'error',
              title: '连接失败',
              message:'获取管理员信息失败'
            })
        })
    },
    isValid(){
      var that = this;
      this.$axios.post('/api/checkInvalid').then(function(response){
        console.log(response.data)
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
      this.getAdminInfo();
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
$background-color: #28394b;
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
