<template>
<div>
  <span>{{shPoint}}  {{szPoint}}</span>
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
      <!--<el-button type="primary" icon="el-icon-search">搜索</el-button>-->
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
        <el-button slot="reference" type="primary" size="small" style="margin-left: 50px">添加</el-button>
      </el-popover>

  </div>
    <div class="results">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="reviewer_id"
        width="100px"
        label="审核员id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="100px"
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
        prop="inst"
        label="负责机构">
      </el-table-column>
      <el-table-column
        prop="str"
        label="负责营业网点">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
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
                <el-button type="primary" size="mini" @click="visible2 = false; onSubmit">保存</el-button>
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

          institute: '',
          ins_ops: [{//机构显示列表
            institute: 'sh',
            label: '上海',
          },{
            institute: 'sz',
            label: '深圳',
          } ],

          shNet: [],//后端传来的所有营业网点列表
          szNet: [],
          shPoint: [],//最终被选择的营业网点列表
          szPoint: [],


          targetReviewer:'',//搜索的目标审核员名称

          tableData:[{//表格审核员对象列表
            reviewer_id:'1',
            name:'whatever',
            account:'abc',
            password:'123456',
            inst:'上海',
            str:'营业网点1'
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

        submitModifyForm(formName) {
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
                auditor_id: 1
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

        getNetList(){
            var that = this;
            this.$axios.get('/api/admin/get_securityUnderAdmin',{
              params:{admin_id : 8888}
            }).then(function(response){
              console.log(response.data)
                that.Net = [];
                that.Net = response.data;
            });
            console.log('get net list');
          console.log(that.Net[0]);
        },

      },

      mounted(){
          console.log('start to get net list');
          this.getNetList();
          this.getSHList();
          this.getSZList();
        }
    }
</script>



<style>
  .search-bar{
    float:left;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
  .wd400{
    width: 100%;
  }
</style>
