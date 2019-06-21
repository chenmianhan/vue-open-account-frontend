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
        <div class="title"><h1 style="font-size:20px;">请选择您要加入的营业网点（可多选）：</h1></div>
        <div class="choose">
            <el-col :span="12">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>上海证券交易所</span>
                </div>
                <div>
                    <el-cascader
                    :options="shNet"
                    checkStrictly
                    v-model="shPoint"
                    props.expandTrigger="hover"
                    :show-all-levels='false'
                    class="wd400">
                    </el-cascader>
                    <span>{{shPoint}}</span>
                </div>
            </el-card>    
            </el-col>
            <el-col :span="12">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>深圳证券交易所</span>
                    <!-- <el-checkbox :indeterminate="szIsIndeterminate" v-model="szCheckAll" @change="handleSZ" style="float: right; padding: 3px 0" type="text">全选</el-checkbox> -->
                </div>
                <div>
                    <el-cascader
                    :options="szNet"
                    checkStrictly
                    v-model="szPoint"
                    props.expandTrigger="hover"
                    :show-all-levels='false'
                    class="wd400">
                    </el-cascader>
                    <span>{{szPoint}}</span>
                </div>
            </el-card>        
            </el-col>
            <span></span>
        </div>
            <el-row style="height:50px;">
                <el-button icon="el-icon-caret-left" round @click="$router.push({path:'/user/evaluation'})">上一步</el-button>
                <el-button type="success" round @click="handleSubmit" :disabled="shPoint.length==0&&szPoint.length==0">提  交<i class="el-icon-success icon"></i></el-button>
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
            shPoint: [],
            szPoint: [],
        }
    },
    methods: {
        handleSubmit(){
            this.$confirm("提交至审核员后不可修改，确认提交吗？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var point = [parseInt(this.shPoint[2]), parseInt(this.szPoint[2])];
                const postData = {
                    netPoint: point,
                    userId: localStorage.getItem('ms_username')
                };
                console.log(postData);

                this.$axios.post('', postData).then(function(response){
                    // 成功的话
                    this.$message({
                        type: 'success',
                        message: '提交成功！已提交给审核员'
                    });
                    this.$router.push({path: '/user/loading'});
                    });
                    // 否则
                    this.$message.error('提交失败');
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交'
                });
            });
        },
        getSHList(){
            var that = this;
            this.$axios.get('/api/security/get_securityall').then(function(response){
                that.shNet = [];
                that.shNet = response.data;
                for(var i = 0; i < that.shNet.length; i++){
                    for(var j = 0; j < that.shNet[i].children.length; j++){
                        for(var t = 0; t < that.shNet[i].children[j].children.length; t++){
                            if(that.shNet[i].children[j].children[t].type != '0'){
                                that.shNet[i].children[j].children.splice(t,1);
                                t--;
                            }
                        }
                    }
                }
            });
        },
        getSZList(){
            var that = this;
            this.$axios.get('/api/security/get_securityall').then(function(response){
                that.szNet = [];
                that.szNet = response.data;
                for(var i = 0; i < that.szNet.length; i++){
                    for(var j = 0; j < that.szNet[i].children.length; j++){
                        for(var t = 0; t < that.szNet[i].children[j].children.length; t++){
                            if(that.szNet[i].children[j].children[t].type != '1'){
                                that.szNet[i].children[j].children.splice(t,1);
                                t--;
                            }
                        }
                    }
                }
            });
        }
    },
    mounted(){
        this.getSHList();
        this.getSZList();
    }
}
</script>

<style scoped>
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
</style>
