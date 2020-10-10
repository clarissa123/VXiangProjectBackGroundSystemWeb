<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'drbManagement'}">
            <img class="appManage" src="@/assets/images/home.png" />
            达人榜管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'hotSearchManagement'}">
            <img class="appManage" src="@/assets/images/file-list.png" />热搜设置
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="clickModal">创建热词</el-button>
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
        <el-table-column prop="hotWord" label="热搜信息" align="center"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" sortable align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <span class="update-btn cursor" @click="clickEditModal(scope.row)">编辑</span>
            <span class="dot">|</span>
            <span class="delete-btn cursor" @click="rowDelete(scope.row.id)">删除</span>
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
    <!-- 新增 -->
    <Popup
      :showModal="Popup.showModal"
      :width="Popup.width"
      :height="Popup.height"
      :title="Popup.title"
      @close="clickModal"
      v-if="Popup.showModal"
    >
      <div class="slot-content">
        <div class="slot-item">
          <div class="slot-wen">热词信息：</div>
          <input type="text" class="slot-input" v-model="hotWord" />
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal">取消</div>
          <div class="btn ok cursor" @click="addHotWord">确定</div>
        </div>
      </div>
    </Popup>
    <!-- 编辑 -->
    <Popup
      :showModal="Popup2.showModal"
      :width="Popup2.width"
      :height="Popup2.height"
      :title="Popup2.title"
      @close="clickEditModal"
      v-if="Popup2.showModal"
    >
      <div class="slot-content">
        <div class="slot-item">
          <div class="slot-wen">热词信息：</div>
          <input type="text" class="slot-input" v-model="hotWord" />
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickEditModal">取消</div>
          <div class="btn ok cursor" @click="clickEdit">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import {
  getHotWordList,
  addHotWord,
  deleteHotWord,
  updateHotWord
} from "@/api/appManagement/hotSearchManagement.js";
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
      //搜索参数
      queryParams: {
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      },
      //分页
      total: 0, //总条数
      hide: true,
      background: true,
      //删除的id数组
      ids: [],
      //编辑
      updateId: 0,
      //热词信息
      hotWord: '',
      // 新增弹窗的属性
      Popup: {
        width: 380,
        height: 310,
        showModal: false,
        title: "新增"
      },
      // 编辑弹窗的属性
      Popup2: {
        width: 380,
        height: 310,
        showModal: false,
        title: "编辑"
      },
      //表格
      tableData: [],
      loading: false,
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
    // 新增- 打开/关闭 弹窗
    clickModal() {
      this.Popup.showModal = !this.Popup.showModal;
      this.hotWord = '';
    },
    //编辑- 打开/关闭 弹窗
    clickEditModal(row) {
      this.Popup2.showModal = !this.Popup2.showModal;
      this.updateId = row.id;
      this.hotWord = row.hotWord;
    },
    //获取列表
    async getList() {
      this.loading = true;
      var result = await getHotWordList().then(res => {
        if (res.code == 1) {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = Number(res.data.total);
          this.queryParams.pageSize = res.data.pageSize;
          this.queryParams.pageNum = res.data.pageNum;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
      });
    },
    //添加
    async addHotWord() {
      let params = {
        hotWord: this.hotWord,
      };
      var result = await addHotWord(params).then(res => {
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
    },
    //修改成功提交
    async clickEdit() {
      let params = {
        hotWord: this.hotWord,
        id: this.updateId
      };
      await updateHotWord(params).then(res => {
        if (res.code == 1) {
          this.Popup2.showModal = !this.Popup2.showModal;
          this.getList(this.queryParams);
          this.$message({
            message: "修改成功",
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
        deleteHotWord({
          ids: this.ids
            .map(v => {
              return v.id;
            })
            .join(",")
        }).then(res => {
          if (res.code == 1) {
            this.getList(this.queryParams);
            this.$message({
              message: "删除成功",
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
      }).catch(() => {
        console.log('cancle')
      });
    },
    //行内删除
    rowDelete(id) {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
        deleteHotWord({
          ids: id
        }).then(res => {
          if (res.code == 1) {
            this.getList(this.queryParams);
            this.$message({
              message: "删除成功",
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

// 弹窗设置
.slot-content {
  width: 100%;
  height: 170px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding-top: 80px;
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
      margin: 0 24px;
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
</style>