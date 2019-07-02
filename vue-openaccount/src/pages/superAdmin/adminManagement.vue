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
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px" size="mini">
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
              <el-cascader :options="Net"
                           checkStrictly
                           v-model="addForm.store"
                           class="wd400">
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
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">

          <el-popover
            placement="bottom"
            v-model="visible2">
            <div style="text-align:center; width: 300px">
              <el-form ref="modifyForm" :model="modifyForm" :rules="rules" label-width="100px" size="mini">
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
                  <el-cascader :options="Net"
                               checkStrictly
                               v-model="modifyForm.store"
                               class="wd400">
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


          Net:[], //后端传来的所有营业网点列表

          tableData:[{
            admin_id:'1',
            name:'whatever',
            authority:'',
          }],

          modifyForm:{
            name:'',
            account:'',
            password:'',
            store:'',
          },

          addForm:{
            name:'',
            account:'',
            password:'',
            store:'',
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
          }
        }
      },
      methods: {

        submitAddForm(formName) {
          var that = this;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                name: that.addForm.name,
                account: that.addForm.account,
                password: that.addForm.password,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/superadmin/addAdmin',postData)
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
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                name: that.modifyForm.name,
                account: that.modifyForm.account,
                password: that.modifyForm.password,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/superadmin/modifyAdmin', postData)
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
          const postData = {
            admin_id:  row.admin_id,
          };
          this.$confirm("确认删除该管理员吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/deleteAdmin', postData)//post也可以改成get，但需要对应服务端的请求方法
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

        getNetList(){
          var that = this;
          this.$axios.get('/api/superadmin/get_securityUnderAdmin')
            .then(function(response){
            console.log(response.data)
            that.Net = [];
            that.Net = response.data;
          });
          console.log('get net list');
          console.log(that.Net[0]);
        },

        handleCheckedSHChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.shNet.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.shNet.length;
        }

      },

      mounted(){
        console.log('start to get net list');
        this.getNetList();
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
  }
</style>
