<template>
    <div class='statistic-item'>
        <el-row>
            <div class='search-bar'>
            <!-- 查询方式选择 -->
                <div class='block' style="margin-bottom: 35px; text-align: left;">
                    <el-select @change="handleSelectChange"
                    v-model="way" placeholder="请选择">
                        <el-option
                            v-for="item in wayOptions"
                            :key="item.way"
                            :label="item.label"
                            :value="item.way">
                        </el-option>
                    </el-select>
                    <!-- 日期查询 -->
                    <div class='block' v-show="way == 'date'">
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
                        <el-tooltip v-show="way=='date'"
                        class="item" effect="dark" content="所选日期范围最大为一周" placement="right">
                            <el-button @click='queryTable' icon='el-icon-search' type='primary' circle></el-button>
                        </el-tooltip>
                    </div>
                    <!-- 按用户姓名查询 -->
                    <div class="block" v-show="way == 'name'">
                        <el-autocomplete
                            v-model="state"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入用户姓名"
                            @select="handleSelect"
                        ></el-autocomplete>
                    </div>
                    <el-button v-show="way=='name'" @click="queryTable" icon="el-icon-search" type="primary" circle></el-button>
                </div>
            </div>
        </el-row>
        <!-- 页头 -->
        <el-row v-show="way=='date'">
            <div class='show-item'>
                <el-row :gutter="12">
                    <el-col :span="4">
                            <div class="show-text-item" style="text-align: left;">
                                <el-row>{{ reviewedNum }} </el-row>
                            </div>
                            <div class="show-data-item">
                                <span>审核通过</span>
                            </div>
                    </el-col>
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
        </el-row>
        <!-- 下方的表格：
        默认开户时间降序排列
         -->
        <div style="margin-top: 5px;">
            <el-table 
            v-loading='loading' 
            :data="tableData" 
            @filter-change="handleFilterChange"
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
                    prop="reviewStatus"
                    column-key="reviewStatus"
                    label="审核状态"
                    width="100"
                    :filters="[{ text: '通过', value: '通过' }, { text: '未通过', value: '未通过' }]"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                        :type="filterTagColor(scope.row.reviewStatus)"
                        disable-transitions>{{scope.row.reviewStatus}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
            <div class="page-block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[8, 16, 24]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNum">
                </el-pagination>
            </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            totalNum: 0,
            currentPage: 1,
            pageSize: 8,
            filterCode: 0,

            toReviewNum: 0,
            reviewedNum: 0,
            notPassNum: 0,

            way: 'date',//默认日期

            username: [],
            state: '',
            timeout:  null,

            wayOptions:[{
                way: 'date',
                label:'按日期查询',
            },{
                way:'name',
                label:'按用户姓名查询',
            }],

            dateValue:'', //查询日期条件

            targetUser:'',//搜索的目标用户名称


            tableData: [],
             pickerOptions: {//日期选择器的快捷选项
                shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        end.setTime(end.getTime());

                        var dateRange = new Array(start, end);
                        var reg = new RegExp( '/' , "g" );
                        dateRange[0] = dateRange[0].toLocaleDateString().replace(reg,'-');
                        dateRange[1] = dateRange[1].toLocaleDateString().replace(reg,'-');
                        dateRange[0] += ' 00:00:00';
                        dateRange[1] += ' 23:59:59';

                        this.dateValue = dateRange;
                        start = this.dateValue[0];
                        end = this.dateValue[1];

                        picker.$emit('pick', [start, end]);
                    }
                }]
             },
             loading: true
          }
    },

    methods: {
        handleSelectChange(){
            this.tableData = [];
            this.totalNum = 0;

            this.queryTable();
        },

        handleFilterChange(filters){
            console.log(this.filters);
            if (filters.reviewStatus.length == 2){
                this.filterCode = 0;
            }else{
                if (filters.reviewStatus[0] == '通过'){
                    this.filterCode = 1;
                }else if (filters.reviewStatus[0] == '未通过'){
                    this.filterCode = 2;
                }else{
                    this.filterCode = 0;
                }
            }
            this.queryTable();
        },

        filterTagColor(statu){ //标签颜色
            if (statu === '通过'){
                return 'success';
            }else if (statu === '未通过'){
                return 'danger';
            }else{
                return 'primary';
            }
        },

        getReviewerInfo(){//获取该审核员统计数据
            if(this.dateValue != ''){
                var that = this;
                const postData = {
                    start: this.dateValue[0],
                    end: this.dateValue[1],
                    reviewerId: ''
                };
                console.log(this.$Qs.stringify(postData));

                //向后端传输审核员的ID，后端返回审核员信息
                this.$axios.post('/api/reviewer/getReviewerInfo', this.$Qs.stringify(postData)
                ).then(function(response) {
                    console.log(response.data);
                    that.toReviewNum = response.data.toReviewNum;
                    that.reviewedNum = response.data.reviewedNum;
                    that.notPassNum = response.data.notPassNum;
                    // that.totalNum = that.reviewedNum + that.notPassNum;
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

        queryTable(){
            this.tableData = [];
            this.totalNum = 0;
            if(this.way=='date'){
                this.getReviewerInfo();//更新审核员审核人数数据
                this.queryDate();
            }else if (this.way=='name'){
                this.queryName();
            }
        },

        queryDate(){
            if(this.dateValue != ''){
                // this.tableData = [];
                // this.totalNum = 0;
                console.log(this.dateValue);
                const postData = {
                    start: this.dateValue[0],
                    end: this.dateValue[1],
                    pageNum: this.currentPage,
                    size: this.pageSize,
                    status: this.filterCode
                }
                var that = this;
                console.log(this.$Qs.stringify(postData));
                //向后端传输日期范围，后端返回该范围中所有用户信息对象列表
                //一个对象元素对应一个用户信息
                this.$axios.post('/api/reviewer/getUserByDate', this.$Qs.stringify(postData)
                ).then(function(response){
                    console.log("queryDate");
                    console.log(response.data);
                    that.tableData = response.data;
                    if (that.filterCode == 0){
                        that.totalNum = that.reviewedNum + that.notPassNum;
                    }else if (that.filterCode == 1){
                        that.totalNum = that.reviewedNum;
                    }else if (that.filterCode == 2){
                        that.totalNum = that.notPassNum;
                    }
                    that.loading = false;
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type:'error',
                        title: '连接异常',
                        message: '获取用户信息失败！'
                    });
                });
            }
            else{
                if (this.setDefaultDate()){
                    this.queryDate();
                }
            }
        },

        queryName(){
           if (this.state != ''){
                this.tableData = [];
                this.totalNum = 0;
                console.log(this.state);
                const postData = {
                    username: this.state,
                    pageNum: this.currentPage,
                    size: this.pageSize,
                };
                var that = this;
                console.log(this.$Qs.stringify(postData));
                this.$axios.post('/api/reviewer/getUserByName', this.$Qs.stringify(postData)
                ).then(function(response){
                    that.tableData = response.data;
                    that.totalNum = that.tableData.length;
                    that.loading = false;
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type: 'error',
                        title: '连接失败',
                        message: '获取用户信息失败！'
                    })
                })
           }
        //    else{
        //      this.$msgbox({
        //         type: 'info',
        //         message: '请输入你想要搜索的用户姓名！'
        //      })
        //    }
        },

        loadAll(){
          var that = this;
          //后端传回用户姓名和ID对应的列表
          this.$axios.post('/api/reviewer/getUserId'
          ).then(function(response){
              console.log(response);
              that.username = response.data;
          }).catch(function(error){
              console.log(error);
              that.$msgbox({
                  type: 'error',
                  title: '连接失败',
                  message: '获取用户ID失败！'
              })
          })
        },

        querySearchAsync(queryString, cb) {
          var username = this.username;
          var results = queryString ? username.filter(this.createStateFilter(queryString)) : username;

          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        },

        createStateFilter(queryString) {
          return (state) => {
            return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },

        handleSelect(item) {
            this.tableData = [];
            this.totalNum == 0;
            console.log(item.value);
            console.log(item.address);
            var that = this;

            this.$axios.get('/api/reviewer/getUserInfoById', {params:{userId: item.address}}
            ).then(function(response){
                that.tableData = response.data;
                that.totalNum = that.tableData.length;
            }).catch(function(error){
                console.log(error);
                that.$msgbox({
                    type: 'error',
                    title:'连接失败',
                    message: '获取用户信息失败！'
                })
            })
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
        },

        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            console.log(this.pageSize);
            this.queryTable();
        },

        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            console.log(this.currentPage);
            this.queryTable();
        }
    },

    mounted(){
        this.setDefaultDate();
        this.getReviewerInfo();
        this.queryTable();
        this.username = this.loadAll(); 
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
    .search-bar{
        /*position: relative;*/
        float:left;
        margin-left: 45px
    }
    
    .block{
        display: inline-block;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
    .statistic-item {
        margin-top: 40px;
        margin-left: 120px;
        margin-right: 120px;
    }
    /* .text {
        font-size: 14px;
    } */

    .item {
        margin-bottom: 18px;
    }
    
    .show-item {
        text-align: left;
        margin-left: 50px;
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

    .page-block {
        margin-top: 40px;
        margin-bottom: 40px;
    }
</style>