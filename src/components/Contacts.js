import React, { useState, useEffect } from 'react';
import API from '../API';
import '../styles/form.css'
import '../styles/contacts.css';
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
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
  const [currentId, setCurrentId] = useState(null)
  

  useEffect(() => {
    API.get('/contacts')
      .then(res => res.data)
      .then(data => setRows(data));
  }, [])

  const handleClickDelete = () => {
    API.delete(`/contacts/${currentId}`)
      .then(() => {
        setRows(
          rows.filter(row => row.id !== currentId)
        )
        setCurrentId(null)
      })
      handleClose()
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

  // Alert Dialog Box Before Delete
  const [open, setOpen] = useState(false);

  const handleClickOpen = (id) => {
    setCurrentId(id)
    setOpen(true);
  };
  const handleClose = () => {
    setCurrentId(null)
    setOpen(false);
  };

  if (!rows) {
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
                          <TableCell className='cells-icons' key={column.id} align={column.align}>
                            {column.label === 'Modifier' ? <Link to={`/contacts/${value}`}><EditIcon className='update-icon' /></Link> : column.label === 'Supprimer' ? <DeleteForeverIcon className='contacts-icons' style={{ color: "red" }} onClick={() => handleClickOpen(value)} /> : value}
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
            rowsPerPageOptions={[5, 10, 15, 20, 30, 50]}
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
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Êtes-vous sur de vouloir supprimer ce contact ?"}</DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
          </Button>
            <Button onClick={handleClickDelete} color="primary">
              Supprimer
          </Button>
          </DialogActions>
        </Dialog>
        <Link to={`/nouveau-contact`}><AddCircleOutlineIcon className='contacts-icons contacts-icons-add' style={{ color: "#329797", fontSize: 50 }} /></Link>
      </div>
    );
  }
}

export default Contacts;
