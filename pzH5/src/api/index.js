import request from "@/utils/request";
export default {
  login(data) {
    return request.post("/login", data);
  },
  // 首页数据
  index() {
    return request.get("/Index/index");
  },
  // 陪护师列表
  h5Companion() {
    return request.get("/h5/companion");
  },
  // 创建订单
  createOrder(data) {
    return request.post("/createOrder", data);
  },
  // 订单列表
  orderList(params) {
    return request.get("/order/list", { params });
  },
  // 订单详情
  orderDetail(params) {
    return request.get("/order/detail", { params });
  },
};
