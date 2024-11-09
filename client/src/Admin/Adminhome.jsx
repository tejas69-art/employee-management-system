import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    courses: [],
    image: null
  });
  const [employeeList, setEmployeeList] = useState([]);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    fetchEmployeeList();
    checkUserRole();
  }, []);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/employees');
      setEmployeeList(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const checkUserRole = async () => {
    try {
      const userId = window.localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:8000/api/roles/${userId}`);
      const role = response.data[0].role;
      setIsManager(role === "manager");
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      const updatedCourses = checked
        ? [...formData.courses, value]
        : formData.courses.filter(course => course !== value);
      setFormData({ ...formData, courses: updatedCourses });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'courses') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'image') {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      await axios.post('http://localhost:8000/api/submitEmployee', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Form submitted:', formData);
      fetchEmployeeList();
      handleCloseForm();
      setFormData({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        image: null
      });
    } catch (error) {
      console.error('Error submitting employee:', error);
    }
  };

  return (
    <div className="container mt-5">
      {isManager && <h1 className="mb-4">Welcome Manager!</h1>}
      {!isManager && <h1 className="mb-4">Welcome Admin!</h1>}

      {isManager && (
        <div className='container mt-2'>
          <Link to="/manager">
            <button className="btn btn-primary mb-3 mr-3">Manager Tab</button>
          </Link>
        </div>
      )}
      <button className="btn btn-primary mb-3" onClick={handleButtonClick}>Add New Employee</button>
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title mb-4">Add New Employee</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">Mobile Number:</label>
                <input
                  type="tel"
                  id="mobile"
                  className="form-control"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="designation" className="form-label">Designation:</label>
                <select
                  id="designation"
                  className="form-control"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="hr">HR</option>
                  <option value="sales">Sales</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Gender:</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="male"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="male">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="female"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="female">Female</label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Courses:</label>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="courses"
                      id="mca"
                      value="mca"
                      checked={formData.courses.includes('mca')}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="mca">MCA</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="courses"
                      id="bca"
                      value="bca"
                      checked={formData.courses.includes('bca')}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="bca">BCA</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="courses"
                      id="bsc"
                      value="bsc"
                      checked={formData.courses.includes('bsc')}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="bsc">BSc</label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image Upload:</label>
                <input
                  type="file"
                  id="image"
                  className="form-control"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>
              <button type="submit" className="btn btn-primary mr-2">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      <EmployeeList employeeList={employeeList} />
    </div>
  );
}

function EmployeeList({ employeeList }) {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title mb-4">Employee List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Courses</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.courses.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;