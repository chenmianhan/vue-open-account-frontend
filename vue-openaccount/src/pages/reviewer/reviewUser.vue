<template>
    <!-- 页头 -->
    <div class='review item'>
        <span style="display:inline-block;width:200px;font-weight:bold;font-size:22px">用户开户信息审核</span>
        <!-- 审核的三个部分 -->
        <el-divider></el-divider>
        <div class='review-info'>
            <el-row :gutter="12">
                <!-- 用户信息 -->
                <el-col :span="10" >
                    <el-card shadow="hover" class='box-card'>
                        <div slot="header" class="clearfix">
                            <span style='font-weight:bold;font-size:18px'>基本信息</span>
                        </div>
                        <div class="text item">
                            <div v-for="(item, index) in userInfo" :key='index' class="info-box">
                                <el-row :gutter="16">
                                    <el-col :span="9" align='right'><span class="title">{{item.title}}：</span></el-col>
                                    <el-col :span="15" align='left'><span class="content">{{item.content}}</span></el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>
                    <div style='padding: 14px;'>
                        <el-button-group v-show='!checked.info'>
                            <el-button @click="setResult('info',true)"
                            size='small' type="primary" icon="el-icon-check" round></el-button>
                            <el-button @click="setResult('info',false)"
                            size='small' type="info" icon="el-icon-close" round></el-button>
                        </el-button-group>
                        <el-tag v-show='checked.info && this.reviewResult.infoResult'
                            closable
                            :disable-transitions="false"
                            @close="handleClose('info')">
                            通过
                        </el-tag>
                        <el-tag v-show='checked.info && !this.reviewResult.infoResult' type="danger"
                            closable
                            :disable-transitions="false"
                            @close="handleClose('info')">
                            不通过
                        </el-tag>
                    </div>
                </el-col>
                <!-- 风险测评结果 -->
                <el-col :span="4">
                    <el-card shadow="hover" class='box-card'>
                        <div slot="header" class="clearfix">
                            <span style='font-weight:bold;font-size:18px'>风险测评</span>
                        </div>
                        <div class="text item">
                            <div style='padding: 12px'><el-button>{{userType}}</el-button></div>
                            <div style='padding: 12px'><el-button type="primary" plain>{{userGrade}} 分</el-button></div>
                        </div>
                    </el-card>
                    <div style='padding: 14px;'>
                        <el-button-group v-show='!checked.grade'>
                            <el-button @click="setResult('grade',true)"
                            size='small' type="primary" icon="el-icon-check" round></el-button>
                            <el-button @click="setResult('grade',false)"
                            size='small' type="info" icon="el-icon-close" round></el-button>
                        </el-button-group>
                        <el-tag v-show='checked.grade && this.reviewResult.gradeResult'
                            closable
                            :disable-transitions="false"
                            @close="handleClose('grade')">
                            通过
                        </el-tag>
                        <el-tag v-show='checked.grade && !this.reviewResult.gradeResult' type="danger"
                            closable
                            :disable-transitions="false"
                            @close="handleClose('grade')">
                            不通过
                        </el-tag>
                    </div>
                </el-col>
                <!-- 身份证照片 -->
                <el-col :span="10">
                    <el-card shadow="hover" class='box-card'>
                        <div slot="header" class="clearfix">
                            <span style='font-weight:bold;font-size:18px'>身份证照片</span>
                        </div>
                        <div class="text item">
                            <div class="image__placeholder">
                                <el-col :span='8'>
                                    <div class='img-box'>
                                        <img class="img-item" :src='imageUrl_1'>
                                    </div>
                                </el-col>
                                <el-col :span='8'>
                                    <div class='img-box'>
                                        <img class="img-item" :src='imageUrl_2'>
                                    </div>
                                </el-col>
                                <el-col :span='8'>
                                    <div class='img-box'>
                                        <img class="img-item" :src='imageUrl_3'>
                                    </div>
                                </el-col>
                            </div>
                        </div>
                    </el-card>
                    <div style='padding: 14px;'>
                        <el-button-group v-show='!checked.image'>
                            <el-button @click="setResult('image',true)"
                            size='small' type="primary" icon="el-icon-check" round></el-button>
                            <el-button @click="setResult('image',false)"
                            size='small' type="info" icon="el-icon-close" round></el-button>
                        </el-button-group>
                        <el-tag v-show='checked.image && this.reviewResult.imageResult'
                            closable
                            :disable-transitions="false"
                            @close="handleClose('image')">
                            通过
                        </el-tag>
                        <el-tag v-show='checked.image && !this.reviewResult.imageResult' type="danger"
                            closable
                            :disable-transitions="false"
                            @close="handleClose('image')">
                            不通过
                        </el-tag>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="padding: 0px;">
            <el-button @click="confirmPost" type="primary" icon="el-icon-s-promotion">提交</el-button>
        </div>
    </div>
</template>

