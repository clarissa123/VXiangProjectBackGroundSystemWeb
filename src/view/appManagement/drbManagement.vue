<template>
  <div class="task-list">
    <Top>
      <div class="top-right" slot="btn">
        <router-link to="/tgDataManagement">
          <el-button class="btn left-btn">推广数据</el-button>
        </router-link>
        <router-link to="/addDrbManagement">
          <el-button class="btn left-btn">创建达人</el-button>
        </router-link>
        <el-button class="btn right-btn" @click="clickDelete">删除</el-button>
      </div>
    </Top>
    <div class="bottom">
      <div class="table-container">
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          class="table" :data="tableData" style="width: 100%" :cell-style="cell"
          :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column prop="headImage" label="头像" align="center">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.headImage" width="102" height="62" class="headImage" />
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
          <el-table-column label="推广数据" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.data1}}：{{scope.row.data1Value}}</p>
              <p>{{scope.row.data2}}：{{scope.row.data2Value}}</p>
              <p>{{scope.row.data3}}：{{scope.row.data3Value}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="update-btn cursor" @click="jumpToLook(scope.row.id,scope.row)">查看</span>
              <span class="dot">|</span>
              <el-dropdown>
                <span class="el-dropdown-link more-btn cursor">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown" style="{width:'88px',height:'88px',padding: 0}">
                  <el-dropdown-item @click.native="jumpToEdit(scope.row.id,scope.row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="rowDelete(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
          @pageChange="pageChange"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getMasterList,
    deleteMaster,
  } from "@/api/appManagement/drbManagement.js";
  import Pagination from "@/components/Pagination.vue";
  import Top from "@/components/top.vue";

  export default {
    components: {
      Pagination,
      Top
    },
    data() {
      return {
        //表格
        tableData: [],
        loading: false,
        queryParams: {
          pageNum: 1, //当前页数
          pageSize: 10 //每页显示多少条
        },
        //分页
        total: 0, //总条数
        hide: true,
        background: true,
        //删除的id数组
        ids: []
      };
    },
    mounted() {
      this.getList(this.queryParams);
      console.log(process.env);
    },
    methods: {
      //跳转到编辑页面
      jumpToEdit(id, row) {
        this.$router.push({
          name: 'editDrbManagement',
          params: {
            id: id,
            row: row,
          }
        });
      },

      //跳转到查看页面
      jumpToLook(id, row) {
        this.$router.push({
          name: 'lookDrbManagement',
          params: {
            id: id,
            row: row,
          }
        });
      },
      //列表首页
      async getList(params) {
        this.loading = true;
        await getMasterList(params).then(res => {
          if (res.code == 1) {
            this.loading = false;
            res.data.list.forEach(v => {
              v.headImage =
                process.env.VUE_APP_BASE_API + "/vshare/file/" + v.headImage;
            });
            this.tableData = res.data.list;
            this.total = Number(res.data.total);
            this.queryParams.pageSize = res.data.pageSize;
            this.queryParams.pageNum = res.data.pageNum;
          }
        });
      },
      //分页
      pageChange(item) {
        this.queryParams.pageNum = item.page_index;
        this.queryParams.pageSize = item.page_limit;
        this.getList(this.queryParams);
      },
      //批量删除 1
      handleSelectionChange(res) {
        this.ids = res;
      },
      //批量删除 2
      clickDelete() {
        this.$confirm('是否确认删除？', '提示', {}).then(() => {
deleteMaster({
          ids: this.ids
            .map(v => {
              return v.id;
            })
            .join(",")
        }).then(res => {
          if (res.code == 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList(this.queryParams);
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
          }
        });
      }).catch(() => {
        console.log('cancle')
      });
      },
      //行内删除
      rowDelete(id) {
        this.$confirm('是否确认删除？', '提示', {}).then(() => {
        deleteMaster({
          ids: id
        }).then(res => {
          if (res.code == 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList(this.queryParams);
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
          }
        });
      }).catch(() => {
        console.log('cancle')
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
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  .task-list .top {
    .fj(row, flex-end);
  }

  .headImage {
    .borderRadius(10px);
  }
</style>