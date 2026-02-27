import { Order, OrderItem } from "@/lib/order.service";

export type { OrderItem };
export type LocalOrder = Order & { localItems: OrderItem[] };