<script>
// import Info from '../../assets/js/userInfo.js'
export default {
    data: function(){
        return {
            userId:'',
            imageUrl_1:'../../assets/image/user.jpg',
            imageUrl_2:'../../assets/image/user.jpg',
            imageUrl_3:'../../assets/image/user.jpg',
            userType: '',
            userGrade: 0,
            userInfo: [],//属性中增加用户id
            checked:{//是否已经选择过审核结果
                info: false,
                grade: false,
                image: false
            },
            reviewResult: { //审核结果
                infoResult: '',
                gradeResult: '',
                imageResult: ''
            },
            isPost: false //是否提交成功
        }
    },
    methods:{
        getFullInfo(){//从后端获取当前审核用户的全部信息
            //this.userId = this.$route.query.userId;//获取跳转界面的userId
            console.log(this.$route.query.userId);
            console.log(this.userId);

            //let Base64 = require('js-base64').Base64;

            this.checked.info = false;
            this.checked.grade = false;
            this.checked.image = false;

            const postData = {
                    userId: ''
            }

            if (this.$route.query.userId != undefined){
                postData.userId= this.$route.query.userId
            }
            
            console.log("userId: " + postData.userId);
            var that = this;
            this.$axios.post('/api/reviewer/getUserInfo', this.$Qs.stringify(postData)
            ).then(function(response){
                console.log("response: " , response.data);
                that.userInfo = response.data.userInfo;
                that.imageUrl_1 = 'data:image/png;base64,' + response.data.imageUrl_1;
                that.imageUrl_2 = 'data:image/png;base64,' + response.data.imageUrl_2;
                that.imageUrl_3 = 'data:image/png;base64,' + response.data.imageUrl_3;
                that.userType = response.data.userType;
                that.userGrade = response.data.userGrade;
                var code = response.data.code;
                if (code == '205'){
                    that.$msgbox({
                        type: 'info',
                        title: '审核已完成',
                        message:'你已审核完目前所有的待审核用户！'
                    });
                    that.$router.push('/reviewer/home');
                }else if (code == '204'){
                    that.$message({
                        type: 'success',
                        message: '已获取下一位待审核用户'
                    });
                }else {
                    that.$msgbox({
                        type: 'error',
                        title: '系统异常',
                        message:'未知状态码！'
                    });
                }
            }).catch(function(error){
                console.log(error);
                that.$msgbox({
                    type: 'error',
                    title: '连接异常',
                    message:'获取待审核用户信息失败！'
                })
            })
        },

        setResult(part, isPass){
            switch(part){
                case 'info':
                    this.reviewResult.infoResult = isPass;
                    this.checked.info = true;
                    break;
                case 'grade':
                    this.reviewResult.gradeResult = isPass;
                    this.checked.grade = true;
                    break;
                case 'image':
                    this.reviewResult.imageResult = isPass;
                    this.checked.image = true;
            }
        },

        handleClose(part){
            switch(part){
                case 'info':
                    this.reviewResult.infoResult = null;
                    this.checked.info = false;
                    break;
                case 'grade':
                    this.reviewResult.gradeResult = null;
                    this.checked.grade = false;
                    break;
                case 'image':
                    this.reviewResult.imageResult = null;
                    this.checked.image = false;
            }
        },

        confirmPost(){//弹出确认提交消息框
            //在确认消息框中显示审核结果
            this.$confirm('此操作将提交审核结果, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.postResult();//提交结果
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交！'
                });
            });
        },

        postResult(){//提交审核结果
            // console.log(this.checked.info && this.checked.grade && this.checked.image);
            //只有当所有选项都被选择之后才能提交
            if (this.checked.info && this.checked.grade && this.checked.image){
                var that = this;
                const postData = {
                    userId: this.userInfo[0].content,
                    infoResult: this.reviewResult.infoResult,
                    gradeResult: this.reviewResult.gradeResult,
                    imageResult: this.reviewResult.imageResult
                }
                console.log(this.$Qs.stringify(postData));
                this.$axios.post('/api/reviewer/postResult',that.$Qs.stringify(postData)
                ).then(function(response){
                    console.log(response);
                    if (response.data.code == '201'){
                        that.isPost = true;
                    }else if (response.data.code == '202'){
                        that.isPost = false;
                    }else if (response.data.code == '203'){
                        that.isPost = true;
                        that.$msgbox({
                            type: 'error',
                            title: '系统异常',
                            message:'系统开户失败！'
                        });
                    }else{
                        that.isPost = false;
                        that.$msgbox({
                            type: 'error',
                            title: '系统异常',
                            message:'未知状态码！'
                        });
                    }
                    console.log('提交状态:' + that.isPost);//控制台查看提交状态
                    if(that.isPost){
                        that.$message({
                            type: 'success',
                            message: '确认提交！'
                        });
                        that.isPost = false;
                        that.getFullInfo();//继续获取下一个待审核用户的信息
                    }
                    else{
                        that.$message.error('提交失败！');
                        that.isPost = false;
                    }
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type: 'error',
                        title: '连接错误',
                        message:'与后台服务器通讯失败！'
                    });
                    return false;
                });
            }
            else{
                this.$msgbox({
                    type: 'error',
                    title: '格式错误',
                    message:'您没有审核所有信息！'
                });
                return false;
            }
        }
    },

    mounted(){
        this.getFullInfo();
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

    .box-card {
        height: 270px;
    }

    .review-info {
        height: 360px;
        /* max-height: 360px;
        min-height: 360px; */
    }

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
        max-width: 85%;
        top:0;
        left:0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
</style>
