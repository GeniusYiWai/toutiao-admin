<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            articleId ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-form
        ref="publishForm"
        :model="article"
        label-width="60px"
        :rules="formRules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"> </el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="350"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            articleId ? "修改" : "发布"
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import Vue from "vue";

import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";
import { uploadImage } from "@/api/image";
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
} from "element-tiptap";
export default {
  name: "Publish",
  components: { "el-tiptap": ElementTiptap },
  data() {
    return {
      channels: [], // 文章频道列表
      article: {
        title: "", // 文章标题
        content: "", // 文章内容
        cover: {
          // 文章封面
          type: 1, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [], // 封面图片的地址
        },
        channel_id: null,
      },
      formRules: {
        title: [
          { required: true, trigger: "blur", message: "请输入文章标题" },
          {
            min: 5,
            max: 30,
            message: "长度在5到30",
          },
        ],
        content: [
          { required: true, message: "请输入文章内容" },
          {
            validator(rule, value, callback) {
              if (value === "<p></p>") {
                callback(new Error("请输入文章内容"));
              } else {
                callback();
              }
            },
          },
        ],
        channel_id: [
          {
            required: true,
            message: "请选择文章频道",
          },
        ],
      },
      //文章id
      articleId: null,
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          uploadRequest(file) {
            const fd = new FormData();
            fd.append("image", file);
            //返回promise对象
            return uploadImage(fd).then((res) => {
              //返回结果
              return res.data.data.url;
            });
          },
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    // 如果路由中有id则请求展示文章内容
    const id = this.$route.query.id;
    if (id) {
      this.articleId = id;
      //加载要修改的文章详情
      this.loadArticle();
    }
    //加载频道
    this.loadChannels();
  },
  mounted() {},
  methods: {
    //获取文章内容
    async loadArticle() {
      const res = await getArticle(this.articleId);
      this.article = res.data.data;
    },
    //发布文章
    onPublish(draft) {
      this.$refs.publishForm.validate(async (valid) => {
        //验证失败
        if (!valid) {
          return;
        } else {
          // 如果是修改文章则执行修改操作
          //判断是否有文章id传入
          if (this.articleId) {
            const res = await updateArticle(
              this.articleId,
              this.article,
              draft
            );
            this.$message.success("修改成功");
            this.$router.push("/article");
          } else {
            const res = await addArticle(this.article, draft);
            this.$message.success("发布成功");
          }
        }
      });
    },
    //加载频道
    async loadChannels() {
      const res = await getArticleChannels();
      this.channels = res.data.data.channels;
    },
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style scoped lang='less'>
</style>