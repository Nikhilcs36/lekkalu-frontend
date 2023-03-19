import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ModalContainer } from "./styled";
import { formatDate, preventPropagationOnEnter } from "./utils";
import TagInput from "./TagInput";
import dayjs from "dayjs";

const ExpenseFormModal = ({
  onAddExpense,
  onUpdateExpense,
  expenseToEdit,
  editIndex,
  onCancelEdit,
}) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [myTags, setMyTags] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (expenseToEdit) {
      setAmount(expenseToEdit.amount);
      setMyTags(expenseToEdit.tags);
      setSelectedDate(new Date(expenseToEdit.time));
      setOpen(true);
    }
  }, [expenseToEdit]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (editIndex !== null) {
      onCancelEdit();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagIDs = myTags.map(tag => tag.id);

    const newExpense = {
      amount,
      tags: tagIDs,
      user: 1,
      time: formatDate(new Date(selectedDate))
    };

    if (editIndex !== null) {
      onUpdateExpense(editIndex, { ...expenseToEdit, ...newExpense });
    } else {
      onAddExpense({ ...newExpense });
    }

    setAmount("");
    setMyTags("");
    handleClose();
  };

  const handleAmountChange = (event) => {
    const newValue = event.target.value;

    if (newValue === "" || (newValue >= 0 && !isNaN(newValue))) {
      setAmount(newValue);
    } else {
      return;
    }
  };

  return (
    <ModalContainer>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Expense
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="p">Provide the amount:</Typography>
            <TextField
              value={amount}
              onChange={handleAmountChange}
              onKeyPress={preventPropagationOnEnter}
              required
              fullWidth
            />
            <Typography variant="p">Select tags:</Typography>
            <TagInput myTags={myTags} setTags={setMyTags} />
            <Typography variant="p">Choose the date:</Typography>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  defaultValue={dayjs(selectedDate)}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </div>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" color="primary">
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </ModalContainer>
  );
};

export default ExpenseFormModal;
