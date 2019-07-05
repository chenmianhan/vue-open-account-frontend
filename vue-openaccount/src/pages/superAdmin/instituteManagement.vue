<template>
  <div v-loading='loading' element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="search-bar">
      <el-form :inline="true" :model="searchForm" size="medium" style="margin-top:20px;">
        <el-form-item label="查找营业网点">
        <el-input v-model="store" placeholder="营业网点名称" class="wd400"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryStore" circle type="primary"></el-button>
        </el-form-item>
        <el-form-item>
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
            </el-form-item>
            <el-form-item label="网点电话" prop="contact_phone">
              <el-input v-model="addForm.contact_phone"></el-input>
            </el-form-item>
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false; submitAddForm('addForm')">保存</el-button>
          </el-form>
        </div>
        <el-button slot="reference" type="primary" size="small">添加</el-button>
      </el-popover>
        </el-form-item>
      </el-form>
    </div>



    <!-- <div class="search-bar">
      <div class="block">
        <el-input v-model="store" placeholder="营业网点名称" class="wd400"></el-input> -->
        <!--<el-autocomplete
          v-model="store"
          :fetch-suggestions="querySearchAsync"
          placeholder="营业网点名称"
          @select="handleSelect"
          class="wd400"
        ></el-autocomplete>-->
      <!-- </div>
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
            </el-form-item>
            <el-form-item label="网点电话" prop="contact_phone">
              <el-input v-model="addForm.contact_phone"></el-input>
            </el-form-item>
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false; submitAddForm('addForm')">保存</el-button>
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
          prop="security_id"
          width="100px"
          label="网点id">
        </el-table-column>
        <el-table-column
          prop="name"
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
          searchForm:{},
          loading: true,
          address: areajson,
          visible: false,
          currentPage: 1,
          pageSize: 8,
          length: 0,
          currentData: [],

          store:'',

          vals:[],

          addForm:{
            store:'',
            address:'',
            address_detail:'',
          },

          instData:[{
            security_id: '',
            name:'营业网点1',
            province:'广东',
            city:'广州',
            contact_phone:'',
            user_number:'123',
          }],

          rules: {
            store: [
              { required: true, message: '请输入网点名称', trigger: 'blur' }
            ],
            address: [
              { required: true, trigger: 'blur'}
            ],
            contact_phone: [
              { required: true, message: '请输入电话号码', trigger: 'blur' },
              { validator: checkPhone, trigger: 'blur' }
            ],
          },

        }
      },
      methods:{
        handleSizeChange(val){
          this.pageSize = val;
          this.handleCurrentChange(1);
        },
        handleCurrentChange(val){{
          this.currentPage = val;
          this.currentData = [];
          for(var i = (this.currentPage - 1) * this.pageSize; (i < this.currentPage * this.pageSize) && (i < this.length); i++){
            this.currentData.push(this.instData[i]);
          }
        }},
        handleChange(file, fileList) {
          // console.log(file, fileList);
        },

        getCascaderObj(val,opt) {
          return val.map(function (value, index, array) {
            for (var itm of opt) {
              if (itm.value == value) { opt = itm.children; return itm; }
            }
            return null;
          });
        },

        submitAddForm(formName) {
          this.addForm.address.splice(2,1);
          this.vals = this.getCascaderObj(this.addForm.address, this.address);
          var temp = [];
          for (var i = 0; i < this.vals.length; i++){
            temp[i] = this.vals[i].label;
          };
          this.addForm.address = temp;
          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {

              const postData = {
                store: that.addForm.store,
                address: that.addForm.address,
                phone: that.addForm. contact_phone,
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
            store:  row.security_id,
          };
          this.$confirm("确认删除该网点吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/deleteStore', postData)//post也可以改成get，但需要对应服务端的请求方法
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
            console.log(postData);
            this.$axios.post('/api/superadmin/getStore', postData)
              .then(function(response){
                console.log(response.data);
                that.instData = response.data;
                that.length = that.instData.length;
                // if(that.length < that.pageSize){
                //   that.currentData = that.instData;
                // }else{
                //   that.currentData = [];
                //   for(var i = 0; i < that.pageSize; i++){
                //     that.currentData.push(that.instData[i]);
                //   }
                // }
                that.handleCurrentChange(1);
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
          this.$axios.get('/api/superadmin/getStore', postData)
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
              that.loading = false;
            that.instData = response.data;
            that.length = that.instData.length;
            // that.currentData = [];
            // for(var i = 0; i < that.pageSize; i++){
            //   that.currentData.push(that.instData[i]);
            // }
            that.handleCurrentChange(1);
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
  padding:10px;
  border-bottom:1px #DCDFE6 solid;
  background-color:#F2F6FC;
  height:80px;
  width:90%;
  margin:0 auto;
}
  .results{
    margin-top:40px;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
  .wd400{
    width: 100%;
  }
</style>
