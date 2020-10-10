<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/home.png" />
            系统管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'rizhiList'}">
            <img class="appManage" src="@/assets/images/file.png" />日志管理
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" style="margin-right: 0;" @click="exportLoge">下载记录</el-button>
      </div>
    </Top>
    <div class="bottom">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="table"
        :data="tableData"
        style="width: 1640"
        :cell-style="cell"
        :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
      >
        <el-table-column prop="operAppUser" label="用户名" align="center"></el-table-column>
        <el-table-column prop="sysAcount" label="账号" align="center"></el-table-column>
        <el-table-column prop="roleName" label="权限" align="center"></el-table-column>
        <el-table-column prop="operType" label="调整类型" align="center"></el-table-column>
        <el-table-column prop="operDesc" label="调整记录" align="center"></el-table-column>
        <el-table-column prop="operName" label="调整的用户名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" sortable align="center"></el-table-column>
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
  getDisList2,
  updateDis,
  deleteDis,
  addDis,
  exportLoge
} from "@/api/systemManagement/systemDistribution.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";
import Popup from "@/components/popup.vue";

export default {
  components: {
    Pagination,
    Top,
    Popup
  },
  data() {
    return {
      //新增弹框
      title: "",
      message: "",
      enable: false,
      //上传图片
      extraParams: {
        fileType: 5 //普通图片
      },
      uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
      imageUrl: "",
      optionsOne: [{
        value: "1",
        label: "外部链接"
      },
      {
        value: "2",
        label: "教程"
      },
      {
        value: "3",
        label: "vip充值"
      },
      {
        value: "4",
        label: "任务中心"
      }
      ],
      //跳转方式 下拉框  外部链接/教程/vip充值/任务中心
      valueOne: "",
      //bannerUrl
      valueTwo: "",
      //教程下面的分类 下拉框   //外部链接 输入框
      valueThree: "",

      optionsTwo: [],
      optionsThree: [],

      // 弹窗的属性
      Popup: {
        width: 900,
        height: 610,
        showModal: false,
        title: "添加"
      },
      Popup3: {
        width: 900,
        height: 610,
        showModal: false,
        title: "编辑"
      },
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

      //表格
      tableData: [],
      loading: false,

      //分页
      total: 0, //总条数
      hide: true,
      background: true,

      //搜索参数
      queryParams: {
        pageNum: 1, //当前页数
        pageSize: 10, //每页显示多少条
        startTime:'',
        endTime:''
      },
      //删除的id数组
      ids: [],

      //编辑
      updateId: 0
    };
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    exportLoge() {
      window.location.href = `${process.env.VUE_APP_BASE_API}/sys/admin/log/export`
    },
    indexMethod(index) {
      return (
        index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      );
    },
    //改变是否启用
    async changeStatus(status, id) {
      var num = 0
      this.tableData.forEach((item, index) => {
        if (id != item.id && item.enable) {
          num++
        }
      })
      if (num > 0) {
        this.$message({
          message: '同时只能启用一条提示信息！',
          type: "error"
        });

        this.getList();
      } else {
        let selectNew = this.tableData.find(v => {
          return v.id == id
        })

        await updateDis(selectNew).then(res => {
          if (res.code == 1) {
            this.getList(this.queryParams);
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data,
              type: "error"
            });
            this.getList();
          }
        });
      }

    },
    // 新增- 打开/关闭 弹窗
    clickModal() {
      this.resetValue();
      this.Popup.showModal = !this.Popup.showModal;
    },
    // 查看- 打开/关闭 弹窗
    clickModal3(row) {
      this.Popup3.showModal = !this.Popup3.showModal;
      this.resetValue();
      this.title = row.title;
      this.message = row.message;
      this.updateId = row.id;
      this.enable = row.enable;
    },
    //根据日期搜索
    search() {
      this.getList(this.queryParams);
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
    //清空弹框内容
    resetValue() {
      this.message = "";
      this.title = "";
    },
    //修改成功提交
    async clickEdit() {
      let params = {
        title: this.title,
        message: this.message,
        id: Number(this.updateId),
        enable: this.enable
      };
      await updateDis(params).then(res => {
        if (res.code == 1) {
          this.Popup3.showModal = !this.Popup3.showModal;
          this.getList(this.queryParams);
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.data,
            type: "error"
          });
          return;
        }
      });
    },
    //列表首页
    async getList(params) {
      this.loading = true;
      await getDisList2(params).then(res => {
        this.loading = false;
        this.tableData = res.rows;
        this.total = Number(res.total);
        this.queryParams.pageSize = Number(res.records);
        this.queryParams.pageNum = res.page;
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
    async clickDelete() {
      let id = this.ids.map(v => {
        return v.id;
      });
      await deleteDis({
        ids: id
      }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.queryParams.createTimeFrom = "";
          this.queryParams.createTimeTo = "";
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
    },
    //行内删除
    async rowDelete(id) {
      let arr = [];
      arr.push(id);
      await deleteDis({
        ids: arr
      }).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.queryParams.createTimeFrom = "";
          this.queryParams.createTimeTo = "";
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
    },
    //修改 table表格 列的文字颜色
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
    //消息管理-新增
    async addDis() {
      let params = {
        message: this.message,
        title: this.title
      };
      await addDis(params).then(res => {
        if (res.code == 1) {
          this.Popup.showModal = !this.Popup.showModal;
          this.getList(this.queryParams);
          this.$message({
            message: "添加成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
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

// 弹窗设置
.slot-content {
  width: 100%;
  height: 555px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  position: relative;

  .slot-middle {
    width: 100%;
    height: 500px;
    padding: 30px 30px 97px 30px;
    box-sizing: border-box;

    .disItem {
      height: 235px;
      align-items: flex-start;

      .bannerBg {
        height: 234px;
        width: 710px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed rgba(0, 0, 0, 0.15);
        background: #fafafc;
      }
    }

    .item {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;
    }

    .naTo {
      height: 40px;
      align-items: center;

      .itemSelect {
        width: 710px;
        height: 100%;
      }
    }

    .foreignUrl {
      width: 710px;
    }

    .itemName {
      width: 85px;
      height: 40px;
      text-align: end;
      line-height: 40px;
    }

    .img {
      .wh(710px, 234px);
    }
  }

  .slot-btns {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    border-top: 1px solid rgba(0, 0, 0, 0.09);

    .btn {
      width: 65px;
      height: 32px;
      border-radius: 4px;
      line-height: 32px;
    }

    .cancel {
      color: #000000;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(217, 217, 217, 1);
      margin-right: 8px;
    }

    .ok {
      background: #1890ff;
      box-sizing: 1px solid #1890ff;
      color: #ffffff;
    }
  }
}
</style>