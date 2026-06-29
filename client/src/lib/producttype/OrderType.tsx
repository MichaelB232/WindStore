export interface OrderProductSummary {
  name: string;
  imageUrl: string;
}

export interface OrderItemConfigSummary {
  configName: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  configId: number | null;
  quantity: number;
  unitPrice: string;
  product: OrderProductSummary;
  productConfig: OrderItemConfigSummary | null;
}

export interface OrderPayment {
  id: number;
  orderId: number;
  paymentMethodId: number;
  amount: string;
  status: string;
  transactionId: string | null;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: string;
  status: string;
  createdAt?: string;
  orderItems: OrderItem[];
  payments: OrderPayment[];
}

export interface CheckoutResult {
  orderId: number;
  token: string;
  redirectUrl: string;
}

export interface CheckoutPayload {
  productId: number;
  configId: number;
  quantity: number;
}
