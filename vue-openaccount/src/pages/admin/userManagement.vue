<template>
  <div>
    <span>{{shPoint}}  {{szPoint}}</span>
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
        <span class="demonstration" v-show="institute!=''">所属营业网点</span>
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
        <el-input v-model="targetUser" placeholder="用户姓名"></el-input>
      </div>
      <el-button icon="el-icon-search" circle></el-button>
    </div>
    <div class="results">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="user_id"
        width="100px"
        label="用户id">
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
      <el-table-column
        prop="date"
        label="开户日期">
      </el-table-column>
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
                </el-form-item>

                <el-form-item label="所属营业网点" prop="store">
                  <el-cascader :options="Net"
                               checkStrictly
                               v-model="modifyForm.store"
                               class="wd400">
                  </el-cascader>
                </el-form-item>

                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="visible = false; submitModifyForm('modifyForm')">保存</el-button>
              </el-form>
            </div>
            <el-button slot="reference" size="mini">修改</el-button>
          </el-popover>

          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>


    </el-table>
    </div>
  </div>
</template>


<script>
    export default {
      data() {
        return {
          visible : false,

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
          shPoint: [],//最终被选择的营业网点列表
          szPoint: [],

          Net:[],

          targetUser:'',//搜索的目标用户名称

          modifyForm:{
            store:'',
            name:'',
            idNum:'',
            contact_address:'',
            contact:'',
          },

          tableData:[{//表格用户对象列表
            user_id:'1',
            name:'whatever',
            id_num:'123466876878987',
            contact:'2435465767453',
            inst:'上海',
            str:'营业网点1',
            date:'2019-6-10 13:20:45'
          }],
        };
      },
      methods: {
        querytable(){//查询指定网点的用户
          var that = this;

          if (this.institute != '' && this.shPoint.length > 0 && this.szPoint.length > 0){
            if (institute == 'sh'){
              const postData = {
                institue: this.institute,
                net: this.shPoint[0]
              };
            }else{
              const postData = {
                institute: this.institute,
                net: this.szPoint[0]
              }
            }
            this.$axios.post('/api/admin/getAllUsers', this.$Qs.stringify(postData)
              ).then(function (response) {
                //将返回的数据存入页面中声明的data中
                that.tableData = response.data.tableData;
              })
              .catch(function (error) {
                console.log(error);
                that.$msgbox({
                      type: 'error',
                      title: '连接异常',
                      message:'获取目标网点用户信息失败！'
                  })
              });
          }else{
            this.$msgbox({
              type: 'error',
              title: '信息不完全',
              message: '未选择机构或网点!'
            });
          }
        },

        queryUser(){//查询指定姓名的用户
          var that = this;
          if (this.institute != '' && this.shPoint.length > 0 && this.szPoint.length > 0){
            if (this.institute == 'sh'){
              const postData = {
                institue: this.institute,
                net: this.shPoint[0],
                username: this.targetUser
              };
            }else{
              const postData = {
                institute: this.institute,
                net: this.szPoint[0],
                username: this.targetUser
              };
            }

            this.$axios.post('/api/admin/getTargetUsers', this.$Qs.stringify(postData)
              ).then(function (response) {
                //将返回的数据存入页面中声明的data中
                that.tableData = response.data.tableData;
              })
              .catch(function (error) {
                console.log(error);
                that.$msgbox({
                      type: 'error',
                      title: '连接异常',
                      message:'获取目标用户信息失败！'
                  })
              });
          }else{
            this.$msgbox({
              type: 'error',
              title: '信息不完全',
              message: '未选择机构或网点!'
            });
          }
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

</style>
