import { useState } from "react";
import { Box, styled, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import TodoList from "./TodoList";

// styled component
const AppTodoRoot = styled(Box)(({ theme }) => ({
  "& .searchBoxHolder": {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "calc(220px - 94px + 30px)",
    [theme.breakpoints.down("sm")]: { height: "calc(220px - 94px -16px + 30px)" },
  },
  "& .searchBox": {
    width: "calc(100% - 60px)",
    [theme.breakpoints.down("sm")]: { width: "calc(100% - 32px)" },
  },
  "& .todoContent": { marginTop: -94 },
}));

const AppTodo = () => {
  const [query, setQuery] = useState("");
  const handleQueryChange = (event) => setQuery(event.target.value);

  return (
    <AppTodoRoot>
      <Box height={220} bgcolor="primary.main">
        <Box className="searchBoxHolder">
          <Box className="searchBox">
            <TextField
              fullWidth
              name="query"
              value={query}
              size="medium"
              variant="outlined"
              onChange={handleQueryChange}
              InputProps={{
                startAdornment: <Search />,
                sx: { outline: "none", borderRadius: 300, background: "white" },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box className="todoContent">
        <TodoList query={query} />
      </Box>
    </AppTodoRoot>
  );
};

export default AppTodo;
