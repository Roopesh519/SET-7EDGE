import React, { useState } from 'react';

const StepDefinitionModal = ({ isOpen, onClose, onConfirm }) => {
  const [gherkinScenarios, setGherkinScenarios] = useState('');
  const [framework, setFramework] = useState('');
  const [language, setLanguage] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [errors, setErrors] = useState({});

  const frameworkOptions = [
    { value: '', label: 'Select Framework' },
    { value: 'selenium', label: 'Selenium WebDriver' },
    { value: 'cypress', label: 'Cypress' },
    { value: 'playwright', label: 'Playwright' },
    { value: 'testcafe', label: 'TestCafe' },
    { value: 'webdriverio', label: 'WebDriverIO' },
    { value: 'puppeteer', label: 'Puppeteer' },
    { value: 'appium', label: 'Appium (Mobile)' },
    { value: 'rest-assured', label: 'REST Assured (API)' },
    { value: 'postman', label: 'Postman/Newman (API)' },
    { value: 'cucumber-js', label: 'Cucumber.js' },
    { value: 'cucumber-java', label: 'Cucumber Java' },
    { value: 'specflow', label: 'SpecFlow (.NET)' }
  ];

  const languageOptions = [
    { value: '', label: 'Select Language' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'csharp', label: 'C#' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'go', label: 'Go' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'scala', label: 'Scala' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!gherkinScenarios.trim()) {
      newErrors.gherkinScenarios = 'Please enter Gherkin scenarios';
    }

    if (!framework) {
      newErrors.framework = 'Please select an automation framework';
    }

    if (!language) {
      newErrors.language = 'Please select a programming language';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }

    const prompt = `Act as a test automation expert and step definition generator.

Given the following Gherkin scenarios, generate step definitions for automated testing using the specified framework and programming language.

**Requirements:**
- Framework: ${framework}
- Programming Language: ${language}
- Generate clean, maintainable, and reusable step definitions
- Include proper page object patterns where applicable
- Add appropriate waits, assertions, and error handling
- Follow best practices for the selected framework and language
- Include comments explaining complex logic
- Ensure step definitions are atomic and focused on single actions

**Gherkin Scenarios:**
${gherkinScenarios}${additionalContext ? `\n\n**Additional Context:**\n${additionalContext}` : ''}

Generate comprehensive step definitions that implement the given Gherkin scenarios with proper automation patterns and best practices.`;

    onConfirm(prompt);
    handleClose();
  };

  const handleClose = () => {
    setGherkinScenarios('');
    setFramework('');
    setLanguage('');
    setAdditionalContext('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800">Generate Step Definitions</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gherkin Scenarios <span className="text-red-500">*</span>
          </label>
          <textarea
            value={gherkinScenarios}
            onChange={(e) => setGherkinScenarios(e.target.value)}
            placeholder="Paste your Gherkin scenarios here..."
            rows={6}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
              errors.gherkinScenarios ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.gherkinScenarios && (
            <p className="text-red-600 text-sm mt-1">{errors.gherkinScenarios}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Automation Framework <span className="text-red-500">*</span>
            </label>
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
                errors.framework ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              {frameworkOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.framework && (
              <p className="text-red-600 text-sm mt-1">{errors.framework}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programming Language <span className="text-red-500">*</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
                errors.language ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.language && (
              <p className="text-red-600 text-sm mt-1">{errors.language}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context (Optional)
          </label>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Enter any additional context such as:
• Specific selectors or element identification strategies
• Page object structure requirements
• Custom utilities or helper methods needed
• Environment or configuration details
• Integration requirements"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Generate Step Definitions
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDefinitionModal;