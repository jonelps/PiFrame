import React, { useState, Fragment } from 'react';
import './App.css';
//components
import InputImage from './components/InputImages';

//all this runs when rendered
function App() {

    /*try {
      const response = await fetch('http://localhost:3001/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Upload successful');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading');
    }
  };*/

  return (
    <div className="App">
      <InputImage />
    </div>
  );
}

export default App;