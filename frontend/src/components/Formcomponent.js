import React from 'react'

const Formcomponent = () => {
  return (
    <div>
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

        
       

          {/* Submit button */}
          <div className="form-group mt-3">
            <button type="submit" className='btn btn-primary'>Generate Report</button>
          </div>
        </form>
    </div>
  )
}

export default Formcomponent
