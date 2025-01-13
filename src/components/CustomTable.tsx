import React, { useCallback, useState, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  TablePagination,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TableProps } from '../types';
import { ROWS_PER_PAGE_OPTIONS, TABLE_CLASSES } from '../constants';

export const CustomTable = <T extends { id: string }>({
  columns,
  rows,
  selectable = false,
  actions = false,
  loading = false,
  onEdit,
  onDelete,
  onRowClick,
}: TableProps<T>): JSX.Element => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [rows]);

  const handleClick = useCallback((id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }, [selected]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);

  const isSelected = useCallback((id: string) => selected.indexOf(id) !== -1, [selected]);

  const TableRowMemo = memo(({ row, index }: { row: T; index: number }) => {
    const isItemSelected = selectable && isSelected(row.id);
    const labelId = `enhanced-table-checkbox-${index}`;

    return (
      <TableRow
        hover
        onClick={(event) => {
          if (selectable) {
            handleClick(row.id);
          } else if (onRowClick) {
            onRowClick(row);
          }
        }}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        className={`
          transition-colors duration-200
          ${theme.palette.mode === 'dark' 
            ? TABLE_CLASSES.row.hover.dark 
            : TABLE_CLASSES.row.hover.light
          }
          ${isItemSelected 
            ? theme.palette.mode === 'dark'
              ? TABLE_CLASSES.row.selected.dark
              : TABLE_CLASSES.row.selected.light
            : ''
          }
        `}
      >
        {selectable && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={isItemSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </TableCell>
        )}
        {columns.map((column) => {
          const value = row[column.id];
          return (
            <TableCell key={column.id} align={column.align}>
              {column.format ? column.format(value) : value}
            </TableCell>
          );
        })}
        {actions && (
          <TableCell align="right">
            <div className="flex justify-end gap-1">
              {onEdit && (
                <Tooltip title="Edit">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                    size="small"
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                    size="small"
                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </TableCell>
        )}
      </TableRow>
    );
  });
  TableRowMemo.displayName = 'TableRow';

  return (
    <Paper 
      elevation={0} 
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        theme.palette.mode === 'dark' 
          ? TABLE_CLASSES.paper.dark
          : TABLE_CLASSES.paper.light
      }`}
    >
      {loading && (
        <LinearProgress 
          className="rounded-t-xl" 
          sx={{ 
            '& .MuiLinearProgress-bar': {
              transition: 'transform 0.5s ease-in-out',
            },
          }} 
        />
      )}
      <TableContainer className="max-h-[600px]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={`font-semibold ${
                    theme.palette.mode === 'dark' 
                      ? TABLE_CLASSES.header.dark
                      : TABLE_CLASSES.header.light
                  }`}
                >
                  {column.label}
                </TableCell>
              ))}
              {actions && <TableCell align="right" style={{ minWidth: 100 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRowMemo key={row.id} row={row} index={index} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className={`border-t ${
          theme.palette.mode === 'dark' 
            ? 'border-gray-700' 
            : 'border-gray-200'
        }`}
      />
    </Paper>
  );
};
