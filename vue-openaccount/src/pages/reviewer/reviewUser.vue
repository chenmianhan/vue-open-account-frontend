<template>
    <!-- 页头 -->
    <div class='review item'>
        <span style="display:inline-block;width:200px;font-weight:bold;font-size:22px">用户开户信息审核</span>
        <!-- 审核的三个部分 -->
        <el-divider></el-divider>
        <div class='review info'>
            <el-row :gutter="12">
                <!-- 用户信息 -->
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <el-col :span='12'>
                                <span style='font-weight:bold;font-size:18px'>基本信息</span>
                            </el-col>
                            <el-col :span='12'>
                                <el-button-group>
                                    <el-button size='small' type="primary" icon="el-icon-check" round></el-button>
                                    <el-button size='small' type="info" icon="el-icon-close" round></el-button>
                                </el-button-group>
                            </el-col>
                        </div>
                        <div class="text item">
                            <div v-for="(item, index) in userInfo" :key='index' class="info-box">
                                <el-row>
                                    <el-col :span="8" align='left'><span class="title">{{item.title}}：</span></el-col>
                                    <el-col :span="16" align='left'><span class="content">{{item.content}}</span></el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!-- 身份证照片 -->
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <el-col :span='12'>
                                <span style='font-weight:bold;font-size:18px'>身份证照片</span>
                            </el-col>
                            <el-col :span='12'>
                                <el-button-group>
                                    <el-button size='small' type="primary" icon="el-icon-check" round></el-button>
                                    <el-button size='small' type="info" icon="el-icon-close" round></el-button>
                                </el-button-group>
                            </el-col>
                        </div>
                        <div class="text item">
                            <div class="image__placeholder">
                                <el-col :span='12'>
                                    <el-row>
                                        <!-- <img class="photo" src="../../assets/image/user.jpg"> -->
                                        <el-image src='../../assets/image/user.jpg' fit='scale-down'></el-image>
                                    </el-row>
                                    <div style="padding: 14px;">
                                        <el-row><span class="demonstration">正面照</span></el-row>
                                    </div>
                                </el-col>
                                <el-col :span='12'>
                                    <el-row>
                                        <!-- <img class="photo" src="../../assets/image/user.jpg"> -->
                                        <el-image src='../../assets/image/user.jpg' fit='scale-down'></el-image>
                                    </el-row>
                                    <div style="padding: 14px;">
                                        <el-row><span class="demonstration">反面照</span></el-row>
                                    </div>
                                </el-col>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!-- 风险测评结果 -->
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <el-col :span='12'>
                                <span style='font-weight:bold;font-size:18px'>风险测评结果</span>
                            </el-col>
                            <el-col :span='12'>
                                <el-button-group>
                                    <el-button size='small' type="primary" icon="el-icon-check" round></el-button>
                                    <el-button size='small' type="info" icon="el-icon-close" round></el-button>
                                </el-button-group>
                            </el-col>
                        </div>
                        <div class="text item">
                            <div style='padding: 12px'><el-button>{{userType}}</el-button></div>
                            <div style='padding: 12px'><el-button type="primary">{{userGrade}} 分</el-button></div>
                        </div>
                    </el-card>
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

<style>
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

    .box-card {
        width: 480px;
    }
</style>
