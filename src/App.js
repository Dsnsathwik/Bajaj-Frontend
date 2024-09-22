import React, { useState } from 'react';
import axios from 'axios';
import "./App.css"


document.title = "AP21110011099"; 

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const options = ['Alphabets', 'Numbers', 'Highest lowercase alphabet'];

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);

      if (!parsedInput.data && !parsedInput.file_b64) {
        throw new Error('Invalid input format: "data" or "file_b64" must be present.');
      }

      const response = await axios.post('https://testbfhl-eosin.vercel.app/bfhl', parsedInput);
      setResponseData(response.data);

      
      setDropdownVisible(true);
      setError(null);
    } catch (err) {
      setError('Invalid JSON input or format.');
      setDropdownVisible(false);
      setResponseData(null);
    }
  };

  const handleSelectionChange = (event) => {
    const value = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOptions(value);
  };

  const filterResponseData = () => {
    if (!responseData) return [];

    let filteredData = [];

    if (selectedOptions.includes('Alphabets')) {
      filteredData = [...filteredData, ...responseData.alphabets];
    }

    if (selectedOptions.includes('Numbers')) {
      filteredData = [...filteredData, ...responseData.numbers];
    }

    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredData = [...filteredData, ...responseData.highest_lowercase_alphabet];
    }

    return filteredData;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Input</h1>

      <textarea
        rows="4"
        cols="50"
        placeholder='Enter valid JSON like {"data":["M","1","334","4","B","Z","a"], "file_b64": "base64string"}'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dropdownVisible && (
        <>
          <h2>Filter Options</h2>
          <select multiple onChange={handleSelectionChange}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </>
      )}

      {responseData && (
        <div>
          <h2>Response Summary</h2>
          <p><strong>Success:</strong> {responseData.is_success ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {responseData.user_id}</p>
          <p><strong>Email:</strong> {responseData.email}</p>
          <p><strong>Roll Number:</strong> {responseData.roll_number}</p>
          {responseData.file_valid && (
            <>
              <p><strong>File Valid:</strong> Yes</p>
              <p><strong>File MIME Type:</strong> {responseData.file_mime_type}</p>
              <p><strong>File Size (KB):</strong> {responseData.file_size_kb}</p>
            </>
          )}
        </div>
      )}

      <h2>Filtered Data</h2>
      <ul>
        {filterResponseData().map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
