<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-select
          class="select"
          v-model="queryParams.typeId"
          clearable
          placeholder="所有分类"
          @click.native="clickSelect"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
        </el-select>
        <el-date-picker
          class="date"
          v-model="value1"
          value-format="yyyy-MM-dd"
          @change="selectTime"
          type="daterange"
          align="left"
          unlink-panels
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-button class="search-btn" @click="search">搜索</el-button>
      </div>
      <div class="top-right" slot="btn">
        <router-link to="/addCourseManagement">
          <el-button class="btn left-btn">添加教程</el-button>
        </router-link>
        <el-button class="btn right-btn" @click="clickDelete">删除</el-button>
      </div>
    </Top>

    <div class="bottom">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="table"
        :data="tableData"
        style="width: 100%"
        :cell-style="cell"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
      >
        <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
        <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="previewImage" label="预览图" align="center">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <img :src="scope.row.previewImage" width="102" height="62" />
          </template>
        </el-table-column>
        <el-table-column prop="mainTitle" label="主标题" align="center"></el-table-column>
        <el-table-column prop="subTitle" label="副标题" align="center"></el-table-column>
        <el-table-column prop="typeName" label="分类" align="center"></el-table-column>
        <el-table-column prop="createTime" label="发布时间" sortable align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <span class="update-btn cursor" @click="jumpToLook(scope.row.id)">查看</span>
            <span class="dot">|</span>
            <el-dropdown>
              <span class="el-dropdown-link more-btn cursor">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu
                slot="dropdown"
                class="dropdown"
                style="{width:'88px',height:'88px',padding: 0}"
              >
                <el-dropdown-item @click.native="jumpToEdit(scope.row.id)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="rowDelete(scope.row.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增 -->
      <Pagination
        :background="background"
        :hide="hide"
        :pageSize="queryParams.pageSize"
        :total="total"
        @pageChange="pageChange"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import {
  getTutorialList,
  deleteTutorial,
  updateTutorial,
} from "@/api/appManagement/courseManagement/courseManagementList.js";
import {
  getTutorialTypeList
} from "@/api/appManagement/courseManagement/courseManagementType.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";

export default {
  components: {
    Pagination,
    Top
  },
  data() {
    return {
      //搜索参数
      queryParams: {
        //时间
        createTimeFrom: "",
        createTimeTo: "",
        pageNum: 1, //当前页数
        pageSize: 10, //每页显示多少条
        typeId: '',
      },
      //删除的id数组
      ids: [],

      //下拉菜单选择器
      options: [],

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
    };
  },
  mounted() {
    this.getList(this.queryParams);
    console.log(process.env);
  },
  methods: {
    indexMethod(index) {
      return (
        index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      );
    },
    //跳转到查看页面
    jumpToLook(id) {
      this.$router.push({
        name: 'lookCourseManagement',
        params: {
          id: id,
        }
      });
    },
    //跳转到编辑页面
    jumpToEdit(id) {
      this.$router.push({
        name: 'editCourseManagement',
        params: {
          id: id,
        }
      });
    },
    clickSelect() {
      this.getTutorialTypeList();
    },
    //获取搜索日期
    selectTime(value1) {
      if (value1 == null) {
        this.queryParams.createTimeFrom = "";
        this.queryParams.createTimeTo = "";
        this.queryParams.pageNum = 1;
      } else {
        this.queryParams.pageNum = 1;
        this.queryParams.createTimeFrom = value1[0];
        this.queryParams.createTimeTo = value1[1];
      }
    },
    //获取下拉框菜单
    async getTutorialTypeList() {
      await getTutorialTypeList().then(res => {
        res.data.list.forEach(v => {
          v.value = v.id;
          v.label = v.typeName;
        });
        this.options = res.data.list;
      });
    },
    //根据日期搜索
    search() {
      this.getList(this.queryParams);
    },
    //列表首页
    async getList(params) {
      this.loading = true;
      await getTutorialList(params).then(res => {
        this.loading = false;
        res.data.list.forEach(v => {
          v.previewImage =
            process.env.VUE_APP_BASE_API + "/vshare/file/" + v.previewImage;
        });
        this.tableData = res.data.list;
        this.total = Number(res.data.total);
        this.queryParams.pageSize = res.data.pageSize;
        this.queryParams.pageNum = res.data.pageNum;
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
        deleteTutorial({
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
            this.queryParams.createTimeFrom = '';
            this.queryParams.createTimeTo = '';
            this.value1 = '';
            this.getList(this.queryParams);
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      }).catch(() => {
        console.log('cancle')
      });




    },
    //行内删除
    rowDelete(id) {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
        deleteTutorial({
          ids: id
        }).then(res => {
          if (res.code == 1) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.queryParams.createTimeFrom = '';
            this.queryParams.createTimeTo = '';
            this.value1 = '';
            this.getList(this.queryParams);
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
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
@import "../../../assets/style/myUI.less";

.task-list .top .top-right .left-btn {
  .wh(88px, 32px);
  letter-spacing: 1px;
}

.task-list .top .top-right .right-btn {
  letter-spacing: 1px;
}
</style>