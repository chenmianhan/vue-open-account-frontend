<template>
  <div class="error-page">
      <div class="error-code">4<span>0</span>4</div>
      <img class="imgs" src="../assets/image/404.gif">
      <span class="aoh">啊哦~</span>
      <div class="error-desc"> 你所访问的页面不存在</div>
      <div class="error-handle">
          <router-link to="/">
            <el-button type="primary" size="large" @click="backLogin">返回登录</el-button>
          </router-link>
          <el-button class="error-btn" type="primary" size="large" @click="goBack">返回上一页</el-button>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
      goBack(){
          this.$router.go(-1);
      },
      backLogin(){
          this.router.push({path: '/login'});
          
      }
  }
}
</script>


<style scoped>
.imgs {
    /* margin: 80px 0 20px 0; */
    width: 10%;
}
.aoh{
    width: 30%;
    font-size:18px;
    color: #606266;
    text-align: left;
    margin: 10px;
}
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .error-code{
        line-height: 1;
        font-size: 250px;
        font-weight: bolder;
        color: #2d8cf0;
    }
    .error-code span{
        color: #00a854;
    }
    .error-desc{
        width: 50%;
        font-size: 30px;
        color: #606266;
        border-top: 1px solid #606266;
    }
    .error-handle{
        margin-top: 30px;
        padding-bottom: 200px;
    }
    .error-btn{
        margin-left: 100px;
    }
</style>
