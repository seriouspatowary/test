import React, { useState, useEffect } from 'react';
import PdfComponent from './PdfComponent';
import FormComponent from './FormComponent'

const Home = () => {

  const [projects, setProjects] = useState([]);

  const [pdfBase64, setPdfBase64] = useState('');

 
  useEffect(() => {
    fetchProjects();
  
    
  }, []);


  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getproject`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  


  return (
    <div className="">
        <FormComponent setPdfBase64={setPdfBase64} projects={projects}  />
      <div style={{height:'600px', width:'100%'}}>
        {pdfBase64 && (
          <PdfComponent pdfBase64={pdfBase64}/>
        )}
      </div>
    </div>
  );
}

export default Home;
