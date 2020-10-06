<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updateProfileLoading"
                @click="onUpdateUser"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            id="file"
            type="file"
            ref="file"
            hidden
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img class="preview-image" :src="previewImage" ref="preview-image" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from "@/api/user";

export default {
  name: "SettingsIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      }, // 用户资料
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: "", // 预览图片
      cropper: null, // 裁切器示例
      updatePhotoLoading: false, // 更新用户头像 loading 状态
      updateProfileLoading: false, // 更新基本信息的 loading 状态
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUser();
  },
  mounted() {},
  methods: {
    async onUpdateUser() {
      this.updateProfileLoading = true;
      const res = await updateUserProfile(this.user);
      console.log(res);
      this.$message.success("修改成功");
      this.updateProfileLoading = false;
    },
    async loadUser() {
      const res = await getUserProfile();
      // console.log(res);
      this.user = res.data.data;
    },

    onFileChange(file) {
      console.log(file);
    },

    onDialogOpened() {},

    onDialogClosed() {},

    onUpdatePhoto() {},
  },
};
</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
