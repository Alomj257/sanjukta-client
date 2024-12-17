import React from 'react';
import DataTable from 'react-data-table-component';

const customStyles = {
  headCells: {
    style: {
      backgroundColor: '#dad8d8',
      color: 'black',
      fontSize: '17px',
      fontWeight: '600',
      minHeight: '50px',
    }

  },
  rows: {
    style: {
      minHeight: '55px',
    },
  },
}

const CustomDataTable = ({ columns, data}) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      customStyles = {customStyles}
      pagination
      sortable
      highlightOnHover
      responsive
    />
  );
};

export default CustomDataTable;
