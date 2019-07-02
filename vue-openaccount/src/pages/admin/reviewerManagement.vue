<template>
<div>
  <h1 style="float: left">你所负责的营业网点：  {{store}}</h1>
    <div class="search-bar">
      <div class="block">
      <span class="demonstration">所属机构</span>
      <el-select v-model="institute" placeholder="请选择">
          <el-option
            v-for="item in ins_ops"
            :key="item.institute"
            :label="item.label"
            :value="item.institute">
          </el-option>
        </el-select>
      </div>
      <div class="block">
        <span class="demonstration" v-show="institute!=''">所属营业网点</span>
        <el-cascader v-show="institute=='sh'"
          :options="shNet"
          checkStrictly
          v-model="shPoint"
          props.expandTrigger="hover"
          :show-all-levels='false'
          class="wd400">
          </el-cascader>
        <el-cascader v-show="institute=='sz'"
          :options="szNet"
          checkStrictly
          v-model="szPoint"
          props.expandTrigger="hover"
          :show-all-levels='false'
          class="wd400">
          </el-cascader>
      </div>
      <div class="block">
        <el-input v-model="targetReviewer" placeholder="审核员姓名"></el-input>
      </div>
      <el-button icon="el-icon-search" circle></el-button>

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

          store:'',

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


          targetReviewer:'',//搜索的目标审核员名称

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
        querytable(){//查询指定网点的审核员
          var that = this;

          if (this.institute != '' && this.shPoint.length > 0 && this.szPoint.length > 0){
            if (institute == 'sh'){
              const postData = {
                institue: this.institute,
                net: this.shPoint[0]
              };
            }else{
              const postData = {
                institute: this.institute,
                net: this.szPoint[0]
              }
            }
            this.$axios.post('/api/admin/getAllReviewers', this.$Qs.stringify(postData)
              ).then(function (response) {
                //将返回的数据存入页面中声明的data中
                that.tableData = response.data.tableData;
              }).catch(function (error) {
                console.log(error);
                that.$msgbox({
                      type: 'error',
                      title: '连接异常',
                      message:'获取目标网点审核员信息失败！'
                  })
              });
          }else{
            this.$msgbox({
              type: 'error',
              title: '信息不完全',
              message: '未选择机构或网点!'
            });
          }
        },

        queryUser(){//查询指定姓名的审核员
          var that = this;

          if (this.institute != '' && this.shPoint.length > 0 && this.szPoint.length > 0){
            if (this.institute == 'sh'){
              const postData = {
                institue: this.institute,
                net: this.shPoint[0],
                username: this.targetReviewer
              };
            }else{
              const postData = {
                institute: this.institute,
                net: this.szPoint[0],
                username: this.targetReviewer
              };
            }

            this.$axios.post('/api/admin/getTargetReviewer', this.$Qs.stringify(postData)
              ).then(function (response) {
                //将返回的数据存入页面中声明的data中
                that.tableData = response.data.tableData;
              })
              .catch(function (error) {
                console.log(error);
                that.$msgbox({
                      type: 'error',
                      title: '连接异常',
                      message:'获取目标审核员信息失败！'
                  })
              });
          }else{
            this.$msgbox({
              type: 'error',
              title: '信息不完全',
              message: '未选择机构或网点!'
            });
          }
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

        getSHList(){
          var that = this;
          this.$axios.get('/api/security/get_securityall').then(function(response){
            that.shNet = [];
            that.shNet = response.data;
            for(var i = 0; i < that.shNet.length; i++){
              for(var j = 0; j < that.shNet[i].children.length; j++){
                for(var t = 0; t < that.shNet[i].children[j].children.length; t++){
                  if(that.shNet[i].children[j].children[t].type != '0'){
                    that.shNet[i].children[j].children.splice(t,1);
                    t--;
                  }
                }
              }
            }
          });
          console.log('get sh list');
        },
        getSZList(){
          var that = this;
          this.$axios.get('/api/security/get_securityall').then(function(response){
            that.szNet = [];
            that.szNet = response.data;
            for(var i = 0; i < that.szNet.length; i++){
              for(var j = 0; j < that.szNet[i].children.length; j++){
                for(var t = 0; t < that.szNet[i].children[j].children.length; t++){
                  if(that.szNet[i].children[j].children[t].type != '1'){
                    that.szNet[i].children[j].children.splice(t,1);
                    t--;
                  }
                }
              }
            }
          });
          console.log('get sz list');
        },



      },

      mounted(){
          console.log('start to get net list');
          this.getSHList();
          this.getSZList();
        }
    }
</script>



<style scoped>
  .search-bar{
    float: left;
    width: 100%;
  }
  .block{
    display: inline-block;
    padding: 10px;
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
