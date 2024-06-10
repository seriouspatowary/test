import Connection from '../databases/db.js';

export const getProjects = async (req, res) => {
  try {
   
    const query = 'SELECT DISTINCT Project FROM geo_attendance_demo';
    Connection.query(query, (error, results) => {
      if (error) {
        return res.status(400).json({ message: 'Error', error: error.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }

      const projectIds = results.map(result => result.Project);
      res.status(200).json(projectIds);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolByProject = async (req, res) => {
  try {
    const { Project } = req.body;

  
    if (!Project) {
      return res.status(401).json({ message: 'Project parameter is required' });
    }

    const query = 'SELECT DISTINCT School FROM geo_attendance_demo WHERE Project = ?';
    Connection.query(query, [Project], (error, results) => {
      if (error) {
        return res.status(400).json({ message: 'Error', error: error.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'No schools found for the specified project' });
      }

      const schools = results.map(result => result.School);
      res.status(200).json(schools);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

