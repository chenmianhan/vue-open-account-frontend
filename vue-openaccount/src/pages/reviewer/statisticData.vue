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
                        <el-row>{{ exchangeName }}</el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="font-weight:bold">
                        <span>你所负责的网点</span>
                    </div>
                    <div class='text item'>
                        <el-row>{{ branchNetName }}</el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="font-weight:bold">
                        <span>已审核人数</span>
                    </div>
                    <div class="text item">
                        <el-row>{{ reviewedNum }} </el-row>
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
                        <el-row>{{ toReviewNum }} </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <!-- 日期查询 -->
        <div style="padding: 5px; text-align: center;">
            <!-- <p>{{ dateValue[0] }} + {{ dateValue[1] }}</p> -->
            <el-date-picker
                v-model="dateValue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="所选日期范围最大为一周" placement="right">
                <el-button @click='getTableData' icon='el-icon-search' type='primary' round>查询</el-button>
            </el-tooltip>
        </div>
        <!-- 下方的表格：
        固定表头
        默认开户时间降序排列
        可选择开户机构/营业网点进行排序
         -->
        <div style="padding: 14px;">
            <el-table v-loading="loading" :data="tableData" 
            :default-sort = "{prop: 'accTime', order: 'descending'}" 
            border style="width: 100%">
                <el-table-column prop="userId" label="用户id" width="80">
                </el-table-column>
                <el-table-column prop="userName" label="姓名" width="80">
                </el-table-column>
                <el-table-column prop="idCardNum" label="身份证号码" width='180'>
                </el-table-column>
                <el-table-column prop="contactNum" label="联系方式" width='140'>
                </el-table-column>
                <el-table-column prop="accExchangeName" label="开户机构" sortable width='140'>
                </el-table-column>
                <el-table-column prop="accBranchNetName" label="开户营业网点" sortable width='140'>
                </el-table-column>
                <el-table-column prop="accTime" sortable label="开户时间">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            reviewerId: localStorage.getItem('ms_username'),
            exchangeName: '上海证券交易所',
            branchNetName: '广发证券公司',
            toReviewNum: 0,
            reviewedNum: 0,

            dateValue:'', //字符串数组object,dateValue[0]/[1]为开始/结束日期yyyy-mm-dd
            tableData: [{//表格用户对象列表
                userId: '1',
                userName:'张三',
                idCardNum:'510504199901010311',
                contactNum:'13800000000',
                accExchangeName:'上海证券交易所',
                accBranchNetName:'广发证券公司',
                accTime:'2000-01-01 00:00:00'
            }],
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
             loading: true
          }
    },

    methods: {
        getReviewerInfo(){//获取从属机构名称以及该审核员统计数据
            var that = this;
            const postData = {
                reviewerId: this.reviewerId
            }
            //向后端传输审核员的ID，后端返回审核员信息
            this.$axios.post('/api/statisticData/getReviewerInfo', this.$Qs.stringify(postData)
            ).then(function(response) {
                console.log(response.data);
                that.exchangeName = response.data.exchangeName;
                that.branchNetName = response.data.branchNetName;
                that.toReviewNum = response.data.toReviewNum;
                that.reviewedNum = response.data.reviewedNum;
            }).catch(function(error){
                console.log(error);
                that.$msgbox({
                    type: 'error',
                    title: '连接异常',
                    message:'获取审核员信息和统计数据失败！'
                });
            });
        },

        getTableData(){//根据选择日期范围显示用户信息
            const postData = {
                reviewerId: this.reviewerId,
                start: this.dateValue[0],
                end: this.dateValue[1]
            }
            var that = this;
            console.log(postData);
            //向后端传输日期范围，后端返回该范围中已审核的用户信息对象列表
            //一个对象元素对应一个用户信息
            this.$axios.post('/api/statisitcData/getUserInfo', this.$Qs.stringify(postData)
            ).then(function(response){
                console.log(response.data);
                that.tableData = response.data.userInfoList;
                that.loading = false;
            }).catch(function(error){
                console.log(error);
                that.$msgbox({
                    type:'error',
                    title: '连接异常',
                    meassage: '获取已审核用户信息失败！'
                });
            });
        },

        setDefaultDate(){//默认显示最近一周已审核用户信息
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

            var dateRange = new Array(start, end);
            var reg = new RegExp( '/' , "g" );
            dateRange[0] = dateRange[0].toLocaleDateString().replace(reg,'-');
            dateRange[1] = dateRange[1].toLocaleDateString().replace(reg,'-');

            this.dateValue = dateRange;
        },

        goToReview(){//跳转到开始审核界面
            this.$router.push('/reviewer/reviewUser');
        },
    },

    mounted(){
        this.getReviewerInfo();
        this.setDefaultDate();
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