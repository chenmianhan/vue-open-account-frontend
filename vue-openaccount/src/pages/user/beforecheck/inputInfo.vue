<template>
<div>
  <div style="margin: 0 auto;width:70%;margin-top:50px;margin-bottom:50px;text-align:left;">
  <el-steps :active="0" finish-status="success">
    <el-step title="用户信息填写"></el-step>
    <el-step title="风险测评"></el-step>
    <el-step title="选择营业网点"></el-step>
    <el-step title="审核"></el-step>
  </el-steps>  
  </div>
<el-divider><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i></el-divider>
  <div class="questions">
    <h1>请填写以下信息</h1>

    <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px" class="demo-infoForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="infoForm.name" class="wd400"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender" >
        <el-radio-group v-model="infoForm.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="生日" required prop="birthday">
        <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.birthday" style="width: 300px;"></el-date-picker>
      </el-form-item>

      <el-form-item label="手机号" prop="contact">
        <el-input v-model="infoForm.contact" class="wd400"></el-input>
      </el-form-item>

      <el-form-item label="身份证号" prop="idNum">
        <el-input v-model="infoForm.idNum" class="wd400"></el-input>
      </el-form-item>

      <el-form-item label="家庭住址" prop="address">
        <el-cascader
          :options="address"
          change-on-select
          v-model="infoForm.address"
          expand-trigger="hover"
          class="wd400">
        </el-cascader>
        <!-- <el-input v-model="infoForm.address" class="wd400"></!-->
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-caret-left" round @click="$router.push({path:'/login/warning'})">上一步</el-button>
        <el-button type="primary" round @click="submitForm('infoForm')">下一步<i class="el-icon-caret-right icon"></i></el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import area from '../../../assets/js/area.js'
  /*import {AxiosInstance as axios} from "axios";*/

    export default {
      data() {
        let validID=(rule,value,callback)=>{
          if(value==''||value==undefined){
              callback()
          }else{
              let reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
              if(!reg.test(value)){callback(new Error('身份证号码不正确'))}
          }
        };
        var checkPhone = (rule, value, callback) => {
          if (!value) {          
            return callback(new Error('手机号不能为空'));        
            } else {          
              const reg = /^1[3|4|5|7|8][0-9]\d{8}$/          
              console.log(reg.test(value));          
              if (reg.test(value)) {            
                callback();          
              } else {            
                return callback(new Error('请输入正确的手机号'));          
              }        
            }      
          };
        return {
          address: areajson,
          infoForm: {
            name: '',
            gender: '',
            birthday:'',
            contact: '',
            idNum: '',
            address: ''
          },
          rules: {
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            gender: [
              { required: true, message: '请选择性别', trigger: 'blur' }
            ],
            birthday: [
              { type: 'date', required: true, message: '请选择生日', trigger: 'blur' }
            ],
            contact: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: checkPhone, trigger: 'blur' }
            ],
            idNum: [
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              { validator:validID, trigger: 'blur' }
            ],
            address: [
              { required: true, message: '请输入家庭地址', trigger: 'blur' },
            ]
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
          });

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
.wd400{
  width: 300px;
}
.icon{
    margin-left:6px;
}
</style>
