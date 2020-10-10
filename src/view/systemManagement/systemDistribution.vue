<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <el-date-picker class="date" v-model="value1" value-format="yyyy-MM-dd" @change="selectTime" type="daterange"
          align="left" unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="search-btn" @click="search">搜索</el-button>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn" @click="clickModal">添加</el-button>
        <el-button class="btn right-btn" @click="clickDelete">删除</el-button>
      </div>
    </Top>
    <div class="bottom">
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" class="table"
        :data="tableData" style="width: 1640" :cell-style="cell" :default-sort="{prop: 'date', order: 'descending'}"
        @selection-change="handleSelectionChange"
        :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
        <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
        <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
        <el-table-column prop="title" label="提示标题" align="center"></el-table-column>
        <el-table-column prop="message" label="消息详情" align="center"></el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch class="my-switch" v-model="scope.row.enable" inactive-color="#D3DCE6"
              @change="changeStatus($event,scope.row.id)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="发布时间" sortable align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <span class="update-btn cursor" @click="clickModal3(scope.row)">编辑</span>
            <span class="dot">|</span>
            <span class="delete-btn cursor" @click="rowDelete(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增 -->
      <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
        @pageChange="pageChange"></Pagination>
    </div>
    <!-- 新增 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal" v-if="Popup.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item disItem">
            <div class="itemName">提示标题：</div>
            <el-input v-model="title"></el-input>
          </div>
          <div class="naTo item">
            <div class="itemName">提示详情：</div>
            <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="message"></el-input>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal">取消</div>
          <div class="btn ok cursor" @click="addDis">确定</div>
        </div>
      </div>
    </Popup>
    <!-- 编辑 -->
    <Popup :showModal="Popup3.showModal" :width="Popup3.width" :height="Popup3.height" :title="Popup3.title"
      @close="clickModal3" v-if="Popup3.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item disItem">
            <div class="itemName">提示标题：</div>
            <el-input v-model="title"></el-input>
          </div>
          <div class="naTo item">
            <div class="itemName">提示详情：</div>
            <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="message"></el-input>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal3">取消</div>
          <div class="btn ok cursor" @click="clickEdit">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    getDisList,
    updateDis,
    deleteDis,
    addDis
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
            label: "购买课程"
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
          //时间
          createTimeFrom: "",
          createTimeTo: "",
          pageNum: 1, //当前页数
          pageSize: 10 //每页显示多少条
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
        await getDisList(params).then(res => {
          if (res.code == 1) {
            this.loading = false;
            this.tableData = res.data;
            this.tableData = res.data;
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