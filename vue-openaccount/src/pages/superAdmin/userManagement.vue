<template>
  <div>
    <div class="search-bar">
      <div class="block">
      <span class="demonstration">选择网点</span>
        <el-select v-model="institute" placeholder="所属机构">
          <el-option
            v-for="item in ins_ops"
            :key="item.institute"
            :label="item.label"
            :value="item.institute">
          </el-option>
        </el-select>
      </div>
      <div class="block">
     <!-- <span class="demonstration">所属营业网点</span>-->
        <el-cascader v-show="institute=='sh'"
                     placeholder="所属营业网点"
                     :options="shNet"
                     checkStrictly
                     v-model="shPoint"
                     props.expandTrigger="hover"
                     :show-all-levels='false'
                     class="wd400">
        </el-cascader>
        <el-cascader v-show="institute=='sz'"
                     placeholder="所属营业网点"
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
        prop="apply_time"
        width="100px"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="audit_time"
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
              v-model="visible">
              <div style="text-align:center; width: 300px">
                <el-form ref="modifyForm" :model="modifyForm" :rules="rules" label-width="100px" size="mini">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号码" prop="idNum">
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
                    <el-input v-model="modifyForm.contact_address_detail" class="wd400" style="padding: 10px" placeholder="详细地址"></el-input>
                  </el-form-item>

                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="visible = false; submitModifyForm('modifyForm',scope.row)">保存</el-button>
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
          address: areajson,
          visible : false,
          /*props: { multiple: true },*/

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

          Net:[],

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
            contact_address_detail:'',
          },

          tableData:[{
            user_id:'1',
            name:'whatever',
            id_num:'123466876878987',
            contact_address:'北京市xx区',
            contact:'2435465767453',
          }],

          userData:[],

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
        handleChange(value) {
          console.log(value);
        },

        handleDelete(index, row) {
          console.log(index, row);
          let deleteId = row.user_id;
            this.$confirm("确认删除该用户吗？", "提示", {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post('/api/deleteUsers', {user_id: deleteId})//post也可以改成get，但需要对应服务端的请求方法
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

        submitModifyForm(formName, row) {
          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              const postData = {
                name: that.modifyForm.name,
                ID_number: that.modifyForm.idNum,
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
  .wd400{
    width: 100%;
  }
</style>
