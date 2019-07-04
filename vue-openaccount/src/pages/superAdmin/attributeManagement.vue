<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange" >
      <el-collapse-item title="身份证有效期" name="1">
        <!--<div style="color:gray;">设置用户身份证最晚有效期</div>-->
        <el-tooltip effect="dark" content="设置用户身份证最晚有效期" placement="left">
        <el-date-picker
          v-model="dateValue"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        </el-tooltip>
        <el-button type="primary" style="float: right" size="small" @click="SubmitDate">保存</el-button>
      </el-collapse-item>

      <el-collapse-item title="风险测评分数" name="2">
        <div style="display: inline; color:gray; padding-bottom: 10px">
          设置通过风险测评的最低分数：
          <el-input v-model="score" size="small" style="width: 50px"></el-input>
        </div>
        <el-button type="primary" style="float: right" size="small" @click="SubmitScore">保存</el-button>
      </el-collapse-item>

      <el-collapse-item title="营业网点审核员数量" name="3">
        <div style="display: inline; padding-bottom: 10px">
          <el-tooltip effect="dark" content="设置营业网点的审核员最大数" placement="left">
          <el-input-number v-model="num" size="medium" @change="handleChange" :min="1" style="width: 150px"></el-input-number>
          </el-tooltip>
        </div>
        <el-button type="primary" style="float: right" size="small" @click="SubmitNum">保存</el-button>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
    export default {
      data() {
        return {
          activeNames: ['1'],
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
          this.$confirm("确认修改吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/changeExpireDate', postData)
              .then(function (response) {
                this.$message({
                  type: 'info',
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
          this.$confirm("确认修改吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/changeMinScore', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                this.$message({
                  type: 'info',
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
          this.$confirm("确认修改吗？", "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/superadmin/changeMaxNum', postData)//post也可以改成get，但需要对应服务端的请求方法
              .then(function (response) {
                this.$message({
                  type: 'info',
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
      }
    }
</script>
<style>

</style>
