import shortId from "shortid";
import Mock from "../mock";

const notifications = [
  {
    id: shortId.generate(),
    heading: "Message",
    icon: { name: "chat", color: "primary" },
    timestamp: 1570702802573,
    title: "New message from Devid",
    subtitle: "Hello, Any progress...",
    path: "chat",
  },
  {
    id: shortId.generate(),
    heading: "Alert",
    icon: { name: "notifications", color: "error" },
    timestamp: 1570702702573,
    title: "Server overloaded",
    subtitle: "Traffice reached 2M",
    path: "page-layouts/user-profile",
  },
  {
    id: shortId.generate(),
    heading: "Message",
    icon: { name: "chat", color: "primary" },
    timestamp: 1570502502573,
    title: "New message from Goustove",
    subtitle: "Hello, send me details",
    path: "chat",
  },
];

Mock.onGet("/api/notification").reply(() => {
  return [200, notifications];
});

Mock.onPost("/api/notification/add").reply((config) => {
  if (config.data) {
    notifications.push(JSON.parse(config.data));
  }

  return [200, notifications];
});

Mock.onPost("/api/notification/delete").reply((config) => {
  let { id } = JSON.parse(config.data);
  const response = notifications.filter((notification) => notification.id !== id);

  return [200, response];
});

Mock.onPost("/api/notification/delete-all").reply(() => {
  return [200, []];
});
