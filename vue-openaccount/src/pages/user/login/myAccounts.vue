<template>
<div>
    <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户</el-breadcrumb-item>
            <el-breadcrumb-item>我的账户</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="account-box">
        <el-tabs v-model="accountName" @tab-click='handleClick'>
            <el-tab-pane label="资金账户" name="first">
                <el-col :span="16">
                    <el-card class="main-account" shadow='hover'>
                        <el-row>
                            <!-- <span style="float: left;">主资金账户</span> -->
                            <el-button class='button' type="text" @click="handleWithdraw(primaryAccount)">提现</el-button>
                            <el-button class='button' type="text" @click="handleRecharge(primaryAccount)">充值</el-button>
                        </el-row>
                        <el-row class="primary-account">
                            <img src="../../../assets/image/coin.png" class="primary-coin"><span class="title-money">余额：￥{{primaryAccount.balance}}</span>
                        </el-row>
                    </el-card>
                    <div v-for="item in secondaryAccount" :key='item.id'>
                        <el-row>
                            <el-col :span='16'>
                                <el-card class="secon-account" shadow='hover'>
                                    <el-row>
                                        <el-button class='button' type="text" @click="handleWithdraw(item)">提现</el-button>
                                        <el-button class='button' type="text" @click="handleRecharge(item)">充值</el-button>
                                    </el-row>
                                    <el-row class="seco-account">
                                        <!-- <img src="../../assets/coin.png" class="secon-coin"> -->
                                        <span class="second-money">余额：￥{{item.balance}}</span>
                                    </el-row>
                                </el-card>
                            </el-col>
                            <el-col :span='6'>
                                <el-button size="small" type="danger" round style="margin: 50px 0;" @click="handleDelete(item.id)">删 除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row style="margin-bottom:50px;">
                        <el-col :span='16'>
                            <a @click="addVisible = true">
                            <el-card class="secon-account-plus" shadow='hover'>
                                <el-row class="seco-account-plus">
                                    <i class='el-icon-circle-plus plus'></i><span class="second-money">添加资金账户</span>
                                </el-row>
                            </el-card>
                            </a>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span='8'>
                    <div class="line">
                        <el-timeline>
                            <el-timeline-item v-for="(amount, index) in bill" :color='amount.color' :key="index" :timestamp='amount.timestep'>
                                <span style="float: left;margin-left: 5px;">{{amount.message}}</span>{{amount.value}}
                            </el-timeline-item>
                        </el-timeline>
                        <el-button type='text' @click="handleMoreDetail">>> 查看更多流水</el-button>
                    </div>
                </el-col>
            </el-tab-pane>
            <el-tab-pane label="证券账户" name="second">
                <el-card class="box-card" shadow='hover'>
                <div slot="header" class="clearfix">
                    <span>上海证券交易所</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <div class="text item">
                    {{netPoint.n_netpoint}}
                </div>
                </el-card>
                <el-card class="box-card" shadow='hover'>
                <div slot="header" class="clearfix">
                    <span>深圳证券交易所</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <div class="text item">
                    {{netPoint.s_netpoint}}
                </div>
                </el-card>
            </el-tab-pane>
        </el-tabs>
        <!-- 对话框 -->
        <el-dialog title="充值" :visible.sync="rechargeVisible" width="30%">
        <el-form :model="rechargeForm" :rules="rules" ref="rechargeForm">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth" prop="cardID">
            <el-input size="small" :disabled="true" v-model="rechargeForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="充值金额" :label-width="formLabelWidth" prop="value">
            <el-input size="small" v-model="rechargeForm.value" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="账户密码" :label-width="formLabelWidth" prop="password">
            <el-input size="small" type="password" v-model="rechargeForm.password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="rechargeVisible = false" size="small" >取 消</el-button>
            <el-button type="primary" @click="rechargeOK(rechargeForm.account)" size="small">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 提现 -->
        <el-dialog title="提现" :visible.sync="withdrawVisible" width="30%">
        <el-form :model="withdrawForm" :rules="rules" ref="withdrawForm">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth" prop="cardID">
            <el-input size="small" :disabled="true" v-model="withdrawForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="提现金额" :label-width="formLabelWidth" prop="value">
            <el-input size="small" v-model="withdrawForm.value" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="账户密码" :label-width="formLabelWidth" prop="password">
            <el-input size="small" type="password" v-model="withdrawForm.password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="withdrawVisible = false" size="small" >取 消</el-button>
            <el-button type="primary" @click="withdrawOK(withdrawForm.account)" size="small">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 添加账户 -->
        <el-dialog title="添加账户" :visible.sync="addVisible" width="30%">
        <el-form :model="addForm">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth">
            <el-input size="small" v-model="addForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="账户密码" :label-width="formLabelWidth">
            <el-input size="small" type="password" v-model="addForm.password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false" size="small" >取 消</el-button>
            <el-button type="primary" @click="handleAdd" size="small">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</div>
</template>

