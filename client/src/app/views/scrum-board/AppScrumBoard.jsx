import {
  Box,
  Button,
  Card,
  ClickAwayListener,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  styled,
  TextField,
} from "@mui/material";
import { H1 } from "app/components/Typography";
import { addNewBoard, getAllBoard } from "app/redux/slices/scrumSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// styled components
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const H5 = styled("h5")({
  margin: 0,
  fontWeight: "500",
  whiteSpace: "pre-wrap",
  textTransform: "capitalize",
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: 150,
  display: "flex",
  padding: "24px",
  cursor: "pointer",
  alignItems: "center",
  justifyContent: "center",
  "& .textBox": {
    textAlign: "center",
    fontWeight: "500",
    color: theme.palette.primary.main,
  },
}));

const AppScrumBoard = () => {
  const [open, setOpen] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");

  const dispatch = useDispatch();
  const { boardList } = useSelector((state) => state.scrumboard);

  useEffect(() => {
    dispatch(getAllBoard());
  }, [dispatch]);

  const openEditorDialog = (value) => setOpen(value);

  const handleChange = (event) => {
    if (event.key === "Enter" && !event.shiftKey) handleAddNewBoard();
    else setTextFieldValue(event.target.value);
  };

  const handleAddNewBoard = () => {
    let title = textFieldValue.trim();
    if (title !== "") {
      dispatch(addNewBoard(title));
      setTextFieldValue("");
      setOpen(false);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {boardList.map((board) => (
          <Grid key={board.id} item lg={3} md={3} sm={12} xs={12}>
            <Link to={`/scrum-board/${board.id}`}>
              <Card elevation={3} sx={{ p: 3, height: 152, cursor: "pointer" }}>
                <H5>{board.title}</H5>
              </Card>
            </Link>
          </Grid>
        ))}

        <Grid item lg={3} md={3} sm={12} xs={12}>
          {open ? (
            <ClickAwayListener onClickAway={() => openEditorDialog(false)}>
              <Card elevation={3} sx={{ p: 3, height: 152, width: 288 }}>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  variant="outlined"
                  label="Board Title"
                  onChange={handleChange}
                  onKeyDown={handleChange}
                  sx={{ mb: "12px" }}
                  value={textFieldValue}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => openEditorDialog(false)}>
                          <Icon fontSize="small">clear</Icon>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button onClick={handleAddNewBoard} variant="contained" color="primary">
                    Add
                  </Button>
                </Box>
              </Card>
            </ClickAwayListener>
          ) : (
            <StyledCard elevation={3} onClick={() => openEditorDialog(true)}>
              <div className="textBox">
                <H1>+</H1>
                <div>Create New Board</div>
              </div>
            </StyledCard>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppScrumBoard;
