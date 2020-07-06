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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: '80%',
    overflow: 'auto',
  },
});

function Apartments() {
  const columns = [
    { id: 'name', label: 'Nom', minWidth: 170 },
    { id: 'title', label: 'Intitulé', minWidth: 170 },
    { id: 'id', label: 'Modifier', minWidth: 15 },
    { id: 'id', label: 'Supprimer', minWidth: 15 }
  ];
  const [rows, setRows] = useState()
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  //Loading data
  useEffect(() => {
    API.get('/apartments')
      .then(res => res.data)
      .then(data => setRows(data));
  }, [])

  // Delete apartment
  const handleClickDelete = () => {
    setLoading(true);
    setErrorForm(false);
    API.delete(`/apartments/${currentId}`)
      .then(res => res.data)
      .then(() => {
        setRows(
          rows.filter(row => row.id !== currentId)
        )
      })
      .then(data => {
        setMessageForm(true);
        setLoading(false);
        setMsgAlert(`L'appartement a bien été supprimé.`);
        handleClose();
      })
      .catch(err => {
        console.log(err);
        setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau !');
        setErrorForm(true);
        setLoading(false);
        setMessageForm(true);
        handleClose();
      })
  }

  // Style table and pagination
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
    setCurrentId(null)
  };

  // Alert confirmation or error popup
  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }
  const handleCloseMui = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageForm(false);
  };

  if (!rows) {
    return <p>loading...</p>
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.label} align={column.align}>
                            {column.label === 'Modifier' ? <Link to={`/appartement/${value}`}><EditIcon color='primary' /></Link> : column.label === 'Supprimer' ? <DeleteForeverIcon className='contacts-icons' style={{ color: "red" }} onClick={() => handleClickOpen(value)} /> : value}
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
          <DialogTitle id="alert-dialog-slide-title">{"Êtes-vous sur de vouloir supprimer l'appartement ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Toute suppression sera irréversible.
          </DialogContentText>
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
        {loading && <CircularProgress style={{ width: '50px', height: '50px' }} />}
        <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
          <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
            {msgAlert}
          </Alert>
        </Snackbar>
        <Link to={`/nouvel-appartement`}><AddCircleOutlineIcon className='contacts-icons contacts-icons-add' style={{ color: "green", fontSize: 50 }} /></Link>
      </div>
    );
  }
}

export default Apartments;
