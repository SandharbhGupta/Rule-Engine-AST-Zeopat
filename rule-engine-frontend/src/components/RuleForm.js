import React, { useState } from 'react';
import axios from 'axios';

const RuleForm = () => {
  const [rule, setRule] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rules/create_rule', {
        rule: rule,
        description: description,
      });
      setSuccess(response.data.message);
      setError(null);
      setRule('');
      setDescription('');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Failed to create rule.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-slate-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-700 text-center ">Create Rule</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2 font-semibold">Rule String:</label>
          <textarea
            value={rule}
            rows={8}
            cols={45}
            onChange={(e) => setRule(e.target.value)}
            required
            placeholder="e.g., (age > 30 AND department = 'Sales')"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2 font-semibold">Description:</label>
          <input
            type="text"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the rule"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
      {success && (
        <p className="mt-4 text-green-600 bg-green-100 p-2 rounded-md">{success}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 bg-red-100 p-2 rounded-md">{error}</p>
      )}
    </div>
  );
};

export default RuleForm;
