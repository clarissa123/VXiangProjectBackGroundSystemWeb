<template>
  <div class="task-list">
    <div class="record">
      <!-- 总提现金额 -->
      <div class="tip income">
        <span>总提现金额：</span>
        <span>{{totals.totalOutMoney}}</span>
      </div>
      <!-- 手续费 -->
      <div class="tip expenditure">
        <span>手续费：</span>
        <span>{{totals.serviceMoney}}</span>
      </div>
      <!-- 实际提现金额 -->
      <div class="tip balance">
        <span>实际提现金额：</span>
        <span>{{totals.realityMoney}}</span>
      </div>
      <!-- 等待提现 -->
      <div class="tip wait">
        <span>等待提现：</span>
        <span>{{totals.notOutMoney}}</span>
      </div>
    </div>
    <Top>
      <div class="top-left" slot="search">
        <el-select class="select" clearable v-model="queryParams.state" placeholder="所有状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          class="date"
          v-model="value2"
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
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="exportExcel">导出提现记录</el-button>
        <el-button class="btn right-btn" @click="clickModal">提现设置</el-button>
      </div>
    </Top>
    <div class="bottom">
      <div class="table-container">
        <el-table
          id="table"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          :data="tableData"
          style="width: 100%"
          :cell-style="cell"
          :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}"
        >
          <el-table-column prop="id" label="编号" align="center" fixed></el-table-column>
          <el-table-column label="用户ID" align="center">
            <template slot-scope="scope">
              <span @click="clickModal2(true,scope.row)">{{scope.row.userIdNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center">
            <template slot-scope="scope">
              <span class="sort-style" @click="clickModal2(true,scope.row)">{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userPhone" label="电话" align="center"></el-table-column>
          <el-table-column label="提现账户" min-width="250px" align="center">
            <template slot-scope="scope">
              <p>开户名：{{scope.row.bankManName}}</p>
              <p>开户银行：{{scope.row.bankOrgName}}</p>
              <p>银行账户：{{scope.row.bankAccount}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="thenBalance" label="余额" align="center"></el-table-column>
          <el-table-column prop="amount" label="提现金额" align="center"></el-table-column>
          <el-table-column prop="serviceAmount" label="手续费" align="center"></el-table-column>
          <el-table-column prop="realityAmount" label="实际提现金额" align="center"></el-table-column>
          <el-table-column label="状态" sortable align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1">
                <span class="green-dot"></span>未审核
              </span>
              <span v-if="scope.row.status==2">
                <span class="gray-dot"></span>通过
              </span>
              <span v-if="scope.row.status==3">
                <span class="gray-dot"></span>不通过
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" sortable align="center"></el-table-column>
          <el-table-column prop="processor" label="操作人" align="center"></el-table-column>
          <el-table-column label="操作" align="center" fixed="right" >
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link more-btn">
                  审核
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  class="dropdown"
                  style="{width:'88px',height:'88px',padding: 0}"
                >
                  <el-dropdown-item @click.native="changeStatus(scope.row.id,true)">通过</el-dropdown-item>
                  <el-dropdown-item @click.native="changeStatus(scope.row.id,false)">不通过</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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

    <!-- 提现设置 -->
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
          <div class="slot-wen">最低提现额</div>
          <input type="text" class="slot-input" v-model="form.min" />
          <div class="slot-wen">元</div>
        </div>
        <div class="slot-item">
          <div class="slot-wen">提现手续费</div>
          <input type="text" class="slot-input" v-model="form.serviceRate" />
          <div class="slot-wen">%</div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel" @click="clickModal">取消</div>
          <div class="btn ok" @click="clickUpdate">确定</div>
        </div>
      </div>
    </Popup>

    <!-- 用户详情 -->
    <Popup
      :showModal="Popup2.showModal"
      :width="Popup2.width"
      :height="Popup2.height"
      :title="Popup2.title"
      @close="clickModal2(false)"
      v-if="Popup2.showModal"
    >
      <div class="slot-content2">
        <div class="slot-middle">
          <div class="item">
            <div class="itemLeft">用户ID ：</div>
            <div class="itemRight cursor">{{detailInfor.idNum}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">昵称 ：</div>
            <div class="itemRight cursor">{{detailInfor.name}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">电话：</div>
            <div class="itemRight">{{detailInfor.phone}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">注册时间：</div>
            <div class="itemRight">{{detailInfor.createTime}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">团队信息：</div>
            <div class="itemRight">
              <p>直推人数：{{detailInfor.teamInfo.countOne}}</p>
              <p>间推人数：{{detailInfor.teamInfo.countTwo}}</p>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">银行信息：</div>
            <div class="itemRight">
              <p>开户名：{{detailInfor.bankAccountInfo.owner}}</p>
              <p>开户银行：{{detailInfor.bankAccountInfo.orgName}}</p>
              <p>银行账号：{{detailInfor.bankAccountInfo.cardNum}}</p>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">历史总收入：</div>
            <div class="itemRight">{{detailInfor.accountInfo.totalIncr}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">已提现金额：</div>
            <div class="itemRight">{{detailInfor.accountInfo.totalDecr}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">余额：</div>
            <div class="itemRight">{{detailInfor.accountInfo.balance}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">VIP级别：</div>
            <div class="itemRight2">{{detailInfor.vipList | filterVip2}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">会员等级：</div>
            <div class="itemRight">{{detailInfor.memberId |filterVip}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">备注：</div>
            <div class="itemRight">
              {{detailInfor.remark}}
              <!-- <textarea class="textarea" v-model="detailInfor.remark" name id cols="30" rows="10"></textarea> -->
            </div>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { appList } from "@/api/systemManagement/systemUser/systemUserApp.js";
import {
  getTotal,
  getList,
  allow,
  notAllow,
  getAccountOut,
  editAccountOut
} from "@/api/financeManagement/financeApply.js";
import Pagination from "@/components/Pagination.vue";
import Top from "@/components/top.vue";
import Popup from "@/components/popup.vue";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  inject: ["reload"], //注入reload方法
  components: {
    Pagination,
    Top,
    Popup
  },
  data() {
    return {
      //用户详情
      Popup2: {
        width: 960,
        height: 770,
        showModal: false,
        title: "用户详情"
      },
      detailInfor: {},
      form: {
        min: "",
        serviceRate: ""
      },
      //统计数据
      totals: {
        notOutMoney: 0, //等待提现
        realityMoney: 0, //实际提现金额
        serviceMoney: 0, //手续费
        totalOutMoney: 0 //总提现金额
      },
      //搜索参数
      queryParams: {
        startDate: "", //开始时间
        endDate: "", //结束时间
        state: "", //状态 1表示未审核，2表示通过，3表示驳回
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      },
      // 提现设置
      Popup: {
        width: 380,
        height: 310,
        showModal: false,
        title: "提现设置"
      },
      //下拉菜单选择器
      options: [
        {
          value: 1,
          label: "待审核"
        },
        {
          value: 2,
          label: "通过"
        },
        {
          value: 3,
          label: "不通过"
        }
      ],
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
    this.getList();
    console.log(process.env);
  },
  filters: {
    filterVip(val) {
      var name = "";
      switch (val) {
        case 1:
          name = "青铜会员";
          break;
        case 2:
          name = "白银会员";
          break;
        case 3:
          name = "黄金会员";
          break;
        case 4:
          name = "钻石会员";
          break;
      }
      return name;
    },
    filterVip2(val) {
      var arr = [];
      val.forEach((item, index) => {
        arr.push(item.name);
      });
      return arr.join(",");
    }
  },
  methods: {
    clickModal2(flag, item) {
      if (flag == false) {
        this.Popup2.showModal = false;
      } else {
        appList({
          idNum: item.userIdNum
        }).then(res => {
          this.Popup2.showModal = true;
          this.detailInfor = res.data[0];
        });
      }
    },
    indexMethod(index) {
      return (
        index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
      );
    },
    //手续费配置修改
    async clickUpdate() {
      await editAccountOut(this.form).then(res => {
        if (res.code == 1) {
          this.Popup.showModal = !this.Popup.showModal;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.reload();
        }
      });
    },
    //跳转到编辑页面
    changeStatus(id, flag) {
      let aid = Number(id);
      if (flag == true) {
        this.allow(aid);
      } else {
        this.notAllow(aid);
      }
    },
    //通过记录
    async allow(id) {
      await allow({
        id: id
      }).then(res => {
        if (res.code != 1) {
          this.$message({
            message: res.data,
            type: "error"
          });
          this.reload();
        } else {
          this.$message({
            message: "修改通过状态成功",
            type: "success"
          });
          this.reload();
        }
      });
    },
    //不通过记录
    async notAllow(id) {
      await notAllow({
        id: id
      }).then(res => {
        if (res.code != 1) {
          this.$message({
            message: res.data,
            type: "error"
          });
          this.reload();
        } else {
          this.$message({
            message: "修改不通过状态成功",
            type: "success"
          });
          this.reload();
        }
      });
    },
    //点击搜索
    search() {
      this.getList(this.queryParams);
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
    //分页
    pageChange(item) {
      this.queryParams.pageNum = item.page_index;
      this.queryParams.pageSize = item.page_limit;
      this.getList(this.queryParams);
    },
    //获取统计数据
    async getTotal() {
      await getTotal().then(res => {
        if (res.code == "1") {
          if (res.data == null) {
            this.totals = {};
          } else {
            this.totals = res.data;
          }
        }
      });
    },
    // 打开/关闭 弹窗
    clickModal() {
      this.Popup.showModal = !this.Popup.showModal;
      //获取手续费配置
      this.getAccountOut();
    },
    //获取手续费配置
    async getAccountOut() {
      await getAccountOut().then(res => {
        if(!res.data == true){
          return;
        }
        this.form = res.data;
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
    cell({ row, column, rowIndex, columnIndex }) {
      //第二列添加  颜色
      if (columnIndex === 1) {
        return "color:#1890FF";
      }
    },
    // 导出表格所用
    exportExcel() {
      window.location.href = `${process.env.VUE_APP_BASE_API}/finance/accountOut/export?startDate=${this.queryParams.startDate}&endDate=${this.queryParams.endDate}&state=${this.queryParams.state}`;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/style/myUI.less";

.sort-style {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 弹窗设置
.slot-content {
  width: 100%;
  height: 200px;
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
      width: 130px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      margin: 0 10px;
      padding-left: 10px;
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

.task-list {
  .wh(100%, 100%);

  .record {
    .wh(100%, 80px);
    background: @white;
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
      background-image: url("../../assets/images/deep-blue.png");
    }

    .expenditure {
      background-image: url("../../assets/images/light-red.png");
    }

    .balance {
      background-image: url("../../assets/images/light-blue.png");
    }

    .wait {
      background-image: url("../../assets/images/orange.png");
    }
  }

  .bottom {
    height: calc(100% - 160px);
  }
}

.slot-content2 {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  position: relative;

  .slot-middle {
    width: 100%;
    height: 725px;
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
        height: 22px;
        align-items: center;
      }

      .itemRight2 {
        margin-left: 33px;
        min-height: 22px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 25px;
        display: flex;
        align-items: flex-start;
        justify-content: center;

        .changeVip {
          width: 60px;
          height: 32px;
          background: rgba(24, 144, 255, 1);
          border-radius: 4px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
          margin-left: 20px;
          margin-right: 10px;
        }

        .chexiaoVip {
          width: 60px;
          height: 32px;
          background: #999999;
          border-radius: 4px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fff;
        }
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
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;

        .textarea {
          width: 770px;
          height: 114px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.15);
        }

        p {
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 25px;
        }
      }
    }
  }

  .slot-btns {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 52px;
    display: flex;
    justify-content: flex-start;
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
      margin-left: 8px;
    }

    .ok {
      background: #1890ff;
      box-sizing: 1px solid #1890ff;
      color: #ffffff;
    }
  }
}

.task-list .top .top-right .left-btn {
  .wh(116px, 32px);
}

.task-list .top .top-right .right-btn {
  .wh(88px, 32px);
  background: @blue;
  color: @white;
}

.el-pagination {
  margin-top: 0;
  padding-top: 20px;
  box-sizing: border-box;
  background: @white;
}
</style>