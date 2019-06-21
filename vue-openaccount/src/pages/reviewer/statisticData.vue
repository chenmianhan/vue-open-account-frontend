<template>
    <div class='statistic item'>
        <!-- 页头 -->
        <el-row :gutter="12">
            <el-col :span="12">
                <el-card shadow="hover">
                    <div class='firm item'>
                        <el-row v-model='getFirmName'>你所负责的机构：{{ exchangeName }}</el-row>
                        <el-row v-model='getFirmName'>你所负责的网点：{{ branchNetworkName }}</el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <div class='data item'>
                        <el-row v-model='getFirmName'>
                            待审核人数 {{ toReviewNum }}
                            <el-button type="text" @click='goToReview' class="button">立即前往</el-button>
                        </el-row>
                        <el-row v-model='getFirmName'>已审核人数 {{ reviewedNum }}</el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 日期查询 -->
        <el-row>
            <span class="demonstration">查询选择日期范围内的已审核用户信息</span>
        </el-row>
        <el-row>
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
        </el-row>
        <!-- 下方的表格：固定表头 -->
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="userId" label="用户id"  width="80">
            </el-table-column>
            <el-table-column prop="userName" label="姓名" width="80">
            </el-table-column>
            <el-table-column prop="gender" label="性别" width='60'>
            </el-table-column>
            <el-table-column prop="idCardNum" label="身份证号码" width='210'>
            </el-table-column>
            <el-table-column prop="contactNum" label="联系方式" width='140'>
            </el-table-column>
            <el-table-column prop="accExchangeName" label="开户机构" width='129'>
            </el-table-column>
            <el-table-column prop="accbranchNetworkName" label="开户营业网点" width='130'>
            </el-table-column>
            <el-table-column prop="accTime" label="开户时间" width='210'>
            </el-table-column>
        </el-table>
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
             dateValue:''
          }
    },

    methods: {
        getFirmName(){
            console.log('here!');
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

<style>
    .text {
        font-size: 18px;
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