import Connection from '../databases/db.js';
import PDFDocument from 'pdfkit';

export const generatePdf = async (req, res) => {
  try {
    const { Project, Month, Year, School } = req.body;

    const startDate = `${Year}-${Month.padStart(2, '0')}-01`;
    const lastDayOfMonth = new Date(Year, parseInt(Month, 10), 0).getDate();
    const endDate = `${Year}-${Month.padStart(2, '0')}-${lastDayOfMonth}`;

  

    const query = `
      SELECT 
        geo_attendance_demo.Project, 
        geo_attendance_demo.School, 
        DATE_FORMAT(geo_attendance_demo.Date, '%Y-%m-%d') AS Date, 
        geo_attendance_demo.Punch_Out_Time, 
        geo_attendance_demo.Remarks, 
        attendance_status.Status_Name 
      FROM geo_attendance_demo 
      INNER JOIN attendance_status ON geo_attendance_demo.Success = attendance_status.ID
      WHERE geo_attendance_demo.Project = ? 
      AND DATE_FORMAT(geo_attendance_demo.Date, '%Y-%m-%d') >= ? 
      AND DATE_FORMAT(geo_attendance_demo.Date, '%Y-%m-%d') <= ? 
      ${School ? 'AND geo_attendance_demo.School = ?' : ''}`;

    const values = [Project, startDate, endDate];
    if (School) values.push(School);

    Connection.query(query, values, (error, results) => {
      if (error) {
        return res.status(400).json({ message: 'Error', error: error.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No data found for the specified parameters' });
      }
   
   
   
      const doc = new PDFDocument();
      const buffers = [];

      const headers = ['SI No', 'Project', 'School', 'Date', 'Out Time', 'Remarks', 'Status'];
      const columnWidths = [40, 40, 40, 80, 80, 120, 80];
      const headerHeight = 30;
      const rowHeight = 30;
      const margin = 60;
      const pageWidth = doc.page.width - margin * 2;
      const pageHeight = doc.page.height - margin * 2;
      const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0);

      let yPos = margin;
      let xPos;

      const centerTable = (tableWidth, pageWidth, margin) => {
        return (pageWidth - tableWidth) / 2 + margin;
      };

      const drawTableHeaders = () => {
        xPos = centerTable(tableWidth, pageWidth, margin);
        headers.forEach((header, index) => {
          const textHeight = doc.heightOfString(header, { width: columnWidths[index] });
          const textY = yPos + (headerHeight - textHeight) / 2;
          doc.text(header, xPos, textY, { width: columnWidths[index], align: 'center' });
          doc.rect(xPos, yPos, columnWidths[index], headerHeight).stroke(); 
          xPos += columnWidths[index];
        });
        yPos += headerHeight;
      };

      const drawTableRow = (row, index) => {
        xPos = centerTable(tableWidth, pageWidth, margin);
        const rowData = { 'SI No': index + 1, ...row };
        Object.entries(rowData).forEach(([key, value], index) => {
          let displayValue = value === null ? ' ' : value.toString();
          if (key === 'Date') {
            const date = new Date(value);
            displayValue = date.toISOString().split('T')[0]; 
          }
          else if (key === 'Punch_Out_Time' && value) {
            // Manually parse the time string "HH:mm:ss"
            const [hours, minutes, seconds] = value.split(':');
            const date = new Date();
            date.setHours(parseInt(hours));
            date.setMinutes(parseInt(minutes));
            date.setSeconds(parseInt(seconds));

            // Format time in standard Indian time format with AM/PM
            displayValue = date.toLocaleTimeString('en-IN', {
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit'
            });
          }
          const textHeight = doc.heightOfString(displayValue, { width: columnWidths[index] });
          const textY = yPos + (rowHeight - textHeight) / 2;
          doc.text(displayValue, xPos, textY, { width: columnWidths[index], align: 'center' });
          doc.rect(xPos, yPos, columnWidths[index], rowHeight).stroke();
          xPos += columnWidths[index];
        });
        yPos += rowHeight;
      };

      drawTableHeaders();

      
      results.forEach((row, index) => {
        if (yPos + rowHeight > pageHeight) {
          doc.addPage();
          yPos = margin;
          drawTableHeaders();
        }
        drawTableRow(row, index);
      });

     
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers).toString('base64');
        res.status(200).json({ pdfData });
      });

     
      doc.end();

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

