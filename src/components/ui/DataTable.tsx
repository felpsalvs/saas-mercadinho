import { useState } from 'react';
import { motion } from 'framer-motion';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  isLoading
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | ((item: T) => string | number);
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = typeof sortConfig.key === 'function' 
      ? sortConfig.key(a) 
      : a[sortConfig.key];
    const bValue = typeof sortConfig.key === 'function'
      ? sortConfig.key(b)
      : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof T | ((item: T) => string | number)) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                }`}
                onClick={() => column.sortable && requestSort(column.accessor)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick?.(item)}
                className={`${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor])}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 