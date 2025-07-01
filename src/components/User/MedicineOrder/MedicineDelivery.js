import React, { useState } from 'react';
import './MedicineDelivery.css';

// Import icons/images
import whatsappIcon from '../../../assets/wearable.jpg';
import scanIcon from '../../../assets/Ayurveda Banner Photo.jpg';
import phoneIcon from '../../../assets/Ayurveda Oil.jpg';

function MedicineDelivery() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleWhatsAppOrder = () => {
    // Implement WhatsApp integration
    window.open('https://wa.me/YOUR_WHATSAPP_NUMBER', '_blank');
  };

  const handleScanRx = () => {
    // Trigger file input click
    document.getElementById('fileInput').click();
  };

  const handleCallOrder = () => {
    // Implement call functionality
    window.location.href = 'tel:YOUR_PHONE_NUMBER';
  };

  return (
    <div className="medicine-delivery-container">
      <div className="upload-section">
        <h2>Upload Prescription</h2>
        <p>Upload your prescription and we'll deliver your medicines</p>
        
        <input
          type="file"
          id="fileInput"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        <button className="upload-btn" onClick={handleScanRx}>
          Upload Prescription
        </button>
        
        {selectedFile && (
          <div className="selected-file">
            <p>Selected file: {selectedFile.name}</p>
          </div>
        )}
      </div>

      <div className="divider">
        <span>OR YOU CAN ORDER VIA</span>
      </div>

      <div className="order-options">
        <button className="order-option whatsapp" onClick={handleWhatsAppOrder}>
          <img src={whatsappIcon} alt="WhatsApp" />
          <span>Order with WhatsApp</span>
        </button>

        <button className="order-option scan" onClick={handleScanRx}>
          <img src={scanIcon} alt="Scan" />
          <span>Scan Rx</span>
        </button>

        <button className="order-option call" onClick={handleCallOrder}>
          <img src={phoneIcon} alt="Call" />
          <span>Call us to Order</span>
        </button>
      </div>
    </div>
  );
}

export default MedicineDelivery;
