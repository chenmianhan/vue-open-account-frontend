<template>
    <div>
        <el-page-header @back="goBack" content="流水明细">
        </el-page-header>
        <!-- 选择器 -->
        <div>
            <el-date-picker
                v-model="date"
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
            <!-- <span>{{date}}</span> -->
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
            date: [],
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
                starttime: that.date[0],
                endtime: that.date[1],
                // user_id: 44
            }
            console.log(postData)
            this.$axios.post('/api/timeline/get_optional_timeline', postData).then(function(response){
                console.log(response.data)
                for(var i = 0; i < response.data.length; i++){
                    if(response.data[i].value > 0){
                        response.data[i].value = '+' + response.data[i].value;
                    }
                }
                that.moreBill = response.data;
            }).catch(() => {
                that.$message.error({
                    message: '连接错误'
                });
            });
        },
        getData(){
            var that = this;
            const postData = {
                // startDate: that.startDate,
                // endDate: that.endDate,
                // user_id: 44
            }
            // console.log(postData)
            this.$axios.get('/api/timeline/get_timeline', postData).then(function(response){
                console.log('line',response.data)
                for(var i = 0; i < response.data.length; i++){
                    if(response.data[i].value > 0){
                        response.data[i].value = '+' + response.data[i].value;
                    }
                }
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

        this.getData();
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
