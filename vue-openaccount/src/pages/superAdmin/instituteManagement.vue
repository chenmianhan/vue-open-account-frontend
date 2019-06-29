<template>
  <div>
    <div class="search-bar">
      <div class="block">
        <span class="demonstration">所属机构</span>
        <el-cascader
          v-model="institute"
          :options="ins_ops"
          @change="handleChange"></el-cascader>
      </div>
      <el-button icon="el-icon-search" circle></el-button>

      <el-popover
        placement="bottom"
        v-model="visible">
        <div style="text-align:center; width: 300px">
          <el-form ref="form" :model="addForm" label-width="100px" size="mini">
            <el-form-item label="营业网点名称">
              <el-input v-model="addForm.store"></el-input>
            </el-form-item>
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false; submitAddForm('addForm')">保存</el-button>
          </el-form>
        </div>
        <el-button slot="reference" type="primary" size="small" style="margin-left: 700px">添加</el-button>
      </el-popover>
    </div>

    <div class="results">
      <el-table
        :data="instData"
        style="width: 100%">
        <el-table-column
          prop="store"
          label="营业网点名称">
        </el-table-column>
        <el-table-column
          prop="inst"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="user_number"
          label="用户数">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
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
          visible: false,
          institute: [],
          ins_ops: [{
            institute: '上海',
            label: '上海',
          },{
            institute: '深圳',
            label: '深圳',
          } ],

          addForm:{
            store:'',
          },

          instData:[{
            store:'营业网点1',
            inst:'上海',
            user_number:'123',
          }],

        }
      },
      methods:{
        submitAddForm(formName) {
          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                store: that.addForm.store,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/addStore', postData)
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

        handleDelete(index, row) {
          console.log(index, row);
          var deleteStore = row.store;
          this.$confirm("确认删除该网点吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/deleteInstitute', deleteStore)//post也可以改成get，但需要对应服务端的请求方法
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
</style>
