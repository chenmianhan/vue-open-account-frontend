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
        <el-col :span="12"><img src="../../assets/image/cry.gif" class="image"></el-col>
        <el-col :span="10">
            <el-alert type="error" show-icon style="margin:10px auto;width:70%;" :closable="false">
                <h3>{{message}}</h3>
            </el-alert>
            <h3 style="margin:20px auto;">如有问题，请联系客服：{{contactNum}}</h3>
            <el-button 
            style="margin: 20px auto;"
            @click="goToWarning" 
            type="primary">重新开户</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    data(){
        return{
            message: '',
            contactNum: ''
        }
    },
    methods:{
        goToWarning(){
            sessionStorage.setItem('status', 0);
            this.$router.push({path: '/login/warning'})
        },

        getMsg(){
        var that = this;
        this.$axios.post('/api/getReviewResult').then(function(response){
            console.log(response.data)
            that.message = response.data.msg;
        }).catch(()=>{
            that.$msgbox.error({
                title: '连接失败'
            });
        });
        },

        getContactNum(){
            var that = this;
            this.$axios.get('/api/contactNum'
            ).then(function(response){
                console.log(response.data);
                that.contactNum = response.data;
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
        console.log(sessionStorage);
        if(sessionStorage.getItem('Flag') != 'isLogin'
        || sessionStorage.getItem('status') != '5'){
            this.$router.push({path: '/403'});
        }
        this.getMsg();
        this.getContactNum();
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
