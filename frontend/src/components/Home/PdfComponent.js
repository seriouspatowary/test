import React from 'react'

const PdfComponent = ({pdfBase64}) => {

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
            height="700px"
          />
        );
      };
  
      
  return (
        <div className="form-group mt-3 ">
            {renderPdf()}
        </div>

  )
}

export default PdfComponent
