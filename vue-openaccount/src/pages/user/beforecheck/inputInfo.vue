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
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="infoForm.name" class="wd400"></el-input>
      </el-form-item>

      <el-form-item label="证件号码" prop="idNum">
        <el-input v-model="infoForm.idNum" class="wd400"></el-input>
      </el-form-item>

      <el-form-item label="证件住址" prop="address">
        <el-cascader
          :options="address"
          change-on-select
          v-model="infoForm.id_address"
          expand-trigger="hover"
          @change="handleChange"
          class="wd400">
        </el-cascader>
        <!-- <el-input v-model="infoForm.address" class="wd400"></!-->
      </el-form-item>


      <el-form-item label="证件有效期" required prop="period">
        <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.begin" style="width: 300px;"></el-date-picker>
        <br>
        <span>——至——</span>
        <br>
        <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.expire" style="width: 300px;"></el-date-picker>
      </el-form-item>

      <el-form-item label="发证机关" prop="agency">
        <el-input v-model="infoForm.agency" class="wd400"></el-input>
      </el-form-item>


    <el-form-item label="联系地址" prop="address">
      <el-cascader
        :options="address"
        change-on-select
        v-model="infoForm.contact_address"
        expand-trigger="hover"
        @change="handleChange"
        class="wd400">
      </el-cascader>
      <!-- <el-input v-model="infoForm.address" class="wd400"></!-->
    </el-form-item>


      <el-form-item label="邮寄地址" prop="address">
        <el-cascader
          :options="address"
          change-on-select
          v-model="infoForm.mail_address"
          expand-trigger="hover"
          @change="handleChange"
          class="wd400">
        </el-cascader>
        <!-- <el-input v-model="infoForm.address" class="wd400"></!-->
      </el-form-item>


      <el-form-item label="职业" prop="job">
        <el-input v-model="infoForm.job" class="wd400"></el-input>
      </el-form-item>


      <el-form-item label="学历" prop="degree">
        <el-cascader
          :options="degree"
          change-on-select
          v-model="infoForm.degree">
        </el-cascader>
        <!-- <el-input v-model="infoForm.address" class="wd400"></!-->
      </el-form-item>

      <el-form-item label="联系邮箱" prop="email">
        <el-input v-model="infoForm.email" class="wd400"></el-input>
      </el-form-item>

      <h3>请上传身份证正反面照和个人大头照</h3>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>


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
          dialogImageUrl: '',
          dialogVisible: false,
          address: areajson,

          infoForm: {
            name: '',
            begin: '',
            expire:'',
            email: '',
            idNum: '',
            agency:'',
            id_address: '',
            mail_address: '',
            contact_address: '',
            job:'',
            degree:'',
          },

          degree:[{
            value: 'primary',
            label: '小学',}
            ,{
              value: 'junior',
              label: '中学',}
            ,{
            value: 'highschool',
            label: '高中',}
            , {
              value: 'uni',
              label: '大学',}
            ,{
              value: 'college',
              label: '大专',
            }
          ],

          fileList: [{name:'',url:''}],

          rules: {
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            begin: [
              { type: 'date', required: true, message: '请选择证件有效期', trigger: 'change' }
            ],
            expire: [
              { type: 'date', required: true, message: '请选择证件有效期', trigger: 'change' }
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
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log(file);
        },
        handleExceed(files, fileList) {
          this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },

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
            idNum: this.infoForm.idNum,
            begin: this.infoForm.begin,
            expire:this.infoForm.expire,
            email: this.infoForm.email,
            agency:this.infoForm.agency,
            id_address: this.infoForm.id_address,
            mail_address: this.infoForm.mail_address,
            contact_address: this.infoForm.contact_address,
            job:this.infoForm.job,
            degree:this.infoForm.degree,
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
