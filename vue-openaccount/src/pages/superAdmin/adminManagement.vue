<template>

  <div>
    <div class="search-bar">
      <el-form :inline="true"  size="medium" style="margin-top:20px;">

        <el-select v-model="way" placeholder="请选择">
          <el-option
            v-for="item in wayOptions"
            :key="item.way"
            :label="item.label"
            :value="item.way">
          </el-option>
        </el-select>

        <el-form-item v-show="way == 'store'">
          <!--<el-autocomplete
            v-model="store"
            :fetch-suggestions="querySearchAsync"
            placeholder="输入营业网点名称"
            @select="handleSelect"
            class="wd400"
          ></el-autocomplete>-->
          <el-input v-model="store" placeholder="营业网点名称" class="wd400"></el-input>
        </el-form-item>

        <el-form-item v-show="way == 'name'">
          <el-input v-model="admin_name" placeholder="输入管理员姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryAdmin" circle type="primary"></el-button>
        </el-form-item>
        <el-form-item>
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
            <el-button slot="reference" type="success" size="small" >添加</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
    </div>


    <!-- <div class="search-bar">
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
    </div> -->

  <div class="results">
    <el-table
      :data="currentData"
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
        prop="store"
        label="负责网点">
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">

          <el-popover
            placement="bottom"
            v-model="scope.row.visible2">
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

                <el-form-item label="权限" prop="store">
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
  <!-- 分页器 -->
    <div style="margin: 30px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total='length'>
      </el-pagination>
    </div>

  </div>
</template>
<script>
import area from '../../assets/js/area';
    export default {
      data(){
        return{
          loading: true,
          address: areajson,
          visible: false,
          currentPage: 1,
          pageSize: 8,
          length: 0,
          currentData: [],

          way: 'store',
          store:'',
          admin_name:'',

          visible1: false,
          visible2: false,
          props: { multiple: true },

          wayOptions:[{
            way: 'store',
            label:'按营业网点查询',
          },{
            way:'name',
            label:'按管理员姓名查询',
          }],

          Net:[], //后端传来的所有营业网点列表

          tableData:[{
            admin_id:'1',
            name:'whatever',
            account:'',
            password:'',
            store:'',
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
        handleSizeChange(val){
          this.pageSize = val;
          this.handleCurrentChange(1);
        },
        handleCurrentChange(val){{
          this.currentPage = val;
          this.currentData = [];
          for(var i = (this.currentPage - 1) * this.pageSize; (i < this.currentPage * this.pageSize) && (i < this.length); i++){
            this.tableData[i].visible2 = false;
            this.currentData.push(this.tableData[i]);
          }
        }},
        handleChange(file, fileList) {
          // console.log(file, fileList);
        },

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
          this.$axios.get('/api/security/get_securityall')
            .then(function(response){
            /*console.log(response.data)*/
            that.Net = response.data;
          });
          console.log('get net list');
        },

        handleCheckedSHChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.shNet.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.shNet.length;
        },

        queryAdmin(){
          if(this.way=='store'){
            this.queryStore();
          }else if (this.way=='name'){
            this.queryName();
          }
        },

        queryStore(){
          if (this.store != ''){
            console.log(this.store);
            const postData = {
              store: this.store
            };
            var that = this;
            this.$axios.post('/api/superadmin/getAdminByStore', postData)
              .then(function(response){
                that.tableData = response.data;
                that.length = that.tableData.length;
                that.handleCurrentChange(1);
              }).catch(function(error){
              console.log(error);
              that.$msgbox({
                type: 'error',
                title: '连接失败',
                message: '获取管理员信息失败！'
              })
            })
          }else{
            this.$msgbox({
              type: 'info',
              title: '信息不完全',
              message: '请输入你想要搜索的网点名称！'
            })
          }
        },

        queryName(){
          if (this.admin_name != ''){
            console.log(this.admin_name);
            const postData = {
              admin_name: this.admin_name
            };
            var that = this;
            this.$axios.post('/api/superadmin/getAdminByName', postData)
            .then(function(response){
              that.tableData = response.data;
              that.length = that.tableData.length;
              that.handleCurrentChange(1);
            }).catch(function(error){
              console.log(error);
              that.$msgbox({
                type: 'error',
                title: '连接失败',
                message: '获取用户信息失败！'
              })
            })
          }else{
            this.$msgbox({
              type: 'info',
              title: '信息不完全',
              message: '请输入你想要搜索的管理员姓名！'
            })
          }
        },

        loadAllAdmin(){
          var that = this;
          this.$axios.get('/api/superadmin/getAllAdmin')
            .then(function(response){
              that.loading = false;
              that.tableData = response.data;
              that.length = that.tableData.length;
              // that.currentData = [];
              // for(var i = 0; i < that.pageSize; i++){
              //   that.currentData.push(that.tableData[i]);
              // }
              that.handleCurrentChange(1);
            }).catch(function(error){
              console.log(error);
              that.$msgbox({
                type: 'error',
                title: '连接失败',
                message: '获取管理员信息失败！'
              })
          })
        },


      },

      mounted(){
        console.log('start to get net list');
        this.getNetList();
        this.loadAllAdmin();
      }
    }
</script>
<style scoped>
.search-bar{
  padding:10px;
  border-bottom:1px #DCDFE6 solid;
  background-color:#F2F6FC;
  height:80px;
  width:100%;
  margin:0 auto;
}
  .block{
    display: inline-block;
    padding: 10px;
  }
  .wd400{
    width: 100%;
  }
    .results{
    margin-top:40px;
  }

</style>
