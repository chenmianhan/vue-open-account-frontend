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


  <div class="chooseBank">
    <h1>请选择资金存管银行并填写银行账号</h1>

    <el-form ref="bankForm" :model="bankForm" status-icon :rules="rules" label-width="100px">
      <el-form-item label="选择银行" prop="user_bank">
       <el-select v-model="bankForm.user_bank" class="wd400">
         <el-option label="中国银行" value="中国银行"></el-option>
         <el-option label="中国农业银行" value="中国农业银行"></el-option>
         <el-option label="中国建设银行" value="中国建设银行"></el-option>
         <el-option label="中国工商银行" value="中国工商银行"></el-option>
       </el-select>
      </el-form-item>

      <el-form-item label="存管银行账号" prop="bank_account">
        <el-input v-model="bankForm.bank_account" aria-placeholder="输入储蓄卡卡号" class="wd400"></el-input>
      </el-form-item>
      <el-form-item label="确认银行账号" prop="check_account">
        <el-input v-model="bankForm.check_account" aria-placeholder="确认卡号" class="wd400"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="bank_password">
        <el-input v-model="bankForm.bank_password" aria-placeholder="输入取款密码" class="wd400"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-caret-left" round @click="$router.push({path:'/user/choose'})">上一步</el-button>
        <el-button type="primary" round @click="submitForm('bankForm')">下一步<i class="el-icon-caret-right icon"></i></el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
    export default {
      data(){
        let checkAccount = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入账号'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入账号不一致'));
          } else {
            callback();
          }
        };

        return{
          user_bank:[],

          bankForm:{
            user_bank:'',
            bank_account:'',
            check_account:'',
            bank_password:'',
          },

          rules: {
            check_account: [
              { validator: checkAccount, trigger: 'blur' }
            ]
          }

        }
      },

      methods: {
        submitForm(formName) {
          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const postData = {
                bank_account: that.bankForm.bank_account,
                bank_password: that.bankForm.bank_password,
              };
              this.$axios.post('/api/chooseBank',this.$Qs.stringify(postData), {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
              })
                .then(function (response) {
                  // if(response.data.)
                  console.log(response);
                  that.$router.push('/user/loading');
                })
                .catch(function (error) {
                  that.$msgbox({
                    title: '连接失败',
                    type: 'error'
                  });
                });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      }
    }
</script>
<style>
  .chooseBank{
    width:40%;
    margin: 0 auto;
  }
  .wd400{
    width: 300px;
  }
  .icon{
    margin-left:6px;
  }
</style>
