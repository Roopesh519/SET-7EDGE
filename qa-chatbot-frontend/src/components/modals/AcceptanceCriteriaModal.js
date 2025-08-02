import React, { useState } from 'react';

const AcceptanceCriteriaModal = ({ isOpen, onClose, onConfirm }) => {
  const [cos, setCos] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!cos.trim()) {
      setError('Please enter Conditions of Satisfaction (COS)');
      return;
    }

    setError('');

    const featureDescription = `Feature Description:\n${cos}${additionalNotes ? `\n\nAdditional Notes:\n${additionalNotes}` : ''}`;

    const prompt = `Generate the following output **only** using the structure described below. **Do not add any introductory sentences, summaries, interpretations, or additional explanations.** Only include the exact structure requested.

---
**Acceptance Criteria**

(Leave this section empty — do not list or rewrite anything here.)

**Happy Paths:**
- List all happy paths using numbered bullets.
- Each step should describe one clear user action or result.
- Steps must be concise and realistic.

**Unhappy Paths:**
- List all unhappy paths using numbered bullets.
- Include user errors, validation misses, improper UX feedback, system failures, or edge cases.
- Be specific and practical in each scenario.

---

Now use the following content as the Feature Description:
${cos}${additionalNotes ? `\n\nAdditional Notes:\n${additionalNotes}` : ''}
`;

    onConfirm(prompt);
    setCos('');
    setAdditionalNotes('');
  };

  const handleClose = () => {
    setCos('');
    setAdditionalNotes('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Acceptance Criteria</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conditions of Satisfaction (COS) <span className="text-red-500">*</span>
          </label>
          <textarea
            value={cos}
            onChange={(e) => setCos(e.target.value)}
            placeholder="Enter COS here..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter any extra context or rules..."
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceCriteriaModal;