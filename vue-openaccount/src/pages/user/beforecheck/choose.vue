<template>
    <div>
        <div class="title"><h1>请选择您要加入的营业网点（可多选）：</h1></div>
        <div class="choose">
            <el-col :span="12">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>上海证券交易所</span>
                    <el-checkbox :indeterminate="shIsIndeterminate" v-model="shCheckAll" @change="handleSH" style="float: right; padding: 3px 0" type="text">全选</el-checkbox>
                </div>
                <div>
                    <el-checkbox-group v-model="shanghaiNetpoint" v-for="(item, index) in shNet" :key="index" @change="handleCheckSH">
                        <el-col :span="12" style="margin-bottom:15px;">
                        <el-checkbox :label="item" border></el-checkbox>
                        </el-col>
                    </el-checkbox-group>
                </div>
            </el-card>    
            </el-col>
            <el-col :span="12">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>深圳证券交易所</span>
                    <el-checkbox :indeterminate="szIsIndeterminate" v-model="szCheckAll" @change="handleSZ" style="float: right; padding: 3px 0" type="text">全选</el-checkbox>
                </div>
                <div>
                    <el-checkbox-group v-model="shenzhenNetpoint" v-for="(item, index) in szNet" :key="index" @change="handleCheckSZ">
                        <el-col :span="12" style="margin-bottom:15px;">
                        <el-checkbox :label="item" border></el-checkbox>
                        </el-col>
                    </el-checkbox-group>
                </div>
            </el-card>        
            </el-col>
            <!-- <span>{{shanghaiNetpoint}}</span><span>{{shenzhenNetpoint}}</span> -->
        </div>
    </div>
</template>

<script>
import Net from '../../../assets/js/netName';
export default {
    data(){
        return{
            shIsIndeterminate: true,
            shCheckAll: false,
            szIsIndeterminate: true,
            szCheckAll: false,
            shanghaiNetpoint: [],
            shenzhenNetpoint: [],
            shNet: shNet,
            szNet: szNet
        }
    },
    methods: {
        handleSH(val){
            this.shanghaiNetpoint = val ? this.shNet : [];
            this.shIsIndeterminate = false;
        },
        handleCheckSH(value){
            let checkedSH = value.length;
            this.shCheckAll = checkedSH == this.shNet.length;
            this.shIsIndeterminate = checkedSH > 0 && checkedSH < this.shNet.length;
        },
        handleSZ(val){
            this.shenzhenNetpoint = val ? this.szNet : [];
            this.szIsIndeterminate = false;
        },
        handleCheckSZ(value){
            let checkedSZ = value.length;
            this.szCheckAll = checkedSZ == this.szNet.length;
            this.szIsIndeterminate = checkedSZ > 0 && checkedSZ < this.szNet.length;
        }
    }
}
</script>

<style scoped>
    .box-card{
        width: 70%;
        margin: 0 auto;
        margin-top: 50px;
    }
    .clearfix{
        font-size: 20px;
    }
    .choose{
        padding: 0 60px 0 60px;
    }
</style>
