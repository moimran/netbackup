import React from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface TableHeaderProps {
  title: string;
  subtitle?: string;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  }>;
  onAdd?: () => void;
  addButtonLabel?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  subtitle,
  stats,
  onAdd,
  addButtonLabel = 'Add New',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      {/* Title and Subtitle Section */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #60A5FA, #34D399)'
              : 'linear-gradient(45deg, #2563EB, #059669)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 600 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Stats and Action Button Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: { xs: 'space-between', md: 'flex-end' },
        }}
      >
        {/* Stats */}
        {stats && stats.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {stat.label}:
                </Typography>
                <Chip
                  label={stat.value}
                  color={stat.color || 'default'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderRadius: '6px',
                    minWidth: '60px',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Add Button */}
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
              boxShadow: theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                : '0 4px 12px rgba(37, 99, 235, 0.2)',
              minWidth: '140px',
            }}
          >
            {addButtonLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TableHeader;
