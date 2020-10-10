<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-select class="select" clearable v-model="queryParams.statusCode" placeholder="所有状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          class="date"
          v-model="value1"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          align="left"
          unlink-panels
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="selectTime"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-button class="search-btn" @click="search">搜索</el-button>
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
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
        >
          <el-table-column label="课程名称" align="center">
            <template slot-scope="scope">
              <span class="sort-style">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="课程级别" align="center"></el-table-column>
          <el-table-column prop="subjectMatterId" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="uid" label="用户ID" align="center"></el-table-column>
          <el-table-column label="用户昵称" align="center">
             <template slot-scope="scope">
              <span class="sort-style">{{ scope.row.userNickname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          <el-table-column
            prop="statusCodeName"
            label="状态"
            sortable
            align="center"
            :filters="[{text: '等待审核', value: '等待审核'}, {text: '通过', value: '通过'}, {text: '未通过', value:'未通过'}]"
            :filter-method="filterHandler"
          ></el-table-column>
          <el-table-column prop="commitTime" label="申请时间" sortable align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template scope="scope">
              <el-link
                class="blue-link cursor"
                type="primary"
                :underline="false"
                @click.native="clickModal1(scope.row.id)"
              >查看</el-link>
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
    <Popup
      :showModal="Popup.showModal"
      :width="Popup.width"
      :height="Popup.height"
      :title="Popup.title"
      @close="clickModal2"
      v-if="Popup.showModal"
    >
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item">
            <div class="itemLeft">课程名称</div>
            <input type="text" class="itemRight input" v-model="form.assignmentName" />
          </div>
          <div class="item">
            <div class="itemLeft">用户ID</div>
            <input type="text" class="itemRight input" v-model="form.uid" />
          </div>
          <div class="item">
            <div class="itemLeft">课程截图</div>
            <div class="itemRight jtBg">
              <img :src="form.assignmentImgUrl" class="img" alt />
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">课程链接</div>
            <input type="text" class="itemRight input" v-model="form.assignmentPromoteUrl" />
          </div>
          <div class="item">
            <div class="itemLeft">提交时间</div>
            <input type="text" class="itemRight input" v-model="form.createTime" />
          </div>
          <div class="item">
            <div class="itemLeft">审核状态</div>
            <el-select
              clearable
              class="itemRight selectBody"
              v-model="form.statusCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="item">
            <div class="itemLeft">管理员备注</div>
            <textarea
              class="textArea itemRight"
              name
              id
              cols="30"
              rows="10"
              v-model="form.descMark"
            ></textarea>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal2">取消</div>
          <div class="btn ok cursor" @click="clickUpdate">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import {
  getAuditList,
  getAuditById,
  putAudit
} from "@/api/taskManagement/taskExamine.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";
import Popup from "@/components/popup.vue";
export default {
  inject: ["reload"], //注入reload方法
  components: {
    Pagination,
    Top,
    Popup
  },
  data() {
    return {
      //查询详情
      form: {
        assignmentName: "", //商品编号
        uid: "", //用户ID
        assignmentImgUrl: "", //图片地址
        assignmentPromoteUrl: "", //课程推广链接
        statusCode: 1, //课程审核状态
        createTime: "", //发布时间
        subjectMatterId: "" //商品编号
      },
      Popup: {
        width: 960,
        height: 984,
        showModal: false,
        title: "审核详情"
      },
      //下拉菜单选择器
      options: [
        {
          value: 1,
          label: "等待审核"
        },
        {
          value: 2,
          label: "通过"
        },
        {
          value: 3,
          label: "未通过"
        }
      ],
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
      //搜索参数
      queryParams: {
        startTime: "", //开始时间
        endTime: "", //结束时间
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
        statusCode: "", //下拉框搜索状态
        orderStyle: 1, //审核状态
        orderType: 1 //升序
      },

      //删除的id数组
      ids: [],

      //分页
      total: 0, //总条数
      hide: true,
      background: true
    };
  },
  mounted() {
    this.getList(this.queryParams);
    console.log(process.env);
  },
  methods: {
    //根据日期搜索
    search() {
      this.getList(this.queryParams);
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
    //分页
    pageChange(item) {
      this.queryParams.currentPage = item.page_index;
      this.queryParams.pageSize = item.page_limit;
      this.getList(this.queryParams);
    },
    // 打开/关闭 弹窗
    clickModal2() {
      this.Popup.showModal = !this.Popup.showModal;
    },
    // 查看详情
    clickModal1(id) {
      this.Popup.showModal = !this.Popup.showModal;
      this.getDataById(id);
    },
    //根据id获取详情
    async getDataById(id) {
      await getAuditById({
        auditId: id
      }).then(res => {
        this.form = res.data;
      });
    },
    async clickUpdate() {
      await putAudit(this.form).then(res => {
        if (res.code == 1) {
          this.Popup.showModal = !this.Popup.showModal;
          this.getList(this.queryParams);
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      });
    },
    async getList(params) {
      this.loading = true;
      if (params.startTime == "") {
        delete params.startTime;
      }
      if (params.endTime == "") {
        delete params.endTime;
      }
      await getAuditList(params).then(res => {
        this.loading = false;
        this.tableData = res.data.rows;
        this.total = Number(res.data.records);
        this.queryParams.currentPage = res.data.page;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    cell({ row, column, rowIndex, columnIndex }) {
      //第二列添加 颜色
      if (columnIndex === 0) {
        return "color:#1890FF";
      }
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/myUI.less";

.slot-content {
  width: 100%;
  height: 928px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  position: relative;

  .slot-middle {
    width: 100%;
    height: 870px;
    padding: 34px 20px;
    box-sizing: border-box;

    .item {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 15px;
      min-height: 22px;

      .itemLeft {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        width: 120px;
        display: flex;
        justify-content: flex-end;
        height: 40px;
        align-items: center;
        line-height: 40px;
      }

      .itemRight {
        margin-left: 33px;
        min-height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 25px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      .selectBody {
        width: 104px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(217, 217, 217, 1);
      }

      .jtBg {
        width: 240px;
        height: 357px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        padding: 11px;
        box-sizing: border-box;

        .img {
          width: 100%;
          height: 100%;
          background: red;
        }
      }

      .textArea {
        width: 770px;
        height: 114px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        padding: 12px;
        box-sizing: border-box;
      }

      .input {
        width: 770px;
        height: 40px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        padding-left: 10px;
      }
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
    padding: 0 30px;
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

.sort-style {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/deep/.popup .popup-content .slotWrap {
  width: 924px;
  height: 800px;
  overflow-y: scroll;
}
</style>