<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange" >
      <el-collapse-item title="身份证有效期" name="1">
        <div style="float: left; color:gray;">设置</div>
        <el-date-picker
          v-model="dateValue"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-collapse-item>

      <el-collapse-item title="风险测评分数" name="2">
        <div style="float: left; display: inline; color:gray; padding-bottom: 10px">
          设置通过风险测评的最低分数：
          <el-input v-model="score" size="small" style="width: 50px"></el-input>
        </div>

      </el-collapse-item>
      <el-collapse-item title="营业网点审核员数量" name="3">
        <div style="float: left; display: inline; color:gray; padding-bottom: 10px">
          设置营业网点的审核员最大数：
          <el-input-number v-model="num" size="medium" @change="handleChange" :min="1" style="width: 150px"></el-input-number>
        </div>
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
        }
      }
    }
</script>
<style>

</style>
