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
          class="image"
        >
          <el-image
            style="height: 100px"
            :src="image.url"
            fit="cover"
          ></el-image>
          <div class="action-wrap">
            <i
              class="el-icon-star-off"
              :class="{ collect: image.is_collected }"
              @click="onCollectImage(image)"
            ></i>
            <i
              class="el-icon-delete-solid"
              @click="onDeleteImage(image.id, index)"
            ></i>
          </div>
        </el-col>
      </el-row>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        @current-change="onCurrentChange"
        :current-page.sync="page"
      >
      </el-pagination>
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
import { getImages, collectImage, deleteImage } from "@/api/image";
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
      //弹出框
      dialogIploadVisible: false,
      //请求头
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      totalCount: 100,
      pageSize: 20,
      loading: false,
      page: 1,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadImages();
  },
  mounted() {},
  methods: {
    async loadImages(collect, page = 1) {
      this.loading = true;
      this.page = page;
      const res = await getImages({
        collect,
        page: this.page,
      });
      const data = res.data.data;
      this.images = data.results;
      this.totalCount = data.total_count;
      this.loading = false;
    },
    //图片上传成功
    onUploadSuccess() {
      this.dialogIploadVisible = false;
      this.loadImages(false);
      this.$message.success("上传成功");
    },
    //分页
    onCurrentChange(page) {
      this.loadImages(this.collect, page);
    },
    //收藏 取消收藏图片
    async onCollectImage(img) {
      let collect;
      collect = !img.is_collected;
      const res = await collectImage(img.id, collect);
      img.is_collected = collect;
      this.$message.success((collect ? "收藏" : "取消") + "成功");
    },
    //删除图片
    async onDeleteImage(imgId, index) {
      const res = await deleteImage(imgId);
      this.images.splice(index, 1);
      this.$message.success("删除成功");
    },
  },
  watch: {
    collect() {
      this.loadImages(this.collect);
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
.image {
  position: relative;
  .action-wrap {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    color: white;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .collect {
    color: red;
  }
}
</style>