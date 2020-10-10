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
      <div class="table-container">
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255, 255, 1)" class="table" :data="tableData" style="width: 1640"
          :cell-style="cell" :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
          <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="bannerUrl" label="预览图" align="center">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.bannerUrl" width="301" height="113" />
            </template>
          </el-table-column>
          <el-table-column prop="linkType" label="跳转方式" :formatter="formatter" align="center">
            <template slot-scope="scope">
              <p v-html="formatter(scope.row.linkType)"></p>
              <p v-if="scope.row.linkUrl">
                <span>详情：</span>
                {{scope.row.linkUrl}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间" sortable align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="update-btn cursor" @click="clickModal3(scope.row)">查看</span>
              <span class="dot">|</span>
              <el-dropdown>
                <span class="el-dropdown-link more-btn cursor">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown" style="{width:'88px',height:'88px',padding: 0}">
                  <el-dropdown-item @click.native="clickEditModal(true,scope.row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="rowDelete(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增 -->
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
          @pageChange="pageChange"></Pagination>
      </div>
    </div>
    <!-- 查看 -->
    <Popup :showModal="Popup3.showModal" :width="Popup3.width" :height="Popup3.height" :title="Popup3.title"
      @close="clickModal3" v-if="Popup3.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item bannerItem">
            <div class="itemName">Banner：</div>
            <img class="img" :src="imageUrl" alt />
          </div>
          <div class="naTo item">
            <div class="itemName">跳转方式：</div>
            <span>{{valueOne}}</span>
          </div>
          <div class="naTo item" v-if="this.valueThree!=''">
            <div class="itemName">分类详情：</div>
            <span>{{valueThree}}</span>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal3">取消</div>
          <div class="btn ok cursor" @click="clickModal3">确定</div>
        </div>
      </div>
    </Popup>
    <!-- 新增 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal" v-if="Popup.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item bannerItem">
            <div class="itemName">Banner：</div>
            <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
              <div v-if="!imageUrl" class="uploadWen">尺寸：800px * 350px</div>
            </el-upload>
          </div>
          <div class="naTo item">
            <div class="itemName">跳转方式：</div>
            <el-select clearable class="itemSelect" v-model="valueOne" placeholder="请选择" @change="selectOne($event)">
              <el-option v-for="item in optionsOne" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="naTo item" v-if="this.valueOne==2">
            <div class="itemName"></div>
            <el-select clearable class="itemSelect" v-model="valueThree" placeholder="请选择">
              <el-option v-for="item in optionsThree" :key="item.mainTitle" :label="item.mainTitle"
                :value="item.mainTitle"></el-option>
            </el-select>
          </div>
          <div class="naTo item" v-if="this.valueOne==1">
            <div class="itemName"></div>
            <el-input class="foreignUrl" v-model="valueThree" autocomplete="off"></el-input>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickModal">取消</div>
          <div class="btn ok cursor" @click="addBanner">确定</div>
        </div>
      </div>
    </Popup>
    <!-- 编辑 -->
    <Popup :showModal="Popup2.showModal" :width="Popup2.width" :height="Popup2.height" :title="Popup2.title"
      @close="clickEditModal(false)" v-if="Popup2.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item bannerItem">
            <div class="itemName">Banner：</div>
            <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
              <div v-if="!imageUrl" class="uploadWen">尺寸：800px * 350px</div>
            </el-upload>
          </div>
          <div class="naTo item">
            <div class="itemName">跳转方式：</div>
            <el-select clearable class="itemSelect" v-model="valueOne" placeholder="请选择" @change="selectOne($event)">
              <el-option v-for="item in optionsOne" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="naTo item" v-if="this.valueOne==2">
            <div class="itemName"></div>
            <el-select clearable class="itemSelect" v-model="valueThree" placeholder="请选择">
              <el-option v-for="item in optionsThree" :key="item.mainTitle" :label="item.mainTitle"
                :value="item.mainTitle"></el-option>
            </el-select>
          </div>
          <div class="naTo item" v-if="this.valueOne==1">
            <div class="itemName"></div>
            <el-input class="foreignUrl" v-model="valueThree" autocomplete="off"></el-input>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click="clickEditModal(false)">取消</div>
          <div class="btn ok cursor" @click="clickEdit">确定</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    getbannerList,
    addBanner,
    updateBanner,
    deleteBanner,
    getMainTitle
  } from "@/api/appManagement/bannerManagement.js";
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
          },
          {
            value: "5",
            label: "无"
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
        Popup2: {
          width: 900,
          height: 610,
          showModal: false,
          title: "编辑"
        },
        Popup3: {
          width: 900,
          height: 610,
          showModal: false,
          title: "查看"
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
        this.resetValue();
        this.Popup.showModal = !this.Popup.showModal;
      },
      //编辑- 打开/关闭 弹窗
      clickEditModal(flag, row) {
        if (flag == false) {
          this.Popup2.showModal = false;
        } else {
          this.Popup2.showModal = true;
          this.resetValue();
          this.getMainTitle();
          this.imageUrl = row.bannerUrl;
          this.updateId = row.id;
          // if (row.linkType != '5') {
          //   this.valueOne = row.linkType;
          //   this.valueThree = row.linkUrl;
          // } else {
          //   this.valueOne = '';
          //   this.valueThree = '';
          // }
          this.valueOne = row.linkType;
          this.valueThree = row.linkUrl;
        }

      },
      // 查看- 打开/关闭 弹窗
      clickModal3(row) {
        this.Popup3.showModal = !this.Popup3.showModal;
        this.resetValue();
        this.imageUrl = row.bannerUrl;
        this.valueOne = this.formatter(String(row.linkType));
        this.valueThree = row.linkUrl;
      },
      //table表格 格式化单元格内容
      formatter(linkType) {
        if (linkType == 1) {
          return "外部链接";
        } else if (linkType == 2) {
          return "教程";
        } else if (linkType == 3) {
          return "vip充值";
        } else if (linkType == 4) {
          return "任务中心";
        }else if (linkType == 5) {
          return "不跳转";
        }
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
        this.imageUrl = "";
        this.valueOne = "";
        this.valueTwo = "";
        this.valueThree = "";
      },
      //修改成功提交
      async clickEdit() {
        let params = {
          linkType: this.valueOne == '' ? this.valueOne = '5' : this.valueOne,
          bannerUrl: this.valueTwo,
          linkUrl: this.valueThree,
          id: this.updateId
        };
        await updateBanner(params).then(res => {
          if (res.msg == "成功") {
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

      // 上传成功
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.valueTwo = res.data;
        }
      },
      //上传前的回调函数
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isLt2M;
      },
      //列表首页
      async getList(params) {
        this.loading = true;
        await getbannerList(params).then(res => {
          if (res.msg == '成功') {
            this.loading = false;
            res.data.list.forEach(v => {
              v.bannerUrl =
                process.env.VUE_APP_BASE_API + "/vshare/file/" + v.bannerUrl;
            });
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
        await deleteBanner({
          ids: this.ids
            .map(v => {
              return v.id;
            })
            .join(",")
        }).then(res => {
          if (res.msg == "成功") {
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
      },
      //行内删除
      async rowDelete(id) {
        await deleteBanner({
          ids: id
        }).then(res => {
          if (res.msg == "成功") {
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
      //点击跳转方式 下拉框
      selectOne(event) {
        if (event == 2) {
          this.getMainTitle();
        }
      },
      //banner管理-新增
      async addBanner() {
        let linkUrl = "";
        let params = {
          linkType: this.valueOne == '' ? this.valueOne = '5' : this.valueOne,
          bannerUrl: this.valueTwo,
          linkUrl: this.valueThree
        };

        await addBanner(params).then(res => {
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
      //教程下拉框
      async getMainTitle() {
        await getMainTitle().then(response => {
          if (response.code === 1) {
            this.optionsThree = response.data;
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
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .bannerItem {
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

          /deep/.el-upload .avatar {
            height: 234px;
            width: 710px;
          }

          /deep/.bannerBg .el-upload {
            border: none;
          }

          .uploadBtn {
            width: 106px;
            height: 32px;
            border-radius: 4px;
          }

          .uploadWen {
            height: 22px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;
            margin-top: 10px;
          }
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