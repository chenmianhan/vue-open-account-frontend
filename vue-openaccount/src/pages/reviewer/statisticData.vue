<template>
    <div class='statistic-item'>
        <!-- 日期查询 -->
        <div style="margin-bottom: 35px; text-align: left;">
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
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="checkRange()"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="所选日期范围最大为一周" placement="right">
                <el-button @click='getTableData' icon='el-icon-search' type='primary' round>查询</el-button>
            </el-tooltip>
        </div>
        <!-- 页头 -->
        <div class='show-item' style='float: center;'>
            <el-row :gutter="12">
                <el-col :span="4">
                        <div class="show-text-item" style="text-align: left;">
                            <el-row>{{ reviewedNum }} </el-row>
                        </div>
                        <div class="show-data-item">
                            <span>审核通过</span>
                        </div>
                </el-col>
                <!-- <el-col :span='1'>
                    <el-divider direction='vertical'></el-divider>
                </el-col> -->
                <el-col :span="4">
                        <div class='show-text-item' style="color:maroon;">
                            <el-row>{{ notPassNum }}</el-row>
                        </div>
                        <div class="show-data-item">
                            <span>审核不通过</span>
                        </div>
                </el-col>
                <el-col :span="4">
                        <div class="show-text-item" style="text-align: left;">
                            <el-row>{{ toReviewNum }} </el-row>
                        </div>
                        <div class="show-data-item">
                            <span>等待审核</span>
                        </div>
                </el-col>
            </el-row>
        </div>
        <!-- 下方的表格：
        默认开户时间降序排列
         -->
        <div style="margin-top: 5px;">
            <el-table 
            v-loading='loading' 
            :data="tableData" 
            stripe
            ref="filterTable"
            :default-sort = "{prop: 'accTime', order: 'descending'}" 
            style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item>
                                <span style='color: #99a9bf;'>证件有效期：</span>
                                <span>{{ props.row.idValDate }}</span>
                            </el-form-item>
                            <el-form-item>
                                <span style='color: #99a9bf;'>发证机关：</span>
                                <span>{{ props.row.idInstitute }}</span>
                            </el-form-item>
                            <!-- <el-form-item label="职业">
                                <span>{{ props.row.userJob }}</span>
                            </el-form-item>
                            <el-form-item label="学历">
                                <span>{{ props.row.education }}</span>
                            </el-form-item> -->
                            <el-form-item>
                                <span style='color: #99a9bf;'>联系邮箱：</span>
                                <span>{{ props.row.email }}</span>
                            </el-form-item>
                            <el-form-item>
                                <span style='color: #99a9bf;'>银行名称：</span>
                                <span>{{ props.row.bankName }}</span>
                            </el-form-item>
                            <el-form-item>
                                <span style='color: #99a9bf;'>银行卡号：</span>
                                <span>{{ props.row.bankCardNum }}</span>
                            </el-form-item>
                            <!-- <el-form-item label="开户时间">
                                <span>{{ props.row.accTime }}</span>
                            </el-form-item> -->
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="姓名" width="100">
                </el-table-column>
                <el-table-column prop="idCardNum" label="身份证号码" width='180'>
                </el-table-column>
                <!-- <el-table-column prop="idValDate" label="证件有效期" width="120">
                </el-table-column>
                <el-table-column prop="idInstitute" label="发证机关" width="80">
                </el-table-column>-->
                <el-table-column prop="userJob" label="职业" width="100">
                </el-table-column>
                <el-table-column prop="education" label="学历" width="100">
                </el-table-column>
                <!--<el-table-column prop="email" label="联系邮箱" width='110'>
                </el-table-column>
                <el-table-column prop="bankName" label="银行" width="90">
                </el-table-column>
                <el-table-column prop="bankCardNum" label="银行卡号" width="160">
                </el-table-column>-->
                <el-table-column prop="accTime" sortable label="开户时间">
                </el-table-column>
                <el-table-column
                    prop="reviewStatu"
                    label="审核状态"
                    width="100"
                    :filters="[{ text: '通过', value: '通过' }, { text: '未通过', value: '未通过' }
                    , { text: '待审核', value: '待审核' }]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="filterTagColor(scope.row.reviewStatu)"
                        disable-transitions>{{scope.row.reviewStatu}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            toReviewNum: 0,
            reviewedNum: 0,
            notPassNum: 0,

            dateValue:'', //字符串数组object,dateValue[0]/[1]为开始/结束日期yyyy-mm-dd

            tableData: [{//表格用户对象列表
                userName:'张三',
                idCardNum:'510504199901010311',
                idValDate:'yyyy-mm-dd 至 yyyy-mm-dd',
                idInstitute: 'xx市xx区派出所',
                userJob: '医生',
                education: '大学',
                email: 'xxx@123.com',
                bankName: '工商银行',
                bankCardNum: '48372614784591975',
                accTime:'2000-01-01 00:00:00',
                reviewStatu:'通过'
            }],
             pickerOptions: {//日期选择器的快捷选项
                shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        end.setTime(end.getTime());
                        picker.$emit('pick', [start, end]);
                    }
                }]
             },
             loading: false
          }
    },

    methods: {
        filterTag(value, row) {//过滤标签
            return row.reviewStatu === value;
        },

        filterTagColor(statu){ //标签颜色
            if (statu === '通过'){
                return 'success';
            }else if (statu === '未通过'){
                return 'danger';
            }else if (statu === '待审核'){
                return 'info';
            }else{
                return 'primary';
            }
        },

        getReviewerInfo(){//获取该审核员统计数据
            if(this.dateValue != ''){
                var that = this;
                const postData = {
                    start: this.dateValue[0],
                    end: this.dateValue[1]
                };
                console.log(this.$Qs.stringify(postData));

                //向后端传输审核员的ID，后端返回审核员信息
                this.$axios.post('/api/api/statisticData/getReviewerInfo', this.$Qs.stringify(postData)
                ).then(function(response) {
                    console.log(response.data);
                    that.toReviewNum = response.data.toReviewNum;
                    that.reviewedNum = response.data.reviewedNum;
                    that.notPassNum = response.data.notPassNum;
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type: 'error',
                        title: '连接异常',
                        message:'获取审核员信息和统计数据失败！'
                    });
                });
            }
            else{
                if(this.setDefaultDate()){
                    this.getReviewerInfo();
                }
            }
        },

        getTableData(){//根据选择日期范围显示用户信息
            if(this.dateValue != ''){
                console.log(this.dateValue);
                const postData = {
                    start: this.dateValue[0],
                    end: this.dateValue[1]
                }
                var that = this;
                console.log(this.$Qs.stringify(postData));
                //向后端传输日期范围，后端返回该范围中已审核的用户信息对象列表
                //一个对象元素对应一个用户信息
                this.$axios.post('/api/api/statisticData/getUserInfo', this.$Qs.stringify(postData)
                ).then(function(response){
                    console.log(response.data);
                    that.tableData = response.data;
                    that.toReviewNum = response.data.toReviewNum;
                    that.reviewedNum = response.data.reviewedNum;
                    that.notPassNum = response.data.notPassNum;
                    that.loading = false;
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type:'error',
                        title: '连接异常',
                        message: '获取已审核用户信息失败！'
                    });
                });
            }
            else{
                if (this.setDefaultDate()){
                    this.getTableData();
                }
            }
        },

        setDefaultDate(){//默认显示最近一周已审核用户信息
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            end.setTime(end.getTime());

            var dateRange = new Array(start, end);
            var reg = new RegExp( '/' , "g" );
            dateRange[0] = dateRange[0].toLocaleDateString().replace(reg,'-');
            dateRange[1] = dateRange[1].toLocaleDateString().replace(reg,'-');
            dateRange[0] += ' 00:00:00';
            dateRange[1] += ' 23:59:59';

            this.dateValue = dateRange;
            console.log(this.dateValue);
            return true;
        },

        goToReview(){//跳转到开始审核界面
            this.$router.push('/reviewer/reviewUser');
        },

        checkRange(){//检查选择的日期范围
            var end = new Date(this.dateValue[1]);
            var start = new Date(this.dateValue[0]);
            var now = new Date();

            now.setTime(now.getTime());
            var reg = new RegExp( '/' , "g" );
            now = now.toLocaleDateString().replace(reg, '-');
            var hintDate = now;
            now += ' 23:59:59';
            now = new Date(now);

            var dateRange = end.getTime() - start.getTime();
            var isBeyond = now.getTime() - end.getTime();
            console.log(dateRange);
            console.log(isBeyond);
            
            if(isBeyond < 0){
                this.$msgbox({
                    type:'error',
                    title: '超出范围',
                    message: '结束日期不能超过今天（' + hintDate + '），请重新选择！'
                });
                this.dateValue = '';
                return false;
            }else if (dateRange >= 3600 * 1000 * 24 * 7){
                this.$msgbox({
                    type:'error',
                    title: '超出范围',
                    message: '所选日期范围不能超过一周，请重新选择！'
                });
                this.dateValue = '';
                return false;
            }else{
                return true;
            }
        }
    },

    mounted(){
        this.setDefaultDate();
        this.getReviewerInfo();
        this.getTableData(); 
    }
}
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
        width: 100%;
    }
    /* .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    } */
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
    .statistic-item {
        margin-top: 40px;
        margin-left: 60px;
        margin-right: 70px;
    }
    /* .text {
        font-size: 14px;
    } */

    .item {
        margin-bottom: 18px;
    }

    .show-data-item {
        /* font-weight:bold;  */
        text-align: left;
        color:gray;
        margin-top: 0px;
        margin-bottom: 35px;
    }

    .show-text-item {
        font-weight: bold;
        font-size: 50px;
        text-align: left;
    }
</style>