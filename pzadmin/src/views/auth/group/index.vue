

<template>
  <panel-Header :route="route"></panel-Header>
  <div class="btns">
    <el-button :icon="Plus" type="primary" size="small" @click="open(null)"
      >新增</el-button
    >
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id"> </el-table-column>
    <el-table-column prop="name" label="昵称"> </el-table-column>
    <el-table-column prop="permissionName" label="菜单权限" width="500px ">
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
  <el-dialog v-model="dialogVisible" :before-close="beforeClose">
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rule"
    >
      <el-form-item prop="id">
        <el-input v-show="false" v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称1"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          :data="permissionsData"
          style="max-width: 600px"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
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
import { Plus } from "@element-plus/icons-vue";
import { userGetmenu, userSetmenu, menuList } from "@/api/index";
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
// 表单引用
const formRef = ref(null);
// 树形菜单引用
const treeRef = ref(null);
// 获取当前路由
const route=useRoute()
onMounted(() => {
  userGetmenu().then((res) => {
    permissionsData.value = res.data.data;
  });

  getListData(paginationData);
});

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
//请求列表数据
const getListData = () => {
  menuList(paginationData).then((res) => {
    const { list, total } = res.data.data;
    console.log(list, total);
    tableData.list = list;
    tableData.total = total;
  });
};
// form表单数据
const form = reactive({
  name: "",
  permissions: "",
  id: "",
});

// 列表数据
const tableData = reactive({
  list: [],
  total: 0,
});
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
// 打开弹窗
const open = (rowData = {}) => {
  dialogVisible.value = true;
  // 弹窗打开form是异步的
  nextTick(() => {
    if (rowData) {
      //   form.name = rowData.name;
      //   form.id = rowData.id;
      //   form.permissions = rowData.permissions;
      console.log("打开弹窗时的rowData:", rowData);
      Object.assign(form, {
        id: rowData.id,
        name: rowData.name,
      });
      treeRef.value.setCheckedKeys(rowData.permission);
      console.log("打开弹窗时的form数据:", form);
    }
  });
};
// 树形菜单结构数据
const permissionsData = ref([]);
// 弹窗的显示或者隐藏
const dialogVisible = ref(false);
// 关闭弹窗的回调
const beforeClose = () => {
  dialogVisible.value = false;
  // 重置表单数据
  formRef.value.resetFields();
  // 重置树形菜单数据
  treeRef.value.setCheckedKeys(defaultKeys);
};
// 选中权限
const defaultKeys = [4, 5];

// 表单校验
const rule = reactive({
  name: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
});

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 获取到选择的checkbox数据
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetmenu({
        name: form.name,
        permissions: permissions,
        id: Number(form.id),
      }).then(({ data }) => {
        console.log(data);
        beforeClose();
        getListData();
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
