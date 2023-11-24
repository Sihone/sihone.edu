import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  Hidden,
  Icon,
  IconButton,
  MenuItem,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MatxMenu } from "app/components";
import { themeShadows } from "app/components/MatxTheme/themeColors";
import TagDialog from "./TagDialog";
import { addTodo, deleteTodo, getAllTodoTag, getTodoById, updateTodoById } from "./TodoService";

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  zIndex: 2000,
  background: "#fff",
  borderRadius: "4px",
  boxShadow: themeShadows[5],
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const FlexBox = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
});

const JustifyBox = styled(FlexBox)({
  paddingTop: "8px",
  paddingBottom: "8px",
  justifyContent: "space-between",
  background: "rgba(0, 0, 0, 0.01)",
});

const TodoEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState({
    title: "",
    note: "",
    done: false,
    read: false,
    starred: false,
    important: false,
    startDate: new Date(),
    dueDate: new Date(),
    tag: [],
  });

  const [tagList, setTagList] = useState([]);
  const [shouldOpenTagDialog, setShouldOpenTagDialog] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: tags } = await getAllTodoTag();

    if (id !== "add") {
      const { data: todo } = await getTodoById(id);

      if (!todo) {
        navigate("/todo/list");
        return;
      }

      setTodo(todo);
      setTagList(tags);
    } else {
      setTagList(tags);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // handle add new todo
  const addNewTodo = async () => {
    await addTodo({ ...todo, id: Date.now().toString() });
    navigate("/todo/list");
  };

  // handle update todo
  const updateTodo = async (todo) => {
    await updateTodoById(todo);
    setTodo((state) => ({ ...state, ...todo }));
  };

  // handle get all tag list
  const reloadTagList = async () => {
    const { data } = await getAllTodoTag();
    setTagList(data);
  };

  // handle add new tag in todo
  const addTagInTodo = (id) => {
    if (!todo.tag.includes(id)) {
      setTodo((state) => ({ ...state, tag: [...state.tag, id] }));
    }
  };

  // delete tag from todo item
  const handleTagDelete = (tagId) => {
    const tagList = todo.tag.filter((id) => id !== tagId);
    setTodo((state) => ({
      ...state,
      tag: [...tagList],
    }));

    // updateTodoById({ ...this.state.todo });
  };

  // handle delete todo
  const handleTodoDelete = async () => {
    await deleteTodo(todo);
    navigate("/todo/list");
  };

  // change todo form value
  const handleChange = (event) => {
    event.persist();

    setTodo((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }));
  };

  // handle todo date change
  const handleDateChange = (filedName, date) => {
    setTodo((state) => ({
      ...state,
      [filedName]: date,
    }));
  };

  // handle create todo form submit
  const handleSubmit = (event) => {
    if (id === "add") addNewTodo();
    else updateTodoById(todo).then(() => navigate("/todo/list"));
  };

  const handleTagDialogToggle = () => {
    setShouldOpenTagDialog((state) => !state);
  };

  let { note, done, read, title, starred, dueDate, important, startDate, tag } = todo;

  return (
    <Container>
      <JustifyBox>
        <FlexBox>
          <Link to="/todo/list">
            <IconButton>
              <Icon>arrow_back</Icon>
            </IconButton>
          </Link>

          <Hidden smDown>
            <FormControlLabel
              sx={{ ml: 1 }}
              onChange={() => updateTodo({ ...todo, done: !done })}
              control={<Checkbox checked={done} />}
              label={`Mark As ${done ? "Und" : "D"}one`}
            />
          </Hidden>
        </FlexBox>

        <Box display="flex" flexWrap="wrap">
          <Tooltip title={`Mark As ${read ? "Unr" : "R"}ead`} fontSize="large">
            <IconButton onClick={() => updateTodo({ ...todo, read: !read })}>
              <Icon>{read ? "drafts" : "markunread"}</Icon>
            </IconButton>
          </Tooltip>

          <Tooltip title={`Mark As ${important ? "Uni" : "I"}mportant`} fontSize="large">
            <IconButton onClick={() => updateTodo({ ...todo, important: !important })}>
              <Icon color={important ? "error" : "inherit"}>
                {important ? "error" : "error_outline"}
              </Icon>
            </IconButton>
          </Tooltip>

          <Tooltip title={`Mark As ${starred ? "Uns" : "S"}tarred`} fontSize="large">
            <IconButton onClick={() => updateTodo({ ...todo, starred: !starred })}>
              <Icon color={starred ? "secondary" : "inherit"}>
                {starred ? "star" : "star_outline"}
              </Icon>
            </IconButton>
          </Tooltip>

          <Hidden smDown>
            <Tooltip title="Manage tags" fontSize="large">
              <IconButton onClick={handleTagDialogToggle}>
                <Icon>library_add</Icon>
              </IconButton>
            </Tooltip>
          </Hidden>

          <MatxMenu
            menuButton={
              <Tooltip title="Add tags" fontSize="large">
                <IconButton>
                  <Icon>label</Icon>
                </IconButton>
              </Tooltip>
            }
          >
            {tagList.map((tag) => (
              <MenuItem
                key={tag.id}
                sx={{ textTransform: "capitalize" }}
                onClick={() => addTagInTodo(tag.id)}
              >
                {tag.name}
              </MenuItem>
            ))}
          </MatxMenu>

          <Tooltip title="Delete" fontSize="large">
            <IconButton onClick={handleTodoDelete}>
              <Icon>delete_outline</Icon>
            </IconButton>
          </Tooltip>
        </Box>
      </JustifyBox>

      <Box p={2}>
        {tag.length ? (
          <Box mb={2}>
            {tag.map((tagId) => {
              let tagName = (tagList.find((tag) => tag.id === tagId) || {}).name;
              if (!tagName) return null;
              else
                return (
                  <Chip
                    key={tagId}
                    label={tagName}
                    onDelete={() => handleTagDelete(tagId)}
                    sx={{ mr: 1, textTransform: "capitalize" }}
                  />
                );
            })}
          </Box>
        ) : null}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="text"
            name="title"
            value={title}
            label="Title*"
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            type="text"
            name="note"
            value={note}
            multiline={true}
            label="Put your notes*"
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <DatePicker
                  value={new Date(startDate)}
                  onChange={(date) => handleDateChange("startDate", date)}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      variant="standard"
                      id="mui-pickers-date"
                      label="Start Date*"
                    />
                  )}
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <DatePicker
                  value={new Date(dueDate)}
                  onChange={(date) => handleDateChange("dueDate", date)}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      variant="standard"
                      id="mui-pickers-date"
                      label="End Date*"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Link to="/todo/list">
            <Button variant="outlined" color="secondary" sx={{ mr: 2 }} type="submit">
              cancel
            </Button>
          </Link>

          <Button color="primary" variant="contained" type="submit">
            save
          </Button>
        </form>
      </Box>

      <TagDialog
        open={shouldOpenTagDialog}
        reloadTagList={reloadTagList}
        handleClose={handleTagDialogToggle}
      />
    </Container>
  );
};

export default TodoEditor;
