<template>
<div>
    <div class="search-bar">
      <el-row>
        <div class="block">
          <el-autocomplete
              v-model="state"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入审核员姓名"
              @select="handleSelect"
              @focus="loadAll()"
            ></el-autocomplete>
          <el-button icon="el-icon-search" @click="queryName" type="info" circle></el-button>


            <el-popover
              placement="bottom"
              v-model="visible1"
              style="padding-left: 20px">
              <div style="text-align:center; width: 300px">
                <el-form ref="addForm" :model="addForm" label-width="100px" size="mini">
                  <el-form-item label="审核员名称">
                    <el-input v-model="addForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="账号">
                    <el-input v-model="addForm.account"></el-input>
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="addForm.password"></el-input>
                  </el-form-item>
                  <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible1 = false; submitAddForm('addForm')">保存</el-button>
                </el-form>
              </div>
              <el-button slot="reference" type="primary">添加</el-button>
            </el-popover>

        </div>
      </el-row>

    </div>

    <div class="results">
      <el-table
        v-loading='loading'
        :data="tableData"
        stripe
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        ref="filterTable"
        :default-sort = "{prop: 'accTime', order: 'descending'}"
        style="width: 100%">

        <el-table-column type="expand">

          <template slot-scope="props">

            <el-date-picker
              v-model="tableData.dateValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-button @click='getReviewerInfo(props.row)' icon='el-icon-search' type='primary' round>查询</el-button>

            <el-form label-position="left" class="demo-table-expand" v-bind:key="refresh">
              <el-form-item style="padding-top: 10px">
                <span style='color: #99a9bf;'>已审核通过：</span>
                <span>{{ props.row.reviewedNum }}</span>
              </el-form-item>
              <el-form-item>
                <span style='color: #99a9bf;'>已审核不通过：</span>
                <span>{{ props.row.notPassNum }}</span>
              </el-form-item>

              <el-form-item>
                <span style='color: #99a9bf;'>未审核：</span>
                <span>{{ props.row.toReviewNum }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

      <el-table-column
        prop="reviewer_id"
        width="150px"
        label="审核员id">
      </el-table-column>
      <el-table-column
        prop="name"
        label="审核员名称">
      </el-table-column>
      <el-table-column
        prop="account"
        label="账号">
      </el-table-column>
      <!--<el-table-column
        prop="password"
        width="300"
        label="密码">
      </el-table-column>-->
      <el-table-column
        label="操作">
        <template slot-scope="scope">

          <el-popover
            placement="bottom"
            v-model="scope.row.visible2">
            <div style="text-align:center; width: 300px">
              <el-form ref="modifyForm" :model="modifyForm" label-width="100px" size="mini">
                <el-form-item label="审核员名称">
                  <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-model="modifyForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="modifyForm.password"></el-input>
                </el-form-item>


               <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>-->
                <el-button type="primary" size="mini" @click="visible2 = false; submitModifyForm('modifyForm',scope.row)">保存</el-button>
              </el-form>
            </div>
            <el-button slot="reference" size="mini" @click="handleForm(scope.row)">修改</el-button>
          </el-popover>

          <el-button type="danger" size="mini" style="margin-left: 15px" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>


<script>
    export default {
      data() {
        return {
          visible1: false,
          loading: true,
          refresh: 0,

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
              }, {
                  text: '最近一个月',
                  onClick(picker) {
                      var end = new Date();
                      var start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
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
              }, {
                  text: '最近三个月',
                      onClick(picker) {
                      var end = new Date();
                      var start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
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
              },{
                  text: '最近一年',
                      onClick(picker) {
                      var end = new Date();
                      var start = new Date();

                      end.setTime(end.getTime());
                      var year = end.getFullYear();

                      var a = year % 4;
                      var b = year % 100;
                      var c = year % 400;
                      
                      if (( (a == 0) && (b != 0) ) || (c == 0) ){//闰年
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 366);
                      }else{
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                      }

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

          reviewerName: [],
          state: '',
          timeout:  null,

          tableData:[
          //   {//表格审核员对象列表
          //   reviewer_id:'1',
          //   name:'小红',
          //   account:'xiaohong',
          //   password:'123456',
          //   dateValue:'',
          //   toReviewNum: '',
          //   reviewedNum: '',
          //   notPassNum: '',
          //   visible2: false,
          // },{
          //   reviewer_id:'2',
          //   name:'小黄',
          //   account:'xiaohuang',
          //   password:'123456',
          //   dateValue:'',
          //   toReviewNum: '',
          //   reviewedNum: '',
          //   notPassNum: '',
          //   visible2: false,
          // }
          ],

          modifyForm:{
            name:'',
            account:'',
            password:'',
          },

          addForm:{
            name:'',
            account:'',
            password:'',
          },

          rules: {
            name: [
              { require: true , message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            account: [
              { require: true , trigger: 'blur' },
            ],
            password: [
              { require: true , trigger: 'blur' },
            ],
          },

          // 获取row的key值
          getRowKeys(row) {
            return row.reviewer_id;
          },
          // 要展开的行，数值的元素是row的key值
          expands: [],

        };
      },
      methods: {
        queryTable(){
            var that = this;
            this.$axios.get('/api/admin/getAllReviewers')
              .then(function(response){
                console.log(response.data);
                that.tableData = response.data;
                for(var i = 0; i < that.tableData.length; i++)
                  that.tableData[i].visible2 = false;
                //that.length = that.tableData.length;
                that.loading = false;
                //that.handleCurrentChange(1);
              }).catch(function(error){
              console.log(error);
              that.$msgbox({
                type: 'error',
                title: '连接失败',
                message: '获取审核员信息失败！'
              })
            })
        },


        queryName(){
           if (this.state != ''){
              console.log(this.state);
              const postData = {
                  reviewerName: this.state
              };
              var that = this;
              console.log(this.$Qs.stringify(postData));
              this.$axios.post('/api/admin/getReviewerByName',postData)
              .then(function(response){
                  that.tableData = response.data;
                  for(var i = 0; i < that.tableData.length; i++)
                    that.tableData[i].visible2 = false;
                  that.loading = false;
              }).catch(function(error){
                  console.log(error);
                  that.$msgbox({
                    type: 'error',
                    title: '连接失败',
                    message: '获取审核员信息失败！'
                  })
              })
           }else{
             this.$msgbox({
                type: 'info',
                title: '信息不完全',
                message: '请输入你想要搜索的审核员姓名！'
             })
           }
        },

        loadAll(){
          var that = this;
          this.$axios.get('/api/admin/getReviewerId'
          ).then(function(response){
            console.log(response.data)
              that.reviewerName = response.data;
          }).catch(function(error){
              console.log(error);
              that.$msgbox({
                  type: 'error',
                  title: '连接失败',
                  message: '获取审核员ID失败！'
              })
          })
        },

        querySearchAsync(queryString, cb) {
          var reviewerName = this.reviewerName;
          var results = queryString ? reviewerName.filter(this.createStateFilter(queryString)) : reviewerName;

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
          console.log(item);
          var that = this;
          const postData = {
            reviewerId: item.address
          }
          this.$axios.post('/api/admin/getReviewerInfo', postData
          ).then(function(response){
              that.tableData = response.data;
              for(var i = 0; i < that.tableData.length; i++){
                that.tableData[i].visible2 = false;
              }
          }).catch(function(error){
              console.log(error);
              that.$msgbox({
                  type: 'error',
                  title:'连接失败',
                  message: '获取审核员信息失败！'
              })
          })
        },

        submitModifyForm(formName, row) {
          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                name: that.modifyForm.name,
                account: that.modifyForm.account,
                password: that.modifyForm.password,
                auditor_id: row.reviewer_id,
              };

              // var that = this;
              console.log(postData);
              this.$axios.put('/api/admin/modifyAuditor', postData)
                .then(function (response) {
                  console.log(response);
                  that.$msgbox({
                    title: '修改成功',
                    type: 'succeed'
                  });
                  that.queryTable();
                })
                .catch(function (error) {
                  that.$msgbox({
                    title: '连接失败',
                    type: 'error'
                  });
                });
            } else {
              this.$msgbox({
                message: '表单格式有误',
                type: 'error'
              });
              // console.log('error submit!!');
              return false;
            }
          });
        },

        submitAddForm(formName) {
          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                name: that.addForm.name,
                account: that.addForm.account,
                password: that.addForm.password,
                str: that.addForm.str,
              };
              // var that = this;
              console.log(postData);
              this.$axios.post('/api/admin/addAuditor', postData)
                .then(function (response) {
                  console.log('修改',response);
                  that.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  that.queryTable();
                })
                .catch(function (error) {
                  console.log(error)
                  that.$msgbox({
                    message: error,
                    type: 'error'
                  });
                });
            } else {
              this.$msgbox({
                message: '表单格式有误',
                type: 'error'
              });
              // console.log('error submit!!');
              return false;
            }
          });
        },

        handleClick(tab, event) {
          console.log(tab, event);
        },

        getReviewerInfo(row){//获取该审核员统计数据
          if(this.tableData.dateValue != ''){
            var that = this;
            const postData = {
              reviewerId:row.reviewer_id,
              start: this.tableData.dateValue[0],
              end: this.tableData.dateValue[1]
            };
            //console.log(row.toReviewNum);
            console.log(this.$Qs.stringify(postData));
            //向后端传输审核员的ID，后端返回审核员信息
            this.$axios.post('/api/reviewer/getReviewerInfo', this.$Qs.stringify(postData)
            ).then(function(response) {
              console.log('getReviewer', response.data);
              row.toReviewNum = response.data.toReviewNum;
              row.reviewedNum = response.data.reviewedNum;
              row.notPassNum = response.data.notPassNum;
              that.refresh++;
              //that.tableData.notPassNum = response.data.notPassNum;
            }).catch(function(error){
              console.log(error);
              that.$msgbox({
                type: 'error',
                title: '连接异常',
                message:'获取审核员信息和统计数据失败！'
              });
            });
          }
        },

        handleDelete(index, row) {
          console.log(index, row);
          let postData = {
            reviewer_id : row.reviewer_id,
          };
          var that = this;
          this.$confirm("确认删除该审核员吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/admin/deleteReviewer', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                console.log('删除',response);
                that.queryTable();
              })
              .catch(function (error) {
                alert(error);
              });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },

        // checkRange(){//检查选择的日期范围

        //   var end = new Date(this.tableData.dateValue[1]);
        //   var start = new Date(this.tableData.dateValue[0]);
        //   var now = new Date();

        //   now.setTime(now.getTime());
        //   var reg = new RegExp( '/' , "g" );
        //   now = now.toLocaleDateString().replace(reg, '-');
        //   var hintDate = now;
        //   now += ' 23:59:59';
        //   now = new Date(now);

        //   var dateRange = end.getTime() - start.getTime();
        //   var isBeyond = now.getTime() - end.getTime();
        //   console.log(dateRange);
        //   console.log(isBeyond);

        //   if(isBeyond < 0){
        //     this.$msgbox({
        //       type:'error',
        //       title: '超出范围',
        //       message: '结束日期不能超过今天（' + hintDate + '），请重新选择！'
        //     });
        //     this.dateValue = '';
        //     return false;
        //   }else if (dateRange >= 3600 * 1000 * 24 * 7){
        //     this.$msgbox({
        //       type:'error',
        //       title: '超出范围',
        //       message: '所选日期范围不能超过一周，请重新选择！'
        //     });
        //     this.dateValue = '';
        //     return false;
        //   }else{
        //     return true;
        //   }
        // },

        handleForm(row){
          this.modifyForm.name = row.name;
          this.modifyForm.account = row.account;
        },

      },

      mounted(){
        this.queryTable();
        console.log(sessionStorage);
        this.reviewerName = this.loadAll();
        }
    }
</script>



<style scoped>
  .search-bar{
    /*position: relative;*/
    float:left;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
  /* .add-button{
    /*float:right;*/
  /* }  */
  .wd400{
    width: 100%;
  }
  .demo-table-expand {
    font-size: 0;
    width: 100%;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
