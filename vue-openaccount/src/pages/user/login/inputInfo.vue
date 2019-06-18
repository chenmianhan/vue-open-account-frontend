<template>

  <div class="questions">
    <h1>请填写以下信息</h1>

    <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-infoForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="infoForm.name"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender" >
        <el-radio-group v-model="infoForm.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="生日" required>
        <el-col :span="11">
          <el-form-item prop="birthday">
            <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.birthday" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="手机号" prop="contact">
        <el-input v-model="infoForm.contact"></el-input>
      </el-form-item>

      <el-form-item label="身份证号" prop="idNum">
        <el-input v-model="infoForm.idNum"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('infoForm')">提交</el-button>
        <el-button @click="backToWarning">返回</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  /*import {AxiosInstance as axios} from "axios";*/

    export default {
      data() {
        return {
          infoForm: {
            name: '',
            gender: '',
            birthday:'',
            contact: '',
            idNum: '',
          },
          rules: {
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            gender: [
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            birthday: [
              { type: 'date', required: true, message: '请选择生日', trigger: 'change' }
            ],
            contact: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { min: 11, max: 13, message: '手机号错误！', trigger: 'blur' }
            ],
            idNum: [
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              { min: 18, max: 19, message: '身份证错误！', trigger: 'blur' }
            ],
          }
        };
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          }
          );

          const postData ={
            name: this.infoForm.name,
            gender: this.infoForm.gender,
            birthday:this.infoForm.birthday,
            contact: this.infoForm.contact,
            idNum: this.infoForm.idNum,
          };

          this.$axios.post('/api/user/inputInfo',postData, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
          })
            .then(function (response) {
            console.log(response);
          })
            .catch(function (error) {
              console.log(error);
            });
        },
        //回到上一界面风险提示
        backToWarning(){
          this.$router.push('/login/warning');
        }
      }
    }
</script>
<style>
.questions{
  width:40%;
  /* float:left; */
  margin: 0 auto;
}
</style>
