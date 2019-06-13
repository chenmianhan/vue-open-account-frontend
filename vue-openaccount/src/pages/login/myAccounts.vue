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
                            <el-button class='button' type="text"@click="handleWithdraw">提现</el-button>
                            <el-button class='button' type="text" @click="handleRecharge">充值</el-button>
                        </el-row>
                        <el-row class="primary-account">
                            <img src="../../assets/coin.png" class="primary-coin"><span class="title-money">余额：￥{{primaryAccount}}</span>
                        </el-row>
                    </el-card>
                    <div v-for="item in secondaryAccount" :key='item'>
                        <el-row>
                            <el-col :span='16'>
                                <el-card class="secon-account" shadow='hover'>
                                    <el-row>
                                        <!-- <span style="float: left;">主资金账户</span> -->
                                        <el-button class='button' type="text" @click="handleWithdraw">提现</el-button>
                                        <el-button class='button' type="text" @click="handleRecharge">充值</el-button>
                                    </el-row>
                                    <el-row class="seco-account">
                                        <!-- <img src="../../assets/coin.png" class="secon-coin"> -->
                                        <span class="second-money">余额：￥{{item}}</span>
                                    </el-row>
                                </el-card>
                            </el-col>
                            <el-col :span='6'>
                                <el-button size="small" type="danger" round style="margin: 50px 0;" @click="handleDelete">删 除</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span='8'>
                    <div class="line">
                        <el-timeline>
                            <el-timeline-item v-for="(amount, index) in bill" :key="index" :timestamp='amount.timestep'>{{amount.value}}</el-timeline-item>
                        </el-timeline>
                        <el-button type='text' @click="lineVisible = true">>> 查看更多流水</el-button>
                    </div>
                </el-col>
            </el-tab-pane>
            <el-tab-pane label="证券账户" name="second">证券账户</el-tab-pane>
        </el-tabs>
        <!-- 对话框 -->
        <el-dialog title="充值" :visible.sync="rechargeVisible" width="30%">
        <el-form :model="rechargeForm">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth">
            <el-input size="small" v-model="rechargeForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="充值金额" :label-width="formLabelWidth">
            <el-input size="small" v-model="rechargeForm.value" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="rechargeVisible = false" size="small" >取 消</el-button>
            <el-button type="primary" @click="rechargeVisible = false" size="small">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 提现 -->
        <el-dialog title="提现" :visible.sync="withdrawVisible" width="30%">
        <el-form :model="withdrawForm">
            <el-form-item label="储蓄卡" :label-width="formLabelWidth">
            <el-input size="small" v-model="withdrawForm.cardID" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="提现金额" :label-width="formLabelWidth">
            <el-input size="small" v-model="withdrawForm.value" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="withdrawVisible = false" size="small" >取 消</el-button>
            <el-button type="primary" @click="withdrawVisible = false" size="small">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 流水 -->
        <el-dialog title="流水明细" :visible.sync='lineVisible' width="30%" class="lineDialog">
            <el-timeline>
                <el-timeline-item v-for="(amount, index) in moreBill" :key="index" :timestamp='amount.timestep'>
                    {{amount.value}}
                </el-timeline-item>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="lineVisible = false" size="small">取 消</el-button>
                    <el-button @click="lineVisible = false" size="small" type="primaty">确 定</el-button>
                </div>
            </el-timeline>
        </el-dialog>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            accountName: 'first',
            primaryAccount: 12345.67,
            secondaryAccount: [1234.56, 123.45],
            bill: [{
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-12',
                value: '+100.34'
            }, {
                timestep: '2019-06-11',
                value: '-110.00'
            }, {
                timestep: '2019-06-10',
                value: '+100.00'
            }],
            moreBill: [{
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }, {
                timestep: '2019-06-13',
                value: '-100.30'
            }],
            rechargeVisible: false,
            withdrawVisible: false,
            visible: false,
            lineVisible: false,
            withdrawForm: {
                cardID: '',
                value: 0
            },
            rechargeForm: {
                cardID: '',
                value: 0
            },
            formLabelWidth: '70px'
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleRecharge(){
            this.rechargeVisible = true;
        },
        handleWithdraw(){
            this.withdrawVisible = true;
        },
        handleDelete(){
            this.$confirm('此操作将永久删除此账号，是否继续？', "警告", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type:'success',
                    message: '删除成功！'
                });
            }).catch(() => {
                this.$message({
                    type:'info',
                    message: '已取消删除'
                });
            });
        }
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
.secon-account:hover{
    background-color: #E4E7ED;
    transform: scale(1.02);
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
    margin-top: 50px;
}
</style>
