<template>
  <div class="right">
    <div class="left">
      <div class="search-keyword">
        <span>按关键字搜索：</span>
        <el-input v-model="queryParams.keyword" placeholder="请输入关键字" class="input-keyword"></el-input>
        <el-button class="btn ok-btn" @click="searchKeyWords">搜索</el-button>
      </div>
      <div class="search-type">
        <span>按照类型搜索：</span>
        <div class="type-content">
          <span
            v-for="v in eliteNames"
            :key="v.id"
            class="typa-span cursor"
            :class="{'active':item==v.id}"
            @click="chooseItem(v.id)"
          >{{v.eliteName}}</span>
        </div>
        <el-button class="btn search-btn" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="task-list">
      <div class="bottom">
        <div class="table-container">
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            class="table"
            :data="tableData"
            :cell-style="cell"
            :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
          >
            <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
            <el-table-column label="主图" align="center">
              <!-- 图片的显示 -->
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl" width="102" height="62" />
              </template>
            </el-table-column>
            <el-table-column prop="id" label="商品ID" align="center"></el-table-column>
            <el-table-column prop="skuName" label="商品标题" align="center"></el-table-column>
            <el-table-column prop="price" label="商品价格" align="center"></el-table-column>
            <el-table-column prop="commissionShare" label="佣金比率" align="center"></el-table-column>
            <el-table-column prop="sellAmount" label="销量" align="center"></el-table-column>
            <el-table-column label="商品链接" align="center">
              <template slot-scope="scope">
                <a :href="scope.row.materialUrl" target="_blank">{{scope.row.materialUrl}}</a>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <span class="look-btn cursor" @click="jumpToAddTask(scope.row.id,scope.row)">创建任务</span>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :background="background"
            :hide="hide"
            :pageSize="queryParams.pageSize"
            :total="total"
            @pageChange="pageChange"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAll,
  getMaterialList,
  addInfo
} from "@/api/commodityManagement/jdList.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";
import axios from "axios";

export default {
  inject: ["reload"], //注入reload方法
  components: {
    Pagination,
    Top
  },
  data() {
    return {
      //所有频道信息
      eliteNames: [],
      item: 0,

      //表格
      tableData: [],
      loading: false,

      //分页
      total: 0, //总条数
      hide: true,
      background: true,

      //搜索参数
      queryParams: {
        // keyword: "",
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
        eliteId: 0 //频道id
      }
    };
  },
  mounted() {
    //获取所有频道信息
    this.getAll();
    console.log(process.env);
  },
  methods: {
    indexMethod(index){
      return (
          index + 1 + (this.queryParams.currentPage - 1) * this.queryParams.pageSize
        );
    },
    //获取所有频道信息
    async getAll() {
      await getAll().then(res => {
        if (res.code == 1) {
          this.eliteNames = res.data;
        }
      });
    },
    //选中
    chooseItem(id) {
      this.item = id;
    },
    searchKeyWords() {
      this.$message({
        type: "error",
        message: "暂不支持该接口"
      });
    },
    //搜索
    search() {
      this.queryParams.eliteId = this.item;
      this.getMaterialList(this.queryParams);
    },
    async getMaterialList(params) {
      await getMaterialList(params).then(res => {
        if (res.code == 1) {
          this.tableData = res.data.rows;
          this.tableData.forEach(v => {
            v.materialUrl = "https://" + v.materialUrl;
          });
          this.total = Number(res.data.records);
          this.queryParams.currentPage = res.data.page;
        }
      });
    },
    cell({ row, column, rowIndex, columnIndex }) {
      //第二列添加 颜色
      if (columnIndex === 2) {
        return "color:#1890FF";
      }
    },
    //跳转到快速复制页
    jumpToAddTask(id, row) {
      //商品入库
      this.addInfo(row);
      this.$router.push({
        name: "copyTask",
        params: {
          id: id,
          row: row
        }
      });
    },
    //商品入库
    async addInfo(row) {
      await addInfo(row).then(res => {
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: "入库成功！"
          });
        }
      });
    },
    //分页
    pageChange(item) {
      this.queryParams.currentPage = item.page_index;
      this.queryParams.pageSize = item.page_limit;
      this.getMaterialList(this.queryParams);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/myUI.less";

.right {
  .wh(100%, 100%);
  .fj();

  .left {
    .wh(284px, 100%);
    background: @white;
    .borderRadius(2px);

    .btn {
      background: @blue;
      color: @white;
      .borderRadius(4px);
    }

    .ok-btn {
      .wh(50px, 32px);
    }

    .search-btn {
      .wh(224px, 32px);
      position: fixed;
      bottom: 50px;
    }

    span {
      color: #999999;
      display: block;
      margin-bottom: 10px;
    }

    .search-keyword {
      .wh(100%, 102px);
      border-bottom: 1px solid #e8e8e8;
      padding-left: 30px;
      padding-top: 20px;
      box-sizing: border-box;

      .input-keyword {
        .wh(164px, 32px);
        .borderRadius(4px);
        margin-right: 10px;
        margin-bottom: 20px;
      }

      /deep/.input-keyword .el-input__inner {
        .wh(164px, 32px);
      }
    }

    .search-type {
      .wh(100%, 690px);
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding-top: 20px;
      padding-left: 30px;
      padding-top: 20px;
      box-sizing: border-box;

      .type-content {
        .typa-span {
          color: #666666;
          display: inline-flex;
          line-height: 20px;
          margin-right: 28px;
        }

        .active {
          color: @blue;
        }
      }
    }
  }

  .task-list {
    .wh(1336px, 100%);
    border-left: 20px solid @gray;
    overflow-y: auto;
    overflow-x: hidden;

    .bottom {
      .wh(100%, 100%);
    }
  }

  .task-list .top .top-right .left-btn {
    .wh(65px, 32px);
  }
}
</style>