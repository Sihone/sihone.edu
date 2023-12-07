import {
    useMaterialReactTable,
  } from 'material-react-table';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const useMaterialReactTableV2 = ({columns, data, options, exportedFileName, actions, extraComponents}) => {

    const { t } = useTranslation();

    const handleExportRows = (rows) => {
        rows = rows.map((row) => {
          //remove the actions column
          const { actions, ...rest } = row.original;
          row.original = rest;
          return row;
        });
        const doc = new jsPDF();
        const tableData = rows.map((row) => Object.values(row.original));
        const tableHeaders = columns.map((c) => c.header);
    
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
        });
        doc.save('[SEM] ' + exportedFileName + '.pdf');
    };

    

    return useMaterialReactTable({
        columns,
        data,
        enableRowSelection: false,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableDensityToggle: false,
        initialState: {
          density: 'compact',
        },
        localization: {
            hideAll: t("main.hide all"),
            showAll: t("main.show all"),
            showHideSearch: t("main.show hide search"),
            showHideColumns: t("main.show hide columns"),
            toggleFullScreen: t("main.toggle full screen"),
            rowsPerPage: t("main.rows per page"),
            filterByColumn: t("main.filter by column"),
            search: t("main.search"),
            noRecordsFound: t("main.no records found"),
            sortByColumnAsc: t("main.sort by column asc"),
            sortByColumnDesc: t("main.sort by column desc"),
            clearAllFilters: t("main.clear all filters"),
            clearAllSortings: t("main.clear all sortings"),
            sortedByColumnAsc: t("main.sorted by column asc"),
            sortedByColumnDesc: t("main.sorted by column desc"),
            hideColumn: t("main.hide column"),
            clearFilter: t("main.clear filter"),
            clearSort: t("main.clear sort"),
            toggleVisibility: t("main.toggle visibility"),
            clearSearch: t("main.clear search"),
            columnActions: t("main.column actions"),
        },
        renderTopToolbarCustomActions: ({ table }) => (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              padding: '8px',
              flexWrap: 'wrap',
            }}
          >
            {
                extraComponents?.map((component) => {
                    return component;
                })
            }
            <Box
                sx={{
                display: 'flex',
                gap: '16px',
                padding: '8px',
                flexWrap: 'wrap',
                }}
            >
                {
                    actions?.map((action, index) => {
                        return (
                            <Button
                                key={index}
                                onClick={action.onClick}
                                startIcon={action.icon}
                            >
                                {action.label}
                            </Button>
                        )
                    })
                }
                <Button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() =>
                    handleExportRows(table.getPrePaginationRowModel().rows)
                }
                startIcon={<FileDownloadIcon />}
                >
                {t("main.export all")}
                </Button>
                <Button
                disabled={table.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRows(table.getRowModel().rows)}
                startIcon={<FileDownloadIcon />}
                >
                {t("main.export visible")}
                </Button>
            </Box>
          </Box>
        ),
        ...options,
      });
}