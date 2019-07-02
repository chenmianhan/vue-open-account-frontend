<template>
<div>
  <div style="margin: 0 auto;width:70%;margin-top:50px;margin-bottom:50px;text-align:left;">
    <el-steps :active="0" finish-status="success">
      <el-step title="用户信息填写"></el-step>
      <el-step title="风险测评"></el-step>
      <el-step title="选择营业网点"></el-step>
      <el-step title="选择银行"></el-step>
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

      <el-form-item label="证件住址" prop="id_address">
        <el-cascader
          :options="address"
          props.checkStrictly
          v-model="infoForm.id_address"
          props.expandTrigger="hover"
          class="wd400">
        </el-cascader>
        <el-input v-model="infoForm.id_address_detail" class="wd400" style="padding: 10px" placeholder="详细地址"></el-input>
      </el-form-item>

      <el-form-item label="证件有效期" prop="dates">
        <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.begin" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;"></el-date-picker>
        <br>
        <span>——至——</span>
        <br>
        <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.expire" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;"></el-date-picker>
      </el-form-item>

      <el-form-item label="发证机关" prop="agency">
        <el-input v-model="infoForm.agency" class="wd400"></el-input>
      </el-form-item>


    <el-form-item label="联系地址" prop="contact_address">
      <el-cascader
        :options="address"
        props.checkStrictly
        v-model="infoForm.contact_address"
        props.expandTrigger="hover"
        class="wd400">
      </el-cascader>
       <el-input v-model="infoForm.contact_address_detail" class="wd400" style="padding: 10px" placeholder="详细地址"></el-input>
    </el-form-item>


      <el-form-item label="邮寄地址" prop="mail_address">
        <el-cascader
          :options="address"
          props.checkStrictly
          v-model="infoForm.mail_address"
          props.expandTrigger="hover"
          class="wd400">
        </el-cascader>
        <el-input v-model="infoForm.mail_address_detail" class="wd400" style="padding: 10px" placeholder="详细地址"></el-input>
      </el-form-item>


      <el-form-item label="职业" prop="job">
        <el-input v-model="infoForm.job" class="wd400"></el-input>
      </el-form-item>


      <el-form-item label="学历" prop="degree">
        <el-cascader
          :options="degree"
          props.checkStrictly
          v-model="infoForm.degree"
          class="wd400">
        </el-cascader>
        <!-- <el-input v-model="infoForm.address" class="wd400"></!-->
      </el-form-item>

      <el-form-item label="联系邮箱" prop="email">
        <el-input v-model="infoForm.email" class="wd400"></el-input>
      </el-form-item>

      <el-form-item>
        <h3>请上传身份证正反面照和个人大头照</h3>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeuploadFront"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="infoForm.front"
          list-type="picture">
          <el-button size="small" type="primary">上传正面照</el-button>
        </el-upload>
        <!-- <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeuploadBack"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="infoForm.back"
          list-type="picture">
          <el-button size="small" type="primary">上传反面照</el-button>
        </el-upload> -->
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeuploadBack"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="infoForm.back"
          list-type="picture">
          <el-button size="small" type="primary">上传反面照</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeuploadHead"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :file-list="infoForm.head"
          list-type="picture">
          <el-button size="small" type="primary">上传大头照</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
    <el-row style="height:50px;">
        <el-button class="button" icon="el-icon-caret-left" round @click="$router.push({path:'/login/warning'})">上一步</el-button>
        <el-button class="button" type="primary" round @click="submitForm('infoForm')">下一步<i class="el-icon-caret-right icon"></i></el-button>
    </el-row>
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
              //const reg=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
              const reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
              if(reg.test(value)){
                callback();
              }else{
                return callback(new Error('身份证号码不正确'));
              }
          }
        };
        var checkPhone = (rule, value, callback) => {
          if (!value) {          
            return callback(new Error('手机号不能为空'));        
            } else {          
              const reg = /^1[3|4|5|7|8][0-9]\d{8}$/          
              // console.log(reg.test(value));          
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

          src1:'',
          scr2:'',
          scr3:'',

          infoForm: {
            name: '',
            begin: '2000-01-01 00:00:00',
            expire: '2000-01-01 00:00:00',
            email: '',
            idNum: '',
            agency:'',
            id_address: '',
            id_address_detail: '',
            mail_address: '',
            mail_address_detail: '',
            contact_address: '',
            contact_address_detail: '',
            job:'',
            degree:'',
            front: [],
            frontUrl: '',
            back: [],
            backUrl: '',
            head: [],
            headUrl: ''
          },

          degree:[
            {value: '博士',
              label: '博士',
            },
            {value: '硕士',
              label: '硕士',
            },
            {value: '学士',
              label: '学士',
          },{
              value: '大专',
              label: '大专',
            }, {
              value: '高中',
              label: '高中',}
            , {
            value: '其他',
            label: '其他',}
          ],



          rules: {
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
            ],
            id_address: [
              { required: true, trigger: 'blur'}
            ],
            mail_address: [
              { required: true, trigger: 'blur'}
            ],
            contact_address: [
              { required: true, trigger: 'blur'}
            ],
           /* begin: [
              { type: 'date', required: true, message: '请选择证件有效期', trigger: 'change' }
            ],
            expire: [
              { type: 'date', required: true, message: '请选择证件有效期', trigger: 'change' }
            ],*/
            contact: [
              { required: true, message: '请输入手机号', trigger: 'blur' },
              { validator: checkPhone, trigger: 'blur' }
            ],
            idNum: [
              { required: true, message: '请输入身份证号', trigger: 'blur' },
              { validator:validID, trigger: 'blur' }
            ],
          }
        };
      },
      methods: {
        handleRemove(file, fileList) {
          // console.log(file, fileList);
        },
        handlePreview(file) {
          // console.log(file);
        },
        beforeRemove(file, fileList) {
          return this.$confirm(`确定移除 ${ file.name }？`);
        },
        beforeuploadFront(file) {
          // console.log(file);
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src1 = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.infoForm.frontUrl = this.src1;
          // return false;
        },
        beforeuploadBack(file) {
          // console.log(file);
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src2 = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.infoForm.backUrl = this.src2;
          // return false;
        },
        beforeuploadHead(file) {
          // console.log(file);
          //创建临时的路径来展示图片
          var windowURL = window.URL || window.webkitURL;
          this.src3 = windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.infoForm.headUrl = this.src3;
          // return false;
        },
        //覆盖默认的上传行为
        httprequest() {

        },



        submitForm(formName) {
          var that = this;
          // console.log(this.infoForm);
          // debugger;
          this.$refs[formName].validate((valid) => {
            // console.log(valid);
            if (valid) {
              let postData ={
                account_info: {
                  name: that.infoForm.name,
                  id_number: that.infoForm.idNum,
                  id_issuance_date: that.infoForm.begin,
                  id_overdue_date:that.infoForm.expire,
                  id_licensing_authority:that.infoForm.agency,
                  profession:that.infoForm.job,
                  education:that.infoForm.degree[0],
                  email: that.infoForm.email,
                  id_picture:that.infoForm.frontUrl,
                  id_card_inverse_side:that.infoForm.backUrl,
                  headshot:that.infoForm.headUrl,
                  user_id: 1},
                id_address: that.infoForm.id_address,
                id_address_detail: that.infoForm.id_address_detail,
                postal_address: that.infoForm.mail_address,
                postal_address_detail: that.infoForm.mail_address_detail,
                contact_address: that.infoForm.contact_address,
                contact_address_detail: that.infoForm.contact_address_detail,
              };


              
              console.log(postData);
              this.$axios.post('/api/addAccountInfo', postData)
                .then(
                  res=>{
                    console.log('res=>',res);
                    that.$router.push({path: '/login/evaluation'});
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



        }

      }
    }
</script>
<style scoped>
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
  .button{
    margin: 80px;
}
</style>
