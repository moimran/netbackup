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
  Typography,
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
        onClick={(_event) => {
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
            <TableCell key={column.id.toString()} align={column.align}>
              {column.format ? column.format(value, row) : value}
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
      sx={{
        position: 'relative',
        height: 'calc(100vh - 240px)',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTableCell-root': {
          padding: '16px',
          fontSize: '0.875rem',
        },
        '& .MuiTableCell-head': {
          fontWeight: 600,
          backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
          position: 'sticky',
          top: 0,
          zIndex: 2,
        },
        '& .MuiTableRow-root': {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
        '& .MuiTablePagination-root': {
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
        },
      }}
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
      <TableContainer
        sx={{
          flexGrow: 1,
          height: '100%',
          overflow: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        <Table stickyHeader>
          <TableHead
            sx={{
              '& .MuiTableCell-head': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? theme.palette.grey[900]
                  : theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <TableRow>
              {selectable && (
                <TableCell 
                  padding="checkbox"
                  sx={{
                    width: 48,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? theme.palette.grey[900]
                      : theme.palette.grey[50],
                  }}
                >
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id.toString()}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? theme.palette.grey[900]
                      : theme.palette.grey[50],
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {column.label}
                  </Typography>
                </TableCell>
              ))}
              {actions && (
                <TableCell 
                  align="right"
                  sx={{
                    width: 100,
                    backgroundColor: theme.palette.mode === 'dark'
                      ? theme.palette.grey[900]
                      : theme.palette.grey[50],
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Actions
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rows || [])
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
        count={(rows || []).length}
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
