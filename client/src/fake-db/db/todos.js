import * as _ from "lodash";
import Mock from "../mock";

const db = {
  todos: [
    {
      id: "1",
      title: "API problem",
      note: "API is malfunctioning. kindly fix it",
      important: true,
      starred: true,
      done: false,
      read: false,
      selected: false,
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      tag: [1, 2],
    },
    {
      id: "2",
      title: "Mobile problem",
      note: "Mobile is malfunctioning. fix it",
      important: false,
      starred: false,
      done: true,
      read: true,
      selected: false,
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      tag: [2],
    },
    {
      id: "3",
      title: "API problem",
      note: "API is malfunctioning. fix it",
      important: false,
      starred: false,
      done: true,
      read: false,
      selected: false,
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      tag: [1],
    },
    {
      id: "4",
      title: "API problem",
      note: "API is malfunctioning. fix it",
      important: false,
      starred: false,
      done: false,
      read: true,
      selected: false,
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      tag: [1, 2, 3],
    },
    {
      id: "5",
      title: "API problem",
      note: "API is malfunctioning. fix it",
      important: false,
      starred: false,
      done: true,
      read: false,
      selected: false,
      startDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      tag: [1],
    },
  ],

  tags: [
    { id: 1, name: "frontend" },
    { id: 2, name: "backend" },
    { id: 3, name: "API" },
    { id: 4, name: "issue" },
    { id: 5, name: "mobile" },
  ],
};

Mock.onGet("/api/todo/all").reply(() => {
  const response = db.todos;
  return [200, response];
});

Mock.onGet("/api/todo/tag").reply(() => {
  const response = db.tags;
  return [200, response];
});

Mock.onGet("/api/todo").reply((config) => {
  const id = config.data;

  const response = db.todos.find((todo) => todo.id === id);
  return [200, response];
});

Mock.onPost("/api/todo/reorder").reply((config) => {
  let { todoList } = JSON.parse(config.data);

  db.todos = [...todoList];
  let response = db.todos;
  return [200, response];
});

Mock.onPost("/api/todo/add").reply((config) => {
  let { todo } = JSON.parse(config.data);
  db.todos.push({ ...todo });
  let response = db.todos;
  return [200, response];
});

Mock.onPost("/api/todo/tag/add").reply((config) => {
  let { tag } = JSON.parse(config.data);
  db.tags.push({ ...tag });
  return [200, tag];
});

Mock.onPost("/api/todo/update").reply((config) => {
  let { todo } = JSON.parse(config.data);

  db.todos.map((t, index) => {
    if (t.id === todo.id) {
      db.todos[index] = { ...todo };
    }
    return "dummy value";
  });

  return [200, todo];
});

Mock.onPost("/api/todo/delete").reply((config) => {
  let { todo } = JSON.parse(config.data);
  _.remove(db.todos, (t) => t.id === todo.id);
  let response = db.todos;
  return [200, response];
});

Mock.onPost("/api/todo/tag/delete").reply((config) => {
  let { tag } = JSON.parse(config.data);
  _.remove(db.tags, (t) => t.id === tag.id);

  let response = db.tags;
  return [200, response];
});
