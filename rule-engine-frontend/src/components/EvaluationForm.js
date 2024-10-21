import React, { useState } from 'react';
import axios from 'axios';

const EvaluateForm = () => {
  const [userData, setUserData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'salary' || name === 'experience' ? Number(value) : value,
    }));
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting User Data:', userData);
  
    // Validate user data before making the request
    if (!userData.age || !userData.department || !userData.salary || !userData.experience) {
      console.error('All fields are required.');
      setError('Please fill in all fields.');
      return;
    }
  
    try {
      // Step 1: Fetch the last stored AST from the database
      const astResponse = await axios.get('http://localhost:5000/api/rules/last_ast'); // Your endpoint to fetch the last AST
      const ast = astResponse.data.ast;
  
      // Log the fetched AST for debugging
      console.log('Fetched AST:', ast);
  
      // Step 2: Evaluate the AST against user data
      const evaluationResponse = await axios.post('http://localhost:5000/api/rules/evaluate_rule', {
        userData,
        ast,
      });
  
      console.log('Evaluation Response:', evaluationResponse.data); // Log the evaluation response
  
      setResult(evaluationResponse.data.result);
      setError(null);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to evaluate rule.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setResult(null);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h1 className="text-2xl font-semibold mb-4 text-center">Evaluate Rule</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            min={1}
            max={100}
            value={userData.age}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department:</label>
          <input
            type="text"
            name="department"
            value={userData.department}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Salary:</label>
          <input
            type="number"
            name="salary"
            min={1000}
            value={userData.salary}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience:</label>
          <input
            type="number"
            name="experience"
            min={0}
            value={userData.experience}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Evaluate
        </button>
      </form>
      {result !== null && (
        <p className="mt-4 text-center text-lg font-semibold text-green-600">
          User is {result ? 'eligible' : 'not eligible'}.
        </p>
      )}
      {error && (
        <p className="mt-4 text-center text-lg font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default EvaluateForm;
