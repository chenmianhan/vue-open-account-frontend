<template>
  <div>
    <div class="search-bar">
      <!--<el-form :inline="true" :model="searchForm" size="medium" style="margin-top:20px;">
        <el-form-item label="选择网点">
          <el-cascader
            placeholder="所属营业网点"
            :options="Net"
            checkStrictly
            v-model="point"
            props.expandTrigger="hover"
            :show-all-levels='false'
            class="wd400">
          </el-cascader>
        </el-form-item>
        <el-form-item label="输入用户姓名">
          <el-input v-model="input" placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" circle type="primary" @click="handleSearch"></el-button>
        </el-form-item>
      </el-form>-->
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
          <el-cascader
            placeholder="所属营业网点"
            :options="Net"
            checkStrictly
            v-model="point"
            props.expandTrigger="hover"
            :show-all-levels='false'>
          </el-cascader>
        </el-form-item>

        <el-form-item v-show="way == 'uname'">
          <el-input v-model="user_name" placeholder="输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="queryUser" circle type="primary"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="results">
      <el-table
      v-loading="loading"
      :data="currentData"
      style="width: 100%">
      <el-table-column
        prop="user_id"
        width="50px"
        label="id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="100px"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="id_num"
        label="身份证号码">
      </el-table-column>
        <el-table-column
          prop="contact_address"
          label="联系地址">
        </el-table-column>
      <!--<el-table-column
        prop="contact"
        label="联系方式">
      </el-table-column>-->
      <el-table-column
        prop="apply_time"
        width="100px"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="audio_time"
        label="审核时间">
      </el-table-column>
     <!-- <el-table-column
        prop="date"
        label="开户日期">
      </el-table-column>-->
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">

            <el-popover
              placement="bottom"
              v-model="scope.row.visible">
              <div style="text-align:center; width: 300px">
                <el-form ref="modifyForm" :model="modifyForm" :rules="rules" label-width="100px" size="mini">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                  </el-form-item>
                 <!-- <el-form-item label="身份证号码" prop="idNum">
                    <el-input v-model="modifyForm.idNum"></el-input>
                  </el-form-item>-->
                  <el-form-item label="联系地址" prop="contact_address">
                    <el-cascader
                      :options="address"
                      props.checkStrictly
                      v-model="modifyForm.contact_address"
                      props.expandTrigger="hover"
                      class="wd400">
                    </el-cascader>
                    <el-input v-model="modifyForm.contact_address_detail" class="wd400" style="padding-top: 10px" placeholder="详细地址"></el-input>
                  </el-form-item>

                  <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="scope.row.visible = false; submitModifyForm('modifyForm',scope.row)">保存</el-button>
                </el-form>
              </div>
              <el-button slot="reference" size="mini" @click="handleForm(scope.row)">修改</el-button>
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
  import area from '../../assets/js/area.js'

    export default {
      data() {

        let validID=(rule,value,callback)=>{
          if(value==''||value==undefined){
            callback()
          }else{
            //const reg=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            const reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
            if(reg.test(value)){
              callback();
            }else{
              return callback(new Error('身份证号码不正确'));
            }
          }
        };

        var checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'));
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            // console.log(reg.test(value));
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的手机号'));
            }
          }
        };

        return {
          searchForm: {},
          address: areajson,
          /*props: { multiple: true },*/
          loading: true,
          currentPage: 1,
          pageSize: 8,
          length: 0,
          currentData: [],

          Net:[],
          input:'',

          vals:[],

          way: 'store',
          wayOptions:[{
            way: 'store',
            label:'按营业网点查询',
          },{
            way:'uname',
            label:'按用户姓名查询',
          }],

          point: '',
          user_name:'',

          modifyForm:{
            name:'',
            //idNum:'',
            contact_address:'',
            contact_address_detail:'',
          },

          tableData:[],

          rules: {
            name: [
              { message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            idNum: [
              { message: '请输入身份证号', trigger: 'blur' },
              { validator:validID, trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
        handleForm(row){
          this.modifyForm.name = row.name;
          this.modifyForm.idNum = row.id_num;
        },


        handleDelete(index, row) {
          console.log(index, row);
          let deleteId = row.user_id;
          var that = this;
            this.$confirm("确认删除该用户吗？", "提示", {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('/api/deleteUsers', {user_id: deleteId})//post也可以改成get，但需要对应服务端的请求方法
                .then(function (response) {
                  console.log(response);
                  //that.handleSearch();
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

        getCascaderObj(val,opt) {
          return val.map(function (value, index, array) {
            for (var itm of opt) {
              if (itm.value == value) { opt = itm.children; return itm; }
            }
            return null;
          });
        },

        submitModifyForm(formName, row) {
          this.vals = this.getCascaderObj(this.modifyForm.contact_address, this.address);
          var temp = [];
          for (var i = 0; i < this.vals.length; i++){
            temp[i] = this.vals[i].label;
          };
          this.modifyForm.contact_address = temp;
          console.log(this.modifyForm.contact_address);

          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);

              const postData = {
                name: that.modifyForm.name,
                //ID_number: that.modifyForm.idNum,
                contact_address: that.modifyForm.contact_address,
                contact_address_detail: that.modifyForm.contact_address_detail,
                user_id:row.user_id,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/updateAccountInfo', postData)
                .then(function (response) {
                  console.log(response);
                  that.$msgbox({
                    title: '修改成功',
                    type: 'succeed'
                  });
                  //that.handleSearch();
                  that.queryUser();
                })
                .catch(function (error) {
                  that.$msgbox({
                    title: '连接失败',
                    type: 'error'
                  });
                });

          });
        },

        queryUser(){
          this.loading = true;
          if(this.way=='store'){
            this.queryStore();
          }else if (this.way=='uname'){
            this.queryName();
          }
        },

        queryStore(){
          if (this.point != ''){
            console.log(this.point[2]);
            const postData = {
              store: this.point[2],
            };
            var that = this;
            this.$axios.post('/api/superadmin/getUserByStore', postData)
              .then(function(response){
                console.log(response.data.tableData);
                that.tableData = response.data.tableData;
                that.length = that.tableData.length;
                that.loading = false;
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
              message: '请选择你想要搜索的网点名称！'
            })
          }
        },

        queryName(){
          if (this.user_name != ''){
            console.log(this.user_name);
            const postData = {
              user_name: this.user_name
            };
            var that = this;
            this.$axios.post('/api/superadmin/getUserByName', postData)
              .then(function(response){
                console.log(response);
                that.tableData = response.data.tableData;
                that.length = that.tableData.length;
                that.loading = false;
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

        handleSizeChange(val){
          this.pageSize = val;
          this.handleCurrentChange(1);
        },

        handleCurrentChange(val){{
          this.currentPage = val;
          this.currentData = [];
          for(var i = (this.currentPage - 1) * this.pageSize; (i < this.currentPage * this.pageSize) && (i < this.length); i++){
            this.tableData[i].visible = false;
            this.currentData.push(this.tableData[i]);
          }
        }},

        getList(){
          var that = this;
          this.$axios.get('/api/security/get_securityall').then(function(response){
            that.Net = response.data;
          });
          console.log('get list');
        },

        handleSearch(){
          var that = this;
          var postData = {
            point: this.point,
            name: this.input,
          }
          this.$axios.post('',postData).then(function(response){
            that.userData = response.data;
          })
        }

      },

      mounted(){
        console.log('start to get net list');
        this.getList();
        this.loading = false;
        // this.getSZList();
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
  .wd400{
    width: 100%;
  }
</style>
