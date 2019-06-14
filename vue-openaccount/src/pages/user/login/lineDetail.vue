<template>
    <div>
        <el-page-header @back="goBack" content="流水明细">
        </el-page-header>
        <!-- 选择器 -->
        <div>
            <el-date-picker
            v-model="startDate"
            type="date"
            placeholder="选择日期" 
            size="small">
            </el-date-picker>
            <span style="margin: 20px">至</span>
            <el-date-picker
            v-model="endDate"
            type="date"
            placeholder="选择日期" size="small">
            </el-date-picker>
        </div>
        <div class="timeline">
            <el-timeline>
                <el-timeline-item v-for="(amount, index) in moreBill" :key="index" :color='amount.color' :timestamp='amount.timestep'>
                    <span style="float: left; margin-left: 25px;">{{amount.message}}</span>{{amount.value}}
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            startDate: '',
            endDate: '',
            moreBill: [{
                timestep: '2019-06-13',
                value: '-100.30',
                message: 'xx支出',
                color: '#F56C6C'
            }, {
                timestep: '2019-06-12',
                value: '+100.30',
                message: 'xx收入',
                color: '#67C23A'
            }]
        }
    },
    methods: {
        goBack(){
            this.$router.push({path: '/user/home'})
        }
    },
    mounted(){
        this.$watch('startDate', function(){
            if(this.startDate > this.endDate){
                this.$message.error({
                    message: '起始日期选择有误'
                });
                this.startDate = this.endDate;
            }
        });
        this.$watch('endDate', function(){
            let nowDate = new Date();
            if(this.endDate > nowDate || this.endDate < this.startDate){
                this.$message.error({
                    message: '结束日期选择有误'
                });
                this.endDate = nowDate;
            } 
        })
    }
}
</script>

<style scoped>
    .timeline{
        margin: 50px;
        width: 50%;
    }
</style>
