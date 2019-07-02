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
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px" size="mini">
            <el-form-item label="营业网点名称" prop="store">
              <el-input v-model="addForm.store"></el-input>
            </el-form-item>
            <el-form-item label="网点地址" prop="address">
            <el-cascader
              :options="address"
              props.checkStrictly
              v-model="addForm.address"
              props.expandTrigger="hover">
            </el-cascader>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="addForm.phone"></el-input>
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
          label="网点名称">
        </el-table-column>
        <el-table-column
          prop="inst"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="store"
          label="网点地址">
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
  import area from '../../assets/js/area.js'

    export default {
      data(){
        let checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('电话号码不能为空'));
          } else {
            const reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$)/;
            // console.log(reg.test(value));
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的电话号码'));
            }
          }
        };

        return{
          address: areajson,

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
            address:'',
            phone:'',
          },

          instData:[{
            store:'营业网点1',
            inst:'上海',
            user_number:'123',
          }],

          rules: {
            store: [
              { required: true, message: '请输入网点名称', trigger: 'blur' }
            ],
            address: [
              { required: true, trigger: 'blur'}
            ],
            phone: [
              { required: true, message: '请输入电话号码', trigger: 'blur' },
              { validator: checkPhone, trigger: 'blur' }
            ],
          },

        }
      },
      methods:{
        handleChange(file, fileList) {
          // console.log(file, fileList);
        },

        submitAddForm(formName) {
          this.addForm.address.splice(2,1);
          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const postData = {
                store: that.addForm.store,
                address: that.addForm.address,
                phone: that.addForm.phone,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/superadmin/addStore', postData)
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
            this.$axios.post('/api/superadmin/deleteStore', deleteStore)//post也可以改成get，但需要对应服务端的请求方法
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
