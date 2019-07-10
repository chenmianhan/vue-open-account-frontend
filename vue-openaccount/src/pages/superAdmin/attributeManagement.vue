<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange" >
      <el-collapse-item title="身份证有效期" name="1">
        <el-row>
          <el-col :span="5" style="text-align:right;">
            <img class="img-icon" src="../../assets/image/card.png">
          </el-col>
          <el-col :span="12" style="line-height:150px;">
            <el-tooltip effect="dark" content="设置用户身份证最晚有效期" placement="bottom">
            <el-date-picker
              v-model="dateValue"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            </el-tooltip>
            <el-button type="primary" size="small" style="margin-left:30px;" @click="SubmitDate">保存</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="风险测评分数" name="2">
        <el-row>
          <el-col :span="5" style="text-align:right;">
            <img class="img-icon" src="../../assets/image/paper.png">
          </el-col>
          <el-col :span="12" style="line-height:150px;">
            <div style="display: inline; color:gray; padding-bottom: 10px">
              设置通过风险测评的最低分数：
              <el-input v-model="score" size="small" style="width: 50px"></el-input>
            </div>
            <el-button type="primary" style="margin-left:30px;" size="small" @click="SubmitScore">保存</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="营业网点审核员数量" name="3">
        <el-row>
          <el-col :span="5" style="text-align:right;">
            <img class="img-icon" src="../../assets/image/people.png">
          </el-col>
          <el-col :span="12" style="line-height:150px;">
            <div style="display: inline; padding-bottom: 10px">
              <el-tooltip effect="dark" content="设置营业网点的审核员最大数" placement="left">
              <el-input-number v-model="num" size="medium" @change="handleChange" :min="1" style="width: 150px"></el-input-number>
              </el-tooltip>
            </div>
            <el-button type="primary" style="margin-left:30px;" size="small" @click="SubmitNum">保存</el-button>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
    export default {
      data() {
        return {
          activeNames: ['1','2','3'],
          dateValue: '',
          score:'',
          num:1,

          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          },


        };
      },

      methods: {
        handleChange(val) {
          console.log(val);
        },

        SubmitDate(){
          let postData = {
            expire_date:  this.dateValue,
          };
          var that = this;
          this.$confirm("确认修改吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/changeExpireDate', postData)
              .then(function (response) {
                // console.log('date', response.data)
                that.$message({
                  type: 'success',
                  message: '已修改'
                });
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

        SubmitScore(){
          let postData = {
            min_score:  this.score,
          };
          var that = this;
          this.$confirm("确认修改吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/changeMinScore', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                console.log('score',response.data)
                that.$message({
                  type: 'success',
                  message: '已修改'
                });
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

        SubmitNum(){
          let postData = {
            max_num:  this.num,
          };
          var that = this;
          this.$confirm("确认修改吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/changeMaxNum', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                that.$message({
                  type: 'success',
                  message: '已修改'
                });
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

        getDate(){
          var that = this;
          this.$axios.get('/api/superadmin/getExpireDate')
            .then(function (response) {
              that.dateValue = response.data.expire_date;
            })
            .catch(function (error) {
              alert(error);
            });
        },
        getScore(){
          var that = this;
          this.$axios.get('/api/superadmin/getMinScore').then(function(response){
            that.score = response.data.min_score;
          }).catch(() => {
            that.$msgbox({
              message:'连接异常',
              type: 'error'
            });
          });
        },
        getReviewer(){
          var that = this;
          this.$axios.get('/api/superadmin/getAuditorNum').then(function(response){
            console.log('admin', response.data)
            that.num = response.data.auditor_num;
          }).catch(() => {
            that.$msgbox({
              message:'连接异常',
              type: 'error'
            });
          })
        }

      },
      mounted(){
        this.getDate();
        this.getScore();
        this.getReviewer();
      }
    }
</script>
<style scoped>
  .img-icon{
    width: 60%;
    /* background: #000; */
  }
</style>
