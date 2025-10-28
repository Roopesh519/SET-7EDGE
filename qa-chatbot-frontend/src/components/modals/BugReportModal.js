import React, { useState } from 'react';

const BugReportModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    title: '',
    environment: '',
    bugs: [],
    additionalInfo: ''
  });

  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addBug = () => {
    const newBug = {
      id: Date.now(),
      severity: 'Medium',
      priority: 'Medium',
      status: 'New',
      description: '',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: ''
    };
    
    setFormData(prev => ({
      ...prev,
      bugs: [...prev.bugs, newBug]
    }));
  };

  const removeBug = (bugId) => {
    setFormData(prev => ({
      ...prev,
      bugs: prev.bugs.filter(bug => bug.id !== bugId)
    }));
  };

  const updateBug = (bugId, field, value) => {
    setFormData(prev => ({
      ...prev,
      bugs: prev.bugs.map(bug => 
        bug.id === bugId ? { ...bug, [field]: value } : bug
      )
    }));
  };

  const handleConfirm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a bug report title');
      return;
    }

    if (formData.bugs.length === 0) {
      setError('Please add at least one bug');
      return;
    }

    // Validate that each bug has a description
    const bugsWithoutDescription = formData.bugs.filter(bug => !bug.description.trim());
    if (bugsWithoutDescription.length > 0) {
      setError('All bugs must have a description');
      return;
    }

    setError('');

    // Format bugs for the prompt
    const bugsFormatted = formData.bugs.map((bug, index) => 
      `Bug ${index + 1}:
- Severity: ${bug.severity}
- Priority: ${bug.priority}
- Status: ${bug.status}
- Description: ${bug.description}
- Steps to Reproduce: ${bug.stepsToReproduce || 'Not provided'}
- Expected Behavior: ${bug.expectedBehavior || 'Not specified'}
- Actual Behavior: ${bug.actualBehavior || 'Not specified'}`
    ).join('\n\n');

    const prompt = `Generate a professional Bug Report document based on the following details:

**Bug Report Title:**
${formData.title}

**Environment:** ${formData.environment || 'Not specified'}

**Bugs Found:**
${bugsFormatted}

${formData.additionalInfo ? `**Additional Information:**\n${formData.additionalInfo}` : ''}

Please generate a comprehensive bug report with all relevant details including impact assessment, reproducibility information, and any recommendations for fixing the issues.`;

    onConfirm(prompt);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      environment: '',
      bugs: [],
      additionalInfo: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl space-y-6 max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Bug Report</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Bug Report Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bug Report Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief title for this bug report..."
              className={`w-full px-3 py- Их-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 ${
                error && !formData.title.trim() ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <input
              type="text"
              value={formData.environment}
              onChange={(e) => handleInputChange('environment', e.target.value)}
              placeholder="e.g., Production, Staging, Dev, Browser, OS, Device..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bugs Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Bugs <span className="text-red-500">*</span>
              </label>
            </div>
            
            {formData.bugs.length === 0 ? (
              <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md">
                No bugs added yet. Click "Add Bug" to record an issue.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.bugs.map((bug, index) => (
                  <div key={bug.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Bug #{index + 1}</h4>
                      <button
                        onClick={() => removeBug(bug.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    {/* Severity, Priority, Status */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Severity
                        </label>
                        <select
                          value={bug.severity}
                          onChange={(e) => updateBug(bug.id, 'severity', e.target.value)}
                          className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                          <option value="Trivial">Trivial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Priority
                        </label>
                        <select
                          value={bug.priority}
                          onChange={(e) => updateBug(bug.id, 'priority', e.target.value)}
                          className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Status
                        </label>
                        <select
                          value={bug.status}
                          onChange={(e) => updateBug(bug.id, 'status', e.target.value)}
                          className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="New">New</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Fixed">Fixed</option>
                          <option value="Verified">Verified</option>
                          <option value="Closed">Closed</option>
                          <option value="Reopened">Reopened</option>
                          <option value="Deferred">Deferred</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={bug.description}
                        onChange={(e) => updateBug(bug.id, 'description', e.target.value)}
                        placeholder="Describe the bug..."
                        rows={2}
                        className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Steps to Reproduce */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Steps to Reproduce
                      </label>
                      <textarea
                        value={bug.stepsToReproduce}
                        onChange={(e) => updateBug(bug.id, 'stepsToReproduce', e.target.value)}
                        placeholder="1. First step&#10;2. Second step&#10;3. Expected vs actual result"
                        rows={2}
                        className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    {/* Expected vs Actual Behavior */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Expected Behavior
                        </label>
                        <textarea
                          value={bug.expectedBehavior}
                          onChange={(e) => updateBug(bug.id, 'expectedBehavior', e.target.value)}
                          placeholder="What should happen..."
                          rows={2}
                          className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Actual Behavior
                        </label>
                        <textarea
                          value={bug.actualBehavior}
                          onChange={(e) => updateBug(bug.id, 'actualBehavior', e.target.value)}
                          placeholder="What actually happens..."
                          rows={2}
                          className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={addBug}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                + Add Bug
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Additional notes, workarounds, related issues, attachments info, etc..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-2 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Generate Bug Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugReportModal;

