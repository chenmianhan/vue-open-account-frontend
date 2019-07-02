<template>
<div>
    <!-- 面包屑 -->
    <!-- <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>开户</el-breadcrumb-item>
            <el-breadcrumb-item>账户状态</el-breadcrumb-item>
        </el-breadcrumb>
    </div> -->
  <div style="margin:0 auto;margin-top:50px;margin-bottom: 50px; width:70%;text-align: left;">
    <el-steps :active="4" finish-status="success">
      <el-step title="填写用户信息"></el-step>
      <el-step title="风险测评"></el-step>
      <el-step title="选择营业网点"></el-step>
      <el-step title="选择银行"></el-step>
      <el-step title="审核"></el-step>
    </el-steps>  
  </div>
    <el-divider><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i></el-divider>

    <img src="../../../assets/image/wait.gif" class="image">
    <h1>您的资料待审核......</h1>
    <h3>如有问题，请联系客服：{{contactNum}}</h3>
</div>
</template>

<script>
export default {
    data(){
        return{
            contactNum: 'xxx-xxxx-xxxx'
        }
    },
    
    methods: {
        getContactNum(){
            var that = this;
            this.$axios.get('/api/contactNum'
            ).then(function(response){
                that.contactNum = response.data.contactNum;
            }).catch(function(error){
                console.log(error);
                that.$msgbox({
                    type: 'error',
                    title: '连接失败',
                    message: '与后台服务器通讯失败！'
                })
            })
        }
    },

    mounted(){
        this.getContactNum();
    }
}
</script>

<style scoped>
.image{
    width: 20%;
}
.bread{
    margin: 10px;
}
</style>
