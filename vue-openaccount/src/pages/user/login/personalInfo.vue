<template>
    <div>
        <el-col :span="8">
            <img class="photo" src="../../../assets/image/user.jpg">
        </el-col>
        <el-col :span="16">
            <div class="info-box">
            <el-row>
                <el-col :span="5"><span class="title">姓名：</span></el-col>
                <el-col :span="11"><span class="content">{{accountInfo.name}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><span class="title">储蓄卡：</span></el-col>
                <el-col :span="11"><span class="content">{{accountInfo.deposit_account}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><span class="title">证件类型：</span></el-col>
                <el-col :span="11"><span class="content">{{accountInfo.id_type}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><span class="title">证件号码：</span></el-col>
                <el-col :span="11"><span class="content">{{accountInfo.id_number}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><span class="title">职业：</span></el-col>
                <el-col :span="11"><span class="content">{{accountInfo.profession}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><span class="title">联系地址：</span></el-col>
                <el-col :span="11"><span class="content">{{contactAddress.province}} / {{contactAddress.city}} / {{contactAddress.street}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5"><span class="title">邮寄地址：</span></el-col>
                <el-col :span="11"><span class="content">{{postAddress.province}} / {{postAddress.city}} / {{postAddress.street}}</span></el-col>
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
        this.$axios.get('/api/getAccountInfo', {
            params:{user_id: 17}
        }).then(function(response){
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
        font-size: 18px;
        float: left;
    }
    .content{
        float: left;
        /* margin: 50px; */
    }
    .el-row{
        margin: 20px;
    }
</style>
