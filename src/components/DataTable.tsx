import React from 'react';

import { DataGrid, GridColDef, GridFilterModel, GridToolbar } from '@mui/x-data-grid';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import { TData } from '@/utils/typings.d';
import { deepFlattenToObject } from '@/utils/lib';
import { TableCellComponent } from '@/components/Table/TableCellComponent';

const getHeaders = (data: TData) => {
  let headers = data.ids.map((id) => {
    const obj = deepFlattenToObject(data.entities[id]);

    return obj;
  });

  return headers;
};

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160
  }
];

// Function to flatten nested objects
function flattenObject(obj, parentKey = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}

// Function to convert data to table format
function convertToTableFormat(data) {
  const flattenedData = flattenObject(data);
  return [flattenedData]; // Convert to an array with a single row for simplicity
}

function DataTable({ data }: { data: TData }) {
  const id = data.ids[0];

  // Convert data to table format
  const tableData = convertToTableFormat(data.entities[id]);

  // Output tableData to console
  console.log('table data', tableData);

  // console.log('Object.keys(getHeaders(data)[0]', Object.keys(getHeaders(data)[0]));
  let headers = Object.keys(getHeaders(data)[0]);

  // if (headers.length > 10) {
  //   headers = headers.slice(0, 10);
  // }

  // console.log('headers1:_', headers);

  const arr = getHeaders(data);

  // return (
  //   <div style={{ height: 400, width: '100%' }}>
  //     {/* <DataGrid
  //       rows={[]}
  //       columns={headers}
  //       slots={{
  //         toolbar: GridToolbar
  //       }}
  //       // filterModel={filterModel}
  //       // onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
  //     /> */}
  //   </div>
  // );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={`${index.toString()}`}>{header.toUpperCase()}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {arr.map((obj: any, index) => {
              return (
                <TableRow key={index}>
                  {headers.map((header, index) => {
                    let value = obj[header];

                    if (typeof value === 'number' || typeof value === 'boolean') {
                      value = value.toString();
                    }

                    return <TableCellComponent key={`${index.toString()}`} text={value ?? ''} />;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default DataTable;
