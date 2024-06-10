import React, { useState, useEffect } from 'react';
import PdfComponent from './PdfComponent';
import FormComponent from './FormComponent'

const Home = () => {
  // State variables to manage user selections and PDF data
  const [projects, setProjects] = useState([]);
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



   // Adjust the range as needed


  return (
    <div className="">
        <FormComponent setPdfBase64={setPdfBase64} projects={projects}/>
      <div style={{height:'600px', width:'100%'}}>
        {pdfBase64 && (
          <PdfComponent pdfBase64={pdfBase64}/>
        )}
      </div>
    </div>
  );
}

export default Home;
