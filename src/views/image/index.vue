<template>
  <div class="image-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" size="mini">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogIploadVisible = true"
          >上传素材</el-button
        >
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :md="6"
          :lg="4"
          v-for="(image, index) in images"
          :key="index"
        >
          <el-image
            style="height: 100px"
            :src="image.url"
            fit="cover"
          ></el-image>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogIploadVisible"
      append-to-body
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages } from "@/api/image";
export default {
  name: "ImageIndex",
  components: {},
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      //是否查看收藏 true查看
      collect: false,
      //素材数据
      images: [],
      dialogIploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadImages();
  },
  mounted() {},
  methods: {
    async loadImages(collect) {
      const res = await getImages({
        collect: collect ? collect : this.collect,
      });
      this.images = res.data.data.results;
    },
    //图片上传成功
    onUploadSuccess() {
      this.dialogIploadVisible = false;
      this.loadImages(false);
    },
  },
  watch: {
    collect() {
      this.loadImages();
    },
  },
};
</script>

<style scoped lang='less'>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
</style>