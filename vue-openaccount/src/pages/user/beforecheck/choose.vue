<template>
    <div>
    <!-- 面包屑
    <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>开户</el-breadcrumb-item>
            <el-breadcrumb-item>营业网点选择</el-breadcrumb-item>
        </el-breadcrumb>
    </div> -->
  <div style="margin:0 auto;margin-top:50px;margin-bottom: 50px; width:70%;text-align: left;">
    <el-steps :active="2" finish-status="success" >
      <el-step title="填写用户信息"></el-step>
      <el-step title="风险测评"></el-step>
      <el-step title="选择营业网点"></el-step>
      <el-step title="选择银行"></el-step>
      <el-step title="审核"></el-step>
    </el-steps>  
  </div>
    <el-divider><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i></el-divider>
        <el-row>
        <el-col :span="12">
        <div class="title">开通账户类型</div>
        <div class="check">
            <el-checkbox-group v-model="accountType">
                <el-checkbox :label=0 border>沪市基金账户</el-checkbox>
                <el-checkbox :label=1 border>深市基金账户</el-checkbox><br>
                <el-checkbox :label=2 border>沪市A股账户</el-checkbox>
                <el-checkbox :label=3 border>深市A股账户</el-checkbox>
            </el-checkbox-group>
        </div>
        </el-col>
        <el-col :span="12">
        <div class="title">选择营业网点</div>
            <div style="width:60%;margin: 0 auto;">
                <el-cascader
                :options="shNet"
                checkStrictly
                v-model="point"
                props.expandTrigger="hover"
                :show-all-levels='false'
                class="wd400">
                </el-cascader>
                <span>{{point}}</span>
            </div>
        </el-col>
        </el-row>
        <!-- <el-col :span="9">
            <img class="img-style" src="../../../assets/image/hint1.jpg">
        </el-col> -->
        <el-row style="height:50px;">
            <el-button icon="el-icon-caret-left" round @click="$router.push({path:'/login/evaluation'})">上一步</el-button>
            <el-button type="primary" round @click="handleSubmit">下一步<i class="el-icon-caret-right icon"></i></el-button>
        </el-row>
    </div>
</template>

<script>
import Net from '../../../assets/js/netName';
import Point from '../../../assets/js/netPoint';
export default {
    data(){
        return{
            Netpoint: netPoint,
            shNet: [],
            szNet: [],
            point: [],
            szPoint: [],
            accountType: []
        }
    },
    methods: {
        handleSubmit(){
            this.$confirm("提交至审核员后不可修改，确认提交吗？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const postData = {
                    accountType: this.accountType,
                    point: this.point
                };
                console.log(postData)
                var that = this;
                this.$axios.put('/api/updateSecurity', postData).then(function(response){
                    // 成功的话
                    if(parseInt(sessionStorage.getItem('status')) < 3){
                        sessionStorage.setItem('status', 3);
                    }
                    that.$router.push({path: '/login/chooseBank'});
                });
                    // 否则
                    // that.$message.error('提交失败');
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: error
                });
            });
        },
        // getSHList(){
        //     var that = this;
        //     this.$axios.get('/api/security/get_securityall').then(function(response){
        //         that.shNet = [];
        //         that.shNet = response.data;
        //         for(var i = 0; i < that.shNet.length; i++){
        //             for(var j = 0; j < that.shNet[i].children.length; j++){
        //                 for(var t = 0; t < that.shNet[i].children[j].children.length; t++){
        //                     if(that.shNet[i].children[j].children[t].type != '0'){
        //                         that.shNet[i].children[j].children.splice(t,1);
        //                         t--;
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // },
        // getSZList(){
        //     var that = this;
        //     this.$axios.get('/api/security/get_securityall').then(function(response){
        //         that.szNet = [];
        //         that.szNet = response.data;
        //         for(var i = 0; i < that.szNet.length; i++){
        //             for(var j = 0; j < that.szNet[i].children.length; j++){
        //                 for(var t = 0; t < that.szNet[i].children[j].children.length; t++){
        //                     if(that.szNet[i].children[j].children[t].type != '1'){
        //                         that.szNet[i].children[j].children.splice(t,1);
        //                         t--;
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // }
        getList(){
            var that = this;
            this.$axios.get('/api/security/get_securityall').then(function(response){
                console.log(response);
            });
        }
    },
    mounted(){
        console.log(sessionStorage)
        if(sessionStorage.getItem('Flag') != 'isLogin' 
        || (sessionStorage.getItem('status') != '2' 
        && sessionStorage.getItem('status') != '3')){
            this.$router.push({path: '/403'});
        }
        this.getList();
    }
}
</script>

<style scoped>
.check {
    margin: 20px;
}
    .box-card{
        width: 70%;
        margin: 0 auto;
        margin-top: 50px;
    }
    .clearfix{
        font-size: 20px;
    }
    .choose{
        padding: 0 60px 0 60px;
    }
    .el-button{
        margin: 80px;
    }
    .icon{
        margin-left:6px;
    }
    .bread{
        margin: 10px;
    }
    .wd400{
        width: 100%;
    }
    .title{
        font-size: 20px;
        color: #606266;
        font-weight: bold;
        text-align: left;
        width: 70%;
        margin: 60px auto;
        border-bottom: 1px solid #909399;
        /* background: #000; */

    }
    .el-checkbox{
        margin:10px;
    }
    .img-style{
        width: 80%;
    }
</style>
