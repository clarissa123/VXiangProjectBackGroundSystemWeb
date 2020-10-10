<template>
  <div class="contentBody">
    <div class="slideBody">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <div class="title">
              <img class="titleLogo" src="@/assets/images/rwGl.png" />
              <router-link tag="div" class="titleWen" :to="{name:'taskList'}">课程管理</router-link>
            </div>
          </template>
          <router-link tag="div" class="menuItem" :to="{name:'taskList'}">课程面板</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'taskExamine'}">课程审核</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'typeList'}">分类设置</router-link>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <div class="title">
              <img class="titleLogo" src="@/assets/images/cwGl.png" />
              <router-link tag="div" class="titleWen" :to="{name:'financeRecord'}">财务管理</router-link>
            </div>
          </template>
          <router-link tag="div" class="menuItem" :to="{name:'financeRecord'}">流水记录</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'financeApply'}">提现记录</router-link>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <div class="title">
              <img class="titleLogo" src="@/assets/images/spGl.png" />
              <router-link tag="div" class="titleWen" :to="{name:'taobaoList'}">商品管理</router-link>
            </div>
          </template>
          <router-link tag="div" class="menuItem" :to="{name:'taobaoList'}">淘宝平台</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'jdList'}">京东平台</router-link>
        </el-collapse-item>
        <el-collapse-item name="4">
          <template slot="title">
            <div class="title">
              <img class="titleLogo" src="@/assets/images/appGl.png" />
              <router-link tag="div" class="titleWen" :to="{name:'courseManagementList'}">APP管理</router-link>
            </div>
          </template>
          <router-link tag="div" class="menuItem2" :to="{name:'courseManagementList'}">
            <el-collapse v-model="childrenActiveNames2" accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="title2">
                    <div class="menuItem2">教程管理</div>
                  </div>
                </template>
                <router-link
                  tag="div"
                  class="menuItem extra"
                  :to="{name:'courseManagementList'}"
                >教程列表</router-link>
                <router-link
                  tag="div"
                  class="menuItem extra"
                  :to="{name:'courseManagementType'}"
                >分类管理</router-link>
              </el-collapse-item>
            </el-collapse>
          </router-link>
          <router-link tag="div" class="menuItem2" :to="{name:'scriptManagementList'}">
            <el-collapse v-model="childrenActiveNames3" accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="title2">
                    <div class="menuItem2">脚本管理</div>
                  </div>
                </template>
                <router-link
                  tag="div"
                  class="menuItem extra"
                  :to="{name:'scriptManagementList'}"
                >脚本列表</router-link>
                <router-link
                  tag="div"
                  class="menuItem extra"
                  :to="{name:'scriptManagementType'}"
                >分类管理</router-link>
              </el-collapse-item>
            </el-collapse>
          </router-link>
          <router-link tag="div" class="menuItem" :to="{name:'bannerManagement'}">banner管理</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'kfManagement'}">客服设置</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'tgManagement'}">推广设置</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'hotSearchManagement'}">热搜设置</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'drbManagement'}">达人榜设置</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'xieyi'}">协议&制度</router-link>
        </el-collapse-item>
        <el-collapse-item name="5">
          <template slot="title">
            <div class="title">
              <img class="titleLogo" src="@/assets/images/xtGl.png" />
              <router-link tag="div" class="titleWen" :to="{name:'systemUserHt'}">系统管理</router-link>
            </div>
          </template>
          <router-link tag="div" class="menuItem2" :to="{name:'systemUserHt'}">
            <el-collapse v-model="childrenActiveNames" accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="title2">
                    <div class="menuItem2">用户管理</div>
                  </div>
                </template>
                <router-link tag="div" class="menuItem extra" :to="{name:'systemUserHt'}">后台用户</router-link>
                <router-link tag="div" class="menuItem extra" :to="{name:'systemUserApp'}">APP用户</router-link>
              </el-collapse-item>
            </el-collapse>
          </router-link>
          <router-link tag="div" class="menuItem" :to="{name:'systemVip'}">课程级别管理</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'systemMember'}">会员设置</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'systemDistribution'}">消息管理</router-link>
          <router-link tag="div" class="menuItem" :to="{name:'rizhiList'}">日志管理</router-link>
        </el-collapse-item>
      </el-collapse>
    </div>
    <slot name="record"></slot>
    <div class="rightBody">
      <router-view v-if="isRouterAlive"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "slide",
  provide() {
    return {
      reload: this.reload
    };
  },
  mounted() {
  },
  data() {
    return {
      isRouterAlive: true,
      activeNames: 1, // 折叠菜单显示项
      childrenActiveNames: 1,
      childrenActiveNames2: 1,
      childrenActiveNames3: 1
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.contentBody {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  font-family: "PingFang Medium";
  font-weight: 400;

  /deep/ .menuItem2 .el-collapse {
    border-bottom: none;
  }

  /deep/ .menuItem2 .el-collapse-item {
  }

  /deep/ .menuItem2 .el-collapse-item__header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px !important;
    color: #222222;
    min-height: 40px !important;
    font-size: 14px;
    text-align: center;
    font-family: "PingFang Medium";
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
  }

  /deep/ .menuItem2 .el-collapse-item__content {
    padding-bottom: 0;
  }

  /deep/ .menuItem2 .el-collapse {
    height: 100%;
  }

  /deep/ .el-collapse-item__header {
    border-bottom: none;
  }

  /deep/ .el-collapse-item__header {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70px;
    color: #222222;

    font-size: 14px;
    font-family: "PingFang Medium";
    font-weight: 400;
    color: rgba(34, 34, 34, 1);
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }

  .title {
    width: 200px;
    display: flex;
    align-items: center;
    position: relative;
    margin-left: 45px;

    .titleLogo {
      width: 19px;
      height: 19px;
      position: relative;
      margin-right: 19px;
    }
  }

  .title2 {
    width: 100%;
    height: 40px;
  }

  .menuItem2 {
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }

  /deep/ .el-collapse-item__header .el-collapse-item__arrow {
    font-size: 15px;
  }

  .menuItem {
    width: 100%;
    padding: 0 50px 0 70px;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    color: rgba(102, 102, 102, 1);

    &:hover {
      /* background: rgba(102, 102, 102, 1); */
      background: transparent;
      color: #000000;
    }

    &.active {
      background: #1890ff;
      color: rgba(255, 255, 255, 1);
    }
  }

  .menuItem.extra {
    padding-left: 95px;
  }

  .slideBody {
    width: 240px;
    height: 100%;
    background: #fff;
    overflow-y: scroll;
  }

  .rightBody {
    max-width: 100%;
    height: calc(100% - 40px);
    flex: 1;
    margin: 20px;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
</style>