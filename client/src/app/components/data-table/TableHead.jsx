import { Checkbox, TableCell, TableRow, TableSortLabel } from "@mui/material";
import MuiTableHead from "@mui/material/TableHead";

const TableHead = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, showSelect = true } =
    props;

  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <MuiTableHead>
      <TableRow>
        {
          showSelect && (
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                onChange={onSelectAllClick}
                checked={rowCount > 0 && numSelected === rowCount}
                indeterminate={numSelected > 0 && numSelected < rowCount}
              />
            </TableCell>
          )
        }

        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none checkbox" : "normal checkbox"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={(!showSelect && index === 0) ? {paddingLeft: "16px"} : {}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              onClick={createSortHandler(headCell.id)}
              direction={orderBy === headCell.id ? order : "asc"}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
};

// TableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

export default TableHead;
