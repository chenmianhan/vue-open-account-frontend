<template>

  <div>
    <div class="search-bar">
      <div class="block">
        <el-input v-model="input" placeholder="管理员名称"></el-input>
      </div>
      <el-button icon="el-icon-search" circle></el-button>

      <el-popover
        placement="bottom"
        v-model="visible1">
        <div style="text-align:center; width: 300px">
          <el-form ref="form" :model="addForm" label-width="100px" size="mini">
            <el-form-item label="管理员名称">
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
        prop="admin_id"
        width="100px"
        label="管理员id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="100px"
        label="管理员名称">
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
        prop="authority"
        label="权限">
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
                <el-form-item label="管理员名称">
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
                      <el-checkbox-group v-model="modifyForm.str">
                        <el-checkbox label="营业网点1"></el-checkbox>
                        <el-checkbox label="营业网点2"></el-checkbox>
                        <el-checkbox label="营业网点3"></el-checkbox>
                        <el-checkbox label="营业网点4"></el-checkbox>
                      </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane label="深圳" name="second">
                      <el-checkbox-group v-model="modifyForm.str">
                        <el-checkbox label="营业网点1"></el-checkbox>
                        <el-checkbox label="营业网点2"></el-checkbox>
                        <el-checkbox label="营业网点3"></el-checkbox>
                      </el-checkbox-group>
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
      data(){
        return{
          input:'',
          visible1: false,
          visible2: false,

          modifyForm:{
            name:'',
            account:'',
            password:'',
            inst:[''],
            str:[''],
          },

          addForm:{
            name:'',
            account:'',
            password:'',
            inst:'',
            str:''
          },
        }
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
