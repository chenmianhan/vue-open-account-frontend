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
      <div class="block">
      <span class="demonstration">所属营业网点</span>
      <el-cascader
        v-model="stores"
        :options="str_ops"
        @change="handleChange"></el-cascader>
      </div>
      <div class="block">
      <el-input v-model="input" placeholder="用户姓名"></el-input>
      </div>
      <!--<el-button type="primary" icon="el-icon-search">搜索</el-button>-->
      <el-button icon="el-icon-search" circle></el-button>
    </div>
    <div class="results">
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="user_id"
        width="100px"
        label="用户id">
      </el-table-column>
      <el-table-column
        prop="name"
        width="100px"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="gender"
        width="50px"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="id_num"
        label="身份证号码">
      </el-table-column>
      <el-table-column
        prop="contact"
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="inst"
        width="100px"
        label="开户机构">
      </el-table-column>
      <el-table-column
        prop="str"
        label="开户营业网点">
      </el-table-column>
      <el-table-column
        prop="date"
        label="开户日期">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!--<el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
          <el-button type="text" size="small">删除</el-button>-->
          <el-button size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>


<script>
    export default {
      data() {
        return {
          institute: [],
          ins_ops: [{
            institute: 'shanghai',
            label: '上海',
          },{
            institute: 'shenzhen',
            label: '深圳',
          } ],

          stores: [],
          str_ops:[{
            stores:'wangdian1',
            label:'营业网点1'
          },{
            stores:'wangdian2',
            label:'营业网点2'
          }],

          input:'',

          tableData:[{
            user_id:'1',
            name:'whatever',
            gender:'男',
            id_num:'123466876878987',
            contact:'2435465767453',
            inst:'上海',
            str:'营业网点1',
            date:'2019-6-10 13:20:45'
          }]
        };
      },
      methods: {
        handleChange(value) {
          console.log(value);
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
  .results{
    /*position: relative;*/
  }
</style>
