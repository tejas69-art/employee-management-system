import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from '@/components/ui/pagination'
import { ChevronUp, ChevronDown, Search, Edit, Trash } from 'lucide-react'

const PAGE_SIZE = 10;

function ManagerComponent() {
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
    setCurrentPage(1);
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
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    setFilteredList(prevList => [...prevList].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    }));
  };

  const paginatedList = filteredList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <div className="mb-4 flex items-center">
        <Input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Search className="text-gray-400" />
      </div>
      <div className="mb-2">
        Total Employees: {filteredList.length}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />)}
            </TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
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
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(employee._id, employee.status)}>
                    {employee.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(employee._id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(employee._id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalCount={filteredList.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default ManagerComponent;