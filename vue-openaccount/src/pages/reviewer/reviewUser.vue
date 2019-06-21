<template>
    <!-- 页头 -->
    <div class='review item'>
        <span style="display:inline-block;width:200px;font-weight:bold;font-size:22px">用户开户信息审核</span>
        <!-- 审核的三个部分 -->
        <el-divider></el-divider>
        <div class='review info'>
            <el-row :gutter="12">
                <!-- 用户信息 -->
                <el-col :span="10" class='box-card'>
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span style='font-weight:bold;font-size:18px'>基本信息</span>
                        </div>
                        <div class="text item">
                            <div v-for="(item, index) in userInfo" :key='index' class="info-box">
                                <el-row gutter='16'>
                                    <el-col :span="9" align='right'><span class="title">{{item.title}}：</span></el-col>
                                    <el-col :span="15" align='left'><span class="content">{{item.content}}</span></el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>
                    <div style='padding: 14px;'>
                        <el-button-group>
                            <el-button size='small' type="primary" icon="el-icon-check" round></el-button>
                            <el-button size='small' type="info" icon="el-icon-close" round></el-button>
                        </el-button-group>
                    </div>
                </el-col>
                <!-- 风险测评结果 -->
                <el-col :span="4" class='box-card'>
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span style='font-weight:bold;font-size:18px'>风险测评结果</span>
                        </div>
                        <div class="text item">
                            <div style='padding: 12px'><el-button>{{userType}}</el-button></div>
                            <div style='padding: 12px'><el-button type="primary" plain>{{userGrade}} 分</el-button></div>
                        </div>
                    </el-card>
                    <div style='padding: 14px;'>
                        <el-button-group>
                            <el-button size='small' type="primary" icon="el-icon-check" round></el-button>
                            <el-button size='small' type="info" icon="el-icon-close" round></el-button>
                        </el-button-group>
                    </div>
                </el-col>
                <!-- 身份证照片 -->
                <el-col :span="10" class='box-card'>
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span style='font-weight:bold;font-size:18px'>身份证照片</span>
                        </div>
                        <div class="text item">
                            <div class="image__placeholder">
                                <el-col :span='12'>
                                    <div class='img-box'>
                                        <img class="img-item" src="../../assets/image/user.jpg">
                                    </div>
                                </el-col>
                                <el-col :span='12'>
                                    <div class='img-box'>
                                        <img class="img-item" src="../../assets/image/user.jpg">
                                    </div>
                                </el-col>
                            </div>
                        </div>
                    </el-card>
                    <div style='padding: 14px;'>
                        <el-button-group>
                            <el-button size='small' type="primary" icon="el-icon-check" round></el-button>
                            <el-button size='small' type="info" icon="el-icon-close" round></el-button>
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="padding: 50px;">
            <el-button type="primary" icon="el-icon-s-promotion">提交</el-button>
        </div>
    </div>
</template>

<script>
import Info from '../../assets/js/userInfo.js'
export default {
    data: function(){
        return {
            imageUrl_1:'../../assets/image/user.jpg',
            imageUrl_2:'../../assets/image/user.jpg',
            userType: '保守型',
            userGrade: 78,
            userInfo: userInfo
        }
    },
    methods:{
        getUserInfo(){

        },
        getUserImage(){

        },
        getUserGrade(){

        }
    }
}
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    /* .box-card {
        height: 360px;
        max-height: 360px;
        min-height: 360px;
    } */

    .img-box{
        position:relative;
        z-index:1;
        margin:0 auto;
        width:140px;
        height:165px;
        overflow:hidden;
    }

    .img-item{
        position: absolute;
        max-width: 100%;
        top:0;
        left:0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
</style>
