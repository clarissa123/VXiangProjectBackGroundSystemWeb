<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="search">
        <div class="tab tab1 " :class="{active:tabNum===1?true:false}" @click="clickTab(1)">
          <span>图片推广</span>
        </div>
        <div class="tab tab2" :class="{active:tabNum===2?true:false}" @click="clickTab(2)">
          <span>推广文字</span>
        </div>
      </div>
      <!-- 图片推广 -->
      <div class="top-right" slot="btn" v-if="tabNum===1">
        <el-button class="btn left-btn" @click='clickModal1'>添加</el-button>
        <el-button class="btn right-btn" @click='clickDelete'>删除</el-button>
      </div>
      <!-- 文字推广 -->
      <div class="top-right" slot="btn" v-else>
        <el-button class="btn left-btn" @click='jumpToAdd'>添加</el-button>
        <el-button class="btn right-btn" @click='clickDeleteText'>删除</el-button>
      </div>
    </Top>
    <!-- 图片推广 -->
    <div class="bottom" v-if="tabNum===1">
      <div class="table-container">
        <el-table :key=1 v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          class="table" :data="tableData" style="width: 100%" :cell-style="cell"
          :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="selection" v-model="ids" align="center"></el-table-column>
          <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column prop="imageUrl" label="推广图片" align="center">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" width="140" height="205" />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间" sortable align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="cursor update-btn" @click='clickModal2(scope.row)'>查看</span>
              <span class="dot">|</span>
              <el-dropdown>
                <span class="el-dropdown-link more-btn cursor">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown" style="{width:'88px',height:'88px',padding: 0}">
                  <el-dropdown-item @click.native="clickEditModal(scope.row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="rowDelete(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <!-- 图片推广-分页 -->
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total1"
          @pageChange="pageChange">
        </Pagination>
      </div>
    </div>
    <!-- 文字推广 -->
    <div class="bottom" v-else>
      <div class="table-container">
        <el-table :key=2 v-loading="loadingText" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          class="table" :data="tableDataText" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}"
          @selection-change="handleSelectionChangeText"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="selection" v-model="idsText" align="center"></el-table-column>
          <el-table-column type="index" label="编号" align="center" :index="indexMethodText"></el-table-column>
          <el-table-column prop="images" label="推广图片" align="center">
            <!-- 图片的显示 -->
            <template slot-scope="scope">
              <img :src="scope.row.images" width="140" height="205" />
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="content" label="推广文字" align="center"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" sortable align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="update-btn cursor" @click="jumpToEdit(scope.row.id,scope.row)">编辑</span>
              <span class="dot">|</span>
              <span class="update-btn cursor" @click="rowDeleteText(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 文字推广-分页 -->
        <Pagination :background="backgroundText" :hide="hideText" :pageSize="queryParamsText.pageSize" :total="total2"
          @pageChange="pageChangeText">
        </Pagination>
      </div>
    </div>

    <!-- 图片推广弹框-添加 -->
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height" :title="Popup.title"
      @close="clickModal1" v-if="Popup.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item bannerItem">
            <div class="itemName">推广图片</div>
            <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
              <div v-if="!imageUrl" class="uploadWen">尺寸：270px * 410px</div>
            </el-upload>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click='clickModal1'>取消</div>
          <div class="btn ok cursor" @click='addPic'>确定</div>
        </div>
      </div>
    </Popup>
    <!-- 图片推广弹框-查看 -->
    <Popup :showModal="PopupTwo.showModal" :width="PopupTwo.width" :height="PopupTwo.height" :title="PopupTwo.title"
      @close="clickModal2" v-if="PopupTwo.showModal">
      <div class="slot-contentTwo">
        <div class="slot-middleTwo">
          <img class="img" :src="imageUrl" alt="">
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click='clickModal2'>取消</div>
          <div class="btn ok cursor" @click='clickModal2'>确定</div>
        </div>
      </div>
    </Popup>
    <!-- 图片推广弹框-编辑 -->
    <Popup :showModal="PopupThree.showModal" :width="PopupThree.width" :height="PopupThree.height"
      :title="PopupThree.title" @close="clickModal3" v-if="PopupThree.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item bannerItem">
            <div class="itemName">推广图片</div>
            <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
              <div v-if="!imageUrl" class="uploadWen">尺寸：270px * 410px</div>
            </el-upload>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click='clickModal3'>取消</div>
          <div class="btn ok cursor" @click='clickEdit'>确定</div>
        </div>
      </div>
    </Popup>
    <!-- <Popup :showModal="PopupThree.showModal" :width="PopupThree.width" :height="PopupThree.height"
      :title="PopupThree.title" @close="clickModal3" v-if="PopupThree.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item bannerItem">
            <div class="itemName">推广图片</div>
            <el-upload class="bannerBg" :action="uploadActionUrl" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :data="extraParams">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <el-button v-else class="uploadBtn" type="primary">选择图片</el-button>
              <div v-if="!imageUrl" class="uploadWen">尺寸：270px * 410px</div>
            </el-upload>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn cancel cursor" @click='clickModal3'>取消</div>
          <div class="btn ok cursor" @click='clickEdit'>确定</div>
        </div>
      </div>
    </Popup> -->
  </div>
