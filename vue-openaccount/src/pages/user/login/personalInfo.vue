<template>
    <div>
        <el-col :span="8">
            <img class="photo" src="../../../assets/image/user.jpg">
        </el-col>
        <el-col :span="16">
            <div class="info-box">
            <el-row>
                 <span class="title">姓名</span> 
            </el-row>
            <el-row>
                 <span class="content">{{accountInfo.name}}</span> 
            </el-row>
            <el-row>
                 <span class="title">储蓄卡</span> 
            </el-row>
            <el-row>
                 <span class="content">{{accountInfo.deposit_account}}</span> 
            </el-row>
            <el-row>
                 <span class="title">证件类型</span> 
            </el-row>
            <el-row>
                 <span class="content">{{accountInfo.id_type}}</span> 
            </el-row>
            <el-row>
                 <span class="title">证件号码</span> 
            </el-row>
            <el-row>
                 <span class="content">{{accountInfo.id_number}}</span> 
            </el-row>
            <el-row>
                 <span class="title">职业</span> 
            </el-row>
            <el-row>
                 <span class="content">{{accountInfo.profession}}</span> 
            </el-row>
            <el-row>
                 <span class="title">联系地址</span> 
            </el-row>
            <el-row>
                 <span class="content">{{contactAddress.province}} / {{contactAddress.city}} / {{contactAddress.street}}</span> 
            </el-row>
            <el-row>
                 <span class="title">邮寄地址</span> 
            </el-row>
            <el-row>
                 <span class="content">{{postAddress.province}} / {{postAddress.city}} / {{postAddress.street}}</span> 
            </el-row>
            </div>
            <el-row>
                <el-button type='text' @click="handleChange">>> 申请更改信息</el-button>
            </el-row>
        </el-col>
        <!-- 对话框 -->
        <el-dialog
        title="申请已提交！"
        :visible.sync="visible"
        width="30%">
        <div>管理员将在x个工作日内修改</div><span>有任何问题请联系管理员：131********</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="visible = false">知道了</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
import Info from '../../../assets/js/userInfo.js'
export default {
    data(){
        return {
            userInfo: userInfo,
            visible: false,
            accountInfo: null,
            contactAddress: null,
            postAddress: null
        }
    },
    methods:{
        handleChange(){
            this.visible = true;
        }
    },
    mounted(){
        var that = this;
        this.$axios.get('/api/getAccountInfo').then(function(response){
            console.log(response.data);
            that.accountInfo = response.data.account_info;
            that.contactAddress = response.data.contact_address;
            that.postAddress = response.data.postal_address;
        })
    }
}
</script>

<style scoped>
    .photo{
        width: 60%;
        /* height: 100%; */
        border-radius: 20%;
        margin: 40px;
    }
    .info-box{
        margin-top: 50px;
        /* background-color: black; */
        width: 80%;
    }
    .title{
        font-size: 15px;
        float: left;
        border-bottom: 1px #DCDFE6 solid;
        color: #909399;
        width: 70%;
        text-align: left;
        font-weight: bolder;
    }
    .content{
        /* text-align: right; */
        margin: -5px;
        width: 40%;
        font-size: 16px;
        color: #606266;
        /* background: #000; */
    }
    .el-row{
        margin: 20px;
    }
</style>
