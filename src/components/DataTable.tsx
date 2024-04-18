import React from 'react';

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

function DataTable({ data }: { data: TData }) {
  const headers = Object.keys(getHeaders(data)[0]);

  const arr = getHeaders(data);

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
