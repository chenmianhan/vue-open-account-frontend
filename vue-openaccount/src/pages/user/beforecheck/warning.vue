<template>
<section>
    <!--中间的卡片式幻灯片-->
    <div align="center">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item class="el-carousel__item" v-for="item in imagesbox" :key="item.id">
          <img :src="item.idView" class="image">
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-row>     
      <!--我已知悉风险-->
      <el-checkbox v-model="checked">我已知悉风险</el-checkbox>
      <!--下一步按钮-->
      <el-button type="primary" round @click='nextStepToInfo' :disabled="!checked">下一步<i class="el-icon-caret-right icon"></i></el-button>
    </el-row>
</section>
</template>

<script>
let data = () => {
  return {
    collapsed: false,
    systemName: '金证开户平台',
    userName: '新用户',
    imagesbox:[{id:0, idView: require("../../../assets/image/hint1.jpg")},
    {id:1, idView: require("../../../assets/image/hint2.jpg")},
    {id:2, idView: require("../../../assets/image/hint3.jpg")}],
    checked: false

  }
}

export default {
  //退出登录
  data: data,
  methods: {
    //下一步按钮跳转资料填写界面
    nextStepToInfo(){
      this.$router.push('/login/inputInfo');
    }
  },
  mounted: function() {
    console.log(sessionStorage)
    if(sessionStorage.getItem('Flag') != 'isLogin' || parseInt(sessionStorage.getItem('status')) > 3){
      this.$router.push({path: '/403'});
    }
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

    .main {
        width: $width;
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
    .user-name{
        margin-left: 10px;
    }
    .el-carousel__item {
      width: 100%;
      display: flex;
      align-items: left;
      justify-content: left;
      .image {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .icon{
        margin-left:3px;
    }

</style>