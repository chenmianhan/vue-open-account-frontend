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
        <el-main>
          <el-menu :collapse="collapsed" background-color="#EBEEF5" router :default-active='onRoutes'>
            <el-menu-item index="/user/home">
              <i class="el-icon-notebook-1"></i>
              <span>我的账户</span>
            </el-menu-item>
            <el-menu-item index="/user/info">
              <i class="el-icon-user"></i>
              <span>个人信息</span>
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
            <div class="user-avator"><img src='../assets/user.jpg'></div>
          </el-col>
          <el-col :span="3">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{userName}} <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
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
    userName: 'xx用户'
  }
}

export default {
  data: data,
  methods: {
    handleCommand(command) {
        if(command == 'loginout'){
            localStorage.removeItem('ms_username')
            this.$router.push('/login');
        }
    }
  },
  mounted: function() {

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