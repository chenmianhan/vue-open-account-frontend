<template>
    <div>
        <el-col :span="8">
            <img class="photo" src="../../../assets/image/user.jpg">
        </el-col>
        <el-col :span="16">
            <div v-for="(item, index) in userInfo" :key='index' class="info-box">
            <el-row>
                <el-col :span="5"><span class="title">{{item.title}}：</span></el-col>
                <el-col :span="11"><span class="content">{{item.content}}</span></el-col>
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
            visible: false
        }
    },
    methods:{
        handleChange(){
            this.visible = true;
        }
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
        margin-top: 30px;
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
</style>
