<template>
<div
    v-loading='loading' 
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
>
<!-- <divsfddfd> -->
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
                                <el-button size="small" type="danger" round style="margin: 50px 0;" @click="handleDelete(item)">删 除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row style="margin-bottom:50px;">
                        <el-col :span='16'>
                            <a @click="handleShow()">
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
                <el-row :gutter="100">
                    <el-row><h3>{{netPoint.netpoint}}</h3></el-row>
                    <!-- <span>{{netPoint}}</span> -->
                    <el-col :span="10">
                        <el-card :body-style="{ padding: '0px' }" v-show="netPoint.trade_type1!=null">
                            <img src="../../../assets/image/sh.jpg" class="image">
                            <div style="padding: 14px;">
                                <span>{{netPoint.trade_type1}}</span>
                                <div class="bottom clearfix">
                                <time class="time">上海证券交易所</time>
                                <!-- <el-button type="text" class="button">详情</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="10">
                        <el-card :body-style="{ padding: '0px' }" v-show="netPoint.trade_type2!=null">
                            <img src="../../../assets/image/sz.jpg" class="image">
                            <div style="padding: 14px;">
                                <span>{{netPoint.trade_type2}}</span>
                                <div class="bottom clearfix">
                                <time class="time">深圳证券交易所</time>
                                <!-- <el-button type="text" class="button">详情</el-button> -->
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

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
            <el-input placeholder="请输入交易密码" size="small" type="password" v-model="rechargeForm.password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="rechargeVisible = false; rechargeForm = {cardID:'',value:'',password:''}" size="small" >取 消</el-button>
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
            <el-input size="small" v-model="withdrawForm.value" autocomplete="off">
            <el-button slot="append" @click="allWithdraw(withdrawForm.account)">全部提现</el-button></el-input>
            </el-form-item>
            <el-form-item label="账户密码" :label-width="formLabelWidth" prop="password">
            <el-input placeholder="请输入交易密码" size="small" type="password" v-model="withdrawForm.password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="withdrawVisible = false;  withdrawForm = {cardID:'',value:'',password:''}" size="small" >取 消</el-button>
            <el-button type="primary" @click="withdrawOK(withdrawForm.account)" size="small">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 添加账户 -->
        <el-dialog title="添加账户" :visible.sync="addVisible" width="30%">
        <el-form :model="addForm" ref="addForm" :rules="rules">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth" prop="cardID">
            <el-input size="small" v-model="addForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="储蓄卡密码" :label-width="formLabelWidth" prop="password">
            <el-input placeholder="请输入密码" size="small" type="password" v-model="addForm.password" autocomplete="off"></el-input>
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
            <el-button @click="addVisible = false;addForm = {cardID:'',password:'',name:'',phone:'',bank:''};" size="small" >取 消</el-button>
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
                if (reg.test(value)) {//格式正确
                    callback();
                } else {//格式错误
                    return callback(new Error('请输入格式正确的手机号（长度11位）'));
                }
            };
            var checkValue = (rule, value, callback) => {
                if(value == ''){
                    return callback(new Error('请输入金额'));
                }else if(parseFloat(value) < 0.00){
                    return callback(new Error('每笔金额必须大于0.00元'))
                }else if(parseFloat(value) > 20000.00){
                    return callback(new Error('每笔交易金额上限为20000.00元'))
                }else{
                    callback();
                }
            }
        return {
            code: false,
            loading: true,
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
                value: '',
                password: ''
            },
            rechargeForm: {
                cardID: '',
                value: '',
                password: ''
            },
            addForm: {
                cardID: '',
                password: ''
            },
            formLabelWidth: '100px',
            rules: {
                value: [
                    // {required: true, message: '请输入金额', trigger: 'blur'},
                    // {min: 10, max: 2000, message: "每笔交易金额下限为0元", trigger: 'blur'}
                    {validator: checkValue, trigger: 'blur'}
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
        handleShow(){
            this.addForm.phone = sessionStorage.getItem('phone');
            this.addVisible = true;
        },
        allWithdraw(item){
            // this.withdrawForm.value = '';
            this.withdrawForm.value = item.balance.balance;
        },
        getData(){
            var that = this;
            this.$axios.get('/api/account/accountDisplay').then(function(response){
                that.primaryAccount = response.data.primaryAccount;
                that.primaryAccount.balance.balance = that.changeTwoDecimal_f(that.primaryAccount.balance.balance)
                that.secondaryAccount = response.data.secondaryAccount;
                for(var i = 0;i < response.data.secondaryAccount.length; i++){
                    that.secondaryAccount[i].balance.balance = that.changeTwoDecimal_f(that.secondaryAccount[i].balance.balance);
                }
                if(response.data.netPoint.trade_type1 != ''){
                    that.netPoint.trade_type1 = response.data.netPoint.trade_type1;
                } else{
                    that.netPoint.trade_type1 = null;
                }
                if(response.data.netPoint.trade_type2 != ''){
                    that.netPoint.trade_type2 = response.data.netPoint.trade_type2;
                } else{
                    that.netPoint.trade_type2 = null;
                }
                that.netPoint.netpoint = response.data.netPoint.netpoint;
                that.loading = false;
                // that.netPoint = response.data.netPoint;
            }).catch((error) => {
                that.$msgbox({
                    type: 'error',
                    title: '连接失败',
                    message: '与后台服务器通讯失败！'
                });
            });
        },
        getTimeLine(){
            var that = this;
            const postData = {
                // user_id: 17
            };
            this.$axios.get('/api/timeline/get_timeline').then(function(response){
                if(response.data.length >= 5){
                    that.bill = response.data.slice(0, 5);
                }else{
                    that.bill = response.data;
                }
            });
        },
        checkPassword(val){
            var that = this;
            this.$axios.get('/api/checkFund', {
                params: {
                    password: val
                }
            }).then(function(response){
                that.code = null;
                if(response.data.code == '201'){
                    that.code = true;
                }else{
                    that.code = false;
                }
            }).catch(() => {
                that.$msgbox({
                    message: '连接失败',
                    type: 'error'
                });
            });
        },
        handleAdd(){
            this.$refs['addForm'].validate((valid) => {
                if(valid){
                    if(true){
                        var that = this;
                        const postData = {
                            bank_account: this.addForm.cardID,
                            bank: this.addForm.bank,
                            password: this.addForm.password
                        }
                        this.$axios.post('/api/account/addFundAccount', postData).then(function(response){
                                that.$message({
                                    message: '添加账户成功',
                                    type: 'success'
                                });
                                that.addVisible = false;
                                that.addForm = {};
                                that.getData();
                        }).catch(() => {
                            that.$message({
                                message: '连接失败',
                                type: 'error'
                            });
                        });
                    }else{
                        this.$message({
                            message: '密码错误',
                            type:'error'
                        });
                    } 
                }
            });
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        handleRecharge(item){
            this.rechargeForm.cardID = item.cardID;
            this.rechargeForm.account = item;
            this.rechargeVisible = true;
        },
        handleRP(account){
            var that = this;
            let postData = {
                // fund_id: account.id,
                fund_id: 'u00000000111',
                amount: this.rechargeForm.value
            }
            console.log('postData',postData)
            this.$axios.post('/api/user/recharge', postData).then(function(response){
                console.log(response.data);
                if(response.data == 1){
                    that.$message({
                        message: '充值成功',
                        type:'success'
                    });
                    that.getData();
                    that.rechargeForm.password = '';
                    that.rechargeVisible = false;
                    that.rechargeForm = {};
                } else{
                    that.$msgbox({
                        message: '充值失败',
                        type: 'error'
                    });
                }
            }).catch(() => {
                console.log('error', error)
                that.$msgbox({
                    message: '连接失败',
                    type: 'error'
                });
            });
        },
        rechargeOK(account){
            console.log('account',account);
            this.$refs['rechargeForm'].validate((valid) => {
                if(valid){
                    var that = this;
                    this.$axios.get('/api/checkFund', {
                        params: {
                            password: that.rechargeForm.password
                        }
                    }).then(function(response){
                        if(response.data.code == '201'){
                            that.handleRP(account);
                        }else{
                            that.$message({
                                message: '密码错误',
                                type:'error'
                            });
                        }
                    }).catch(() => {
                        that.$msgbox({
                            message: '连接失败',
                            type: 'error'
                        });
                    });
                }
            });
        },
        handleWM(account){
            console.log('sdsd')
            if(account.balance.balance < parseFloat(this.withdrawForm.value)){
                this.$message({
                    message: '余额不足',
                    type:'error'
                });
            } else{
                var that = this;
                let postData = {
                    fund_id: 'u00000000111',
                    amount: this.withdrawForm.value
                }
                this.$axios.post('/api/user/withdrawal', postData).then(function(response){
                    if(response.data == 1){
                        that.$message({
                            message: '提现成功，将在24小时内到账',
                            type: 'success'
                        });
                        that.getData();
                        that.withdrawForm.password = '';
                        that.withdrawVisible = false;
                        that.withdrawForm = {cardID:'',value:'',password:''}
                    }else{
                        that.$msgbox({
                            message: '提现失败',
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    that.$msgbox({
                        message: '连接失败',
                        type: 'error'
                    });
                });
            }
        },
        withdrawOK(account){
            this.$refs['withdrawForm'].validate((valid) => {
                if(valid){
                    var that = this;
                    this.$axios.get('/api/checkFund', {
                        params: {
                            password: that.withdrawForm.password
                        }
                    }).then(function(response){
                        if(response.data.code == '201'){
                            that.handleWM(account);
                        }else{
                            that.$message({
                                message: '密码错误',
                                type:'error'
                            });
                        }
                    }).catch(() => {
                        that.$msgbox({
                            message: '连接失败',
                            type: 'error'
                        });
                    });
                }
            });
        },
        handleWithdraw(account){
            this.withdrawForm.cardID = account.cardID;
            this.withdrawForm.account = account;
            this.withdrawVisible = true;
        },
        handleDelete(item){
            var that = this;
            if(item.balance.balance > 0){
                this.$confirm('您的账户还有余额，请全部提现！', "警告", {
                    confirmButtonText: '去提现',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleWithdraw(item);
                })
                return;
            }
            this.$confirm('此操作将永久删除此账号，是否继续？', "警告", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.get('/api/account/deleteFundAccount', {
                    params: {id: item.id}
                }).then(function(response){
                    // that.secondaryAccount.splice(index,1);
                    that.getData();
                    that.$message({
                        type:'success',
                        message: '删除成功！'
                    });
                }).catch(() => {
                    that.$message({
                        message: '连接失败',
                        type:'error'
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
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

</style>
