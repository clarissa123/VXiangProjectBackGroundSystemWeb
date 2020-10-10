<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/home.png" />
            系统管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/file-list.png" />用户管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'courseManagementType'}">
            <img class="appManage" src="@/assets/images/file.png" />后台用户
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <router-link :to="{name:'addSystemUserHt',params:{type:'add'}}">
          <el-button class="btn left-btn">新增</el-button>
        </router-link>
        <el-button class="btn right-btn" @click="deluser">删除</el-button>
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
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" prop="nickname" label="用户名"></el-table-column>
        <el-table-column align="center" prop="account" label="账号"></el-table-column>
        <el-table-column align="center" label="权限">
          <template slot-scope="scope">
            <span>{{scope.row.id | filterId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" sortable></el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <span class="del cursor" @click="edit(scope.row.id)">编辑</span>
            <span class="dot">|</span>
            <button
              :class="scope.row.isAdmin?'gray-btn cursor':'cursor'"
              @click="del(scope.row.id)"
              class="del"
              :disabled="scope.row.isAdmin"
            >删除</button>
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
</template>

<script>
import {
  htUserList,
  delUser
} from "@/api/systemManagement/systemUser/systemUserHt.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";

export default {
  components: {
    Pagination,
    Top
  },
  data() {
    return {
      pageSize: 10,
      pageNum: 1,
      multipleSelection: [],
      //下拉菜单选择器
      options: [{
        value: "选项1",
        label: "黄金糕"
      },
      {
        value: "选项2",
        label: "双皮奶"
      },
      {
        value: "选项3",
        label: "蚵仔煎"
      },
      {
        value: "选项4",
        label: "龙须面"
      },
      {
        value: "选项5",
        label: "北京烤鸭"
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
      //搜索参数
      queryParams: {
        pageNum: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
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
  filters: {
    filterId(val) {
      var valName = ''
      if (val == 1) {
        valName = '超级管理员'
      } else {
        valName = '普通管理员'
      }
      return valName;
    }
  },
  methods: {
    del(id) {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
        var ids = [];
        ids.push(id)
        delUser(ids).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          if (this.tableData.length == 1) {
            if (this.pageNum > 1) {
              this.pageNum--;
            }
          }
          this.getList()

        })
      }).catch(() => {
        console.log('cancle')
      });
    },
    // 删除用户
    deluser() {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
        var ids = [];
        this.multipleSelection.forEach((item, index) => {
          ids.push(item.id)
        })
        delUser(ids).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getList()
        })
      }).catch(() => {
        console.log('cancle')
      });
    },
    async getList(params) {
      // this.loading = true;
      var result = await htUserList(params).then(res => {
        res.data.forEach((item, index) => {
          if (item.id == 1) {
            item.isAdmin = true;
          } else {
            item.isAdmin = false
          }
        })
        this.tableData = res.data;
        this.total = Number(res.total);
        // this.loading = false;
      });
    },
    edit(id) {
      // 跳转详情页面
      this.$router.push({
        name: 'addSystemUserHt',
        params: {
          type: 'edit',
          id: id
        }
      })
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
    //分页
    pageChange(item) {
      this.queryParams.pageNum = item.page_index;
      this.queryParams.pageSize = item.page_limit;
      this.getList(this.queryParams);
    },

  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/style/myUI.less";

.gray-btn {
  color: rgba(0, 0, 0, 0.29) !important;
}

.del {
  border: none;
  background: none;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(24, 144, 255, 1);
  line-height: 18px;
}

/deep/.el-breadcrumb__inner {
  img {
    display: inline-block;
    margin-right: 8px;
  }
}
</style>