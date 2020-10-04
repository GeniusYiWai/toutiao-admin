<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 筛选表单 -->
      <el-form ref="form" label-width="40px" size="small">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-col :span="11">
            <el-date-picker
              v-model="rangeDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <!--
            button 按钮的 click 事件有个默认参数
            当你没有指定参数的时候，它会默认传递一个没用的数据
           -->
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询结果 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ totalCount }}条结果：
      </div>
      <!-- 表格 -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        border
        class="list-table"
        size="mini"
        v-loading="loading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template></el-table-column
        >
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column prop="status" label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到 template 里面 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              icon="el-icon-edit"
              type="primary"
              @click="$router.push(`/publish?id=${scope.row.id}`)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <!--  :total="totalCount" 自动计算 以10条每页默认计算
    可以自定义page-size
    total/page-size
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :disabled="loading"
      @current-change="onCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article";

export default {
  name: "Article",
  components: {},
  data() {
    return {
      //文章列表
      articles: [],
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
      //总数据数量
      totalCount: 0,
      //当前页码
      page: 1,
      //每页展示数量
      pageSize: 10,
      //查询文章的状态 不传就是全部
      status: null,
      //文章频道
      channels: [],
      //查询文章的频道
      channelId: null,
      //范围日期
      rangeDate: null,
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles();
    this.loadChannels();
  },
  mounted() {},
  methods: {
    //加载文章
    async loadArticles(page = 1) {
      this.loading = true;
      const res = await getArticles({
        page, //页码
        per_page: this.pageSize, //每页大小
        status: this.status, //查询文章的状态
        channel_id: this.channelId, //查询文章的频道
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null, // 截止日期
      });
      //total_count: totalCount 重命名
      const { results, total_count: totalCount } = res.data.data;
      this.articles = results;
      this.totalCount = totalCount;
      this.loading = false;
    },
    //加载频道
    async loadChannels() {
      const res = await getArticleChannels();
      this.channels = res.data.data.channels;
    },
    onCurrentChange(page) {
      this.loadArticles(page);
    },
    //删除文章
    onDeleteArticle(articleId) {
      this.$confirm("确认删除吗？", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认执行这里
          deleteArticle(articleId.toString()).then((res) => {
            // 删除成功，更新当前页的文章数据列表
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.loadArticles(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang='less'>
.filter-card {
  margin-bottom: 30px;
}
</style>