import Connection from '../databases/db.js';

export const getProjects = async (req, res) => {
  try {
    const query = 'SELECT ID, Project, School FROM geo_attendance_demo';
    Connection.query(query, (error, results) => {
      if (error) {
        return res.status(400).json({ message: 'Error', error: error.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
      }
      
      res.status(200).json(results);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
