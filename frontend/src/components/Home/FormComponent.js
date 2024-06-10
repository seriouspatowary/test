import React, { useState } from 'react'
import Select from 'react-select';

const FormComponent = ({setPdfBase64, projects}) => {
    const [selectedProject, setSelectedProject] = useState('');
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const handleProjectChange = (e) => {
        const selectedProjectId = e.target.value;
        setSelectedProject(selectedProjectId);
        const filteredSchools = projects
          .filter(project => project.Project === parseInt(selectedProjectId))
          .map(item => item.School);
        setSchools([...new Set(filteredSchools)]);
        setSelectedSchool('');
      };
    
      // Event handler for form submission to generate PDF report
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/api/generatepdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Project: selectedProject,
              Month: selectedMonth.toString().padStart(2, '0'),
              Year: selectedYear,
              School: selectedSchool
            }),
          });
          
          if (response.status === 404) {
            alert("No data found for the specified parameters");
            return; // Stop further execution as there is no data
          }
         
          if (!response.ok) {
            throw new Error('Failed to generate report');
          }
      
         
          const { pdfData } = await response.json();
          setPdfBase64(pdfData);
        } catch (error) {
          console.error('Error generating report:', error);
        }
      };

      const yearOptions = [...Array(101).keys()].map(i => ({
        value: new Date().getFullYear() - 50 + i, // Adjust the starting year as needed
        label: `${new Date().getFullYear() - 50 + i}`
      }));
    
  return (
    <div className='m-5'>
        <form onSubmit={handleSubmit} className='d-flex align-items-center justify-content-between'>

        {projects.length &&
        <div className="form-group">
            <label htmlFor="dropdown1">ProjectID</label>
            <select
              className="form-select form-select-sm "
              id="dropdown1"
              value={selectedProject}
              onChange={handleProjectChange}
              aria-label="Option 1"
            >
              <option value="" disabled>Select ProjectID</option>
              {
                projects.map((item, id)=>{
                  return <option key={id} value={item}>{item}</option>
                })
              }
            </select>
          </div>}

          {/* School selection dropdown */}
          <div className="form-group">
            <label htmlFor="dropdown2">School</label>
            <select
              className="form-select form-select-sm"
              id="dropdown2"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              aria-label="Option 2"
              disabled={!selectedProject}
            >
              <option value="" disabled>Select School</option>
              {schools.map(school => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>

          {/* Year selection dropdown */}
          <div className="form-group">
            <label htmlFor="yearDropdown">Select Year</label>
            <Select
              id="yearDropdown"
              options={yearOptions}
              value={yearOptions.find(option => option.value === selectedYear)}
              onChange={(e)=>setSelectedYear(e.value)}
              menuPlacement="auto"
              maxMenuHeight={200}
            />
          </div>

          {/* Month selection dropdown */}
          <div className="form-group">
            <label htmlFor="monthDropdown">Select Month</label>
            <select
              className="form-select form-select-sm"
              id="monthDropdown"
              value={selectedMonth}
              onChange={(e)=>setSelectedMonth(parseInt(e.target.value))}
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <div className="">
            <button type="submit" className='btn btn-primary'>Generate Report</button>
          </div>
        </form>
    </div>
  )
}

export default FormComponent
