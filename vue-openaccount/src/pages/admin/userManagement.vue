<template>
  <div>
    <div class="search-bar">
      <div class="block">
        <el-select v-model="way" placeholder="请选择">
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
        <el-button @click="queryTable" icon="el-icon-search" circle></el-button>
        </div>
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
          prop="address"
          width="100px"
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
              v-model="visible">
              <div style="text-align:center; width: 300px">
                <el-form ref="modifyForm" :model="modifyForm" :rules="rules" label-width="100px" size="mini">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="modifyForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号码" prop="idNum">
                    <el-input v-model="modifyForm.idNum"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="modifyForm.contact"></el-input>
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

          way: 'date',

          username: [],
          state: '',
          timeout:  null,

          wayOptions:[{
            way: 'date',
            label:'按日期查询',
          },{
            way:'name',
            label:'按用户姓名查询',
          }],

          dateValue:'', //查询日期条件

          targetUser:'',//搜索的目标用户名称

          modifyForm:{ //修改表单
            name:'',
            idNum:'',
            contact_address:'',
            contact:'',
          },

          tableData:[{//表格用户对象列表
            user_id:'1',
            name:'张三',
            id_num:'510504199901010000',
            contact:'13300000101',
            address:'广东省广州市大学城',
            date:'2019-01-01 00:00:00'
          }],
          pickerOptions: {//日期选择器的快捷选项
                shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        end.setTime(end.getTime());
                        picker.$emit('pick', [start, end]);
                    }
                }]
             },
          loading: false
        };
      },
      methods: {
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
                console.log(this.$Qs.stringify(postData));
                //向后端传输日期范围，后端返回该范围中所有审核通过用户信息对象列表
                //一个对象元素对应一个用户信息
                this.$axios.post('/api/admin/getUserByDate', this.$Qs.stringify(postData)
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
              console.log(this.$Qs.stringify(postData));
              this.$axios.post('/api/admin/getUserByName', this.$Qs.stringify(postData)
              ).then(function(response){
                  that.tableData = response.data;
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
                message: '请输入你想要搜索的用户姓名！'
             })
           }
        },

        loadAll(){
          var that = this;
          //后端传回用户姓名和ID对应的列表
          this.$axios.get('/api/admin/getUserId'
          ).then(function(response){
              this.username = response.data;
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

        handleSelect(item) {
          console.log(item);
          var that = this;

          this.$axios.get('/api/admin/getUserInfo', params={userId: item.address}
          ).then(function(response){
              that.tableData = response.data;
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
