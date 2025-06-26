<template>
  <panel-Header :route="route"></panel-Header>
  <div class="btns">
    <el-button :icon="Plus" type="primary" size="small" @click="open(null)"
      >新增</el-button
    >
    <el-popconfirm
      title="是否确定删除"
      confirm-button-text="是"
      cancel-button-text="否"
      icon-color="#626AEF"
      :icon="InfoFilled"
      @confirm="confirmEvent"
    >
      <template #reference>
        <el-button
          :icon="Delete"
          type="danger"
          size="small"
          @click="handleDelete"
          >删除</el-button
        >
      </template>
    </el-popconfirm>
  </div>

  <el-table
    :data="tableData.list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55px"></el-table-column>
    <el-table-column prop="id" label="id"> </el-table-column>
    <el-table-column prop="name" label="昵称"> </el-table-column>
    <el-table-column label="头像">
      <template #default="scope">
        <el-image
          :src="scope.row.avatar"
          style="width: 50px; height: 50px"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === "0" ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号"> </el-table-column>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag type="scope.row.active ? 'success' : 'danger' ">{{
          scope.row.active ? "正常" : "失效"
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间">
      <template #default="scope">
        <div class="time">
          <el-icon><Clock /></el-icon>
          <span>{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页逻辑 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="tableData.total"
      size="small"
      :page-count="Math.ceil(tableData.total / paginationData.pageSize)"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogFromVisible"
    :before-close="beforeClose"
    title="陪护师添加"
    width="500px"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rule"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入昵称"
          required
        ></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button
          v-if="!form.avatar"
          type="primary"
          @click="dialogImgVisible = true"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        ></el-image>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeCloseImg"
    title="选择图片"
    width="680px"
  >
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectIndex = index"
      >
        <div v-if="selectIndex === index" class="select">
          <el-icon> <Check></Check></el-icon>
        </div>
        <el-image style="width: 148; height: 148px" :src="item.url"></el-image>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImg()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { useRoute } from "vue-router";
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from "@/api/index";
import { ref, reactive, onMounted, nextTick } from "vue";
import { Plus, Check, InfoFilled, Delete } from "@element-plus/icons-vue";
onMounted(() => {
  photoList().then((res) => {
    fileList.value = res.data.data;
    console.log(res);
  });
  getListData();
});
const route = useRoute();
// 数据弹窗
const dialogFromVisible = ref(false);
const beforeClose = () => {
  dialogFromVisible.value = false;
  if (formRef.value) {
    formRef.value.resetFields(); // 重置表单
  }
};
const formRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const rule = [
  {
    name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    avatar: [{ required: true, message: "请选择头像" }],
    sex: [{ required: true, message: "请选择性别", trigger: "change" }],
    mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  },
];
// 打开弹窗
const open = (rowData = {}) => {
  dialogFromVisible.value = true;
  nextTick(() => {
    if (rowData) {
      Object.assign(form, rowData);
    }
  });
};
// 提交表单
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("操作成功！");
          getListData();
          beforeClose();
          console.log(data);
        } else {
          ElMessage.error(data.msg || "操作失败，请稍后再试！");
        }
      });
    } else {
      console.log("error submit", fields);
    }
  });
};

// 图片弹窗
const dialogImgVisible = ref(false);
const beforeCloseImg = () => {
  dialogImgVisible.value = false;
};
// 头像列表
const fileList = ref([]);
const selectIndex = ref(1);
const confirmImg = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisible.value = false;
};

// 分页数据

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const tableData = reactive({
  list: [],
  total: 0,
});
const getListData = () => {
  companionList(paginationData).then((res) => {
    console.log(res);
    const { list, total } = res.data.data;
    tableData.list = list;
    tableData.total = total;
  });
};

// 点击页码
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};
// 点击当前页
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getListData();
};

const selectTableData = ref([]);
// checkbox数据
const handleSelectionChange = (val) => {
  selectTableData.value = val;
  console.log(
    "选中的数据:",
    val.map((item) => item.id)
  );
};
// 删除列表数据逻辑
const confirmEvent = () => {
  if (selectTableData.value.length === 0) {
    return ElMessage.warning("请至少选择一条数据");
  } else {
    deleteCompanion({ id: selectTableData.value }).then((res) => {
      if (res.data.code === 10000) {
        getListData();
        ElMessage.success("删除成功");
      } else {
        ElMessage.error(res.data.msg || "删除失败，请稍后再试！");
      }
    });
  }
};
</script>

<style scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
