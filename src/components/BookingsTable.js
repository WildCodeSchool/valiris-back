import React, { useState, useEffect, useContext } from 'react';
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
import { Link } from 'react-router-dom';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import UserInfoContext from '../userInfoContext';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    overflow: 'auto',
  },
});

function BookingsTable() {
  const columns = [
    { id: 'apartment', label: 'Appartement', minWidth: 170 },
    { id: 'start', label: 'Début', minWidth: 170 },
    { id: 'end', label: 'Fin', minWidth: 170 },
    { id: 'contact', label: 'Contact', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170 },
    { id: 'id', label: 'Modifier', minWidth: 15 },
    { id: 'id', label: 'Supprimer', minWidth: 15 },
  ];

  const [rows, setRows] = useState()
  const [currentId, setCurrentId] = useState(null)
  const today = Date.now()
  const { reload, setReload } = useContext(UserInfoContext)

  useEffect(() => {
    API.get('/apartments/availabilities/all')
      .then(res => res.data)
      .then(data => setRows(data.map(d => {
        const timeStampStart = new Date(d.starting_date).getTime()
        const timeStampEnd = new Date(d.ending_date).getTime()
        let status = '';
        let color = 'black'
        if (!d.validation) {
          status = 'En attente de validation'
          color = 'red'
        } else if (today > timeStampStart && today < timeStampEnd) {
          status = 'En cours'
          color = 'orange'
        } else if (today > timeStampEnd) {
          status = 'Terminée'
          color = 'gray'
        } else if (d.validation) {
          status = 'Validée'
          color = 'green'
        }
        return {
          id: d.id,
          apartment: d.name,
          start: moment(d.starting_date).format('DD/MM/YYYY'),
          end: moment(d.ending_date).format('DD/MM/YYYY'),
          contact: `${d.firstname} ${d.lastname}`,
          status: status,
          color : color
        }
      })));
      setReload(false);
  }, [reload])

  const handleClickDelete = () => {
    API.delete(`/bookings/${currentId}`)
      .then(() => {
        setRows(
          rows.filter(row => row.id !== currentId)
        )
        setCurrentId(null)
      })
      handleClose()
  }


  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      setOpen(false);
    };

  if (!rows) {
    return <div className='loader'><CircularProgress style={{ width: '70px', height: '70px' }} /></div>
  } else {
    return (
      <div className='contacts-container'>
        <h2>Réservations</h2>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.label}
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map(column => {
                        const value = row[column.id];
                        const color = row.color
                        return (
                          <TableCell className='cells-icons' key={column.label} align={column.align} style={{ color:`${color}` }}>
                            {column.label === 'Modifier' ? <Link to={`/reservation/${value}`}><EditIcon className='update-icon' /></Link> : column.label === 'Supprimer' ? <DeleteForeverIcon className='contacts-icons' style={{ color: "red" }} onClick={() => handleClickOpen(value)} /> : value}
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
          <DialogTitle>{"Êtes-vous sur de vouloir supprimer cette réservation ?"}</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
          </Button>
            <Button onClick={handleClickDelete} color="primary">
              Supprimer
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default BookingsTable;
