import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card, Icon, IconButton, MenuItem, styled } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MatxMenu } from "app/components";
import { H2 } from "app/components/Typography";
import { FlexBetween } from "app/components/FlexBox";
import TodoItem from "./TodoItem";
import { getAllTodo, getAllTodoTag, reorderTodoList, updateTodoById } from "./TodoService";
import { Label } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "30px",
  position: "relative",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const ContentBox = styled(FlexBetween)({
  paddingTop: "8px",
  paddingBottom: "8px",
  background: "rgba(0, 0, 0, 0.01)",
});

const filterList = [
  { title: "All", value: null },
  { title: "Read", value: { key: "read", value: true } },
  { title: "Unread", value: { key: "read", value: false } },
  { title: "Done", value: { key: "done", value: true } },
  { title: "Undone", value: { key: "undone", value: false } },
  { title: "Important", value: { key: "important", value: true } },
  { title: "Unimportant", value: { key: "important", value: false } },
  { title: "Starred", value: { key: "starred", value: true } },
  { title: "Unstarred", value: { key: "starred", value: false } },
];

const TodoList = ({ query }) => {
  const navigate = useNavigate();
  const [tagList, setTagList] = useState([]);
  const [isAlive, setIsAlive] = useState(true);
  const [todoList, setTodoList] = useState([]);
  const [filteredTodoList, setFilteredTodoList] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // New Drag and Drop data logic
  const [dragAbleItem, setDragAbleItem] = useState([]);

  const getAllTodoAndTagList = useCallback(async () => {
    let [{ data: todoList }, { data: tagList }] = await Promise.all([
      getAllTodo(),
      getAllTodoTag(),
    ]);

    if (isAlive) {
      setFilteredTodoList(todoList);
      setTodoList(todoList);
      setTagList(tagList);
    }
  }, [isAlive]);

  useEffect(() => {
    let filteredList = [...todoList];

    // filter by search text
    if (query) {
      const searchStr = query.trim().toLowerCase();

      filteredList = filteredList.filter((todo) => {
        if (todo.title.toLowerCase().match(searchStr)) return true;
        if (todo.note.toLowerCase().match(searchStr)) return true;
        return false;
      });
    }

    // filter by select tag
    if (selectedTag) {
      filteredList = filteredList.filter((todo) => todo.tag.includes(selectedTag));
    }

    // filter by property
    if (selectedProperty) {
      filteredList = filteredList.filter(
        (todo) => todo[selectedProperty.key] === selectedProperty.value
      );
    }

    setFilteredTodoList(filteredList);
  }, [query, selectedProperty, selectedTag, todoList]);

  useEffect(() => {
    getAllTodoAndTagList();
    return () => setIsAlive(false);
  }, [getAllTodoAndTagList]);

  const updateTodo = async (todo) => {
    const { data: updatedTodo } = await updateTodoById(todo);

    if (isAlive) {
      let list1 = todoList.map((item) => {
        if (item.id === updatedTodo.id) return updatedTodo;
        return item;
      });

      let list2 = filteredTodoList.map((item) => {
        if (item.id === updatedTodo.id) return updatedTodo;
        return item;
      });

      setTodoList([...list1]);
      setFilteredTodoList([...list2]);
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) return;

    let todoList = reorder(filteredTodoList, result.source.index, result.destination.index);

    let { data } = await reorderTodoList(todoList);

    if (isAlive) {
      setFilteredTodoList(data);
      setTodoList(data);
    }
  };

  // const filterTodoListByProperty = (queryField, queryValue) => {
  //   if (queryField !== "all") {
  //     let list = todoList.filter((todo) => todo[queryField] === queryValue);
  //     setFilteredTodoList(list);
  //   } else {
  //     setFilteredTodoList(todoList);
  //   }
  // };

  const getItems = (count) => {
    return count.map((k, i) => ({
      done: k.done,
      dueDate: k.dueDate,
      id: `${k.id}`,
      important: k.important,
      note: k.note,
      read: k.read,
      selected: k.selected,
      starred: k.starred,
      startDate: k.startDate,
      tag: k.tag,
      title: k.title,
    }));
  };

  useEffect(() => {
    if (filteredTodoList.length > 0) {
      setDragAbleItem(getItems(filteredTodoList));
    }
  }, [filteredTodoList]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const tempItems = reorder(dragAbleItem, result.source.index, result.destination.index);
    setDragAbleItem(tempItems);
  };

  return (
    <StyledCard className="todo">
      <ContentBox>
        <div>
          <MatxMenu
            menuButton={
              <IconButton size="large">
                <Icon>arrow_drop_down</Icon>
              </IconButton>
            }
          >
            {filterList.map((item, i) => (
              <MenuItem key={i} onClick={() => setSelectedProperty(item.value)}>
                {item.title}
              </MenuItem>
            ))}
          </MatxMenu>

          <MatxMenu
            menuButton={
              <IconButton size="large">
                <Label />
              </IconButton>
            }
          >
            <MenuItem sx={{ textTransform: "capitalize" }} onClick={() => setSelectedTag(null)}>
              all
            </MenuItem>

            {tagList.map((tag) => (
              <MenuItem
                key={tag.id}
                sx={{ textTransform: "capitalize" }}
                onClick={() => setSelectedTag(tag.id)}
              >
                {tag.name}
              </MenuItem>
            ))}
          </MatxMenu>
        </div>

        <Box pr={2}>
          <Button variant="contained" color="primary" onClick={() => navigate("/todo/list/add")}>
            Create Todo
          </Button>
        </Box>
      </ContentBox>

      <div className="todo-list">
        {/* Previous Drag and Drop Code Start*/}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {filteredTodoList.map((todo, index) => {
                  return (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                        >
                          <TodoItem
                            key={index}
                            todo={todo}
                            tagList={tagList}
                            updateTodo={updateTodo}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* Previous Drag and Drop Code End*/}

        <Box p={2}>
          <H2>New Drag and Drop Start From Here for testing</H2>
        </Box>

        {/* New Drag and Drop Code Start*/}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {dragAbleItem.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TodoItem
                          key={index}
                          todo={item}
                          tagList={tagList}
                          updateTodo={updateTodo}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* New Drag and Drop Code End*/}
      </div>
    </StyledCard>
  );
};

export default TodoList;
