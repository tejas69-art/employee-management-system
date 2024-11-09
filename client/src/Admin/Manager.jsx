import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel,
  TablePagination, TextField, IconButton
} from '@mui/material';
import { Search, Edit, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';

const PAGE_SIZE = 10;

function ManagerComponent() {
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  useEffect(() => {
    const filtered = employeeList.filter(employee =>
      Object.values(employee).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredList(filtered);
    setCurrentPage(0);
  }, [searchTerm, employeeList]);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/employees');
      setEmployeeList(response.data);
    } catch (error) {
      console.error('Error fetching employee list:', error);
    }
  };

  const handleToggleActive = async (employeeId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.put(`http://localhost:8000/api/employees/${employeeId}`, { status: newStatus });
      setEmployeeList(prevList => prevList.map(employee => {
        if (employee._id === employeeId) {
          return { ...employee, status: newStatus };
        }
        return employee;
      }));
    } catch (error) {
      console.error('Error toggling employee status:', error);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:8000/api/employees/${employeeId}`);
      setEmployeeList(prevList => prevList.filter(employee => employee._id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEdit = (employeeId) => {
    // Implement edit functionality
    console.log('Edit employee:', employeeId);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedList = [...filteredList].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredList(sortedList);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const paginatedList = filteredList.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <div className="mb-4 flex items-center">
        <TextField
          type="text"
          label="Search employees"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="mr-2"
        />
        <IconButton>
          <Search />
        </IconButton>
      </div>
      <div className="mb-2">
        Total Employees: {filteredList.length}
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'name'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'email'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedList.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.mobile}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>{employee.courses.join(', ')}</TableCell>
                <TableCell>{employee.status || 'Pending'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleToggleActive(employee._id, employee.status)}>
                    {employee.status === 'Active' ? <ArrowUpward /> : <ArrowDownward />}
                  </IconButton>
                  <IconButton onClick={() => handleEdit(employee._id)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employee._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredList.length}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default ManagerComponent;
