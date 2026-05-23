import api from "./api";

export function getDashboardSummary(user?: string) {
  return api
    .get("/dashboard/summary", { params: { user } })
    .then((res) => res.data);
}

export function login(username: string, password: string) {
  return api
    .post("/auth/login", { username, password })
    .then((res) => res.data.user);
}

export function getCustomers() {
  return api.get("/customers").then((res) => res.data);
}

export function getProducts() {
  return api.get("/products").then((res) => res.data);
}

export function saveProduct(product: any) {
  return api.post("/products", product).then((res) => res.data);
}

export function updateProductStock(
  productId: number,
  usedQuantity: number,
  orderNumber: string,
) {
  return api
    .post(`/products/${productId}/stock`, {
      ProductID: productId,
      UsedQuantity: usedQuantity,
      OrderNumber: orderNumber,
      CreatedBy: "System",
    })
    .then((res) => res.data);
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

export function createOrder(data: any) {
  return api.post(`/orders`, data).then((res) => res.data);
}

export function getInvoice(orderNumber: string) {
  return getOrder(orderNumber);
}

export function getPayments(orderId: number) {
  return api.get("/payments", { params: { orderId } }).then((res) => res.data);
}

export function savePayment(orderId: number, amountPaid: number) {
  return api.post("/payments", { orderId, amountPaid }).then((res) => res.data);
}

export function saveStatus(data: any) {
  return api.post("/status", data).then((res) => res.data);
}

export function saveStaff(data: any) {
  return api.post("/staff", data).then((res) => res.data);
}

export function getStaff() {
  return api.get("/staff").then((res) => res.data);
}

export function getStatus(orderNumber: string) {
  return api
    .get("/status", { params: { orderNumber } })
    .then((res) => res.data);
}

export function saveMeasurement(data: any) {
  return api.post("/measurements", data).then((res) => res.data);
}

export function getMeasurementList() {
  return api.get("/measurements/list").then((res) => res.data);
}

export function getMeasurementDetails(orderNumber: string) {
  return api.get(`/measurements/${orderNumber}`).then((res) => res.data);
}

export function logout() {
  return api.post("/auth/logout").then((res) => res.data);
}

export function getLookupData() {
  return api.get("/lookups").then((res) => res.data);
}

export function getSubcategories(categoryId: number) {
  return api.get("/lookups/subcategories", { params: { categoryId } }).then((res) => res.data);
}

export function getStockUsageList() {
  return api.get("/products/0/stock").then((res) => res.data);
}

export function deductStock(productId: number, usedQuantity: number, orderNumber: string) {
  return api
    .post(`/products/${productId}/stock`, {
      ProductID: productId,
      UsedQuantity: usedQuantity,
      OrderNumber: orderNumber,
      CreatedBy: "System",
    })
    .then((res) => res.data);
}

export function getProductsByOrderNumber(orderNumber: string) {
  return api.get(`/products/by-order/${orderNumber}`).then((res) => res.data);
}

export function getProductHistory(productId: string) {
  return api.get(`/products/${productId}/history`).then((res) => res.data);
}

export function getProductByQR(code: string) {
  return api.get(`/products/qr/${encodeURIComponent(code)}`).then((res) => res.data);
}

export function updateStockQuantity(
  productId: number,
  quantity: number,
  transactionType: string,
  remarks: string,
  createdBy: string,
) {
  return api
    .put(`/products/${productId}/stock-quantity`, { Quantity: quantity, TransactionType: transactionType, Remarks: remarks, CreatedBy: createdBy })
    .then((res) => res.data);
}

export function extractMeasurementsFromImage(formData: FormData) {
  return api
    .post("/ocr/extract-measurements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
}
