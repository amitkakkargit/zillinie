import api from "./api";

export function getDashboardSummary(user?: string) {
  return api
    .get("/dashboard/summary", { params: { user } })
    .then((res) => res.data);
}

export function getCustomers() {
  return api.get("/customers").then((res) => res.data);
}

export function getProducts() {
  return api.get("/products").then((res) => res.data);
}

export function getProductStock(productId: number) {
  return api.get(`/products/${productId}/stock`).then((res) => res.data);
}

export function getOrders(search = "") {
  return api.get("/orders", { params: { search } }).then((res) => res.data);
}

export function getOrder(orderNumber: string) {
  return api.get(`/orders/${orderNumber}`).then((res) => res.data);
}

export function getPayments(orderId: number) {
  return api.get("/payments", { params: { orderId } }).then((res) => res.data);
}

export function savePayment(orderId: number, amountPaid: number) {
  return api.post("/payments", { orderId, amountPaid }).then((res) => res.data);
}

export function getStaff() {
  return api.get("/staff").then((res) => res.data);
}

export function getStatus(orderNumber: string) {
  return api
    .get("/status", { params: { orderNumber } })
    .then((res) => res.data);
}
