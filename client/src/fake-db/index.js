import "./db/auth";
import "./db/calendarEvents";
import "./db/chat";
import "./db/ecommerce";
import "./db/inbox";
import "./db/invoice";
import "./db/list";
import "./db/notification";
import "./db/scrumBoard";
import "./db/todos";
import "./db/users";
import Mock from "./mock";

Mock.onAny().passThrough();
