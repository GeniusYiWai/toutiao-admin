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
      <el-form ref="form" :model="form" label-width="40px" size="small">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="全部" value="shanghai"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-col :span="11">
            <el-date-picker
              v-model="form.date1"
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
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 查询结果 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">根据筛选条件共查询到 100条结果：</div>
      <!-- 表格 -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        border
        class="list-table"
        size="mini"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
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
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
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
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :total="1000">
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
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },

      //文章列表
      articles: [],
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticles();
  },
  mounted() {},
  methods: {
    async loadArticles() {
      const { data } = await getArticles();
      this.articles = data.data.results;
    },
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style scoped lang='less'>
.filter-card {
  margin-bottom: 30px;
}
</style>