<template>
    <div class='statistic item'>
        <!-- 页头 -->
        <el-row :gutter="12">
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="font-weight:bold">
                        <span>你所负责的机构</span>
                    </div>
                    <div class='text item'>
                        <el-row v-model='getFirmName'>{{ exchangeName }}</el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="font-weight:bold">
                        <span>你所负责的网点</span>
                    </div>
                    <div class='text item'>
                        <el-row v-model='getFirmName'>{{ branchNetworkName }}</el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="font-weight:bold">
                        <span>已审核人数</span>
                    </div>
                    <div class="text item">
                        <el-row v-model='getStatisticData'>{{ reviewedNum }} </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="font-weight:bold">
                        <span>待审核人数</span>
                        <el-button @click='goToReview' size='mini' style="float: right; padding: 3px 0" type="text">
                            立即前往<i class="el-icon-arrow-right el-icon--right"></i>
                        </el-button>
                    </div>
                    <div class="text item">
                        <el-row v-model='getStatisticData'>{{ toReviewNum }} </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 日期查询 -->
        <div style="padding: 5px; text-align: center;">
            <el-date-picker
                v-model="dateValue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="所选日期范围最大为一周" placement="right">
                <el-button icon='el-icon-search' type='primary' circle></el-button>
            </el-tooltip>
        </div>
        <!-- 下方的表格：固定表头 -->
        <div style="padding: 14px;">
            <el-table v-loading="loading" :data="tableData" border style="width: 100%">
                <el-table-column prop="userId" label="用户id"  width="80">
                </el-table-column>
                <el-table-column prop="userName" label="姓名" width="80">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width='60'>
                </el-table-column>
                <el-table-column prop="idCardNum" label="身份证号码" width='180'>
                </el-table-column>
                <el-table-column prop="contactNum" label="联系方式" width='140'>
                </el-table-column>
                <el-table-column prop="accExchangeName" label="开户机构" width='140'>
                </el-table-column>
                <el-table-column prop="accbranchNetworkName" label="开户营业网点" width='140'>
                </el-table-column>
                <el-table-column prop="accTime" label="开户时间">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            exchangeName: '上海证券交易所',
            branchNetworkName: '广发证券公司',
            toReviewNum: 0,
            reviewedNum: 0,
            tableData: [{//表格用户对象列表
                userId: '1',
                userName:'张三',
                gender:'女',
                idCardNum:'510504199901010311',
                contactNum:'13800000000',
                accExchangeName:'上海证券交易所',
                accbranchNetworkName:'广发证券公司',
                accTime:'2000-01-01 00:00:00'
            }],
            userData:{//已审核用户的信息对象项
                userId: '',
                userName:'',
                gender:'',
                idCardNum:'',
                contactNum:'',
                accExchangeName:'',
                accbranchNetworkName:'',
                accTime:'2000-01-01 00:00:00'
            },
             pickerOptions: {//日期选择器的快捷选项
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }]
             },
             dateValue:'',
             loading: false
          }
    },

    methods: {
        getFirmName(){
            console.log('here!');
        },

        getStatisticData(){
            console.log('here here1!');
        },

        goToReview(){//跳转到开始审核界面
            this.$router.push('/reviewer/reviewUser');
        },

        getTableData(){//表格显示已审核用户信息
            console.log('and here!');
        }
    },

    mounted(){
        this.getFirmName();
        this.getTableData();
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
        width: 480px;
    }

    .card-box {
        height: 100px;
    }
</style>