<template>
    <div>
        <el-col :span="8">
            <img class="photo" src="../../../assets/image/user.jpg">
          <el-row>
                <el-button type='primary' round v-show="!modify" @click="handleChange">更改信息</el-button>
                <el-button type='success' round v-show="modify" @click="handleSubmit">保存</el-button>
            </el-row>

        </el-col>
        <el-col :span="16">
            <div class="info-box">
                 <el-tabs v-model="title">
                      <el-tab-pane label="身份信息" name="1">
                         <el-row>
                              <span class="title">姓名</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{accountInfo.name}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-input v-model="newInfo.name" style="width:200px;"></el-input>
                         </el-row>
                         <el-row>
                              <span class="title">证件类型</span> 
                         </el-row>
                         <el-row>
                              <span class="content">{{accountInfo.id_type}}</span> 
                         </el-row>
                         <el-row>
                              <span class="title">证件号码</span> 
                         </el-row>
                         <el-row>
                              <span class="content">{{accountInfo.id_number}}</span> 
                         </el-row>
                         <el-row>
                              <span class="title">证件有效期</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{accountInfo.id_issuance_date}} 至 {{accountInfo.id_overdue_date}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-date-picker
                                   v-model="newInfo.date"
                                   type="daterange"
                                   align="right"
                                   unlink-panels
                                   range-separator="至"
                                   start-placeholder="开始日期"
                                   end-placeholder="结束日期"
                                   format="yyyy 年 MM 月 dd 日"
                                   value-format="yyyy-MM-dd HH:mm:ss"
                                   :default-time="['00:00:00', '23:59:59']">
                              </el-date-picker>
                         </el-row>
                         <el-row>
                              <span class="title">发证机关</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{accountInfo.id_licensing_authority}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-input v-model="newInfo.authority" style="width:200px;"></el-input>
                         </el-row>
                      </el-tab-pane>
                      <el-tab-pane label="生活信息" name="2">
                         <el-row>
                              <span class="title">职业</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{accountInfo.profession}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-input v-model="newInfo.profession" style="width:200px;"></el-input>
                         </el-row>
                         <el-row>
                              <span class="title">学历</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{accountInfo.education}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-select v-model="newInfo.edu">
                                   <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                   </el-option>
                              </el-select>
                         </el-row>
                         <el-row>
                              <span class="title">邮箱</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-input v-model="newInfo.email" style="width:200px;"></el-input>
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{accountInfo.email}}</span> 
                         </el-row>
                         <el-row>
                              <span class="title">联系地址</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{contactAddress.province}} / {{contactAddress.city}} / {{contactAddress.street}} / {{contactAddress.detail}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-cascader
                              v-model="newInfo.contactAddress"
                              :options="address"
                              props.checkStrictly
                              props.expandTrigger="hover">
                              </el-cascader>
                              <el-input v-model="newInfo.contactDetail" style="width:200px;" placeholder="详细地址"></el-input>
                         </el-row>
                         <el-row>
                              <span class="title">邮寄地址</span> 
                         </el-row>
                         <el-row v-show="!modify">
                              <span class="content">{{postAddress.province}} / {{postAddress.city}} / {{postAddress.street}} / {{postAddress.detail}}</span> 
                         </el-row>
                         <el-row v-show="modify">
                              <el-cascader
                              v-model="newInfo.postAddress"
                              :options="address"
                              props.checkStrictly
                              props.expandTrigger="hover"
                              style="width:200px;">
                              </el-cascader>
                              <el-input v-model="newInfo.postDetail" style="width:200px;" placeholder="详细地址"></el-input>
                         </el-row>
                      </el-tab-pane>
                      <el-tab-pane label="财务信息" name="3">
                         <el-row>
                              <span class="title">储蓄卡</span> 
                         </el-row>
                         <el-row>
                              <span class="content">{{accountInfo.deposit_account}}</span> 
                         </el-row>
                         <el-row>
                              <span class="title">风险测评分数</span> 
                         </el-row>
                         <el-row>
                              <span class="content">{{accountInfo.risk_assessment_mark}}</span> 
                              <el-rate
                              v-model="star"
                              disabled>
                              </el-rate>

                         </el-row>
                      </el-tab-pane>
                 </el-tabs>

            </div>
        </el-col>
        <!-- 对话框 -->
        <el-dialog
        title="申请已提交！"
        :visible.sync="visible"
        width="30%">
        <div>管理员将在x个工作日内修改</div><span>有任何问题请联系管理员：131********</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="visible = false">知道了</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
import Info from '../../../assets/js/userInfo.js'
import area from '../../../assets/js/area'
export default {
    data(){
        return {
             star: 0,
             address: areajson,
             options: [
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
             modify: false,
             title: '1',
            visible: false,
            accountInfo: null,
            contactAddress: null,
            postAddress: null,
            newInfo: {}
        }
    },
    methods:{
         handleSubmit(){
              console.log('submit', this.newInfo);
              this.modify = false;
         },
        handleChange(){
          //   this.visible = true;
          this.newInfo.name = this.accountInfo.name;
          this.newInfo.authority = this.accountInfo.id_licensing_authority;
          this.newInfo.profession = this.accountInfo.profession;
          this.newInfo.edu = this.accountInfo.education;
          this.newInfo.email = this.accountInfo.email;
          // this.newInfo.contactAddress = [this.contactAddress.province, this.contactAddress.city, this.contactAddress.aid];
          this.newInfo.contactDetail = this.contactAddress.detail;
          this.newInfo.postDetail = this.postAddress.detail;
          this.modify = true;
        }
    },
    mounted(){
        var that = this;
        this.$axios.get('/api/getAccountInfo').then(function(response){
            console.log(response.data);
            that.accountInfo = response.data.account_info;
            that.contactAddress = response.data.contact_address;
            that.postAddress = response.data.postal_address;
            that.star = parseFloat(that.accountInfo.risk_assessment_mark) / parseFloat(20.00);
        }).catch(() => {
            that.msgbox({
                message: '连接失败',
                type: 'error'
            });
        });
    }
}
</script>

<style scoped>
    .main-title{
        font-size: 25px;
        font-weight: bold;
    }
    .photo{
        width: 60%;
        /* height: 100%; */
        border-radius: 20%;
        margin: 40px;
    }
    .info-box{
        margin-top: 50px;
        /* background-color: black; */
        width: 80%;
        margin-bottom: 50px;
    }
    .title{
        font-size: 15px;
        float: left;
        border-bottom: 1px #DCDFE6 solid;
        color: #909399;
        width: 70%;
        text-align: left;
        font-weight: bolder;
    }
    .content{
        /* text-align: right; */
        margin: -5px;
        width: 40%;
        font-size: 16px;
        color: #606266;
        /* background: #000; */
    }
    .el-row{
        margin: 20px;
    }
</style>
