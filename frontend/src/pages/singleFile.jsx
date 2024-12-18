import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SinglePageStepper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState(1);
  const [contestid, setContestId] = useState(null);
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
      negativeMarking: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      resultVisibility: "",
      submissionRule: "",
    },
    sectionDetails: {
      sectionTitles: [],
    },
  });

  const validateStep = () => {
    if (currentStep === 1) {
      const {
        name,
        description,
        registrationStart,
        registrationEnd,
        maxRegistrations,
        guidelines,
      } = formData.assessmentOverview;
      return (
        name &&
        description &&
        registrationStart &&
        registrationEnd &&
        maxRegistrations &&
        guidelines
      );
    }
    if (currentStep === 2) {
      const { sections, questions, duration, passPercentage } =
        formData.testConfiguration;
      return sections && questions && duration && passPercentage;
    }
    if (currentStep === 3) {
      const { sectionTitles } = formData.sectionDetails;
      return sectionTitles.length > 0; // Ensure at least one section title is provided
    }
    return true; // Default to true for safety
  };

  const handleChange = (e, step) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleInputChange = (e, step) => {
    const { name, type, checked } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [name]: type === "checkbox" ? checked : e.target.value,
      },
    }));
  };
  

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];

  const nextStep = async () => {
    if (validateStep()) {
      if (currentStep === 2) {
        const generatedContestId = generateContestId(); // Generate a unique contest ID
        setContestId(generatedContestId); // Save it to state for future use
        await saveDataToMongoDB(generatedContestId); // Pass it to saveDataToMongoDB

        try {
          const response = await axios.post(
            "http://localhost:8000/api/start-contest",
            { contestId: generatedContestId },
            {
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
              },
            }
          );
          const token = response.data.token;

          console.log("Token received:", token);
          // Store token securely
          localStorage.setItem("contestToken", token);
          // Navigate to section details without contestId in the URL
          navigate("/sectionDetails");
        } catch (error) {
          console.error("Error starting contest:", {
            message: error.message,
            data: error.response?.data,
            status: error.response?.status,
          });
          alert("Failed to start the contest. Please try again.");
        }
        return; // Exit the function after navigation
      }
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      alert("Please fill in all required fields before proceeding.");
    }
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFinalSubmit = () => {
    console.log("Final Form Data:", formData);
    alert("Form Submitted! Check the console for data.");
  };

  const generateContestId = () => {
    return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
  };

  const saveDataToMongoDB = async (contestId) => {
    const payload = {
      contestId, // Use the passed contestId
      assessmentOverview: formData.assessmentOverview,
      testConfiguration: formData.testConfiguration,
    };

    try {
      const response = await fetch("http://localhost:8000/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Data saved successfully with Contest ID:", contestId);
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Stepper */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        {["Assessment Overview", "Test Configuration"].map((step, index) => (
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
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {/* Step 1: Assessment Overview */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-5 text-center text-indigo-950">
              Assessment Overview
            </h2>
            <p className="text-sm font-normal mb-4 text-center  text-slate-500 ">
              This section captures essential information about the test. Ensure
              clarity and completeness.
            </p>
            <hr />
            <form onSubmit={handleChange} className="space-y-6">
              {/* Assessment Name */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 mt-3 text-start">
                  Assessment Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.assessmentOverview.name}
                  onChange={(e) => handleChange(e, "assessmentOverview")}
                  className="mt-1 block w-full p-3  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the name of the assessment"
                  style={{ borderRadius: "20px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 text-start">
                  Description
                </label>
                <p className="text-sm font-normal text-slate-500 text-start">
                  (Provide a brief overview of the assessment, including its
                  purpose and topics covered.)
                </p>
                <textarea
                  name="description"
                  value={formData.assessmentOverview.description}
                  onChange={(e) => handleChange(e, "assessmentOverview")}
                  rows="4"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Provide a brief overview of the assessment"
                  style={{ borderRadius: "20px" }} // Manually applying the border radius
                  required
                ></textarea>
              </div>

              {/* Registration Start Date & Time */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 text-start">
                  Registration Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="registrationStart"
                  value={formData.assessmentOverview.registrationStart}
                  onChange={(e) => handleChange(e, "assessmentOverview")}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ borderRadius: "20px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Registration End Date & Time */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 text-start">
                  Registration End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="registrationEnd"
                  value={formData.assessmentOverview.registrationEnd}
                  onChange={(e) => handleChange(e, "assessmentOverview")}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  style={{ borderRadius: "20px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Number of Registrations Allowed */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 text-start">
                  Number of Registrations Allowed
                </label>
                <input
                  type="number"
                  name="maxRegistrations"
                  value={formData.assessmentOverview.maxRegistrations}
                  onChange={(e) => handleChange(e, "assessmentOverview")}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the maximum number of registrations"
                  style={{ borderRadius: "20px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Guidelines */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 text-start">
                  Guidelines and Rules
                </label>
                <p className="text-sm font-normal text-slate-500 text-start">
                  (ouline the rules students must follow during the text,
                  include dress code,behavior expectation,and device policies.)
                </p>
                <textarea
                  name="guidelines"
                  value={formData.assessmentOverview.guidelines}
                  onChange={(e) => handleChange(e, "assessmentOverview")}
                  rows="6"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Outline the rules students must follow during the test"
                  required
                ></textarea>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Test Configuration */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-5 text-center text-indigo-950">
              Test Configuration
            </h2>
            <p className="text-sm font-normal mb-5 text-center  text-slate-500 ">
              This section captures essential information about the test. Ensure
              clarity and completeness.
            </p>
            <hr />
            {/* Form */}
            <form onSubmit={handleChange} className="space-y-8">
              {/* Number of Sections */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 mb-1 mt-4 text-start">
                  Number of Sections
                </label>
                <input
                  type="number"
                  name="sections"
                  value={formData.testConfiguration.sections}
                  onChange={(e) => handleChange(e, "testConfiguration")}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Specify how many sections the test will have"
                  style={{ borderRadius: "25px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 mb-1 text-start">
                  Number of Questions
                </label>
                <input
                  type="number"
                  name="questions"
                  value={formData.testConfiguration.questions}
                  onChange={(e) => handleChange(e, "testConfiguration")}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter a brief description of the assessment"
                  style={{ borderRadius: "25px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-lg font-medium text-indigo-950 mb-1 text-start">
                  Duration of the Test
                </label>
                <input
                  type="time"
                  name="duration"
                  value={formData.testConfiguration.duration}
                  onChange={(e) => handleChange(e, "testConfiguration")}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                  style={{ borderRadius: "25px" }} // Manually applying the border radius
                  required
                />
              </div>

              {/* Proctoring Enablement Section */}
              <div className="mt-8">
                {/* Heading */}
                <h2 className="text-lg font-medium text-indigo-950 mb-1 text-start">
                  Proctoring Enablement
                </h2>
                <p className="text-sm text-gray-500 font-normal mb-6 text-start">
                  (Select the types of proctoring to enforce during the test)
                </p>

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: "Full Screen Mode", name: "fullScreenMode" },
                    { label: "Face Detection", name: "faceDetection" },
                    { label: "Device Restriction", name: "deviceRestriction" },
                    { label: "Noise Detection", name: "noiseDetection" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex justify-between items-center px-6 py-3 border border-gray-300 rounded-full bg-white shadow-sm"
                    >
                      {/* Label */}
                      <span className="text-indigo-950 font-semibold text-sm">
                        {item.label}
                      </span>

                      {/* Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={formData.testConfiguration[item.name]} // Reflects the current state
                          onChange={(e) =>
                            handleInputChange(e, "testConfiguration") // Updates state dynamically
                          }
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-yellow-500 peer-checked:bg-yellow-400">
                          <div
                            className={`absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                              formData.testConfiguration[item.name]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Additional Options */}
                <div className="mt-8">
                  {/* Grid Layout */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    {[
                      {
                        label: "Negative Marking",
                        name: "negativeMarking",
                        description:
                          "(Indicate whether negative marking applies for incorrect answers)",
                      },
                      {
                        label: "Shuffle Questions",
                        name: "shuffleQuestions",
                        description:
                          "(Randomize question order for each attempt)",
                      },
                      {
                        label: "Shuffle Options",
                        name: "shuffleOptions",
                        description:
                          "(Rearrange answer choices for added fairness)",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.name}
                        className={`flex justify-between items-center ${
                          index === 0 ? "col-span-2" : "col-span-1"
                        }`}
                      >
                        {/* Text Section */}
                        <div>
                          <span className=" flex justify text-indigo-950 font-semibold text-lg">
                            {item.label}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>

                        {/* Toggle Switch */}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={formData[item.name]}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer-focus:ring-2 peer-focus:ring-yellow-500 peer-checked:bg-yellow-400">
                            <div
                              className={`absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                formData[item.name]
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scoring & Result Preferences */}
              <div>
                <h2 className="text-lg font-medium text-indigo-950 mb-2 text-center">
                  Scoring & Result Preferences
                </h2>
                <p className="text-sm text-gray-500 font-normal text-center mb-4">
                  Set the pass criteria, submission rules, and how and when
                  results are released to students.
                </p>
                {/* Pass Percentage */}
                <div className="mb-6">
                  <label className="block text-lg font-medium text-indigo-950 mb-1 text-start">
                    Pass Percentage
                  </label>
                  <p className="text-sm text-gray-500 font-normal mb-2 text-start">
                    (Enter the minimum percentage required to pass the test.)
                  </p>
                  <input
                    type="number"
                    name="passPercentage"
                    value={formData.testConfiguration.passPercentage}
                    onChange={(e) => handleChange(e, "testConfiguration")}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter the pass percentage"
                    style={{ borderRadius: "25px" }} // Manually applying the border radius
                    required
                  />
                </div>

                {/* Negative Marking Section */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-indigo-950 mb-4 text-start">
                    Submission Rule
                    <p className="text-sm text-gray-500 font-normal text-start">
                      (Better communicates the conditions under which students
                      can submit the test.)
                    </p>
                  </label>
                  <div className="flex space-x-6">
                    {/* Option 1 */}
                    <label
                      className={`flex items-center justify-start w-[250px] px-4 py-3 rounded-2xl border-2 cursor-pointer ${
                        formData.testConfiguration.negativeMarkingType ===
                        "Stay until test ends"
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          formData.testConfiguration.negativeMarkingType ===
                          "Stay until test ends"
                            ? "bg-yellow-400"
                            : "border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.testConfiguration.negativeMarkingType ===
                            "Stay until test ends"
                              ? "bg-white"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <input
                        type="radio"
                        name="negativeMarkingType"
                        value="Stay until test ends"
                        checked={
                          formData.testConfiguration.negativeMarkingType ===
                          "Stay until test ends"
                        }
                        onChange={(e) => handleChange(e, "testConfiguration")}
                        className="hidden"
                      />
                      <span className="ml-2 text-indigo-950 font-medium text-sm">
                        Stay until test ends
                      </span>
                    </label>

                    {/* Option 2 */}
                    <label
                      className={`flex items-center justify-start w-[250px] px-4 py-3 rounded-2xl border-2 cursor-pointer ${
                        formData.testConfiguration.negativeMarkingType ===
                        "Allow early submission"
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          formData.testConfiguration.negativeMarkingType ===
                          "Allow early submission"
                            ? "bg-yellow-400"
                            : "border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.testConfiguration.negativeMarkingType ===
                            "Allow early submission"
                              ? "bg-white"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <input
                        type="radio"
                        name="negativeMarkingType"
                        value="Allow early submission"
                        checked={
                          formData.testConfiguration.negativeMarkingType ===
                          "Allow early submission"
                        }
                        onChange={(e) => handleChange(e, "testConfiguration")}
                        className="hidden"
                      />
                      <span className="ml-2 text-indigo-950 font-medium text-sm">
                        Allow early submission
                      </span>
                    </label>
                  </div>
                </div>

                {/* Result Visibility Section */}
                <div>
                  <label className="block text-lg font-medium text-indigo-950 mb-4 text-start">
                    Result Visibility
                    <p className="text-sm text-gray-500 font-normal">
                      (Clarifies when and how students can see their results and
                      answer keys)
                    </p>
                  </label>
                  <div className="flex space-x-6">
                    {/* Option 1 */}
                    <label
                      className={`flex items-center justify-start w-[250px] px-4 py-3 rounded-2xl border-2 cursor-pointer ${
                        formData.testConfiguration.resultVisibility ===
                        "Immediate release"
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          formData.testConfiguration.resultVisibility ===
                          "Immediate release"
                            ? "bg-yellow-400"
                            : "border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.testConfiguration.resultVisibility ===
                            "Immediate release"
                              ? "bg-white"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <input
                        type="radio"
                        name="resultVisibility"
                        value="Immediate release"
                        checked={
                          formData.testConfiguration.resultVisibility ===
                          "Immediate release"
                        }
                        onChange={(e) => handleChange(e, "testConfiguration")}
                        className="hidden"
                      />
                      <span className="ml-2 text-indigo-950 font-medium text-sm">
                        Immediate release
                      </span>
                    </label>

                    {/* Option 2 */}
                    <label
                      className={`flex items-center justify-start w-[250px] px-4 py-3 rounded-2xl border-2 cursor-pointer ${
                        formData.testConfiguration.resultVisibility ===
                        "Host Control"
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                          formData.testConfiguration.resultVisibility ===
                          "Host Control"
                            ? "bg-yellow-400"
                            : "border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.testConfiguration.resultVisibility ===
                            "Host Control"
                              ? "bg-white"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <input
                        type="radio"
                        name="resultVisibility"
                        value="Host Control"
                        checked={
                          formData.testConfiguration.resultVisibility ===
                          "Host Control"
                        }
                        onChange={(e) => handleChange(e, "testConfiguration")}
                        className="hidden"
                      />
                      <span className="ml-2 text-indigo-950 font-medium text-sm">
                        Host Control
                      </span>
                    </label>
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default SinglePageStepper;
