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
        <el-input v-model="targetUser" placeholder="审核员姓名"></el-input>
      </div>
      <!--<el-button type="primary" icon="el-icon-search">搜索</el-button>-->
      <el-button icon="el-icon-search" circle></el-button>
      <el-popover
        placement="bottom"
        v-model="visible1">
        <div style="text-align:center; width: 300px">
          <el-form ref="form" :model="addForm" label-width="100px" size="mini">
            <el-form-item label="审核员名称">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="addForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>

            <el-form-item label="权限" prop="authority">
              <el-tabs v-model="addForm.inst" @tab-click="handleClick">
                <el-tab-pane label="上海" name="first">
                  <el-radio-group v-model="addForm.str" >
                    <el-radio label="营业网点1"></el-radio>
                    <el-radio label="营业网点2"></el-radio>
                    <el-radio label="营业网点3"></el-radio>
                    <el-radio label="营业网点4"></el-radio>
                  </el-radio-group>
                </el-tab-pane>
                <el-tab-pane label="深圳" name="second">
                  <el-radio-group v-model="addForm.str" >
                    <el-radio label="营业网点1"></el-radio>
                    <el-radio label="营业网点2"></el-radio>
                    <el-radio label="营业网点3"></el-radio>
                  </el-radio-group>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>

            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="visible = false; onSubmit">保存</el-button>
          </el-form>
        </div>
        <el-button slot="reference" type="primary" size="small" style="margin-left: 50px">添加</el-button>
      </el-popover>

  </div>
    <div class="results">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="reviewer_id"
        width="100px"
        label="审核员id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="100px"
        label="审核员名称">
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
        prop="inst"
        label="负责机构">
      </el-table-column>
      <el-table-column
        prop="str"
        label="负责营业网点">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">

          <el-popover
            placement="bottom"
            v-model="visible2">
            <div style="text-align:center; width: 300px">
              <el-form ref="form" :model="modifyForm" label-width="100px" size="mini">
                <el-form-item label="审核员名称">
                  <el-input v-model="modifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-model="modifyForm.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="modifyForm.password"></el-input>
                </el-form-item>

                <el-form-item label="权限" prop="authority">
                  <el-tabs v-model="modifyForm.inst" @tab-click="handleClick">
                    <el-tab-pane label="上海" name="first">
                      <el-radio-group v-model="modifyForm.str" >
                        <el-radio label="营业网点1"></el-radio>
                        <el-radio label="营业网点2"></el-radio>
                        <el-radio label="营业网点3"></el-radio>
                        <el-radio label="营业网点4"></el-radio>
                      </el-radio-group>
                    </el-tab-pane>
                    <el-tab-pane label="深圳" name="second">
                      <el-radio-group v-model="modifyForm.str" >
                        <el-radio label="营业网点1"></el-radio>
                        <el-radio label="营业网点2"></el-radio>
                        <el-radio label="营业网点3"></el-radio>
                      </el-radio-group>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>

                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="visible = false; onSubmit">保存</el-button>
              </el-form>
            </div>
            <el-button slot="reference">修改</el-button>
          </el-popover>

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
          visible1: false,
          visible2: false,
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

          targetUser:'',//搜索的目标用户名称

          tableData:[{//表格用户对象列表
            user_id:'1',
            name:'whatever',
            gender:'男',
            id_num:'123466876878987',
            contact:'2435465767453',
            inst:'上海',
            str:'营业网点1',
            date:'2019-6-10 13:20:45'
          }],

          modifyForm:{
            name:'',
            account:'',
            password:'',
            inst:'',
            str:''
          },

          addForm:{
            name:'',
            account:'',
            password:'',
            inst:'',
            str:''
          },

          ins_radio:'上海',
          str_radio1:'营业网点1',
          str_radio2:'营业网点1',
        };
      },
      methods: {
        onSubmit() {
          console.log('submit!');
        },
        handleClick(tab, event) {
          console.log(tab, event);
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
        }
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
    float:left;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
</style>
