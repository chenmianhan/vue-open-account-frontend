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
        <!-- <el-link type='primary' @click="Netpoint=[]">重新选择</el-link> -->
        <div class="choose">
            <el-col :span="12">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>上海证券交易所</span>
                </div>
                <div>
                    <!-- <el-radio-group v-model="Netpoint[0]" v-for="(item, index) in shNet" :key="index">
                        <el-col :span="12" style="margin:15px;">
                            <el-radio :label="item" border></el-radio>
                        </el-col>
                    </el-radio-group> -->
                    <el-cascader
                    :options="Netpoint"
                    checkStrictly
                    v-model="shPoint"
                    expandTrigger="hover"
                    :show-all-levels='false'
                    class="wd400">
                    </el-cascader>
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
                    <!-- <el-radio-group v-model="Netpoint[1]" v-for="(item, index) in szNet" :key="index">
                        <el-col :span="12" style="margin:15px;">
                            <el-radio :label="item" border></el-radio>
                        </el-col>
                    </el-radio-group> -->
                    <el-cascader
                    :options="Netpoint"
                    checkStrictly
                    v-model="szPoint"
                    expand-trigger="hover"
                    class="wd400">
                    </el-cascader>
                </div>
            </el-card>        
            </el-col>
            <span></span>
        </div>
            <el-row style="height:50px;">
                <el-button icon="el-icon-caret-left" round @click="$router.push({path:'/user/evaluation'})">上一步</el-button>
                <el-button type="success" round @click="handleSubmit" :disabled="Netpoint.length==0">提  交<i class="el-icon-success icon"></i></el-button>
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
            shNet: netPoint,
            szNet: netPoint,
            shPoint: '',
            szPoint: '',
            shNet: shNet,
            szNet: szNet,
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
                    shanghaiNetpoint: this.shanghaiNetpoint,
                    shenzhenNetpoint: this.shenzhenNetpoint,
                    userId: localStorage.getItem('ms_username')
                };

                this.$axios.post('', postData).then(function(response){
                    // 成功的话
                    this.$message({
                        type: 'success',
                        message: '提交成功！已提交给审核员'
                    });
                    this.$router.push({path: '/user/loading'});
                    })
                    // 否则
                    this.$message.error('提交失败');
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交'
                });
            });
        }
    },
    mounted(){
        var that = this;
        this.shNet = [];
        this.szNet = [];
        // var response = {};
        // response.data = netPoint;
        this.$axios.get('/api/security/get_securityall').then(function(response){
            console.log(response.data);
            // for(var pro = 0; pro < response.data.length; pro++){
            //     // 对于每一个省
            //     var obj = {};
            //     obj.label = response.data[pro].label;
            //     obj.value = response.data[pro].value;
            //     var child1sh = [];
            //     var child1sz = [];
            //     for(var city = 0; city < response.data[pro].length; city++){
            //         // 对于每一个城市
            //         var obj = {};
            //         obj.label = response.data[pro][city].label;
            //         obj.value = response.data[pro][city].value;
            //         var child2sh = [];
            //         var child2sz = [];
            //         for(var com = 0; com < response.data[pro][city].length; com++){
            //             // 对于每一个公司
            //             var obj = response.data[pro][city][com];
            //             if (obj.type == 'sh'){
            //                 child2sh.push(obj);
            //             } else {
            //                 child2sz.push(obj);
                //         }
                //     }
                //     obj.children = child2sh;
                //     child1sh.push(obj);
                //     obj.children = child2sz
                //     child1sz.push(obj);
                // }
            //     obj.children = child1sh;
            //     that.shNet.push(obj);
            //     obj.children = child1sz;
            //     that.szNet.push(obj);
            // }
        });
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
</style>
