<template>
  <div>
    <div class="search-bar">
      <div class="block">
        <!--<el-input v-model="input" placeholder="营业网点名称" ></el-input>-->
        <el-autocomplete
          v-model="store"
          :fetch-suggestions="querySearchAsync"
          placeholder="营业网点名称"
          @select="handleSelect"
          class="wd400"
        ></el-autocomplete>
      </div>
      <el-button icon="el-icon-search" @click="queryStore" circle></el-button>

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
              style="width: 100%"
              props.expandTrigger="hover">
            </el-cascader>
              <el-input v-model="addForm.address_detail" style="padding-top: 10px; width: 100%" placeholder="详细地址"></el-input>
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
          prop="province"
          label="省份">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="address"
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
        /*let checkPhone = (rule, value, callback) => {
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
        };*/

        return{
          address: areajson,
          visible: false,

          store:'',

          addForm:{
            store:'',
            address:'',
            address_detail:'',
          },

          instData:[{
            store:'营业网点1',
            province:'广东',
            city:'广州',
            address_detail:'',
            user_number:'123',
          }],

          rules: {
            store: [
              { required: true, message: '请输入网点名称', trigger: 'blur' }
            ],
            address: [
              { required: true, trigger: 'blur'}
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
                address_detail: that.addForm.address_detail,
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
          var that = this;
          console.log(index, row);
          console.log(row.store);
          let postData = {
            store:  row.store,
          };
          this.$confirm("确认删除该网点吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/deleteStore', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                console.log(response);
                that.loadAllStore();
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

        queryStore(){
          if (this.store != ''){
            console.log(this.store);
            const postData = {
              store: this.store
            };
            var that = this;
            this.$axios.post('/api/superadmin/getStore', postData)
              .then(function(response){
              that.instData = response.data;
            }).catch(function(error){
              console.log(error);
              that.$msgbox({
                type: 'error',
                title: '连接失败',
                message: '获取网点信息失败！'
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

        querySearchAsync(queryString, cb) {
          var store = this.store;
          var results = queryString ? store.filter(this.createStateFilter(queryString)) : store;

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
            store: item.store,
          };
          this.$axios.get('/api/superadmin/getStoreInfo', postData)
            .then(function(response){
            that.instData = response.data;
          }).catch(function(error){
            console.log(error);
            that.$msgbox({
              type: 'error',
              title:'连接失败',
              message: '获取用户信息失败！'
            })
          })
        },

        loadAllStore(){
          var that = this;
          this.$axios.get('/api/superadmin/getAllStore')
            .then(function(response){
            this.instData = response.data;
          }).catch(function(error){
            console.log(error);
            that.$msgbox({
              type: 'error',
              title: '连接失败',
              message: '获取网点信息失败！'
            })
          })
        },
      },

      mounted(){
        this.loadAllStore();
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
  .wd400{
    width: 100%;
  }
</style>
