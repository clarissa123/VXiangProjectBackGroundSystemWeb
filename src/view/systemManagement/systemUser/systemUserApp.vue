<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-select class="select" v-model="vipId" placeholder="所有课程类型" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select class="select" v-model="memberId" placeholder="所有会员级别" clearable>
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-date-picker class="date" v-model="value2" type="daterange" align="left" unlink-panels
          start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions" @change="changeTime"
          format="yyyy 年 MM 月 dd 日" clearable></el-date-picker>
        <el-input size="small" placeholder="搜索用户ID" clearable suffix-icon="el-icon-search" v-model="idNum"></el-input>
        <el-button class="search-btn" @click="toSeach">搜索</el-button>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" style="margin-right: 0;" @click="exportLoge">导出用户</el-button>
      </div>
    </Top>
    <div class="bottom">
      <div class="table-container">
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          class="table" :data="tableData" style="width: 100%" :row-class-name="tableRowClassName"
          :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column align="center" prop="idNum" label="用户ID"></el-table-column>
          <el-table-column align="center" prop="parentId" label="上级用户ID"></el-table-column>
          <el-table-column align="center" label="昵称">
            <template slot-scope="scope">
              <span v-show="scope.row.isEnable == 1" style="color:#1890FF">{{scope.row.name}}</span>
              <span v-show="scope.row.isEnable == 0">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="phone" label="电话"></el-table-column>
          <el-table-column align="center" label="团队信息">
            <template slot-scope="scope">
              <p>直推人数:{{scope.row.teamInfo.countOne}}</p>
              <p>间推人数{{scope.row.teamInfo.countTwo}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收入信息">
            <template slot-scope="scope" width="200">
              <p>历史总收入:{{scope.row.accountInfo.totalIncr}}</p>
              <p>已提现金额:{{scope.row.accountInfo.totalDecr}}</p>
              <p>余额:{{scope.row.accountInfo.balance}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" width="100" label="会员等级">
            <template slot-scope="scope">
              <span>{{scope.row.memberId | filterVip }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="videoAlready" label="课程类型">
            <template slot-scope="scope">
              <span>{{scope.row.vipList | filterVip2 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="注册时间" sortable></el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="scope">
              <span>{{scope.row.remark || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作">
            <template slot-scope="scope">
              <span v-show="scope.row.isEnable == 1" class="update-btn cursor"
                @click="openModal(scope.row.id)">查看</span>
              <span v-show="scope.row.isEnable == 0">查看</span>
              <span class="dot">|</span>
              <el-dropdown>
                <span class="el-dropdown-link more-btn cursor">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown" style="{width:'88px',height:'88px',padding: 0}">
                  <el-dropdown-item v-if="scope.row.isEnable==1" @click.native="toChangeVip3(scope.row)">课程调整
                  </el-dropdown-item>
                  <el-dropdown-item disabled v-if="scope.row.isEnable==0">课程调整</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.isEnable==1" @click.native="toChangeVip4(scope.row)">课程撤销
                  </el-dropdown-item>
                  <el-dropdown-item disabled v-if="scope.row.isEnable==0">课程撤销</el-dropdown-item>
                  <el-dropdown-item @click.native="toChangeUser(scope.row)" v-if="scope.row.isEnable==1">禁用该用户
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="ChangeUser(scope.row)" v-if="scope.row.isEnable==0">解除禁用
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
          @pageChange="pageChange"></Pagination>
      </div>
    </div>
    <!-- 查看 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="closeModal" v-if="Popup.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item">
            <div class="itemLeft">用户ID ：</div>
            <div class="itemRight">{{detailInfor.idNum}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">昵称 ：</div>
            <div class="itemRight">{{detailInfor.name}}</div>
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
            <div class="itemLeft">上级用户ID：</div>
            <div class="itemRight">{{detailInfor.parentId==0?"":detailInfor.parentId}}</div>
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
            <div class="itemLeft">课程级别：</div>
            <div class="itemRight2">
              {{detailInfor.vipList | filterVip2}}
              <div class="changeVip cursor" @click="toChangeVip(detailInfor)">充值</div>
              <div class="chexiaoVip cursor" @click="toChangeVip4(detailInfor)">撤销</div>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">会员等级：</div>
            <div class="itemRight">{{detailInfor.memberId |filterVip}}</div>
          </div>
          <div class="item">
            <div class="itemLeft">备注：</div>
            <div class="itemRight">
              <textarea class="textarea" v-model="detailInfor.remark" name id cols="30" rows="10"></textarea>
            </div>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn ok cursor" @click="saveModal(detailInfor)">保存</div>
          <div class="btn cancel cursor" @click="delModal">取消</div>
        </div>
      </div>
    </Popup>

    <!-- VIP调整 -->
    <Popup :showModal="PopupTwo.showModal" :width="PopupTwo.width" :height="PopupTwo.height" :title="PopupTwo.title"
      @close="closeModal2" v-if="PopupTwo.showModal">
      <div class="slot-content2">
        <div class="slot-middle">
          <div class="item">
            <div class="title">用户ID：</div>
            <div class="content">{{detailVip.id2}}</div>
          </div>
          <div class="item" v-if="detailVip.list.length>0">
            <div class="title">购买课程：</div>
            <el-radio-group class="content" v-model="radio">
              <el-radio class="selectItem" :label="item.id" :key="index" v-for="(item,index) in detailVip.list">
                {{item.name}}: ￥{{item.price}}</el-radio>
            </el-radio-group>
          </div>
          <div class="item" v-else>
            <div class="title2">暂无可购买课程</div>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn ok cursor" @click="saveModal2(detailVip)" v-if="detailVip.list.length>0">确定</div>
          <div class="btn cancel cursor" @click="delModal2">取消</div>
        </div>
      </div>
    </Popup>

    <!-- VIP调整 -->
    <Popup :showModal="PopupThree.showModal" :width="PopupThree.width" :height="PopupTwo.height"
      :title="PopupThree.title" @close="closeModal3" v-if="PopupThree.showModal">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <div class="title">用户ID：</div>
            <div class="content">{{detailVip.id2}}</div>
          </div>
          <div class="item" v-if="detailVip.list.length>0">
            <div class="title">购买课程：</div>
            <el-radio-group class="content" v-model="radio">
              <el-radio class="selectItem" :label="item.id" :key="index" v-for="(item,index) in detailVip.list">
                {{item.name}}: ￥{{item.price}}</el-radio>
            </el-radio-group>
          </div>
          <div class="item" v-else>
            <div class="title2">暂无可购买的课程</div>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn ok cursor" @click="saveModal3(detailVip)" v-if="detailVip.list.length>0">确定</div>
          <div class="btn cancel cursor" @click="delModal3">取消</div>
        </div>
      </div>
    </Popup>
    <!-- VIP撤销 -->
    <Popup :showModal="PopupFour.showModal" :width="PopupFour.width" :height="PopupTwo.height" :title="PopupFour.title"
      @close="closeModal4" v-if="PopupFour.showModal">
      <div class="slot-content-w">
        <div class="slot-middle">
          <div class="item">
            <div class="title">用户ID：</div>
            <div class="content">{{detailVipChe.id3}}</div>
          </div>
          <div class="item" v-if="detailVipChe.list.length>0">
            <div class="title">撤销课程：</div>
            <el-radio-group class="content" v-model="radio">
              <el-radio class="selectItem" :label="item.id" :key="index" v-for="(item,index) in detailVipChe.list">
                {{item.name}}: ￥{{item.price}}</el-radio>
            </el-radio-group>
          </div>
          <div class="item" v-else>
            <div class="title2">暂无可撤销的课程</div>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn ok cursor" @click="saveModal4(detailVipChe)" v-if="detailVipChe.list.length>0">确定</div>
          <div class="btn cancel cursor" @click="delModal4">取消</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    appList,
    buyVip,
    listBuyVip,
    listVip,
    remark,
    ChangeUser,
    UserUse,
    lockVip
  } from "@/api/systemManagement/systemUser/systemUserApp.js";
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
        detailVip: {},
        detailInfor: {},
        detailVipChe: {},
        idNum: '',
        vipId: '',
        memberId: '',
        radio: 0,
        // 弹窗的属性
        Popup: {
          width: 960,
          height: 844,
          showModal: false,
          title: "用户详情"
        },
        PopupTwo: {
          width: 380,
          height: 310,
          showModal: false,
          title: "课程购买"
        },
        PopupThree: {
          width: 380,
          height: 310,
          showModal: false,
          title: "课程购买"
        },
        PopupFour: {
          width: 380,
          height: 310,
          showModal: false,
          title: "课程撤销"
        },
        //下拉菜单选择器
        options: [],
        options2: [{
            value: 1,
            label: "青铜"
          },
          {
            value: 2,
            label: "白银"
          },
          {
            value: 3,
            label: "黄金"
          },
          {
            value: 4,
            label: "钻石"
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
        value2: ["", ""],
        timeArr: ['',''],
        //搜索框
        input1: "",

        //表格
        tableData: [],
        loading: false,
        id: '',
        //搜索参数
        queryParams: {
          pageNum: 1, //当前页数
          pageSize: 10 //每页显示多少条
        },
        //分页
        total: 0, //总条数
        hide: true,
        background: true
      };
    },
    mounted() {
      this.getVipList();
      this.getList();
    },
    filters: {
      filterVip(val) {
        var name = "";
        switch (val) {
          case 1:
            name = "青铜";
            break;
          case 2:
            name = "白银";
            break;
          case 3:
            name = "黄金";
            break;
          case 4:
            name = "钻石";
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
      tableRowClassName({
        row,
        rowIndex
      }) {
        if (row.isEnable == 0) {
          return 'warning-row'
        }
        return ""
      },
      ChangeUser(data) {
        this.$confirm('是否解除禁用该用户？', '提示', {}).then(() => {
          UserUse({
            phone: data.phone
          }).then(res => {
            if (res.code == 1) {
              this.$message({
                message: "解除成功",
                type: "success"
              });
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          })
        }).catch(() => {
          console.log('cancle')
        });
      },
      toChangeUser(data) {
        this.$confirm('是否禁用该用户？', '提示', {}).then(() => {
          ChangeUser({
            phone: data.phone
          }).then(res => {
            if (res.code == 1) {
              this.$message({
                message: "禁用成功",
                type: "success"
              });
              this.getList();
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          })
        }).catch(() => {
          console.log('cancle')
        });
      },
      exportLoge() {
        window.location.href =
          `${process.env.VUE_APP_BASE_API}/userInfo/export?startTime=${this.timeArr[0]}&endTime=${this.timeArr[1]}&idNum=${this.idNum}&memberId=${this.memberId}&vipId=${this.vipId}`
        // window.location.href = `${process.env.VUE_APP_BASE_API}/userInfo/export/all`
      },
      indexMethod(index) {
        return (
          index + 1 + (this.queryParams.pageNum - 1) * this.queryParams.pageSize
        );
      },
      //分页
      pageChange(item) {
        this.queryParams.pageNum = item.page_index;
        this.queryParams.pageSize = item.page_limit;
        this.getList(this.queryParams);
      },
      async saveModal2(item) {
        // 掉接口
        var obj = {
          userId: item.id,
          vipId: this.radio
        };
        var result = await buyVip(obj);
        this.PopupTwo.showModal = false;
        this.detailVip = {};
        this.detailInfor = {};
        var obj = {
          idNum: item.id
        };
        // this.loading = true;
        var result = await appList(obj).then(res => {
          this.detailInfor = res.data[0];
          this.Popup.showModal = true;
        });
      },
      value2: ["", ""],
      timeArr: ["",""],
      //搜索框
      input1: "",

      //表格
      tableData: [],
      loading: false,
      id: '',
      //搜索参数
      queryParams: {
        pageNum: 1, //当前页数
        pageSize: 10 //每页显示多少条
      },
      async saveModal3(item) {
        // 掉接口
        var obj = {
          userId: item.id,
          vipId: this.radio
        };
        var result = await buyVip(obj);
        this.PopupThree.showModal = false;
        this.detailVip = {};
        this.detailInfor = {};
        this.getList();
      },
      saveModal4(item) {
        // // 掉接口
        var obj = {
          userId: this.id,
          vipId: this.radio
        };
        lockVip(obj).then(res => {
          if (res.code == 1) {
            this.$message({
              message: "撤消成功",
              type: "success"
            });
            this.PopupFour.showModal = false;
            this.getList();
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
      },
      delModal2() {
        this.PopupTwo.showModal = false;
        this.detailVip = {};
        this.Popup.showModal = true;
      },
      delModal3() {
        this.PopupThree.showModal = false;
        this.detailVip = {};
      },
      delModal4() {
        this.PopupFour.showModal = false;
        this.detailVipChe = {};
      },
      toSeach() {
        this.getList();
      },
      async getVipList() {
        var result = await listVip();
        result = result.data;
        result = JSON.parse(
          JSON.stringify(result)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      this.options = result;
    },
    changeTime(val) {
      this.timeArr = [];
      val.forEach((item, index) => {
        item = new Date(item);
        var now = "";
        now = item.getFullYear() + "-"; //读英文就行了
        now = now + (item.getMonth() + 1) + "-"; //取月的时候取的是当前月-1如果想取当前月+1就可以了
        now = now + item.getDate();
        this.timeArr.push(now);
      });
    },
    // 打开/关闭 弹窗
    async openModal(id) {
      //获取详情
      var obj = {
        idNum: id
      };
      var result = await appList(obj).then(res => {
        this.detailInfor = res.data[0];
        this.Popup.showModal = true;
      });
    },
    clearDetail() {
      this.delModal = {};
      this.Popup.showModal = false;
    },
    saveModal(item) {
      // 保存接口
      var obj = {
        id: item.id,
        remark: item.remark
      };
      remark(obj).then(res => {
        if (res.code == 1) {
          this.$message({
            message: "备注成功",
            type: "success"
          });
          this.clearDetail = {};
          this.Popup.showModal = false;
          this.getList();
        }
      })
    },
    delModal() {
      // 清楚数据
      this.clearDetail = {};
      this.Popup.showModal = false;
    },
    closeModal() {
      // 清楚数据
      this.clearDetail = {};
      this.Popup.showModal = false;
    },
    closeModal2() {
      // 清楚数据
      this.PopupTwo.showModal = false;
    },
    closeModal3() {
      // 清楚数据
      this.PopupThree.showModal = false;
    },
    closeModal4() {
      this.PopupFour.showModal = false;
    },
    async toChangeVip2(item) {
      this.Popup.showModal = false;
      // 掉接口
      var obj = {
        userId: item.id
      };
      var result = await listBuyVip(obj);
      this.detailVip.id = item.id;
      this.detailVip.id2 = item.idNum;
      this.detailVip.list = result.data;
      this.PopupThree.showModal = true;
    },
    async toChangeVip3(item) {
      this.Popup.showModal = false;
      // 掉接口
      var obj = {
        userId: item.id
      };
      var result = await listBuyVip(obj);
      this.detailVip.id = item.id;
      this.detailVip.id2 = item.idNum;
      this.detailVip.list = result.data;
      this.PopupThree.showModal = true;
    },
    async toChangeVip4(item) {
      this.Popup.showModal = false;
      this.detailVipChe.id3 = item.id;
      this.id = item.id
      this.detailVipChe.list = item.vipList;
      this.PopupFour.showModal = true;
      // console.log(vipId: this.radio)
    },
    // 调整vip
    async toChangeVip(item) {
      this.Popup.showModal = false;
      // 掉接口
      var obj = {
        userId: item.id
      };
      var result = await listBuyVip(obj);
      this.detailVip.id = item.id;
      this.detailVip.id2 = item.idNum;
      this.detailVip.list = result.data;
      this.PopupTwo.showModal = true;
    },
    closePopupTwo(isOpen) {
      this.PopupTwo.showModal = isOpen;
      // 调接口 重新获取详情
      this.Popup.showModal = true;
    },
    // 关闭弹窗
    closePopup(isOpen) {
      this.Popup.showModal = isOpen;
    },
    async getList() {
      var obj = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        endTime: this.timeArr[1],
        startTime: this.timeArr[0],
        idNum: this.idNum,
        vipId: this.vipId,
        idNum: this.idNum,
        memberId: this.memberId
      };
      var result = await appList(obj).then(res => {
        this.total = Number(res.total);
        this.tableData = res.data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    }
  };
</script>
<style>
  .el-table .warning-row {
    color: #b5b5b5;
  }
</style>

<style lang="less" scoped>
  @import "../../../assets/style/myUI.less";

  // 弹窗设置
  .slot-content2 {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    position: relative;
    height: 255px;
    overflow-y: auto;
    overflow-x: hidden;

    .slot-middle {
      width: 100%;
      padding: 34px 50px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;

      .item {
        min-height: 22px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 19px;

        .title2 {
          width: 100%;
          text-align: center;
        }

        .title {
          width: 70px;
          text-align: start;
          margin-right: 6px;
        }

        .content {
          text-align: left;
          min-height: 22px;
          width: 150px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;

          .selectItem {
            width: 100px;
            height: 22px;
            margin-bottom: 10px;
            text-align: left;
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
        margin-left: 8px;
      }

      .ok {
        background: #1890ff;
        box-sizing: 1px solid #1890ff;
        color: #ffffff;
      }
    }
  }

  .slot-content {
    width: 100%;
    height: 788px;
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

  .slot-content-w {
    height: 255px;
    overflow-y: auto;
    overflow-x: hidden;

    .slot-middle .item .content {
      text-align: left;
    }
  }

  /deep/.el-input--small {
    font-size: 14px;
    .wh(224px, 32px);
    margin-right: 10px;
    vertical-align: middle;
  }

  .task-list .top .top-left .select {
    .wh(140px, 32px);
  }
</style>