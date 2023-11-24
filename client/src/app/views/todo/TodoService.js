import axios from "axios";

export const getAllTodo = () => axios.get("/api/todo/all");

export const getTodoById = (todoId) => axios.get("/api/todo", { data: todoId });

export const reorderTodoList = (todoList) => axios.post("/api/todo/reorder", { todoList });

export const addTodo = (todo) => axios.post("/api/todo/add", { todo });

export const updateTodoById = (todo) => axios.post("/api/todo/update", { todo });

export const deleteTodo = (todo) => axios.post("/api/todo/delete", { todo });

// tag management
export const getAllTodoTag = () => axios.get("/api/todo/tag");

export const addNewTag = (tag) => axios.post("/api/todo/tag/add", { tag });

export const deleteTag = (tag) => axios.post("/api/todo/tag/delete", { tag });
