import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TestConfiguration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sections: "",
    questions: "",
    duration: "",
    passPercentage: "",
    fullScreenMode: false,
    faceDetection: false,
    deviceRestriction: false,
    noiseDetection: false,
    negativeMarking: false,
    negativeMarkingType: "",
    resultVisibility: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    navigate("/section-details");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-10">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8">
          {["Assessment Overview", "Test Configuration", "Section Details"].map(
            (step, index) => (
              <div key={index} className="flex flex-col items-center w-1/3">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full font-bold ${
                    index === 1
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`mt-2 text-sm ${
                    index === 1 ? "font-bold text-yellow-500" : "text-gray-500"
                  }`}
                >
                  {step}
                </p>
              </div>
            )
          )}
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4">Test Configuration</h1>
        <p className="text-center text-gray-600 mb-8">
          This section allows hosts to configure the structure and conditions of the
          test.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Number of Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Sections
            </label>
            <input
              type="number"
              name="sections"
              value={formData.sections}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Specify how many sections the test will have"
              required
            />
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Questions
            </label>
            <input
              type="number"
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the number of questions"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration of the Test
            </label>
            <input
              type="time"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Guidelines and Toggles */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Full Screen Mode", name: "fullScreenMode" },
              { label: "Face Detection", name: "faceDetection" },
              { label: "Device Restriction", name: "deviceRestriction" },
              { label: "Noise Detection", name: "noiseDetection" },
              { label: "Negative Marking", name: "negativeMarking" },
            ].map((toggle) => (
              <div key={toggle.name} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {toggle.label}
                </label>
                <input
                  type="checkbox"
                  name={toggle.name}
                  checked={formData[toggle.name]}
                  onChange={handleChange}
                  className="h-5 w-10 border-gray-300 rounded-full bg-gray-200 checked:bg-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          {/* Scoring & Result Preferences */}
          <h2 className="text-xl font-semibold mt-6">Scoring & Result Preferences</h2>

          {/* Pass Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pass Percentage
            </label>
            <input
              type="number"
              name="passPercentage"
              value={formData.passPercentage}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the pass percentage"
              required
            />
          </div>

          {/* Result Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Result Visibility
            </label>
            {["Immediate release", "After test completed"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="resultVisibility"
                  value={option}
                  checked={formData.resultVisibility === option}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700">{option}</span>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-300"
              onClick={() => navigate("/")}
            >
              Previous Step
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestConfiguration;
