import { Fragment, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";
import { monthDiff, getDaysInMonth } from "../../utils/dateFunctions";
import { months } from "../../utils/constants";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/joy/Typography";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import NotebookGanttComponent from "./NotebookGantt_Component";

export default function GanttChartTest({
  timeRange,
  tasks,
  setTasks,
  taskDurations,
  setTaskDurations,
  notebookData,
  ganttUnfoldList,
}) {
  const [contextMenu, setContextMenu] = useState(null);
  const handleContextMenu = (event, taskId, formattedDate) => {
    event.preventDefault();
    const mouseX = event.clientX + 2;
    const mouseY = event.clientY - 6;
    setContextMenu({
      mouseX,
      mouseY,
      taskId,
      formattedDate,
    });
  };
  const handleClose = () => {
    setContextMenu(null);
  };

  // for dynamic css styling
  const ganttTimePeriod = {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "minmax(var(--width-Days), 1fr)",
    textAlign: "center",
    height: "var(--cell-height)",
  };

  const ganttTimePeriodSpan = {
    margin: "auto",
  };

  const ganttTimePeriodCell = {
    position: "relative",
    padding: "0.5px 0px",
    display: "flex",
  };

  const [startMonth, setStartMonth] = useState(
    new Date(parseInt(timeRange.fromSelectYear), timeRange.fromSelectMonth)
  );
  const [endMonth, setEndMonth] = useState(
    new Date(parseInt(timeRange.toSelectYear), timeRange.toSelectMonth)
  );

  const numMonths = monthDiff(startMonth, endMonth) + 1;
  let month = new Date(startMonth);

  let monthRows = [];
  let dayRows = [];
  let dayRow = [];

  for (let i = 0; i < numMonths; i++) {
    // create month rows
    monthRows.push(
      <div
        // key={i}
        key={uuidv4()}
        style={{
          ...ganttTimePeriod,
          outline: "none",
          borderBottom: "1px solid var(--color-TimeTable-Border)",
          borderRight: "1px solid var(--color-TimeTable-Border)",
        }}
      >
        <span
          style={{
            ...ganttTimePeriodSpan,
            color: "var(--primary-color)",
            fontWeight: 500,
          }}
        >
          {months[month.getMonth()] + " " + month.getFullYear()}
        </span>
      </div>
    );

    // create day and week rows
    const numDays = getDaysInMonth(month.getFullYear(), month.getMonth() + 1);
    const currYear = month.getFullYear();
    const currMonth = month.getMonth() + 1;

    for (let j = 1; j <= numDays; j++) {
      const currentDate = new Date(currYear, currMonth - 1, j);
      const dayOfWeek = currentDate.getDay();

      dayRow.push(
        <div
          key={uuidv4()}
          style={{
            ...ganttTimePeriod,
            outline: "none",
            borderBottom: "1px solid var(--color-TimeTable-Border)",
            backgroundColor:
              dayOfWeek === 0 || dayOfWeek === 6
                ? "var(--color-Holiday)"
                : "none",
          }}
        >
          <span style={ganttTimePeriodSpan}>{j}</span>
        </div>
      );
    }

    dayRows.push(
      <div
        key={uuidv4()}
        style={{
          ...ganttTimePeriod,
          outline: "none",
          color: "var(--primary-color)",
        }}
      >
        {dayRow}
      </div>
    );

    dayRow = [];
    month.setMonth(month.getMonth() + 1);
  }

  useEffect(() => {
    setStartMonth(
      new Date(parseInt(timeRange.fromSelectYear), timeRange.fromSelectMonth)
    );
    setEndMonth(
      new Date(parseInt(timeRange.toSelectYear), timeRange.toSelectMonth)
    );
  }, [timeRange]);

  return (
    <Fragment>
      <div
        id="gantt-grid-container__time"
        style={{
          gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
          alignContent: "start",
        }}
      >
        {monthRows}
        {dayRows}
        <div
          id="gantt-time-period-cell-container"
          style={{
            gridColumn: "1/-1",
            display: "grid",
          }}
        >
          {notebookData?.map((notebook, index) => {
            return (
              <NotebookGanttComponent
                id={notebook.id}
                key={index}
                notebook={notebook}
                timeRange={timeRange}
                startMonth={startMonth}
                numMonths={numMonths}
                taskDurations={taskDurations}
                setTaskDurations={setTaskDurations}
                ganttTimePeriod={ganttTimePeriod}
                ganttTimePeriodCell={ganttTimePeriodCell}
                ganttUnfoldList={ganttUnfoldList}
              />
            );
          })}
        </div>
      </div>
      {contextMenu && (
        <Menu
          open={true}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MenuItem
            onClick={handleClose}
            sx={{ gap: "5px", color: "var(--primary-color)" }}
          >
            <Brightness1Icon />
            <Typography sx={{ color: "var(--primary-color)" }}>Blue</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ gap: "5px", color: "#fbd07c" }}>
            <Brightness1Icon />
            <Typography sx={{ color: "#fbd07c" }}>Yellow</Typography>
          </MenuItem>
          <MenuItem onClick={handleClose} sx={{ gap: "5px", color: "#43b692" }}>
            <Brightness1Icon />
            <Typography sx={{ color: "#43b692" }}>Green</Typography>
          </MenuItem>
        </Menu>
      )}
      <style>
        {`
        #gantt-grid-container__time {
          display: grid;
          overflow-x: auto;
        }

        .taskDuration:focus {
          outline: 2px solid white;
        }

        .dragging {
          opacity: 0.5;
        }

        .taskRow {
          position: relative;
          z-index: 1;
        }
        
        .taskRow:hover:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          z-index: 2;
        }
      `}
      </style>
    </Fragment>
  );
}
