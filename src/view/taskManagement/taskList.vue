<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-select class="select" v-model="queryParams.type" clearable placeholder="所有级别" @click.native="clickSelect">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker class="date" v-model="value1" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange"
          align="left" unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" @change="selectTime"
          :picker-options="pickerOptions"></el-date-picker>
        <el-button class="search-btn" @click="search">搜索</el-button>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="addTask">新增</el-button>
        <el-button class="btn right-btn" @click="clickDelete">删除</el-button>
      </div>
    </Top>
    <div class="bottom">
      <div class="table-container">
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          class="table" :data="tableData" style="width: 100%" :cell-style="cell"
          @selection-change="handleSelectionChange" @sort-change="changeSort"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
          <!-- <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column> -->
          <!-- <el-table-column  label="编号" align="center" width="50" fixed>
            <template slot-scope="scope">
              <span class="sort-style">{{ scope.$index}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="课程名称" align="center" width="220">
            <template slot-scope="scope">
              <span class="sort-style">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程属性" align="center" width="100" >
            <template slot-scope="scope">
              <span class="sort-style">{{ scope.row.attribute ==1?'涨粉课程':scope.row.attribute ==2?'带货课程':'教程课程' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="subjectMatterId" label="商品编号" align="center" width="220"></el-table-column>
          <el-table-column prop="tag" label="课程标签" align="center" width="120"></el-table-column>
          <el-table-column prop="typeName" label="课程级别" align="center" width="120"></el-table-column>
          <el-table-column label="已领/名额" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.getAmount}}/</span>
              <span>{{scope.row.quota}}</span>
            </template>
          </el-table-column>
          <el-table-column label="视频已领/名额" align="center" width="150">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.videoInfos" :key="index" v-if="item.videoName!=''">
                <span>{{item.videoName}}：{{item.download}}/{{item.downloadAmount}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="是否发布" align="center" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.publish=='已发布'">已发布</span>
              <el-switch class="my-switch" v-model="scope.row.switchValue" inactive-color="#D3DCE6"
                v-if="scope.row.publish=='未发布'" @change="changeStatus(scope.row.id)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" sortable align="center" width="180"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <span class="look-btn cursor" @click="clickLook(scope.row.id)">查看</span>
              <span class="dot">|</span>
              <el-dropdown>
                <span class="el-dropdown-link more-btn">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown" style="{width:'88px',height:'88px',padding: 0}">
                  <el-dropdown-item v-if="scope.row.publishCode!=1" @click.native="jumpToEdit(scope.row.id,scope.row)">
                    编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="jumpToCopy(scope.row.id,scope.row)">快速复制</el-dropdown-item>
                  <el-dropdown-item @click.native="rowDelete(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <footer>
          <div class="total-page">
            <span>共计{{total}}条</span>
          </div>
          <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
            @pageChange="pageChange" class="total-pagination"></Pagination>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getTaskList,
    deleteTask,
    updateTask,
    getType,
    changeStatus
  } from "@/api/taskManagement/taskList.js";
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
        //开关
        switchValue: "未发布",
        //下拉菜单选择器
        options: [],
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

        //表格
        tableData: [],
        loading: false,

        //分页
        total: 0, //总条数
        hide: true,
        background: true,

        //删除的id数组
        ids: [],

        //搜索参数
        queryParams: {
          startTime: "", //开始时间
          endTime: "", //结束时间
          currentPage: 1, //当前页数
          pageSize: 10, //每页显示多少条
          type: "", //级别
          orderType: -1 //降序
        }
      };
    },
    mounted() {
      this.getList(this.queryParams);
      console.log(process.env);
    },
    methods: {
      addTask() {
        this.$router.push({
          name: "addTask"
        });
      },
      indexMethod(index) {
        //正序
        // return (
        //   index + 1 + (this.queryParams.currentPage - 1) * this.queryParams.pageSize
        // );
        //倒序
        return (
          this.total -
          (this.queryParams.currentPage - 1) * this.queryParams.pageSize -
          index
        );
      },
      //改变发布状态
      async changeStatus(id) {
        await changeStatus(id).then(res => {
          this.$message({
            message: "修改状态成功",
            type: "success"
          });
          this.getList(this.queryParams);
        });
      },
      // 从后台获取数据,重新排序
      changeSort(val) {
        if (val.order == "ascending") {
          //升序
          this.queryParams.orderType = 1;
          this.queryParams.currentPage = 1;
        } else if (val.order == "descending") {
          //降序
          this.queryParams.orderType = -1;
          this.queryParams.currentPage = 1;
        } else {
          this.queryParams.orderType = null;
          this.queryParams.currentPage = 1;
        }
        this.getList(this.queryParams);
      },
      //点击下拉框
      clickSelect() {
        this.getType();
      },
      //获取下拉框菜单
      async getType() {
        await getType().then(res => {
          res.data.forEach(v => {
            v.value = v.typeId;
            v.label = v.typeName;
          });
          this.options = res.data;
        });
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
      //根据日期搜索
      search() {
        this.getList(this.queryParams);
      },
      //列表首页
      async getList(params) {
        this.loading = true;
        await getTaskList(params).then(res => {
          if (res.code == 1) {
            this.loading = false;
            if (res.data == null) {
              this.tableData = [];
              this.total = 0;
              this.queryParams.currentPage = 1;
            } else {
              this.tableData = res.data.rows;
              this.total = Number(res.data.records);
              this.queryParams.currentPage = res.data.page;
            }
          }
        });
      },
      cell({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
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
      jumpToCopy(id, row) {
        this.$router.push({
          name: "copyTask2",
          params: {
            id: id
          }
        });
      },
      //分页
      pageChange(item) {
        this.queryParams.currentPage = item.page_index;
        // this.queryParams.pageSize = item.page_limit;
        this.getList(this.queryParams);
      },
      //批量删除 1
      handleSelectionChange(res) {
        this.ids = res;
      },
      clickDelete() {
        if (this.ids.length != 0) {
          this.$confirm("是否删除选中的信息？", "", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              confirmButtonClass: "ok",
              cancelButtonClass: "no",
              type: "error"
            })
            .then(() => {
              this.clickDelete2();
            })
            .catch(() => {
              return;
            });
        } else {
          this.$confirm("当前无选中的信息，无法进行删除！", "", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              confirmButtonClass: "ok",
              cancelButtonClass: "no",
              type: "error"
            })
            .then(() => {
              return;
            })
            .catch(() => {
              return;
            });
        }
      },
      //批量删除 2
      async clickDelete2() {
        let id = this.ids
          .map(v => {
            return v.id;
          })
          .join(",");
        await deleteTask(id).then(res => {
          if (res.code == 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.queryParams.startTime = "";
            this.queryParams.endTime = "";
            this.value1 = "";
            this.getList(this.queryParams);
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
          }
        });
      },
      rowDelete(id) {
        this.$confirm("是否删除该条信息？", "", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            confirmButtonClass: "ok",
            cancelButtonClass: "no",
            type: "error"
          })
          .then(() => {
            this.rowDelete2(id);
          })
          .catch(() => {
            return;
          });
      },
      //行内删除
      async rowDelete2(id) {
        await deleteTask(id).then(res => {
          if (res.code == 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.queryParams.startTime = "";
            this.queryParams.endTime = "";
            this.value1 = "";
            this.getList(this.queryParams);
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
          }
        });
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  footer {
    .fj(row, flex-end);

    .total-page {
      display: inline-block;
    }

    .total-pagination {
      display: inline-block;
    }
  }

  .sort-style {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  

  .task-list .top .top-right .left-btn {
    .wh(65px, 32px);
  }

  /deep/.my-switch .el-switch__core {
    .wh(28px, 16px) !important;
  }

  /deep/.my-switch .el-switch__core:after {
    .wh(12px, 12px);
  }
</style>