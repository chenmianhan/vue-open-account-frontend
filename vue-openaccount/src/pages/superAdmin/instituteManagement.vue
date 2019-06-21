<template>
  <div>
    <div class="search-bar">
      <div class="block">
        <span class="demonstration">所属机构</span>
        <el-cascader
          v-model="institute"
          :options="ins_ops"
          @change="handleChange"></el-cascader>
      </div>
      <el-button icon="el-icon-search" circle></el-button>
    </div>

    <div class="results">
      <el-table
        :data="instData"
        style="width: 100%">
        <el-table-column
          prop="store"
          width="100px"
          label="营业网点名称">
        </el-table-column>
        <el-table-column
          prop="inst"
          width="100px"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="user_number"
          width="50px"
          label="用户数">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <!--<el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" size="small">删除</el-button>-->
            <el-button size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
    export default {
      data(){
        return{
          institute: [],
          ins_ops: [{
            institute: '上海',
            label: '上海',
          },{
            institute: '深圳',
            label: '深圳',
          } ],
          instData:[],
        }
      }

    }
</script>
<style>
  .search-bar{
    /*position: relative;*/
    float:left;
  }
  .block{
    display: inline-block;
    padding: 10px;
  }
</style>
