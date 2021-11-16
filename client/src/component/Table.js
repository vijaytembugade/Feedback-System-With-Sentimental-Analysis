import React, { useState } from 'react';
import { useTable } from 'react-table';
import { TableCell } from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: '#cbcbcb',
		color: '#333333 ',
		fontSize: '13px',
		fontWeight: 'bold',
		textAlign: 'center',
		flex: '100 0 auto',
		width: '100px',
		cursor: 'pointer',
		textTransform: 'capitalize',
	},
	body: {
		fontFamily: 'Medium Font',
		color: '#696969',
		fontSize: '13px',
		fontWeight: '400',
		backgroundColor: '#fff',
		padding: '12px !important',
		borderRight: '0 !important',
		textAlign: 'center',
	},
}))(TableCell);
const Table = ({ columns, data }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({ columns, data });

	return (
		<table {...getTableProps()}>
			<TableHead>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column) => (
							<StyledTableCell {...column.getHeaderProps()}>
								{column.render('Header')}
							</StyledTableCell>
						))}
					</tr>
				))}
			</TableHead>
			<TableBody {...getTableBodyProps()}>
				{
					// loop over the rows
					rows.map((row) => {
						prepareRow(row);
						return (
							<TableRow {...row.getRowProps()}>
								{
									// loop over the rows cells
									row.cells.map((cell) => (
										<StyledTableCell {...cell.getCellProps()}>
											{cell.render('Cell')}
										</StyledTableCell>
									))
								}
							</TableRow>
						);
					})
				}
			</TableBody>
		</table>
	);
};

export default Table;
