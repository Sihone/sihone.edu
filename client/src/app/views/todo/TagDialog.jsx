import { useCallback, useEffect, useState } from "react";
import { Box, Button, Dialog, TextField } from "@mui/material";
import { FlexBetween, FlexBox } from "app/components/FlexBox";
import { Span } from "app/components/Typography";
import { generateRandomId } from "app/utils/utils";
import { addNewTag, deleteTag, getAllTodoTag } from "./TodoService";

const TagDialog = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [tagList, setTagList] = useState([]);
  const [isAlive, setIsAlive] = useState(true);

  const loadTagList = useCallback(async () => {
    let { data } = await getAllTodoTag();
    if (isAlive) setTagList(data);
  }, [isAlive]);

  useEffect(() => {
    loadTagList();
    return () => setIsAlive(false);
  }, [loadTagList]);

  useEffect(() => {
    return () => setIsAlive(false);
  }, []);

  const handleChange = (event) => {
    if (event.key === "Enter") {
      handleAddNewTag();
    } else {
      setName(event.target.value);
    }
  };

  const handleAddNewTag = async (event) => {
    if (name.trim() !== "") {
      let { data: tag } = await addNewTag({
        id: generateRandomId(),
        name: name.trim(),
      });

      if (isAlive) {
        let list = [...tagList];
        list.push(tag);

        setTagList(list);
        setName("");
      }
    }
  };

  const handleDeleteTag = async (id) => {
    await deleteTag({ id, name });
    if (isAlive) {
      let list = tagList.filter((tag) => tag.id !== id);
      setTagList([...list]);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs">
      <Box px={2} py={3}>
        <FlexBox alignItems="center">
          <TextField
            value={name}
            size="small"
            label="New tag*"
            variant="outlined"
            onChange={handleChange}
            onKeyDown={handleChange}
            sx={{ flexGrow: 1 }}
          />
          <Box>
            <Button onClick={handleAddNewTag} variant="contained" color="primary">
              Add
            </Button>
          </Box>
        </FlexBox>

        <Box pt={2}>
          {tagList.map((tag, index) => (
            <FlexBetween my={1} key={tag.id}>
              <Span>{index + 1}</Span>
              <Span textTransform="uppercase">{tag.name}</Span>

              <Button
                variant="contained"
                onClickCapture={() => handleDeleteTag(tag.id)}
                sx={{ background: "error.main" }}
              >
                Delete
              </Button>
            </FlexBetween>
          ))}
        </Box>

        <Box pt={2} textAlign="right">
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TagDialog;
