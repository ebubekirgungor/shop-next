import { DeliveryStatus } from "@/lib/enums";

export const dateOptions: Object = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

export const statusNames = new Map([
  [null, { title: "All", icon: "" }],
  [DeliveryStatus.DELIVERED, { title: "Delivered", icon: "check" }],
  [DeliveryStatus.IN_PROGRESS, { title: "In progress", icon: "progress" }],
  [DeliveryStatus.RETURNED, { title: "Returned", icon: "return" }],
  [DeliveryStatus.CANCELED, { title: "Canceled", icon: "close" }],
]);