<script>
import Bill from '../../../assets/js/timeLine.js';
import account from '../../../assets/js/myAccount';
export default {
    data() {
        return {
            accountName: 'first',
            primaryAccount: data.primaryAccount,
            secondaryAccount: data.secondaryAccount,
            bill: billLittle,
            addVisible: false,
            rechargeVisible: false,
            withdrawVisible: false,
            visible: false,
            withdrawForm: {
                cardID: '',
                value: 0,
                password: ''
            },
            rechargeForm: {
                cardID: '',
                value: 0,
                password: ''
            },
            addForm: {
                cardID: '',
                password: ''
            },
            formLabelWidth: '80px',
            rules: {
                value: [
                    {required: true, message: '请输入金额', trigger: 'blur'},
                    {min: 0, message: "每笔交易金额下限为0元", trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                cardID: [
                    {required: true, message: '请输入卡号', trigger: 'blur'}
                ]
            },
            netPoint: netPoint
        }
    },
    methods: {
        getData(){
            var that = this;
            this.$axios.get('').then(function(response){
                that.primaryAccount = response.data.primaryAccount;
                that.secondaryAccount = response.data.secondaryAccount;
                if(response.data.bill.length >= 5){
                    that.bill = response.data.bill.slice(0, 5);
                }else{
                    that.bill = response.data.bill;
                }
            }).catch(() => {
                that.$msgbox.error({
                    title: '连接失败'
                });
            });
        },
        handleAdd(){
            var that = this;
            this.$axios.post('', that.addForm.cardID).then(function(response){
                if(this.addForm.password == '111111'){
                    that.$message.success({
                        message: '添加账户成功'
                    });
                    that.getData();
                }else{
                    that.$message.error({
                        message: '密码错误'
                    });
                }
            }).catch(() => {
                that.$message.error({
                    message: '连接失败'
                });
            });
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleRecharge(item){
            this.rechargeForm.cardID = item.cardID;
            this.rechargeForm.account = item;
            this.rechargeVisible = true;
        },
        rechargeOK(account){
            this.$refs['rechargeForm'].validate((valid) => {
                if(valid){
                    if(this.rechargeForm.password == '111111'){
                        account.balance += parseFloat(this.rechargeForm.value);
                        this.$message.success({
                            message: '充值成功'
                        });
                        this.rechargeVisible = false;
                    } else {
                        this.$message.error({
                            message: '密码错误'
                        });
                    }
                }
            });
        },
        withdrawOK(account){
            this.$refs['withdrawForm'].validate((valid) => {
                if(valid){
                    if(this.withdrawForm.password == '111111'){
                        if(account.balance < parseFloat(this.withdrawForm.value)){
                            this.$message.error({
                                message: '余额不足'
                            });
                        } else{
                            account.balance -= parseFloat(this.withdrawForm.value);
                            this.$message.success({
                                message: '提现成功，将在24小时内到账'
                            });
                            this.withdrawVisible = false;
                        }
                    }else{
                        this.$message.error({
                            message: '密码错误'
                        });
                    }
                }
            });
        },
        handleWithdraw(account){
            this.withdrawForm.cardID = account.cardID;
            this.withdrawForm.account = account;
            this.withdrawVisible = true;
        },
        handleDelete(index){
            var that = this;
            this.$confirm('此操作将永久删除此账号，是否继续？', "警告", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('', index).then(function(response){
                    that.secondaryAccount.splice(index,1);
                    that.$message({
                        type:'success',
                        message: '删除成功！'
                    });
                }).catch(() => {
                    that.$message.error({
                        message: '连接失败'
                    });
                });
            }).catch(() => {
                this.$message({
                    type:'info',
                    message: '已取消删除'
                });
            });
        },
        handleMoreDetail(){
            this.$router.push({path:'/user/lineDetail'});
        }
    },
    mounted(){
        // this.getData();
    }
}
</script>

<style scoped>
.account-box {
    margin-top: 40px;
    margin-left: 40px;
}
.bread {
    margin: 10px;
}
.button {
    float: right; 
    padding: 3px 10px;
}
.secon-account {
    margin: 20px 0 0 20px;
    /* width: 70%; */
    transition: all 0.4s;
    background-color: #fff;
}
.secon-account-plus {
    margin: 20px 0 0 20px;
    /* width: 70%; */
    transition: all 0.4s;
    background-color: #fff;
    height: 94px;
    color: #909399;
}
.secon-account:hover{
    background-color: #E4E7ED;
    transform: scale(1.02);
}
.secon-account-plus:hover{
    background-color: #E4E7ED;
    transform: scale(1.20);
}
.main-account {
    margin: 20px 0 5px 20px;
    /* width: 70%; */
    transition: all 0.4s;
    background-color: #E3EDF7;
}
.main-account:hover{
    transform: scale(1.02);
    background-color: #A3B8CD;
    color: #fff;
}
.title-money {
    font-size: 26px;
    margin-left: 30px;
    margin-bottom: 30px;
}
.second-money {
    font-size: 18px;
    margin-left: 30px;
    margin-bottom: 30px;
}
.primary-account{
    height: 70px;
    /* line-height: 50px; */
    float: left;
    margin: 5px;
}
.seco-account{
    height: 40px;
    /* line-height: 50px; */
    float: left;
    margin: 5px;
}
.primary-coin {
    width: 60px;
    height: 60px;
    margin-top: -10px;
}
.secon-coin {
    width: 30px;
    height: 30px;
    margin-top: 5px;
}
.line {
    margin-top: 40px;
    margin-left: 30px;
    position:fixed;
    border-left: 1px solid #DCDFE6;
    /* background-color: black; */
}
.box-card{
    width:70%;
    margin: 5px auto;
    margin-top:40px;
}
.plus-button{
    padding:50px;
    text-align: right;
    position: fixed;
    /* background-color: black; */
    width: 70%;
    bottom: 0;
    /* overflow: hidden; */
}
.plus{
    font-size:40px;
}
</style>
