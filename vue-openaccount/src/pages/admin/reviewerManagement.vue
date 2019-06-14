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
      <div class="block">
      <span class="demonstration">所属营业网点</span>
      <el-cascader
        v-model="stores"
        :options="str_ops"
        @change="handleChange"></el-cascader>
    </div>
      <div class="block">
      <el-input v-model="input" placeholder="用户姓名"></el-input>
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
          visible: false,
          institute: [],
          ins_ops: [{
            institute: 'shanghai',
            label: '上海',
          },{
            institute: 'shenzhen',
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

          tableData:[{
            reviewer_id:'1',
            name:'whatever',
            account:'123466876887',
            password:'243546453',
            inst:'上海',
            str:'营业网点1',
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
        handleChange(value) {
          console.log(value);
        },
        onSubmit() {
          console.log('submit!');
        },
        handleClick(tab, event) {
          console.log(tab, event);
        }
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
  .results{
    /*position: relative;*/
  }
</style>
