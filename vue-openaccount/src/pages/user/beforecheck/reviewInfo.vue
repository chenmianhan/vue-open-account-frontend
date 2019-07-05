<template>
    <div>
        <el-divider><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i></el-divider>
        <el-row style="width: 80%; margin: 0 auto;">
            <el-col :span="12">
                <div class="title">用户个人信息</div>
                <div class="block">
                    <el-form :model="infoForm" ref="infoForm" label-width="100px" class="demo-infoForm">
                        <el-form-item label="真实姓名" prop="name">
                            
                        </el-form-item>
                        <el-form-item label="证件号码" prop="idNum">
                            
                        </el-form-item>

                        <el-form-item label="证件住址" prop="id_address">

                        </el-form-item>
                        <el-form-item label="证件有效期" prop="dates">
                            
                        </el-form-item>
                        <el-form-item label="发证机关" prop="agency">
                            
                        </el-form-item>
                        <el-form-item label="联系地址" prop="contact_address">
                            
                        </el-form-item>
                        <el-form-item label="邮寄地址" prop="mail_address">
                            
                        </el-form-item>
                        <el-form-item label="职业" prop="job">
                            
                        </el-form-item>
                        <el-form-item label="学历" prop="degree">

                        </el-form-item>
                        <el-form-item label="联系邮箱" prop="email">
                            
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="title">风险测评结果</div>
                <div style="width:60%;margin: 0 auto;">

                </div>
            </el-col>
        </el-row>
        <el-row style="width: 80%; margin: 0 auto;">
            <el-col :span="12">
                <div class="title">账户类型和营业网点</div>
                <div class="check">
                    
                </div>
            </el-col>
            <el-col :span="12">
                <div class="title">银行信息</div>
                <div style="width:60%;margin: 0 auto;">

                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
    .title{
        font-size: 20px;
        color: #606266;
        font-weight: bold;
        text-align: left;
        width: 70%;
        margin: 50px auto;
        margin-left: 100px;
        margin-right: 100px;

        border-bottom: 1px solid #909399;
        /* background: #000; */
        }
    .block{
        /* font-weight: bold; */
        text-align: left;
        width: 70%;
        /* margin: 10px auto; */
        margin-left: 100px;
        margin-right: 100px;
        /* background: #000; */
        }

    .demo-infoForm label{
        font-size: 10px;
        color:tomato;
    }
</style>


