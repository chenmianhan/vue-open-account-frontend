<template>
  <div>
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
      <span class="demonstration">所属营业网点</span>
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
      <el-input v-model="input" placeholder="用户姓名"></el-input>
      </div>
      <!--<el-button type="primary" icon="el-icon-search">搜索</el-button>-->
      <el-button icon="el-icon-search" circle></el-button>
    </div>
    <div class="results">
      <el-table
      :data="tableData"
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
      <el-table-column
        prop="contact"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="inst"
        width="100px"
        label="开户机构">
      </el-table-column>
      <el-table-column
        prop="str"
        label="开户营业网点">
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
              v-model="visible">
              <div style="text-align:center; width: 300px">
                <el-form ref="form" :model="modifyForm" label-width="100px" size="mini">
                  <el-form-item label="姓名">
                    <el-input v-model="modifyForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号码">
                    <el-input v-model="modifyForm.idNum"></el-input>
                  </el-form-item>
                  <el-form-item label="联系地址" prop="contact_address">
                    <el-cascader
                      :options="address"
                      props.checkStrictly
                      v-model="modifyForm.contact_address"
                      props.expandTrigger="hover"
                      class="wd400">
                    </el-cascader>
                  </el-form-item>
                  <el-form-item label="联系方式">
                    <el-input v-model="modifyForm.contact"></el-input>
                  </el-form-item>


                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible = false; submitModifyForm('modifyForm')">保存</el-button>
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
  import area from '../../assets/js/area.js'

    export default {
      data() {
        return {
          address: areajson,
          visible : false,

          institute: '',
          ins_ops: [{//机构显示列表
            institute: 'sh',
            label: '上海',
          },{
            institute: 'sz',
            label: '深圳',
          } ],

          stores: [],
          str_ops:[{
            stores:'wangdian1',
            label:'营业网点1'
          },{
            stores:'wangdian2',
            label:'营业网点2'
          }],

          input:'',

          modifyForm:{
            name:'',
            idNum:'',
            contact_address:'',
            contact:'',
          },

          tableData:[{
            user_id:'1',
            name:'whatever',
            id_num:'123466876878987',
            contact_address:'北京市xx区',
            contact:'2435465767453',
            inst:'上海',
            str:'营业网点1',
          }],

          userData:[],
        };
      },
      methods: {
        handleChange(value) {
          console.log(value);
        },

        handleDelete(index, row) {
          console.log(index, row);
          var deleteId = row.user_id;
            this.$confirm("确认删除该用户吗？", "提示", {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('/api/admin/deleteUsers', deleteId)//post也可以改成get，但需要对应服务端的请求方法
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

        submitModifyForm(formName) {
          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                name: that.modifyForm.name,
                idNum: that.modifyForm.idNum,
                contact_address: that.modifyForm.contact_address,
                contact: that.modifyForm.contact,
              };

              // var that = this;
              console.log(postData);
              this.$axios.post('/api/modifyUser', this.$Qs.stringify(postData), {
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

        querytable(){
          var that = this;
          this.$axios.get('/api/admin/getAllUsers')//post也可以改成get，但需要对应服务端的请求方法
            .then(function (response) {
              //将返回的数据存入页面中声明的data中
              that.userData = response.data;
            })
            .catch(function (error) {
              alert(error);
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



<style>
  .search-bar{
    /*position: relative;*/
    float:left;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
  .results{
    /*position: relative;*/
  }
</style>
