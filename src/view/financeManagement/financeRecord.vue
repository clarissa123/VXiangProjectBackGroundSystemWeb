<template>
  <div class="record-item">
    <div class="task-list">
      <div class="record">
        <!-- 总收入 -->
        <div class="tip income">
          <span>总收入：</span>
          <span>{{totals.totalInMoney}}</span>
        </div>
        <!-- 总支出 -->
        <div class="tip expenditure">
          <span>总支出：</span>
          <span>{{totals.totalOutMoney}}</span>
        </div>
        <!-- 余额 -->
        <div class="tip balance">
          <span>余额：</span>
          <span>{{totals.balance}}</span>
        </div>
      </div>
      <Top>
        <div class="top-left" slot="search">
          <el-select class="select" clearable v-model="queryParams.serviceType" placeholder="所有类型"
            @click.native="clickSelect">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select class="select" clearable v-model="queryParams.type" placeholder="所有收支">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker class="date" v-model="value2" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange"
            align="left" unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" @change="selectTime"
            :picker-options="pickerOptions"></el-date-picker>

          <el-button class="search-btn" @click="search">搜索</el-button>
        </div>
        <div class="top-right" slot="btn">
          <el-button class="btn left-btn" @click="exportExcel">导出流水记录</el-button>
        </div>
      </Top>
      <div class="bottom">
        <div class="table-container">
          <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            class="table" :data="tableData" style="width: 100%" :cell-style="cell"
            :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange"
            :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
            <!-- <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column> -->
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="serviceInfo" label="业务类型" align="center"></el-table-column>
            <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
            <el-table-column prop="payType" label="支付方式" align="center"></el-table-column>
            <el-table-column label="收支" :filter-method="filterTag" align="center"
              :filters="[{text: '收入', value: 0}, {text: '支出', value: 1}]">
              <template slot-scope="scope">
                <span :class="scope.row.type === 0 ? 'green-dot' : 'red-dot'"></span>
                <span>{{scope.row.type==1?'支出':'收入'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="转账金额" align="center"></el-table-column>
            <el-table-column prop="createTime" label="记录时间" sortable align="center"></el-table-column>
          </el-table>
          <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
            @pageChange="pageChange"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getTotal,
    getList,
    getServiceType
  } from "@/api/financeManagement/financeRecord.js";
  import Pagination from "@/components/Pagination.vue";
  import Top from "@/components/top.vue";
  import FileSaver from "file-saver";
  import XLSX from "xlsx";

  export default {
    inject: ["reload"], //注入reload方法
    components: {
      Pagination,
      Top
    },
    data() {
      return {
        //统计数据
        totals: {
          totalInMoney: 0, //余额
          totalOutMoney: 0, //总支出
          balance: 0 //总收入
        },
        //搜索参数
        queryParams: {
          //时间
          startDate: "", //开始时间
          endDate: "", //结束时间
          serviceType: "", //类型
          type: "", //收支 默认支出
          pageNum: 1, //当前页数
          pageSize: 10 //每页显示多少条
        },
        //下拉菜单选择器
        options: [{
            value: 0,
            label: "收入"
          },
          {
            value: 1,
            label: "支出"
          }
        ],
        options2: [{
            value: 0,
            label: "收入"
          },
          {
            value: 1,
            label: "支出"
          }
        ],
        value: "",

        //日期选择框
        pickerOptions: {
          shortcuts: [{
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
        value2: "",

        //表格
        tableData: [],
        loading: false,

        //分页
        total: 0, //总条数
        hide: true,
        background: true
      };
    },
    mounted() {
      //获取统计数据
      this.getTotal();
      //获取列表
      this.getList(this.queryParams);
    },
    methods: {
      indexMethod(index) {
        return (
          index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
        );
      },
      //获取搜索日期
      selectTime(value2) {
        if (value2 == null) {
          this.queryParams.startDate = "";
          this.queryParams.endDate = "";
          this.queryParams.pageNum = 1;
        } else {
          this.queryParams.pageNum = 1;
          this.queryParams.startDate = value2[0];
          this.queryParams.endDate = value2[1];
        }
      },
      //所有类型下拉框
      clickSelect() {
        this.getServiceType();
      },
      async getServiceType() {
        await getServiceType().then(res => {
          res.data.forEach(v => {
            v.value = v.id;
            v.label = v.name;
          });
          this.options = res.data;
        });
      },
      //点击搜索
      search() {
        this.getList(this.queryParams);
      },
      //分页
      pageChange(item) {
        this.queryParams.pageNum = item.page_index;
        this.queryParams.pageSize = item.page_limit;
        this.getList(this.queryParams);
      },
      async getTotal() {
        await getTotal().then(res => {
          if (res.code == "1") {
            if (this.totals == null) {
              this.totals = {};
            } else {
              this.totals = res.data;
            }
          }
        });
      },
      async getList(params) {
        this.loading = true;
        await getList(params).then(res => {
          this.loading = false;
          this.tableData = res.data;
          this.total = Number(res.total);
          this.queryParams.pageSize = res.pageSize;
          this.queryParams.pageNum = res.pageNum;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      cell({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        //第二列添加 颜色
        if (columnIndex === 1) {
          return "color:#1890FF";
        }
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      // 导出表格所用
      exportExcel() {
        window.location.href =
          `${process.env.VUE_APP_BASE_API}/finance/statement/export?startDate=${this.queryParams.startDate}&endDate=${this.queryParams.endDate}&serviceType=${this.queryParams.serviceType}&type=${this.queryParams.type}`;
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  .record-item {
    .wh(100%, 100%);

    .task-list {
      .record {
        .wh(100%, 80px);
        background: #f9f8fd;
        border-bottom: 20px solid @gray;
        display: inline-flex;

        .tip {
          .wh(228px, 82px);
          line-height: 82px;
          padding-left: 22px;
          box-sizing: border-box;
          margin-right: 8px;
          color: @white;
          .bis();
        }

        .income {
          background-image: url("../../assets/images/purple.png");
        }

        .expenditure {
          background-image: url("../../assets/images/red.png");
        }

        .balance {
          background-image: url("../../assets/images/blue.png");
        }
      }
    }
  }

  .task-list .top .top-right .left-btn {
    .wh(116px, 32px);
    letter-spacing: 1px;
  }

  .task-list .top .top-right .right-btn {
    .wh(88px, 32px);
    letter-spacing: 1px;
  }
</style>