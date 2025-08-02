import React, { useState } from 'react';

const GherkinModal = ({ isOpen, onClose, onConfirm }) => {
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!acceptanceCriteria.trim()) {
      setError('Please enter Acceptance Criteria');
      return;
    }

    setError('');

    const prompt = `Act as a Gherkin test case generator.

Given the following feature description and its Conditions of Satisfaction (Acceptance Criteria), generate Gherkin test scenarios using the following format:

- Feature: [Title and User Story]
- Acceptance Criteria (should be implemented as rules and examples)
- Tag important test types (e.g., @logout, @validation, @pro-only) if applicable.
- Use "Rule" and "Example" where logic needs branching (like feature gating, error handling, or limits).
- Use clean, concise step definitions with 'Given', 'When', 'Then', and 'And'.
- Reuse copy/text/messages exactly as in the COS wherever applicable.
- Ensure character limit validations, permissions, and rich text editing options are covered.

---

**Acceptance Criteria:**
${acceptanceCriteria}${additionalNotes ? `\n\n**Additional Notes:**\n${additionalNotes}` : ''}

Generate clear, specific, and testable Gherkin scenarios that cover the main functionality and edge cases.`;

    onConfirm(prompt);
    setAcceptanceCriteria('');
    setAdditionalNotes('');
  };

  const handleClose = () => {
    setAcceptanceCriteria('');
    setAdditionalNotes('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Generate Gherkin Scenarios</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Acceptance Criteria <span className="text-red-500">*</span>
          </label>
          <textarea
            value={acceptanceCriteria}
            onChange={(e) => setAcceptanceCriteria(e.target.value)}
            placeholder="Enter acceptance criteria here..."
            rows={5}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context (Optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any additional context, business rules, or specific requirements..."
            rows={3}
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
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Generate Gherkin
          </button>
        </div>
      </div>
    </div>
  );
};

export default GherkinModal;