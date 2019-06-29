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
                            <img src="../../../assets/image/coin.png" class="primary-coin"><span class="title-money">余额：{{primaryAccount.balance.currency_type}}{{primaryAccount.balance.balance}}</span>
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
                                        <span class="second-money">余额：{{item.balance.currency_type}}{{item.balance.balance}}</span>
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
                <el-card class="box-card" shadow='hover' v-show="netPoint.n_netpoint != null">
                <div slot="header" class="clearfix">
                    <span>上海证券交易所</span>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
                <div class="text item">
                    {{netPoint.n_netpoint}}
                </div>
                </el-card>
                <el-card class="box-card" shadow='hover' v-show="netPoint.s_netpoint != null">
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
        <el-form :model="addForm" ref="addForm" :rules="rules">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth" prop="cardID">
            <el-input size="small" v-model="addForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="账户密码" :label-width="formLabelWidth" prop="password">
            <el-input size="small" type="password" v-model="addForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input size="small" v-model="addForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
            <el-input size="small" v-model="addForm.phone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="开户行" :label-width="formLabelWidth" prop="bank">
            <el-input size="small" v-model="addForm.bank" autocomplete="off"></el-input>
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
            var validatePhone = (rule, value, callback) => {
                //验证手机号格式是否正确
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {//格式正确
                    callback();
                } else {//格式错误
                    return callback(new Error('请输入格式正确的手机号（长度11位）'));
                }
            };
        return {
            accountName: 'first',
            primaryAccount: data.primaryAccount,
            secondaryAccount: data.secondaryAccount,
            bill: [],
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
                ],
                name: [
                    {required: true, message:'请输入姓名', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message:'请输入手机号码',trigger:'blur'},
                    {validator: validatePhone, trigger: 'blur'}
                ],
                bank: [
                    {required: true, message:'请输入开户行',trigger:'blur'}
                ]
            },
            netPoint: data.netPoint
        }
    },
    methods: {
        getData(){
            var that = this;
            // const postData = {
            //     user_id: 17
            // }
            this.$axios.get('/api/account/accountDisplay', {
                params: {user_id: 17}
            }).then(function(response){
                console.log(response.data);
                that.primaryAccount = response.data.primaryAccount;
                that.primaryAccount.balance.balance = that.changeTwoDecimal_f(that.primaryAccount.balance.balance)
                that.secondaryAccount = response.data.secondaryAccount;
                for(var i = 0;i < response.data.secondaryAccount.length; i++){
                    that.secondaryAccount[i].balance.balance = that.changeTwoDecimal_f(that.secondaryAccount[i].balance.balance);
                }
                if(response.data.netPoint.n_netpoint != ''){
                    that.netPoint.n_netpoint = response.data.netPoint.n_netpoint;
                } else{
                    that.netPoint.n_netpoint = null;
                }
                if(response.data.netPoint.s_netpoint != ''){
                    that.netPoint.s_netpoint = response.data.netPoint.s_netpoint;
                } else{
                    that.netPoint.s_netpoint = null;
                }
                // that.netPoint = response.data.netPoint;
            }).catch(() => {
                that.$msgbox.error({
                    title: '连接失败'
                });
            });
        },
        getTimeLine(){
            var that = this;
            const postData = {
                customer_id: '000000000004'
            };
            this.$axios.post('/api/timeline/get_timeline', postData).then(function(response){
                console.log(response.data);
                if(response.data.length >= 5){
                    that.bill = response.data.slice(0, 5);
                }else{
                    that.bill = response.data;
                }
            });
        },
        handleAdd(){
            this.$refs['addForm'].validate((valid) => {
                if(valid){
                    var that = this;
                    const postData = {
                        cardID: this.addForm.cardID,
                        bank: this.addForm.bank
                    }
                    this.$axios.post('', postData).then(function(response){
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
                }
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
                        account.balance.balance += parseFloat(this.rechargeForm.value);
                        account.balance.balance = this.changeTwoDecimal_f(account.balance.balance);
                        this.$message.success({
                            message: '充值成功'
                        });
                        this.rechargeForm.password = '';
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
                        if(account.balance.balance < parseFloat(this.withdrawForm.value)){
                            this.$message.error({
                                message: '余额不足'
                            });
                        } else{
                            account.balance.balance -= parseFloat(this.withdrawForm.value);
                            account.balance.balance = this.changeTwoDecimal_f(account.balance.balance);
                            this.$message.success({
                                message: '提现成功，将在24小时内到账'
                            });
                            this.withdrawForm.password = '';
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
        },
        changeTwoDecimal_f(x){
            var f_x = parseFloat(x);
            if (isNaN(f_x))
            {
                alert('function:changeTwoDecimal->parameter error');
                return false;
            }
            f_x = Math.round(f_x*100)/100;
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0)
            {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2)
            {
                s_x += '0';
            }
            return s_x;
        }
    },
    mounted(){
        this.getData();
        this.getTimeLine();
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
