import React, { useState, useEffect } from 'react';
import Select from 'react-select'
const Home = () => {
  // State variables to manage user selections and PDF data
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [pdfBase64, setPdfBase64] = useState('');

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  // Function to fetch projects from the server
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/getproject');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Event handler for project selection
  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    setSelectedProject(selectedProjectId);
    const filteredSchools = projects
      .filter(project => project.Project === parseInt(selectedProjectId))
      .map(item => item.School);
    setSchools([...new Set(filteredSchools)]);
    setSelectedSchool('');
  };

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption.value);
  };
  // Event handler for month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
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

  const renderPdf = () => {
    const binaryString = window.atob(pdfBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return (
      <iframe
        src={url}
        title="PDF Preview"
        width="100%"
        height="500px"
      />
    );
  };
  

  const yearRange = 101; // Adjust the range as needed
  const yearOptions = [...Array(yearRange).keys()].map(i => ({
    value: new Date().getFullYear() - 50 + i, // Adjust the starting year as needed
    label: `${new Date().getFullYear() - 50 + i}`
  }));

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="col-md-4">
        <form onSubmit={handleSubmit}>
          {/* Project selection dropdown */}
          <div className="form-group">
            <label htmlFor="dropdown1">ProjectID</label>
            <select
              className="form-select form-select-sm"
              id="dropdown1"
              value={selectedProject}
              onChange={handleProjectChange}
              aria-label="Option 1"
            >
              <option value="" disabled>Select ProjectID</option>
              {[...new Set(projects.map(project => project.Project))].map(projectId => (
                <option key={projectId} value={projectId}>{projectId}</option>
              ))}
            </select>
          </div>

          {/* School selection dropdown */}
          <div className="form-group mt-3">
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
          <div className="form-group mt-3">
            <label htmlFor="yearDropdown">Select Year</label>
            <Select
              id="yearDropdown"
              options={yearOptions}
              value={yearOptions.find(option => option.value === selectedYear)}
              onChange={handleYearChange}
              menuPlacement="auto"
              maxMenuHeight={200}
            />
          </div>

          {/* Month selection dropdown */}
          <div className="form-group mt-3">
            <label htmlFor="monthDropdown">Select Month</label>
            <select
              className="form-select form-select-sm"
              id="monthDropdown"
              value={selectedMonth}
              onChange={handleMonthChange}
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
          <div className="form-group mt-3">
            <button type="submit" className='btn btn-primary'>Generate Report</button>
          </div>
        </form>
        {pdfBase64 && (
          <div className="form-group mt-3">
            {renderPdf()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
