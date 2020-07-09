import React, { useState, useEffect } from 'react';
import API from '../API';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Link } from 'react-router-dom';
import '../styles/Contact.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

function Contacts() {
  const columns = [
    { id: 'firstname', label: 'Prénom', minWidth: 170 },
    { id: 'lastname', label: 'Nom', minWidth: 170 },
    { id: 'phone', label: 'Téléphone', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'id', label: 'Modifier', minWidth: 15 },
    { id: 'id', label: 'Supprimer', minWidth: 15 },
  ];
  
  const [rows, setRows] = useState()
  
  useEffect(() => {
    API.get('/contacts')
      .then(res => res.data)
      .then(data => setRows(data));
  }, [])

  const handleClickDelete = (id) => {
    console.log(id)
    API.delete(`/contacts/${id}`)
    .then(res => {
      setRows(
        rows.filter(row => row.id !== id)
      )
    })
  }


  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if(!rows){
    return <div className='loader'><CircularProgress style={{ width: '70px', height: '70px' }} /></div>
  } else {
    return (
      <div className='contacts-container'>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.label === 'Modifier' ? <Link to={`/contacts/${value}`}><EditIcon color='primary'/></Link> : column.label === 'Supprimer' ? <DeleteForeverIcon className='contacts-icons' style={{ color:"red" }} onClick={() => handleClickDelete(value)}/> : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20, 30, 50 ]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <Link to={`/nouveau-contact`}><AddCircleOutlineIcon className='contacts-icons contacts-icons-add' style={{ color:"green", fontSize: 50 }}/></Link>
      </div>
    );
  }
}

export default Contacts;
