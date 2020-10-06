<template>
  <div class="comment-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-table :data="articles" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="address" label="状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.comment_status ? 'danger' : 'success'"
              size="small"
              @click="onChangeStatus(scope.row)"
              :disabled="scope.row.statusDisabled"
            >
              {{ scope.row.comment_status ? "关闭评论" : "打开评论" }}
            </el-button>
          </template></el-table-column
        >
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :page-size.sync="pageSize"
        :disabled="loading"
        :current-page="page"
        @current-change="onCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="pageSizes"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from "@/api/article";
export default {
  name: "Comment",
  components: {},
  data() {
    return {
      articles: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      pageSizes: [10, 20, 30, 40, 50],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles();
  },
  mounted() {},
  methods: {
    //加载文章
    async loadArticles() {
      this.loading = true;
      const res = await getArticles({
        page: this.page,
        per_page: this.pageSize, //每页大小
        response_type: "comment",
      });
      //total_count: totalCount 重命名
      const { results, total_count: totalCount } = res.data.data;
      this.totalCount = totalCount;
      results.forEach((x) => {
        x.statusDisabled = false;
      });
      this.articles = results;
      this.loading = false;
    },
    onCurrentChange(page) {
      this.page = page;
      this.loadArticles();
    },
    async onChangeStatus(article) {
      article.statusDisabled = true;
      const res = await updateCommentStatus(
        article.id.toString(),
        !article.comment_status
      );
      article.comment_status = !article.comment_status;
      article.statusDisabled = false;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.loadArticles();
    },
  },
};
</script>

<style scoped lang='less'>
</style>