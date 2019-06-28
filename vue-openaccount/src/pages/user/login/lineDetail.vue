<template>
    <div>
        <el-page-header @back="goBack" content="流水明细">
        </el-page-header>
        <!-- 选择器 -->
        <div>
            <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="startDate"
            type="date"
            placeholder="选择日期" 
            size="small">
            </el-date-picker>
            <span style="margin: 20px">至</span>
            <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="endDate"
            type="date"
            placeholder="选择日期" size="small">
            </el-date-picker>
            <el-button style="margin-left:30px;" type="primary" icon="el-icon-search" circle @click="handleSearch"></el-button>
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
import Bill from '../../../assets/js/timeLine.js';
export default {
    data() {
        return {
            startDate: '',
            endDate: '',
            moreBill: ''
        }
    },
    methods: {
        goBack(){
            this.$router.push({path: '/user/home'})
        },
        handleSearch(){
            var that = this;
            const postData = {
                // startDate: that.startDate,
                // endDate: that.endDate
                customer_id: '000000000004'
            }
            this.$axios.post('/api/timeline/get_timeline', postData).then(function(response){
                console.log(response.data)
                that.moreBill = response.data;
            }).catch(() => {
                that.$message.error({
                    message: '连接错误'
                });
            });
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
        });

        this.handleSearch();
    }
}
</script>

<style scoped>
    .timeline{
        margin: 50px auto;
        width: 50%;
        /* overflow: hidden; */
    }
</style>
