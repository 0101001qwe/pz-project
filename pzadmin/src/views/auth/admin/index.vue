<template>
  <panel-Header :route="route"></panel-Header>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"> </el-table-column>
    <el-table-column prop="name" label="昵称"> </el-table-column>
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">{{
        permissionName(scope.row.permissions_id)
      }}</template>
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
  <!-- 弹窗 -->
  <el-dialog v-model="dialogVisible" :before-close="beforeClose">
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rule"
    >
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import dayjs from "dayjs";
import { authAdmin, menuSelectlist, updateUser } from "@/api/index";
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const tableData = reactive({
  list: [],
  total: 0,
});
const formRef = ref([]);
const form = reactive({
  name: "",
  permissions_id: "",
});
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form;
      updateUser({ name, permissions_id }).then((res) => {
        if (res.data.code === 10000) {
          dialogVisible.value = false;
          getListData();
        }
      });
    } else {
      console.log("error submit", fields);
    }
  });
};
const route = useRoute();
// 弹窗控制
const dialogVisible = ref(false);
// 点击开启表单
const open = (rowData = {}) => {
  dialogVisible.value = true;
  Object.assign(form, {
    mobile: rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  });
};
// 关闭弹窗的回调
const beforeClose = () => {
  dialogVisible.value = false;
};
onMounted(() => {
  authAdmin(paginationData).then((res) => {
    console.log(res);
    const { list, total } = res.data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
  menuSelectlist().then((res) => {
    console.log(res);
    options.value = res.data.data;
  });
});
// 请求列表封装
const getListData = () => {
  authAdmin(paginationData).then((res) => {
    console.log(res);
    const { list, total } = res.data.data;
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};
// 下拉权限列表
const options = ref([]);

// 根据权限id获取权限名称
const permissionName = (id) => {
  const permission = options.value.find((item) => item.id === id);
  return permission ? permission.name : "超级管理员";
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

const rule = reactive({
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  permissions_id: [
    { required: true, message: "请选择菜单权限", trigger: "blur" },
  ],
});
</script>

<style scoped>
.time {
  display: flex;
  align-items: center;
}
</style>
