<template>
    <div>
    <!-- 面包屑 -->
    <!-- <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>开户</el-breadcrumb-item>
            <el-breadcrumb-item>风险测评</el-breadcrumb-item>
        </el-breadcrumb>
    </div> -->
  <div style="margin:0 auto;margin-top:50px;margin-bottom: 50px; width:70%;text-align: left;">
    <el-steps :active="1" finish-status="success">
      <el-step title="填写用户信息"></el-step>
      <el-step title="风险测评"></el-step>
      <el-step title="选择营业网点"></el-step>
      <el-step title="审核"></el-step>
    </el-steps>  
  </div>
    <el-divider><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i><i class="el-icon-star-off"></i></el-divider>
    <div>
        <h2>投资者风险承受能力问卷（适用于自然人客户）</h2>
        <span style="color: #606266">客户姓名：{{userName}}   资金账号： {{account}}</span>
        <div class="tips">
            <p>本问卷旨在了解您可承受的风险程度等情况，借此协助您选择合适的产品或服务类别，以符合您的风险承受能力。</p>
            <p>风险承受能力评估是本公司向投资者履行适当性职责的一个环节，其目的是使本公司所提供的产品或服务与您的风险承受能力等级相匹配。</p>
            <p>本公司特别提醒您：本公司向投资者履行风险承受能力评估等适当性职责，并不能取代您自己的投资判断，也不会降低产品或服务的固有风险。同时，与产品或服务相关的投资风险、履约责任以及费用等将由您自行承担。</p>
            <p>本公司提示您：本公司根据您提供的信息对您进行风险承受能力评估，开展适当性工作。您应当如实提供相关信息及证明材料，并对所提供的信息和证明材料的真实性、准确性、完整性负责。</p>
            <p>风险承受能力评级结果将影响您可参与的投资品种。</p>
            <p>本公司建议：当您的各项状况发生重大变化时，需对您所投资的产品及时进行重新审视，以确保您的投资决定与您可承受的投资风险程度等实际情况一致。</p>
            <p>本公司在此承诺，对于您在本问卷中所提供的一切信息，本公司将严格按照法律法规要求承担保密义务。除法律法规规定的有权机关依法定程序进行查询以外，本公司保证不会将涉及您的任何信息提供、泄露给任何第三方，或者将相关信息用于违法、不当用途。</p>
        </div>
        <el-divider><i class="el-icon-edit"></i></el-divider>
        <!-- <div v-for="(block, index) in test" :key="index" class="test">
            <h3>{{block.title}}</h3>
            <div v-for="(question, subIndex) in block.content" :key="subIndex">
                <p>{{subIndex + 1}}. {{question.subtitle}}</p>
                <ul v-for="(choice, i) in question.subcontent" :key="i">
                    <el-radio-group v-model="answer[index][subIndex]">
                        <el-radio :label='String(index) + String(subIndex) + String(i)'>
                        {{choice}}
                        </el-radio>
                    </el-radio-group>
                </ul>
            </div>
        </div> -->
        <div v-for="question in test" :key="question.RE_id" class="test">
            <p>{{question.RE_id + 1}}. {{question.content}}<span v-if="question.isRadio">（单选）</span><span v-else>（多选）</span></p>
            <div v-if="question.isRadio">
            <ul v-for="(option, i) in question.options" :key="i">
                <el-radio-group v-model='answer[question.RE_id]'>
                    <el-radio :label="i + 1">{{option}}</el-radio>
                </el-radio-group>
            </ul>
            </div>
            <div v-else>
                <ul v-for="(option, i) in question.options" :key="i">
                    <el-checkbox-group v-model="answer[question.RE_id]">
                        <el-checkbox :label="i + 1">{{option}}</el-checkbox>
                    </el-checkbox-group>
                </ul>
            </div>
        </div>
    </div>
    <!-- <span>{{answer}}</span> -->
    <el-dialog title='您的风险评级为' :visible.sync='dialogVisible' width="30%" size='mini'>
        <div style="margin: 0 auto;font-size:25px;background-color:#E4E7ED;width:50%;border-radius:7px;">{{grade}}</div>
        <span style="font-size:15px;line-height:60px">得分为{{mark}}分</span>
        <div style="font=size:12px;color:#909399;"><span>对测评结果不满意？可以</span>
        <el-link type="primary" @click="haveSubmit=false;dialogVisible = false;">重新测评</el-link></div>
    </el-dialog>
    <div style="height: 100px;">
        <el-button size="medium" type='success' :disabled="haveSubmit" @click="handleSave">保 存</el-button>
        <el-button size="medium" type='danger' :disabled="haveSubmit" @click="handleSubmit">提 交</el-button>
    </div>
    <div id="footer">
        <el-row>
            <el-button icon="el-icon-caret-left" round @click="$router.push({path:'/user/inputInfo'})">上一步</el-button>
            <el-button type="primary" :disabled="!haveSubmit" round @click="$router.push({path:'/user/choose'})">下一步<i class="el-icon-caret-right icon"></i></el-button>
        </el-row>
    </div>
    </div>
</template>

<script>
import Test from '../../../assets/js/test.js'
export default {
    data(){
        return{
            userName: '用户姓名',
            account: '资金账号',
            test: evaluateTest,
            answer: answer,
            visible: false,
            grade: '保守型',
            mark: 25,
            dialogVisible: false,
            haveSubmit: false
        }
    },
    methods:{
        handleSubmit(){
            this.$confirm('提交后不可修改，确认提交吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const postData = {
                    answer: this.answer
                }
                this.$axios.get('/risk_evaluation/get_grade', postData).then(function(response){
                    this.haveSubmit = true;
                    this.$message({
                        type: 'success',
                        message: '提交成功！'
                    });
                    this.grade = response.data.grade;
                    this.mark = response.data.mark;
                    localStorage.removeItem('answerTemp');
                    this.dialogVisible = true;
                }).catch(() => {
                    this.$msgbox({
                        title: '提交失败',
                        message: '连接异常',
                        type: 'error'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交'
                });
            });
        },
        handleSave(){
            localStorage.setItem('answerTemp', JSON.stringify(this.answer));
            this.$message({
                type: 'success',
                message: '已成功保存，请尽快答完问卷'
            });
        }
    },
    mounted(){
        this.$axios.get('/risk_evaluation/get_questions').then(function(response) {
            this.test = response.data;
            this.answer = new Array();
            for(var i = 0; i < test.length; i++){
                answer[i] = new Array();
            }
        }).catch(() => {
            this.$msgbox({
                type: 'error',
                title: '连接异常',
                message:'获取题目失败'
            });
        });

        // 获取答案
        if(localStorage.getItem('answerTemp') != null){
            this.answer = JSON.parse(localStorage.getItem('answerTemp'));
        }
    }
}
</script>

<style scoped>
    .bread{
        margin: 10px;
    }
    .tips{
        width: 70%;
        text-align: left;
        margin: 0 auto;
        text-indent: 2em;
        font-size: 12px;
        color: #909399;
        margin-bottom: 50px;
    }
    .test{
        width: 70%;
        text-align: left;
        margin: 0 auto;
    }
    .el-button{
        margin: 80px;
    }
    .icon{
        margin-left:3px;
    }
</style>
