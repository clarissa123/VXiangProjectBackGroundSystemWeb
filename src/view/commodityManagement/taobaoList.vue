<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-select v-model="value" placeholder="请选择" class="tab" clearable @change="clickSelect">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          v-model="queryParams.keyword"
          placeholder="输入关键字"
          class="keyword"
          v-if="this.tab==1"
        ></el-input>
        <el-input
          v-model="queryParams.materialId"
          placeholder="输入物料"
          class="materialId"
          v-if="this.tab==1"
        ></el-input>
        <el-input
          v-model="queryParams2.keyword"
          placeholder="输入物料2"
          class="normalId"
          v-if="this.tab==2"
        ></el-input>

        <el-button class="search-btn-w" @click="search1" v-if="this.tab==1">搜索</el-button>
        <el-button class="search-btn-w" @click="search2" v-if="this.tab==2">搜索</el-button>
      </div>
    </Top>
    <div class="bottom">
      <div class="table-container">
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          class="table"
          :data="tableData"
          style="width: 100%,height:100%"
          :cell-style="cell"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
        >
          <el-table-column type="index" label="编号" align="center" fixed></el-table-column>
          <el-table-column label="主图" align="center">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.pictUrl" width="301" height="113" />
            </template>
          </el-table-column>
          <el-table-column prop="itemId" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="title" label="商品标题" align="center"></el-table-column>
          <el-table-column prop="zkFinalPrice" label="商品价格" align="center"></el-table-column>
          <el-table-column prop="commissionRate" label="佣金比率" align="center"></el-table-column>
          <el-table-column prop="volume" label="销量" align="center"></el-table-column>
          <el-table-column label="商品链接" align="center">
            <template slot-scope="scope">
              <a :href="scope.row.itemUrl" target="_blank" class="good-url">{{scope.row.itemUrl}}</a>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="look-btn cursor" @click="jumpToAddTask(scope.row.itemId,scope.row)">创建任务</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button
            class="ok-btn"
            @click="clickUp"
            v-if="tableData.length!=0 && this.queryParams.pageNum>1&&this.tab==1"
          >上一页</el-button>
          <el-button
            class="ok-btn right"
            @click="clickNext"
            v-if="tableData.length!=0&& this.queryParams.pageNum>=1&&this.tab==1"
          >下一页</el-button>
          <el-button
            class="ok-btn"
            @click="clickUp2"
            v-if="tableData.length!=0 && this.queryParams2.pageNum>1&&this.tab==2"
          >上一页</el-button>
          <el-button
            class="ok-btn right"
            @click="clickNext2"
            v-if="tableData.length!=0&& this.queryParams2.pageNum>=1&&this.tab==2"
          >下一页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getNormalList,
  getMaterialList
} from "@/api/commodityManagement/taobaoList.js";
import { addInfo } from "@/api/commodityManagement/jdList.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";
import axios from "axios";

