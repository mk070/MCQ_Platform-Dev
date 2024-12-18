import React, { useState } from "react";

const SinglePageStepper = () => {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState({
    assessmentOverview: {
      name: "",
      description: "",
      registrationStart: "",
      registrationEnd: "",
      maxRegistrations: "",
      guidelines: "",
    },
    testConfiguration: {
      sections: "",
      questions: "",
      duration: "",
      fullScreenMode: false,
      faceDetection: false,
      deviceRestriction: false,
      noiseDetection: false,
      passPercentage: "",
    },
    sectionDetails: {
      sectionTitles: [],
    },
  });

  const handleInputChange = (e, step) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = () => {
    console.log("Final Form Data:", formData);
    alert("Form Submitted! Check the console for data.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Stepper */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        {["Assessment Overview", "Test Configuration", "Section Details"].map(
          (step, index) => (
            <div key={index} className="flex flex-col items-center w-1/3">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                  currentStep === index + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <p
                className={`mt-2 text-sm ${
                  currentStep === index + 1
                    ? "font-bold text-yellow-500"
                    : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          )
        )}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Assessment Overview</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assessment Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.assessmentOverview.name}
                  onChange={(e) => handleInputChange(e, "assessmentOverview")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter assessment name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.assessmentOverview.description}
                  onChange={(e) => handleInputChange(e, "assessmentOverview")}
                  rows="4"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a brief description"
                  required
                ></textarea>
              </div>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Test Configuration</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Sections
                </label>
                <input
                  type="number"
                  name="sections"
                  value={formData.testConfiguration.sections}
                  onChange={(e) => handleInputChange(e, "testConfiguration")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter the number of sections"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full-Screen Mode
                </label>
                <input
                  type="checkbox"
                  name="fullScreenMode"
                  checked={formData.testConfiguration.fullScreenMode}
                  onChange={(e) => handleInputChange(e, "testConfiguration")}
                  className="h-5 w-5"
                />
              </div>
            </form>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Section Details</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section Title
                </label>
                <input
                  type="text"
                  name="sectionTitles"
                  value={formData.sectionDetails.sectionTitles}
                  onChange={(e) => handleInputChange(e, "sectionDetails")}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter section titles"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between w-full max-w-4xl mt-8">
        {currentStep > 1 && (
          <button
            onClick={previousStep}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700"
          >
            Next
          </button>
        )}
        {currentStep === 3 && (
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default SinglePageStepper;