</template>

<script>
  import {
    addPic,
    deletePic,
    getPicList,
    updatePic,
    addText,
    deleteText,
    getTextList,
    updateText
  } from "@/api/appManagement/tgManagement.js";
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
        //图片推广-表格
        tableData: [],
        loading: false,
        //图片推广-上传图片
        extraParams: {
          fileType: 5 //普通图片
        },
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        imageUrl: '',
        valueOne: '',
        //图片推广-删除的id数组
        ids: [],
        //图片推广-分页
        queryParams: {
          pageNum: 1, //当前页数
          pageSize: 8, //每页显示多少条
        },
        total1: 0, //总条数
        hide: true,
        background: true,
        //图片推广-编辑id
        updateId: 0,

        //切换tab页
        tabNum: 1,
        //图片推广-弹框 添加
        Popup: {
          width: 785,
          height: 680,
          showModal: false,
          title: "添加"
        },
        //图片推广-弹框 查看
        PopupTwo: {
          width: 566,
          height: 753,
          showModal: false,
          title: "查看"
        },
        //图片推广-弹框 修改
        PopupThree: {
          width: 785,
          height: 680,
          showModal: false,
          title: "编辑"
        },

        //文字推广-表格
        tableDataText: [],
        loadingText: false,
        //文字推广-上传图片  
        uploadActionUrlText: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        imageUrlText: '',
        valueTwo: '',
        //文字推广-分页
        queryParamsText: {
          pageNum: 1, //当前页数
          pageSize: 8, //每页显示多少条
        },
        total2: 0, //总条数
        hideText: true,
        backgroundText: true,
        //文字推广-删除的id数组
        idsText: [],
        //文字推广-弹框 添加
        PopupText: {
          width: 785,
          height: 680,
          showModal: false,
          title: "添加"
        },
      };
    },
    mounted() {
      //图片推广
      this.getPicList(this.queryParams);
      console.log(process.env);
    },
    methods: {
      indexMethod(index) {
        return (
          index +
          1 +
          (this.queryParams.pageNum - 1) * this.queryParams.pageSize
        );
      },
      indexMethodText(index) {
        return (
          index +
          1 +
          (this.queryParamsText.pageNum - 1) * this.queryParamsText.pageSize
        );
      },
      //图片推广- 打开/关闭 弹窗（图片推广-添加）
      clickModal1() {
        this.Popup.showModal = !this.Popup.showModal;
        this.imageUrl = '';
      },
      //图片推广- 打开/关闭 弹窗（图片推广-查看）
      clickModal2(row) {
        this.PopupTwo.showModal = !this.PopupTwo.showModal;
        this.imageUrl = row.imageUrl;
      },
      //图片推广- 打开/关闭 弹窗（图片推广-编辑）
      clickModal3() {
        this.PopupThree.showModal = !this.PopupThree.showModal;
        if (this.PopupThree.showModal == false) {
          this.valueOne = '';
          this.imageUrl = '';
        }
      },

      //图片推广-新增
      async addPic() {
        let data = {
          imageUrl: this.valueOne
        }
        await addPic(data).then(res => {
          if (res.code == 1) {
            this.Popup.showModal = !this.Popup.showModal;
            this.getPicList(this.queryParams);
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
        })
      },
      //图片推广-批量删除 1
      handleSelectionChange(res) {
        this.ids = res;
      },
      //图片推广-批量删除 2
      clickDelete() {
        this.$confirm('是否确认删除？', '提示', {}).then(() => {
      deletePic({
          ids: this.ids.map(v => {
            return v.id
          }).join(',')
        }).then(res => {
          if (res.code == 1) {
            this.getPicList(this.queryParams);
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
      //图片推广-行内删除
      rowDelete(id) {
      this.$confirm('是否确认删除？', '提示', {}).then(() => {
      deletePic({
          ids: id
        }).then(res => {
          if (res.code == 1) {
            this.getPicList(this.queryParams);
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
      //图片推广-添加跳转
      jumpToAdd() {
        this.$router.push({
          name: 'addTgManagement',
        });
      },

      //图片推广-上传成功
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.valueOne = res.data;
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      //图片推广-列表
      async getPicList(params) {
        this.loading = true;
        var result = await getPicList(params).then(res => {
          if (res.code == 1) {
            this.loading = false;
            res.data.list.forEach(v => {
              v.imageUrl =
                process.env.VUE_APP_BASE_API + "/vshare/file/" + v.imageUrl;
            });
            this.tableData = res.data.list;
            this.total1 = Number(res.data.total);
            // this.queryParams.pageSize = res.data.pageSize;
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
      //图片推广-分页
      pageChange(item) {
        this.queryParams.pageNum = item.page_index;
        // this.queryParams.pageSize = item.page_limit;
        this.getPicList(this.queryParams);
      },
      //图片推广 编辑回显
      clickEditModal(row) {
        this.PopupThree.showModal = !this.PopupThree.showModal;
        this.updateId = row.id;
        this.imageUrl = row.imageUrl;
      },
      //图片推广 编辑提交
      async clickEdit() {
        let data = {
          id: this.updateId,
          imageUrl: this.valueOne
        }
        await updatePic(data).then(res => {
          if (res.code == 1) {
            this.PopupThree.showModal = !this.PopupThree.showModal;
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getPicList(this.queryParams);
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        })
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
      },
      //切换tab页
      clickTab(i) {
        this.tabNum = i;
        this.queryParams.pageNum = 1;
        this.queryParamsText.pageNum = 1;
        if (i == 2) {
          //文字推广
          this.getTextList(this.queryParamsText);
        }
      },

      //文字推广-列表
      async getTextList(params) {
        this.loadingText = true;
        var result = await getTextList(params).then(res => {
          if (res.code == 1) {
            this.loadingText = false;
            res.data.list.forEach(v => {
              v.images =
                process.env.VUE_APP_BASE_API + "/vshare/file/" + v.images;
            });
            this.tableDataText = res.data.list;
            this.total2 = Number(res.data.total);
            // this.queryParamsText.pageSize = res.data.pageSize;
            this.queryParamsText.pageNum = res.data.pageNum;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
        });
      },
      //文字推广-跳转到编辑页面
      jumpToEdit(id, row) {
        this.$router.push({
          name: 'editTgManagement',
          params: {
            id: id,
            row: row,
          }
        });
      },
      //文字推广-批量删除 1
      handleSelectionChangeText(res) {
        this.idsText = res;
      },
      async clickDeleteText() {
        await deleteText({
          ids: this.idsText.map(v => {
            return v.id
          }).join(',')
        }).then(res => {
          if (res.code == 1) {
            this.getTextList(this.queryParamsText);
            this.tabNum = 2;
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
      },
      //行内删除
      async rowDeleteText(id) {
        await deleteText({
          ids: id
        }).then(res => {
          if (res.code == 1) {
            this.getTextList(this.queryParamsText);
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
      },
      //文字推广-分页
      pageChangeText(item) {
        this.queryParamsText.pageNum = item.page_index;
        // this.queryParamsText.pageSize = item.page_limit;
        this.getTextList(this.queryParamsText);
      },

    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  .slot-contentTwo {
    width: 100%;
    height: 698px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    position: relative;

    .slot-middleTwo {
      height: 645px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .img {
        width: 402px;
        height: 589px;
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
      border-top: 1px solid rgba(0, 0, 0, .09);

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
        background: #1890FF;
        box-sizing: 1px solid #1890FF;
        color: #FFFFFF;
      }
    }
  }

  .slot-content {
    width: 100%;
    height: 628px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    position: relative;

    .slot-middle {
      width: 100%;
      height: 575px;
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .bannerItem {
        height: 410px;
        align-items: flex-start;

        .bannerBg {
          height: 100%;
          width: 270px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.02);

          .avatar {
            width: 270px;
            height: 410px;
          }

          .el-upload {
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

      .itemName {
        width: 85px;
        height: 40px;
        text-align: end;
        line-height: 40px;
        margin-right: 10px;
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
      border-top: 1px solid rgba(0, 0, 0, .09);

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
        background: #1890FF;
        box-sizing: 1px solid #1890FF;
        color: #FFFFFF;
      }
    }
  }

  .active {
    border-bottom: 1px solid @blue;
  }

  .top-left {
    display: inline-flex;

    .tab {
      .wh(88px, 46px);
      line-height: 46px;
      font-weight: 500;
      text-align: center;
      color: @blue;
      box-sizing: border-box;
    }
  }

  .task-list .bottom{
    height: calc(100% - 74px);
  }
</style>