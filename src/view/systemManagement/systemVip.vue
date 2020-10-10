<template>
  <div class="task-list">
    <Top>
      <div class="top-left" slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{name:'systemUserHt'}">
            <img class="appManage" src="@/assets/images/home.png" />
            系统管理
          </el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'systemVip'}">
            <img class="appManage" src="@/assets/images/file.png" />课程级别管理
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="top-right" slot="btn">
        <el-button class="btn left-btn cursor" @click="addModal">添加课程</el-button>
      </div>
    </Top>
    <div class="bottom">
      <div class="table-container">
        <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
          class="table" :data="tableData" style="width: 100%" :cell-style="cell"
          :default-sort="{prop: 'date', order: 'descending'}" @selection-change="handleSelectionChange"
          :header-cell-style="{height:'54px',borderRadius:'4px 4px 0px 0px',background:'#FCF9FC',fontWeight:'500',color:'rgba(0,0,0,0.85)',fontFamily:'PingFangSC-Regular'}">
          <el-table-column type="index" label="编号" align="center" :index="indexMethod"></el-table-column>
          <el-table-column label="LOGO" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt class="logoItem" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="subTitle" label="副标题" align="center"></el-table-column>
          <el-table-column prop="price" label="充值金额" align="center"></el-table-column>
          <el-table-column prop="taskNum" label="领取数量(次/天)" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch class="my-switch" v-model="scope.row.used" inactive-color="#D3DCE6"
                @change="changeStatus(scope.row.id)" v-if="scope.row.used==false"></el-switch>
              <p style="color:rgba(0,0,0,0.4);" v-if="scope.row.used==false">
                一旦启用
                <br />无法更改
              </p>
              <span v-else>启用</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间" sortable align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <span class="update-btn cursor" @click="toDetail(scope.row)">查看</span>
              <span class="dot">|</span>
              <span class="delete-btn cursor" @click="toEdit(scope.row)">修改</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :background="background" :hide="hide" :pageSize="queryParams.pageSize" :total="total"
          @pageChange="pageChange"></Pagination>
      </div>
    </div>
    <Popup :showModal="Popup.showModal" :width="Popup.width" :height="Popup.height"
      :title="isEdit == true? '编辑课程':'查看课程'" @close="closeModal" v-if="Popup.showModal">
      <div class="slot-content">
        <div class="slot-middle">
          <div class="item">
            <div class="itemLeft">logo：</div>
            <div class="itemRight2">
              <div class="imgBg" v-if="!detailData.logo"></div>
              <img class="imgBg2" v-else :src="detailData.logo" />
              <el-upload class="avatar-uploader uploadBody" :action="uploadActionUrl" :show-file-list="false"
                :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload" :data="extraParams"
                v-if="isEdit == true">
                <el-button class="uploadBtn" type="primary">选择图片</el-button>
                <div v-if="!detailData.logo" class="uploadWen">尺寸：80px * 80px</div>
              </el-upload>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">课程名称：</div>
            <div class="itemRight">
              <input type="text" class="input" v-model="detailData.name" v-if="isEdit == true" />
              <span v-else>{{detailData.name}}</span>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">副标题：</div>
            <div class="itemRight">
              <input type="text" class="input" v-model="detailData.subTitle" v-if="isEdit == true" />
              <span v-else>{{detailData.subTitle}}</span>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">排序：</div>
            <div class="itemRight">
              <input type="text" class="input" style="width:100px" v-model="detailData.sort" v-if="isEdit == true" />
              <span v-else>{{detailData.sort}}</span>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">充值金额：</div>
            <div class="itemRight" style="width:200px">
              <input type="text" class="input" style="width:100px" v-model="detailData.price" v-if="isEdit == true" />
              <span v-else>{{detailData.price}}</span>
              <div class="rightWen">元</div>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">领取数量：</div>
            <div class="itemRight" style="width:200px">
              <input type="text" class="input" style="width:100px" v-model="detailData.taskNum" v-if="isEdit == true" />
              <span v-else>{{detailData.taskNum}}</span>
              <div class="rightWen">次/天</div>
            </div>
          </div>
          <div class="item item1">
            <div class="itemLeft">佣金返利：</div>
            <div class="itemRight">
              <div class="itemRightItem">
                <div class="yjWen">青铜会员</div>
              </div>
              <div class="itemRightItem">
                <div class="yjWen">白银会员</div>
              </div>
              <div class="itemRightItem">
                <div class="yjWen">黄金会员</div>
              </div>
              <div class="itemRightItem">
                <div class="yjWen">钻石会员</div>
              </div>
            </div>
          </div>
          <div class="item item2">
            <div class="itemLeft">直推：</div>
            <div class="itemRight">
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageQt" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageQt}}</span>
              </div>
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageBy" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageBy}}</span>
              </div>
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageHj" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageHj}}</span>
              </div>
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageZs" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageZs}}</span>
              </div>
            </div>
          </div>
          <div class="item item3">
            <div class="itemLeft">间推：</div>
            <div class="itemRight">
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageQtTo" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageQtTo}}</span>
              </div>
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageByTo" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageByTo}}</span>
              </div>
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageHjTo" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageHjTo}}</span>
              </div>
              <div class="itemRightItem">
                <input class="yjInput" type="text" v-model="detailData.brokerageZsTo" v-if="isEdit == true" />
                <span v-else>{{detailData.brokerageZsTo}}</span>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="itemLeft">背景图片</div>
            <div class="itemRight">
              <img class="imgBg3" v-if="isEdit != true" :src="detailData.backgroundImage"
                style="width: '372px';height: '130px';" />
              <el-upload class="avatar-uploader bannerBg" :action="uploadActionUrl" :show-file-list="false"
                :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload" :data="extraParams" v-else>
                <img v-if="detailData.backgroundImage" :src="detailData.backgroundImage" class="avatar" />
                <el-button v-else size="small" class="uploadBtn" type="primary">点击上传</el-button>
                <div v-if="!detailData.backgroundImage" class="uploadWen">尺寸：372px * 130px</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="slot-btns">
          <div class="btn ok cursor" v-if="isEdit == true" @click="saveModal(detailData)">确定</div>
          <div class="btn cancel cursor" @click="cancelModal">取消</div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
  import {
    add,
    del,
    edit,
    getDetail,
    list,
    used,
    changeStatus
  } from "@/api/systemManagement/systemVip.js";
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
        extraParams: {
          fileType: 5 //普通图片
        },
        detailData: {},
        imageUrl1: "",
        imageUrl2: "",
        Popup: {
          width: 550,
          height: 780,
          showModal: false,
          title: "添加课程"
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
        value2: "",
        uploadActionUrl: process.env.VUE_APP_BASE_API + "/common/uploadFile",
        //表格
        tableData: [],
        loading: false,

        //搜索参数
        queryParams: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页显示多少条
        },
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
    methods: {
      indexMethod(index) {
        return (
          index + 1 + (this.queryParams.currentPage - 1) * this.queryParams.pageSize
        );
      },
      //分页
      pageChange(item) {
        this.queryParams.currentPage = item.page_index;
        this.queryParams.pageSize = item.page_limit;
        this.getList(this.queryParams);
      },
      //改变发布状态
      async changeStatus(id) {
        await changeStatus({
          id: id
        }).then(res => {
          this.$message({
            message: "修改状态成功",
            type: "success"
          });
          this.getList(this.queryParams);
        });
      },
      closeModal() {
        // 清楚数据
        this.Popup.showModal = false;
        (this.detailData = {}), (this.valueTwo = null);
        this.valueOne = null;
        this.isEdit = false;
      },
      cancelModal() {
        // 同上
        this.Popup.showModal = false;
        this.detailData = {};
        this.valueTwo = null;
        this.valueOne = null;
        this.isEdit = false;
      },
      async saveModal(item) {
        // 保存
        if (this.isAdd) {
          var obj = {
            backgroundImage: this.valueTwo,
            brokerageBy: Number(this.detailData.brokerageBy),
            brokerageByTo: Number(this.detailData.brokerageByTo),
            brokerageHj: Number(this.detailData.brokerageHj),
            brokerageHjTo: Number(this.detailData.brokerageHjTo),
            brokerageQt: Number(this.detailData.brokerageQt),
            brokerageQtTo: Number(this.detailData.brokerageQtTo),
            brokerageZs: Number(this.detailData.brokerageZs),
            brokerageZsTo: Number(this.detailData.brokerageZsTo),
            logo: this.valueOne,
            name: this.detailData.name,
            price: Number(this.detailData.price),
            sort: Number(this.detailData.sort),
            subTitle: this.detailData.subTitle,
            taskNum: Number(this.detailData.taskNum)
          };
          var isOk = true;
          for (var i in obj) {
            if (!obj[i] == true) {
              this.$message({
                message: "请输入完整信息",
                type: "error"
              });
              return;
            }
          }
          await add(obj).then(res => {
            if (res.code == 1) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              // 清除
              this.Popup.showModal = false;
              this.isAdd = false;
              this.closeModal();
              // 取列表
              this.getList(this.queryParams);
            }
          });
        } else {
          if (this.valueOne == null || this.valueTwo == null) {
            if (item.backgroundImage.indexOf("vshare/file/") != -1) {
              var search = "normalImage";
              var str = item.backgroundImage;
              var start = str.indexOf(search);
              this.valueTwo = str.substr(start, start + search.length);
            }
            if (item.logo.indexOf("vshare/file/") != -1) {
              var search = "normalImage";
              var str = item.logo;
              var start = str.indexOf(search);
              this.valueOne = str.substr(start, start + search.length);
            }
          }

          var obj = {
            backgroundImage: this.valueTwo,
            brokerageBy: Number(this.detailData.brokerageBy),
            brokerageByTo: Number(this.detailData.brokerageByTo),
            brokerageHj: Number(this.detailData.brokerageHj),
            brokerageHjTo: Number(this.detailData.brokerageHjTo),
            brokerageQt: Number(this.detailData.brokerageQt),
            brokerageQtTo: Number(this.detailData.brokerageQtTo),
            brokerageZs: Number(this.detailData.brokerageZs),
            brokerageZsTo: Number(this.detailData.brokerageZsTo),
            id: this.detailData.id,
            logo: this.valueOne,
            name: this.detailData.name,
            price: Number(this.detailData.price),
            sort: Number(this.detailData.sort),
            subTitle: this.detailData.subTitle,
            taskNum: Number(this.detailData.taskNum)
          };
          await edit(obj).then(res => {
            if (res.code == 1) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              // 清除
              this.Popup.showModal = false;
              // 取列表
              this.closeModal();
              this.getList(this.queryParams);
            }
          });
        }
      },
      async toEdit(item) {
        this.isEdit = true;
        // 掉接口
        var obj = {
          id: item.id
        };
        var result = await getDetail(obj);
        this.detailData = result.data;
        this.detailData.logo =
          process.env.VUE_APP_BASE_API + "/vshare/file/" + this.detailData.logo;
        this.detailData.backgroundImage =
          process.env.VUE_APP_BASE_API +
          "/vshare/file/" +
          this.detailData.backgroundImage;
        //打开
        this.Popup.showModal = true;
      },
      async toDetail(item) {
        // 同上
        this.isEdit = false;
        var obj = {
          id: item.id
        };
        var result = await getDetail(obj);
        this.detailData = result.data;
        this.detailData.logo =
          process.env.VUE_APP_BASE_API + "/vshare/file/" + this.detailData.logo;
        this.detailData.backgroundImage =
          process.env.VUE_APP_BASE_API +
          "/vshare/file/" +
          this.detailData.backgroundImage;
        //打开
        this.Popup.showModal = true;
      },
      // 上传成功
      handleAvatarSuccess1(res, file) {
        this.$set(this.detailData, "logo", URL.createObjectURL(file.raw));
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.valueOne = res.data;
        }
      },
      handleAvatarSuccess2(res, file) {
        this.$set(
          this.detailData,
          "backgroundImage",
          URL.createObjectURL(file.raw)
        );
        if (res.code == 1) {
          this.$message({
            message: "上传图片成功",
            type: "success"
          });
          this.valueTwo = res.data;
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
      // 打开/关闭 弹窗
      addModal() {
        this.isEdit = true;
        this.Popup.showModal = true;
        this.isAdd = true;
      },
      async getList(params) {
        this.loading = true;
        var result = await list(params).then(res => {
          if (res.code == '1') {
            this.loading = false;
            this.total = Number(res.data.total);
            res.data.rows.forEach((item, index) => {
              item.logo =
                process.env.VUE_APP_BASE_API + "/vshare/file/" + item.logo;
              item.backgroundImage =
                process.env.VUE_APP_BASE_API +
                "/vshare/file/" +
                item.backgroundImage;
            });
            this.tableData = res.data.rows;
          }

        });
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
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "../../assets/style/myUI.less";

  .logoItem {
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }

  .slot-content {
    width: 100%;
    height: 725px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    position: relative;

    .slot-middle {
      width: 100%;
      height: 555px;
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

          .imgBg {
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.15);
          }

          .imgBg2 {
            width: 80px;
            height: 80px;
            border-radius: 4px;
          }

          .uploadBody {
            width: 124px;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 20px;
          }

          /deep/.avatar-uploader .el-upload {
            border: none;
          }

          .uploadBtn {
            width: 106px;
            height: 32px;
            margin-left: 10px;
            display: flex;
            justify-content: center;
            align-items: center;

            .btn {
              width: 106px;
              height: 32px;
              background: rgba(24, 144, 255, 1);
              border-radius: 4px;
              line-height: 32px;
              text-align: center;
            }

            .wen {
              margin-top: 10px;
              width: 96px;
              height: 22px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.45);
              line-height: 22px;
            }
          }
        }

        .itemRight {
          margin-left: 33px;
          min-height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;

          /deep/.bannerBg .avatar {
            .wh(372px, 130px);
          }

          .bannerBg {
            height: 130px;
            width: 372px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.02);
            margin-top: 20px;

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

          .itemRightItem {
            width: 88px;
            margin-right: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .yjWen {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.65);
              line-height: 40px;
            }

            .yjInput {
              width: 88px;
              height: 32px;
              background: rgba(255, 255, 255, 1);
              border-radius: 4px;
              border: 1px solid rgba(0, 0, 0, 0.15);
              text-align: center;
            }
          }

          .input {
            width: 280px;
            height: 40px;
            padding-left: 10px;
            padding-right: 10px;
            background: rgba(255, 255, 255, 1);
            border-radius: 4px;
            border: 1px solid rgba(0, 0, 0, 0.15);
          }

          .rightWen {
            margin-left: 10px;
            height: 22px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 22px;
          }

          .uploadBtn {
            width: 106px;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;

            .btn {
              width: 106px;
              height: 32px;
              background: rgba(24, 144, 255, 1);
              border-radius: 4px;
              line-height: 32px;
              text-align: center;
            }

            .wen {
              margin-top: 10px;
              width: 96px;
              height: 22px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.45);
              line-height: 22px;
            }
          }

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

          img.imgBg3 {
            .wh(372px, 130px);
          }
        }
      }

      .item1 {
        margin-bottom: 0;
      }

      .item2 {
        margin-bottom: 0;
      }

      .item3 {
        margin-bottom: 0;
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
    .wh(74px, 32px);
  }

  /deep/.el-breadcrumb__inner {
    img {
      display: inline-block;
      margin-right: 8px;
    }
  }
</style>