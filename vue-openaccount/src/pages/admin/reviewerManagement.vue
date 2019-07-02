<template>
<div>
    <div class="search-bar">
      <div class="block">
        <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入审核员姓名"
            @select="handleSelect"
          ></el-autocomplete>
      </div>
      <el-button icon="el-icon-search" circle></el-button>
    </div>
    <div class="add-button">
      <el-popover
        placement="bottom"
        v-model="visible1">
        <div style="text-align:center; width: 300px">
          <el-form ref="form" :model="addForm" label-width="100px" size="mini">
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
            <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
          </el-form>
        </div>
        <el-button slot="reference" type="primary" size="small" style="float: right; margin-right: 20px">添加</el-button>
      </el-popover>
    </div>
    <div class="results">
      <el-table
        v-loading='loading'
        :data="tableData"
        stripe
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
              @change="checkRange()"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-tooltip class="item" effect="dark" content="所选日期范围最大为一周" placement="right">
              <el-button @click='getReviewerInfo(props.row)' icon='el-icon-search' type='primary' round>查询</el-button>
            </el-tooltip>

            <el-form label-position="left" class="demo-table-expand">
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
        width="100px"
        label="审核员id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="150px"
        label="审核员名称">
      </el-table-column>
      <el-table-column
        prop="account"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="password"
        label="密码">
      </el-table-column>
      <el-table-column
        label="操作"
        >
        <template slot-scope="scope">

          <el-popover
            placement="bottom"
            v-model="visible2">
            <div style="text-align:center; width: 300px">
              <el-form ref="form" :model="modifyForm" label-width="100px" size="mini">
                <el-form-item label="审核员名称">
                  <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-model="modifyForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="modifyForm.password"></el-input>
                </el-form-item>


                <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="visible2 = false; submitAddForm('modifyForm',scope.row)">保存</el-button>
              </el-form>
            </div>
            <el-button slot="reference" size="mini">修改</el-button>
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
          visible2: false,
          loading: false,

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

          reviewerName: [],
          state: '',
          timeout:  null,

          tableData:[{//表格审核员对象列表
            reviewer_id:'1',
            name:'whatever',
            account:'abc',
            password:'123456',
            dateValue:'',
            toReviewNum: 0,
            reviewedNum: 0,
            notPassNum: 0,
          }],

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

        };
      },
      methods: {
        queryName(){
           if (this.state != ''){
              console.log(this.state);
              const postData = {
                  reviewerName: this.state
              };
              var that = this;
              console.log(this.$Qs.stringify(postData));
              this.$axios.post('/api/admin/getReviewerByName', this.$Qs.stringify(postData)
              ).then(function(response){
                  that.tableData = response.data;
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
          //后端传回用户姓名和ID对应的列表
          this.$axios.get('/api/admin/getReviewerId'
          ).then(function(response){
              this.reviewerName = response.data;
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

          this.$axios.get('/api/admin/getReviewerInfo', params={reviewerId: item.address}
          ).then(function(response){
              that.tableData = response.data;
          }).catch(function(error){
              console.log(error);
              that.$msgbox({
                  type: 'error',
                  title:'连接失败',
                  message: '获取审核员信息失败！'
              })
          })
        },

        onSubmit() {
          this.visible1 = false; 
          var that = this;
          this.$axios.post('', that.addForm).then(function(response){
            
          })
          console.log('submit!');
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
                str: that.modifyForm.str,
                auditor_id: row.reviewer_id,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/admin/modifyAuditor', postData)
                .then(function (response) {
                  console.log(response);
                  that.$msgbox({
                    title: '修改成功',
                    type: 'succeed'
                  });
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
                  console.log(response);
                  that.$msgbox({
                    title: '修改成功',
                    type: 'succeed'
                  });
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
        handleClick(tab, event) {
          console.log(tab, event);
        },

        getReviewerInfo(row){//获取该审核员统计数据
          console.log();
          if(this.tableData.dateValue != ''){
            var that = this;
            const postData = {
              reviewer_id:row.reviewer_id,
              start: this.tableData.dateValue[0],
              end: this.tableData.dateValue[1]
            };
            console.log(this.$Qs.stringify(postData));

            //向后端传输审核员的ID，后端返回审核员信息
            this.$axios.post('/api/api/statisticData/getReviewerInfo', this.$Qs.stringify(postData)
            ).then(function(response) {
              console.log(response.data);
              that.tableData.toReviewNum = response.data.toReviewNum;
              that.tableData.reviewedNum = response.data.reviewedNum;
              that.tableData.notPassNum = response.data.notPassNum;
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

        handleDelete(index, row) {
          console.log(index, row);
          let postData = {
            reviewer_id : row.reviewer_id,
          };
          this.$confirm("确认删除该审核员吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/deleteReviewer', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                console.log(response);
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
      },

      mounted(){

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
  .add-button{
    float:right;
  }
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