export default {
  inject: ["reload"], //注入reload方法
  components: {
    Pagination,
    Top
  },
  computed: {
    noMore() {
      return this.count >= 20;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  data() {
    return {
      //下拉菜单选择器
      options: [
        {
          value: "普通",
          label: "普通"
        },
        {
          value: "精选",
          label: "精选"
        }
      ],
      value: "普通",
      tab: 1, //切换普通/精选

      //日期选择框
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: "",

      //表格
      tableData: [],
      loading: false,

      //分页
      total: 0, //总条数
      hide: false,
      background: true,

      //删除的id数组
      ids: [],

      //搜索参数(普通搜索)
      queryParams: {
        keyword: "", //普通搜索关键字
        materialId: "", //普通搜索物料
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      },
      //搜索参数(精选搜索)
      queryParams2: {
        keyword: "", //精选搜索物料
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      }
    };
  },
  mounted() {
    console.log(process.env);
  },
  methods: {
    //点击下拉框
    clickSelect(v) {
      if (v == "普通") {
        this.tab = 1;
      } else {
        this.tab = 2;
      }
    },
    //点击跳转到查看详情页
    clickLook(id) {
      this.$router.push({
        name: "taskDetail",
        params: {
          id: id
        }
      });
    },
    //获取搜索日期
    selectTime(value1) {
      if (value1 == null) {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
        this.queryParams.pageNum = 1;
      } else {
        this.queryParams.pageNum = 1;
        this.queryParams.startTime = value1[0];
        this.queryParams.endTime = value1[1];
      }
    },
    //普通搜索
    search1() {
      this.tableData = [];
      this.queryParams2 = {
        keyword: "", //精选搜索物料
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      };
      this.getList(this.queryParams);
    },
    //物料搜索
    search2() {
      this.tableData = [];
      this.queryParams = {
        keyword: "", //普通搜索关键字
        materialId: "", //普通搜索物料
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      };
      this.getList2(this.queryParams2);
    },
    clickUp() {
      this.queryParams.pageNum -= 1;
      if (this.queryParams.pageNum <= 0) {
        this.queryParams.pageNum = 1;
      }
      this.getList(this.queryParams);
    },
    clickNext() {
      this.queryParams.pageNum += 1;
      this.getList(this.queryParams);
    },
    clickUp2() {
      this.queryParams2.pageNum -= 1;
      if (this.queryParams2.pageNum <= 0) {
        this.queryParams2.pageNum = 1;
      }
      this.getList2(this.queryParams2);
    },
    clickNext2() {
      this.queryParams2.pageNum += 1;
      this.getList2(this.queryParams2);
    },
    //普通搜索-列表首页
    async getList(params) {
      this.loading = true;
      if (params.pageNum == undefined) {
        params.pageNum = 1;
      }
      await getNormalList(params).then(res => {
        if (res.code == 1) {
          this.loading = false;
          this.tableData = res.data;
          this.total = Number(res.data.total);
        } else if (res.code == 2) {
          this.$message({
            type: "error",
            message: res.data
          });
          this.loading = false;
          return;
        }
      });
    },
    //精选搜索-列表首页
    async getList2(params) {
      this.loading = true;
      if (params.pageNum == undefined) {
        params.pageNum = 1;
      }
      await getMaterialList(params).then(res => {
        if (res.code == 1) {
          this.loading = false;
          this.tableData = res.data;
          this.total = res.data.total;
          this.queryParams.pageNum = res.data.pageNum;
        } else if (res.code == 2) {
          this.$message({
            type: "error",
            message: res.data
          });
          this.loading = false;
          return;
        }
      });
    },
    cell({ row, column, rowIndex, columnIndex }) {
      //第二列添加 颜色
      if (columnIndex === 2) {
        return "color:#1890FF";
      }
    },
    //跳转到编辑页
    jumpToEdit(id, row) {
      this.$router.push({
        name: "editTask",
        params: {
          id: id,
          row: row
        }
      });
    },
    //跳转到快速复制页
    jumpToAddTask(id, row) {
      //商品入库
      this.addInfo(id, row);
    },
    //商品入库
    async addInfo(id, row) {
      let params = {
        commissionShare: row.commissionRate,
        commissonPrice:
          (row.commissionRate / 100).toFixed(3) * row.zkFinalPrice,
        id: row.itemId,
        imgUrl: row.pictUrl,
        materialUrl: row.itemUrl,
        price: row.zkFinalPrice,
        sellAmount: row.volume
      };
      await addInfo(params).then(res => {
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: "入库成功！"
          });
          this.$router.push({
            name: "copyTaskTb",
            params: {
              id: id,
              row: row
            }
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
          return;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/myUI.less";

.footer {
  .wh(100%, auto);
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.ok-btn {
  background: @blue;
  color: @white;
  .wh(65px, 32px);
  .borderRadius(4px);
}

.right {
  margin-left: 10px;
}

.task-list .top .top-right .left-btn {
  .wh(65px, 32px);
}

.tab {
  .wh(67px, 32px);
}

/deep/.tab .el-input__inner {
  background-color: @gray;
  padding-left: 6px;
  color: #bfbfbf;
  height: 32px;
}

/deep/.tab .el-input__suffix {
  right: 0;
  top: 5px;
}

.keyword {
  .wh(204px, 32px);
}

/deep/.keyword .el-input__inner,
/deep/.normalId .el-input__inner {
  height: 32px;
}

.materialId {
  .wh(176px, 32px);
}

.normalId {
  .wh(239px, 32px);
}

/deep/.materialId .el-input__inner {
  background-color: @gray;
  height: 32px;
}

.search-btn-w {
  .wh(60px, 32px);
  background: @blue;
  .borderRadius(4px);
  margin-left: 10px;
  color: @white;
}

.good-url {
  text-overflow: ellipsis;
  overflow: hidden;
  height: 50px;
  display: block;
}
</style>