<template>
  <div>
    <div class="search-bar">
      <div class="block">
        <el-select @change="handleSelectChange"
        v-model="way" placeholder="请选择">
          <el-option
            v-for="item in wayOptions"
            :key="item.way"
            :label="item.label"
            :value="item.way">
          </el-option>
        </el-select>
      <!-- 日期查询 -->
        <div class='block' v-show="way == 'date'">
            <!-- <p>{{ dateValue[0] }} + {{ dateValue[1] }}</p> -->
            <el-date-picker
                v-model="dateValue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="checkRange()"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions">
            </el-date-picker>
            <!-- <el-tooltip class="item" effect="dark" content="所选日期范围最大为一周" placement="right">
                <el-button @click='getTableData' icon='el-icon-search' type='primary' round>查询</el-button>
            </el-tooltip> -->
        </div>
        <!-- 按用户姓名查询 -->
        <div class="block" v-show="way == 'name'">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入用户姓名"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
        <el-button @click="queryTable" icon="el-icon-search" type="info" circle></el-button>
        </div>
      </div>
      <div class="results">
        <el-table
        v-loading='loading'
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="user_id"
          label="用户id">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="id_num"
          width="200"
          label="身份证号码">
        </el-table-column>
        <el-table-column
          prop="contact"
          width="150"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="address"
          width="200"
          label="联系地址">
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
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        return {
          address: areajson,

          way: 'date',

          username: [],
          state: '',
          timeout:  null,

          vals:[],

          wayOptions:[{
            way: 'date',
            label:'按日期查询',
          },{
            way:'name',
            label:'按用户姓名查询',
          }],

          dateValue:'', //查询日期条件

          modifyForm:{ //修改表单
            name:'',
            //idNum:'',
            contact_address:'',
            contact_address_detail:'',
          },

          rules: {
            name: [
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            idNum: [
              { validator:validID, message: '请输入身份证号', trigger: 'blur' }
            ]
          },

          tableData:[],

          pickerOptions: {//日期选择器的快捷选项
                shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        var end = new Date();
                        var start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        end.setTime(end.getTime());

                        var dateRange = new Array(start, end);
                        var reg = new RegExp( '/' , "g" );
                        dateRange[0] = dateRange[0].toLocaleDateString().replace(reg,'-');
                        dateRange[1] = dateRange[1].toLocaleDateString().replace(reg,'-');
                        dateRange[0] += ' 00:00:00';
                        dateRange[1] += ' 23:59:59';

                        this.dateValue = dateRange;
                        start = this.dateValue[0];
                        end = this.dateValue[1];

                        picker.$emit('pick', [start, end]);
                    }
                }]
             },
          loading: true
        };
      },
      methods: {
          handleSelectChange(){
              this.tableData = [];
              this.totalNum = 0;

              this.queryTable();
          },

        handleForm(row){
          this.modifyForm.name = row.name;
          this.modifyForm.idNum = row.id_num;
        },

          setDefaultDate(){//默认显示最近一周已审核用户信息
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              end.setTime(end.getTime());

              var dateRange = new Array(start, end);
              var reg = new RegExp( '/' , "g" );
              dateRange[0] = dateRange[0].toLocaleDateString().replace(reg,'-');
              dateRange[1] = dateRange[1].toLocaleDateString().replace(reg,'-');
              dateRange[0] += ' 00:00:00';
              dateRange[1] += ' 23:59:59';

              this.dateValue = dateRange;
              console.log(this.dateValue);
              return true;
          },

          checkRange(){//检查选择的日期范围
            var end = new Date(this.dateValue[1]);
            var start = new Date(this.dateValue[0]);
            var now = new Date();

            now.setTime(now.getTime());
            var reg = new RegExp( '/' , "g" );
            now = now.toLocaleDateString().replace(reg, '-');
            var hintDate = now;
            now += ' 23:59:59';
            now = new Date(now);

            var dateRange = end.getTime() - start.getTime();
            var isBeyond = now.getTime() - end.getTime();
            console.log(dateRange);
            console.log(isBeyond);
            
            if(isBeyond < 0){
                this.$msgbox({
                    type:'error',
                    title: '超出范围',
                    message: '结束日期不能超过今天（' + hintDate + '），请重新选择！'
                });
                this.dateValue = '';
                return false;
            }else if (dateRange >= 3600 * 1000 * 24 * 7){
                this.$msgbox({
                    type:'error',
                    title: '超出范围',
                    message: '所选日期范围不能超过一周，请重新选择！'
                });
                this.dateValue = '';
                return false;
            }else{
                return true;
            }
        },

        queryTable(){
            this.tableData = [];
            this.totalNum = 0;
            if(this.way=='date'){
              this.queryDate();
            }else if (this.way=='name'){
              this.queryName();
            }
        },

        queryDate(){
            if(this.dateValue != ''){
                console.log(this.dateValue);
                const postData = {
                    start: this.dateValue[0],
                    end: this.dateValue[1]
                }
                var that = this;
                console.log(postData);
                //console.log(this.$Qs.stringify(postData));
                //向后端传输日期范围，后端返回该范围中所有审核通过用户信息对象列表
                //一个对象元素对应一个用户信息
                this.$axios.post('/api/admin/getUserByDate', postData
                ).then(function(response){
                    console.log(response.data);
                    that.tableData = response.data;
                    that.loading = false;
                }).catch(function(error){
                    console.log(error);
                    that.$msgbox({
                        type:'error',
                        title: '连接异常',
                        message: '获取用户信息失败！'
                    });
                });
            }
            else{
                if (this.setDefaultDate()){
                    this.queryDate();
                }
            }
        },

        queryName(){
           if (this.state != ''){
              console.log(this.state);
              const postData = {
                  username: this.state
              };
              var that = this;
              //console.log(this.$Qs.stringify(postData));
              this.$axios.post('/api/admin/getUserByName', postData
              ).then(function(response){
                  that.tableData = response.data;
                  that.loading = false;
                  for(var i = 0; i < that.tableData.length; i++){
                   that.tableData[i].visible = false;
                 }
              }).catch(function(error){
                  console.log(error);
                  that.$msgbox({
                    type: 'error',
                    title: '连接失败',
                    message: '获取用户信息失败！'
                  })
              })
           }
          //  else{
          //    this.$msgbox({
          //       type: 'info',
          //       title: '信息不完全',
          //       message: '请输入你想要搜索的用户姓名！'
          //    })
          //  }
        },

        loadAll(){
          var that = this;
          //后端传回用户姓名和ID对应的列表
          this.$axios.get('/api/admin/getUserId'
          ).then(function(response){
              console.log(response.data);
              that.username = response.data.username;
          }).catch(function(error){
              console.log(error);
              that.$msgbox({
                  type: 'error',
                  title: '连接失败',
                  message: '获取用户ID失败！'
              })
          })
        },

        querySearchAsync(queryString, cb) {
          var username = this.username;
          var results = queryString ? username.filter(this.createStateFilter(queryString)) : username;

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

        getCascaderObj(val,opt) {
          return val.map(function (value, index, array) {
            for (var itm of opt) {
              if (itm.value == value) { opt = itm.children; return itm; }
            }
            return null;
          });
        },

        submitModifyForm(formName, row) {
          this.vals = this.getCascaderObj(this.modifyForm.address, this.address);
          var temp = [];
          for (var i = 0; i < this.vals.length; i++){
            temp[i] = this.vals[i].label;
          };
          this.modifyForm.address = temp;
          console.log(this.modifyForm.address);

          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
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
                  console.log('修改', response);
                  that.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  that.queryTable();
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
          let deleteId = row.user_id;
          var that = this;
          this.$confirm("确认删除该用户吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/deleteUsers', {user_id: deleteId})//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                console.log('delete',response);
                if(response.data == 1){
                  that.$message({
                    message: '删除成功',
                    type: 'success'
                  })
                  that.queryTable();
                } else {
                  that.$msgbox({
                    message: '用户账户余额不为零，不可删除',
                    type: 'warning'
                  });
                }
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

        handleSelect(item) {
          console.log(item);
          var that = this;
          const postData = {
             userId: item.address
          }
          console.log(postData);

          this.$axios.post('/api/admin/getUserInfo', postData
          ).then(function(response){
              console.log(response);
              that.tableData = response.data.tableDate;
          }).catch(function(error){
              console.log(error);
              that.$msgbox({
                  type: 'error',
                  title:'连接失败',
                  message: '获取用户信息失败！'
              })
          })
        }
      },

      mounted(){
          this.setDefaultDate();
          this.queryTable();
          this.username = this.loadAll();
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
  .results{
    padding: 10px;
  }

</style>
