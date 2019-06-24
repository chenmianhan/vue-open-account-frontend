<template>

  <div>
    <div class="search-bar">
      <div class="block">
        <el-input v-model="input" placeholder="管理员名称"></el-input>
      </div>
      <el-button icon="el-icon-search" circle></el-button>

      <el-popover
        placement="bottom"
        v-model="visible1">
        <div style="text-align:center; width: 300px">
          <el-form ref="form" :model="addForm" label-width="100px" size="mini">
            <el-form-item label="管理员名称">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="addForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>

            <el-form-item label="权限" prop="authority">
              <el-select v-model="institute" placeholder="请选择">
                <el-option
                  v-for="item in ins_ops"
                  :key="item.institute"
                  :label="item.label"
                  :value="item.institute">
                </el-option>
              </el-select>
              <!--选择地点-->
              <el-cascader v-show="institute=='sh'"
                           :options="shNet"
                           :props="props"
                           checkStrictly
                           v-model="addForm.shPoint"
                           class="wd400"
                           collapse-tags
                           clearable></el-cascader>

              <el-cascader v-show="institute=='sz'"
                           :options="szNet"
                           :props="props"
                           checkStrictly
                           v-model="addForm.szPoint"
                           class="wd400"
                           collapse-tags
                           clearable>
              </el-cascader>
            </el-form-item>

            <el-button size="mini" type="text" @click="visible1 = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible1 = false; submitAddForm('addForm')">保存</el-button>
          </el-form>
        </div>
        <el-button slot="reference" type="primary" size="small" style="margin-left: 700px">添加</el-button>
      </el-popover>
    </div>

  <div class="results">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="admin_id"
        width="100px"
        label="管理员id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="150px"
        label="管理员名称">
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
        prop="authority"
        label="权限">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>上海：</p>
            <!--<p>{{ scope.row. }}</p>-->
            <p>深圳：</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">查看权限信息</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">

          <el-popover
            placement="bottom"
            v-model="visible2">
            <div style="text-align:center; width: 300px">
              <el-form ref="form" :model="modifyForm" label-width="100px" size="mini">
                <el-form-item label="管理员名称">
                  <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-model="modifyForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="modifyForm.password"></el-input>
                </el-form-item>

                <el-form-item label="权限" prop="authority">
                 <!-- <el-tabs v-model="modifyForm.inst" @tab-click="handleClick">
                    <el-tab-pane label="上海" name="first">
                      <el-checkbox-group v-model="modifyForm.str">
                        <el-checkbox label="营业网点1"></el-checkbox>
                        <el-checkbox label="营业网点2"></el-checkbox>
                        <el-checkbox label="营业网点3"></el-checkbox>
                        <el-checkbox label="营业网点4"></el-checkbox>
                      </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane label="深圳" name="second">
                      <el-checkbox-group v-model="modifyForm.str">
                        <el-checkbox label="营业网点1"></el-checkbox>
                        <el-checkbox label="营业网点2"></el-checkbox>
                        <el-checkbox label="营业网点3"></el-checkbox>
                      </el-checkbox-group>
                    </el-tab-pane>
                  </el-tabs>-->
                  <!--选择机构-->
                  <el-select v-model="institute" placeholder="请选择">
                    <el-option
                      v-for="item in ins_ops"
                      :key="item.institute"
                      :label="item.label"
                      :value="item.institute">
                    </el-option>
                  </el-select>
                 <!--选择地点-->
                  <el-cascader v-show="institute=='sh'"
                               :options="shNet"
                               :props="props"
                               checkStrictly
                               v-model="modifyForm.shPoint"
                               class="wd400"
                               collapse-tags
                               clearable></el-cascader>

                  <el-cascader v-show="institute=='sz'"
                               :options="szNet"
                               :props="props"
                               checkStrictly
                               v-model="modifyForm.szPoint"
                               class="wd400"
                               collapse-tags
                               clearable>
                  </el-cascader>
                </el-form-item>

                <el-button size="mini" type="text" @click="visible2 = false">取消</el-button>
                <el-button type="primary" size="mini" @click="visible2 = false; submitModifyForm('modifyForm')">保存</el-button>
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
      data(){
        return{
          input:'',
          visible1: false,
          visible2: false,
          props: { multiple: true },

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

          tableData:[{
            admin_id:'1',
            name:'whatever',
            authority:'',
          }],

          modifyForm:{
            name:'',
            account:'',
            password:'',
            shPoint:[],
            szPoint:[],
          },

          addForm:{
            name:'',
            account:'',
            password:'',
            shPoint:[],
            szPoint:[],
          },
        }
      },
      methods: {

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
                inst: that.addForm.inst,
                str: that.addForm.str,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/addAdmin', this.$Qs.stringify(postData), {
                headers: {'content-type': 'application/x-www-form-urlencoded'},
              })
                .then(function (response) {
                  console.log(response);
                  that.$msgbox({
                    title: '添加成功',
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
                inst: that.modifyForm.inst,
                str: that.modifyForm.str,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/modifyAdmin', this.$Qs.stringify(postData), {
                headers: {'content-type': 'application/x-www-form-urlencoded'},
              })
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

        handleDelete(index, row) {
          console.log(index, row);
          var deleteId = row.admin_id;
          this.$confirm("确认删除该管理员吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/deleteAdmin', deleteId)//post也可以改成get，但需要对应服务端的请求方法
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

        handleCheckedSHChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.shNet.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.shNet.length;
        }

      },

      mounted(){
        console.log('start to get net list');
        this.getSHList();
        this.getSZList();
      }
    }
</script>
<style>
  .search-bar{
    /*position: relative;*/
    float:left;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
  .wd400{
    width: 100%;
    padding: 10px;
  }
</style>
