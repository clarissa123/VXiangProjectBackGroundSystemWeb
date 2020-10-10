<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-input
          placeholder="按Enter键搜索"
          suffix-icon="el-icon-search"
          v-model="queryParams.catgoryName"
          @keyup.enter.native="searchName"
        ></el-input>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="clickModal(true)">新增类目</el-button>
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
          style="width: 100%"
          :cell-style="cell"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
        >
          <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="assignmentTypeName" label="一级类目" align="center"></el-table-column>
          <el-table-column prop="assignmentCatName" label="类目名称" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="look-btn cursor" @click="clickModal2(true,scope.row)">修改</span>
              <span class="dot">|</span>
              <span class="look-btn cursor" @click="clickModal3(scope.row.id)">删除</span>
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

    <!-- 新增 -->
    <Popup
      :showModal="Popup.showModal"
      :width="Popup.width"
      :height="Popup.height"
      :title="Popup.title"
      @close="clickModal(false)"
      v-if="Popup.showModal"
      class="addleimu-popup"
    >
      <div class="slot-content">
        <div class="slot-item">
          <div class="slot-wen">一级类目：</div>
          <el-select
            class="select"
            v-model="typeId"
            clearable
            placeholder="请选择"
            @click.native="clickSelect"
            @change="changeLeiMu($event)"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </div>
        <div class="slot-item">
          <div class="slot-wen">类目名称：</div>
          <input type="text" class="slot-input" v-model="assignmentCatName" />
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal(false)">取消</div>
          <div class="btn ok cursor" @click="addType">确定</div>
        </div>
      </div>
    </Popup>

    <!-- 修改 -->
    <Popup
      :showModal="Popup2.showModal"
      :width="Popup2.width"
      :height="Popup2.height"
      :title="Popup2.title"
      @close="clickModal2(false)"
      v-if="Popup2.showModal"
      class="editleimu-popup"
    >
      <div class="slot-content">
        <div class="slot-item">
          <div class="slot-wen">一级类目：</div>
          <el-select
            class="select"
            v-model="typeId"
            clearable
            placeholder="请选择"
            @click.native="clickSelect"
            @change="changeLeiMu($event)"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </div>
        <div class="slot-item">
          <div class="slot-wen">类目名称：</div>
          <input type="text" class="slot-input" v-model="assignmentCatName" />
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal2(false)">取消</div>
          <div class="btn ok cursor" @click="updateType">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import {
  getQueryPage,
  addType,
  updateType,
  deleteType,
  getFirstType
} from "@/api/taskManagement/taskList.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";
import Popup from "@/components/popup.vue";
import axios from "axios";

export default {
  inject: ["reload"], //注入reload方法
  components: {
    Pagination,
    Top,
    Popup
  },
  data() {
    return {
      //开关
      switchValue: "未发布",
      //一级类目下拉框
      typeOptions: [],
      value: "",
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
      hide: true,
      background: true,
      //搜索参数
      queryParams: {
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
        catgoryName: "" //分类名称
      },
      // 新增弹窗的属性
      Popup: {
        width: 380,
        height: 310,
        showModal: false,
        title: "新增类目"
      },
      // 修改弹窗的属性
      Popup2: {
        width: 380,
        height: 310,
        showModal: false,
        title: "修改类目"
      },
      //类目名称
      assignmentCatName: "",
      //一级类目
      typeId: "",
      //编辑
      updateId: 0,
      //删除
      deleteId: 0
    };
  },
  mounted() {
    this.getList(this.queryParams);
    console.log(process.env);
  },
  methods: {
    changeLeiMu(event) {
      this.typeId = event;
    },
    indexMethod(index) {
      return (
        index +
        1 +
        (this.queryParams.currentPage - 1) * this.queryParams.pageSize
      );
    },
    searchName() {
      this.getList(this.queryParams);
    },
    // 新增- 打开/关闭 弹窗
    clickModal(flag) {
      if (flag == false) {
        this.Popup.showModal = false;
      } else {
        this.Popup.showModal = true;
        this.assignmentCatName = ""; //类目名称
        this.typeId = ""; //类目名称
      }
    },
    //获取一级类目
    clickSelect() {
      this.getFirstType(); //获取一级类目
    },
    async getFirstType() {
      let res = await getFirstType();
      this.typeOptions = res.data;
    },
    // 修改- 打开/关闭 弹窗
    async clickModal2(flag, row) {
      if (flag == true) {
        let res = await getFirstType();
        this.typeOptions = res.data;
        // this.typeOptions = row
        this.Popup2.showModal = true;
        this.updateId = row.id;
        this.assignmentCatName = row.assignmentCatName;
        this.typeId = row.assignmentType;
      } else {
        this.Popup2.showModal = false;
      }
    },
    //删除
    clickModal3(id) {
      this.deleteId = id;
      this.$confirm("是否删除该条信息？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "ok",
        cancelButtonClass: "no",
        type: "error"
      })
        .then(() => {
          this.deleteType(this.deleteId);
        })
        .catch(() => {
          return;
        });
    },
    //新增
    async addType() {
      let res = await addType({
        assignmentCatName: this.assignmentCatName,
        assignmentType: this.typeId
      });
      if (res.code == "1") {
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.Popup.showModal = false;
        this.getList(this.queryParams);
      }
    },
    //修改
    async updateType() {
      let res = await updateType({
        assignmentCatName: this.assignmentCatName,
        id: this.updateId,
        assignmentType: this.typeId
      });
      if (res.code == "1") {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.Popup2.showModal = !this.Popup2.showModal;
        this.getList(this.queryParams);
      }
    },
    //删除
    async deleteType(id) {
      let res = await deleteType(id);
      if (res.code == "1") {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getList(this.queryParams);
      } else {
        this.$confirm("不能删除有数据的信息！", "", {
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
    //列表首页
    async getList(params) {
      this.loading = true;
      await getQueryPage(params).then(res => {
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
    cell({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return "color:#1890FF";
      }
      //第二列添加 颜色
      if (columnIndex === 2) {
        return "color:#1890FF";
      }
    },
    //分页
    pageChange(item) {
      this.queryParams.currentPage = item.page_index;
      this.queryParams.pageSize = item.page_limit;
      this.getList(this.queryParams);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/myUI.less";

.task-list .top .top-right .left-btn {
  .wh(110px, 32px);
}

/deep/.my-switch .el-switch__core {
  .wh(28px, 16px) !important;
}

/deep/.my-switch .el-switch__core:after {
  .wh(12px, 12px);
}

/deep/.addleimu-popup {
  .slot-content {
    width: 100%;
    height: 213px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 50px;
    position: relative;

    .slot-item {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      .slot-wen {
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }

      .slot-input {
        width: 210px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.09);
        padding: 0 10px;
        box-sizing: border-box;
      }
    }

    .slot-btns {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 52px;
      display: flex;
      justify-content: flex-end;
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
}

/deep/.editleimu-popup {
  .slot-content {
    width: 100%;
    height: 213px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 50px;
    position: relative;

    .slot-item {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;

      .slot-wen {
        height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }

      .slot-input {
        width: 210px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.09);
        padding: 0 10px;
        box-sizing: border-box;
      }
    }

    .slot-btns {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 52px;
      display: flex;
      justify-content: flex-end;
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
}
</style>