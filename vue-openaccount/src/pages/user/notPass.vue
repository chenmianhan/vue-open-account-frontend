<template>
<div>
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
    <el-row>
        <el-col :span="10"><img src="../../assets/image/cry.gif" class="image"></el-col>
        <el-col :span="12">
    <h1>您未通过审核</h1><span>点此</span><el-link @click="$router.push({path: '/login/warning'})">重新开户</el-link>
    <!-- <div v-for="title in titles" :key="title"> -->
        <el-alert type="error" show-icon style="margin:10px auto;width:70%;" :closable="false">
            <h3>{{message}}</h3>
        </el-alert>
    <!-- </div> -->
    <h3>如有问题，请联系客服：xxx-xxxx-xxxx</h3>

        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    data(){
        return{
            message: '您的XXXXXXX都没有通过'
        }
    },
    mounted(){
        var that = this;
        this.$axios.post('/api/getReviewResult').then(function(response){
            console.log(response.data)
            that.message = response.data.msg;
        }).catch(()=>{
            that.$msgbox.error({
                title: '连接失败'
            });
        });
    }
}
</script>

<style scoped>
.image{
    width: 70%;
    float: right;
}
.bread{
    margin: 10px;
}
</style>
