import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";

import FormDialog from "./FormDialog";

export default function ContextItem(props) {
  const [contextMenu, setContextMenu] = React.useState(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  // const handleRenameClick = () => {
  //   setIsEditing(true);
  //   handleClose();
  // };

  return (
    <Box
      onContextMenu={handleContextMenu}
      style={{ cursor: "context-menu" }}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <Typography
        sx={{
          flexWrap: "nowrap",
          paddingLeft: "10px",
          color: "var(--primary-color)",
        }}
      >
        {props.value}
      </Typography>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <FormDialog
          handleClose={handleClose}
          onChange={props.onChange}
          num={props.num}
        />
        <MenuItem onClick={props.handleDelete(props.num)}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}
