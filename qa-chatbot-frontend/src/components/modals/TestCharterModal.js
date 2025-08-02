import React, { useState } from 'react';

const TestCharterModal = ({ isOpen, onClose, onConfirm }) => {
    const [formData, setFormData] = useState({
        cos: '',
        persona: '',
        duration: 'Short (30 min)',
        ratio: '90/10',
        bugTime: '',
        environment: '',
        tester: '',
        objectives: '',
        areas: {
            functional: true,
            uiUx: true,
            navigation: true,
            security: true,
            errorHandling: true
        },
        bugs: []
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAreaChange = (area, checked) => {
        setFormData(prev => ({
            ...prev,
            areas: {
                ...prev.areas,
                [area]: checked
            }
        }));
    };

    const addBug = () => {
        const newBug = {
            id: Date.now(),
            severity: 'Medium',
            description: '',
            stepsToReproduce: '',
            status: 'Open'
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
        if (!formData.cos.trim()) {
            alert('Please enter COS for Test Charter');
            return;
        }
        if (!formData.persona.trim()) {
            alert('Please enter Persona for Test Charter');
            return;
        }

        const selectedAreas = Object.entries(formData.areas)
            .filter(([key, value]) => value)
            .map(([key, value]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
            .join(', ');

        // Format bugs for the prompt
        const bugsFormatted = formData.bugs.length > 0 
            ? formData.bugs.map((bug, index) => 
                `Bug ${index + 1}: 
                - Severity: ${bug.severity}
                - Description: ${bug.description || 'To be described'}
                - Steps to Reproduce: ${bug.stepsToReproduce || 'To be documented'}
                - Status: ${bug.status}`
              ).join('\n\n')
            : 'No bugs reported during this session';

        const prompt = `Generate a Test Charter in plain text Markdown based on the following Conditions of Scope (COS): 
COS: ${formData.cos} 
PERSONA: ${formData.persona}
DURATION: ${formData.duration}
CHARTER VS. OPPORTUNITY: ${formData.ratio}
BUG INVESTIGATION & REPORTING: ${formData.bugTime || 'To be determined'}
TESTING AREAS: ${selectedAreas}
TEST ENVIRONMENT: ${formData.environment || 'To be specified'}
TESTER: ${formData.tester || 'To be assigned'}
OBJECTIVES: ${formData.objectives || 'To be defined'}
BUGS FOUND: 
${bugsFormatted}

Structure: CHARTER – Define the testing objectives and expected behavior. AREAS – Table of testing areas (Functional, UI/UX, Navigation, Security, Error Handling). TESTER – Placeholder for tester's name. TASK BREAKDOWN – Outline key testing tasks. DURATION – Specify session length (Short (30 min) / Long (1 hour)). BUG INVESTIGATION & REPORTING – Time allocated for defect analysis. CHARTER VS. OPPORTUNITY – Ratio of structured vs. exploratory testing (e.g., 90/10). TEST NOTES – Key scenarios covering Feature validation, Security, Navigation, Error Handling, UI/UX. TEST CASES – Table format with columns: Test Case ID Steps Expected Outcome Actual Outcome Status (Pass/Fail) POTENTIAL RISKS – Identify risks and challenges. BUGS – Table format with columns: Bug ID Severity Description Steps to Reproduce Status (Open, In Progress, Resolved) ISSUES & CLARIFICATIONS – List open questions needing resolution. ENHANCEMENTS – Suggest usability, security, or performance improvements. PERSONA(Describe the assumed user persona for this session), Test Execution Notes(Important notes to be added to another tester), Resources (specifying the type of environment we have tested in).`;

        onConfirm(prompt);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            cos: '',
            persona: '',
            duration: 'Short (30 min)',
            ratio: '90/10',
            bugTime: '',
            environment: '',
            tester: '',
            objectives: '',
            areas: {
                functional: true,
                uiux: true,
                navigation: true,
                security: true,
                errorHandling: true
            },
            bugs: []
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
                {/* Fixed Header */}
                <div className="p-6 pb-4 border-b border-gray-200">
                    <h3 className="text-lg text-gray-700 font-semibold">Test Charter</h3>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 py-4">
                    <div className="space-y-4">
                        {/* COS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conditions of Scope (COS) *
                            </label>
                            <textarea
                                value={formData.cos}
                                onChange={(e) => handleInputChange('cos', e.target.value)}
                                placeholder="Enter your COS here..."
                                rows={3}
                                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Persona */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Persona *
                            </label>
                            <input
                                type="text"
                                value={formData.persona}
                                onChange={(e) => handleInputChange('persona', e.target.value)}
                                placeholder="Specify your persona (e.g., End User, Admin, Developer)..."
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Duration and Ratio Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Short (30 min)">Short (30 min)</option>
                                    <option value="Long (1 hour)">Long (1 hour)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Charter vs. Opportunity
                                </label>
                                <input
                                    type="text"
                                    value={formData.ratio}
                                    onChange={(e) => handleInputChange('ratio', e.target.value)}
                                    placeholder="e.g., 90/10"
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Bug Investigation Time and Environment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bug Investigation Time
                                </label>
                                <input
                                    type="text"
                                    value={formData.bugTime}
                                    onChange={(e) => handleInputChange('bugTime', e.target.value)}
                                    placeholder="e.g., 15 minutes"
                                    className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Environment
                                </label>
                                <input
                                    type="text"
                                    value={formData.environment}
                                    onChange={(e) => handleInputChange('environment', e.target.value)}
                                    placeholder="e.g., Staging, Production, Dev"
                                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Tester Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tester Name
                            </label>
                            <input
                                type="text"
                                value={formData.tester}
                                onChange={(e) => handleInputChange('tester', e.target.value)}
                                placeholder="Enter tester's name..."
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Objectives */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Charter Objectives
                            </label>
                            <textarea
                                value={formData.objectives}
                                onChange={(e) => handleInputChange('objectives', e.target.value)}
                                placeholder="Brief description of testing objectives..."
                                rows={2}
                                className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Testing Areas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Testing Areas
                            </label>
                            <div className="grid grid-cols-2 gap-2 text-gray-700">
                                {Object.entries(formData.areas).map(([key, value]) => (
                                    <label key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) => handleAreaChange(key, e.target.checked)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Bugs Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Bugs Found During Testing
                                </label>
                                <button
                                    onClick={addBug}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                >
                                    + Add Bug
                                </button>
                            </div>
                            
                            {formData.bugs.length === 0 ? (
                                <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md">
                                    No bugs added yet. Click "Add Bug" to record any issues found during testing.
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
                                            
                                            <div className="grid grid-cols-2 gap-3 mb-3">
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
                                                        <option value="Open">Open</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                        <option value="Closed">Closed</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={bug.description}
                                                    onChange={(e) => updateBug(bug.id, 'description', e.target.value)}
                                                    placeholder="Describe the bug..."
                                                    rows={2}
                                                    className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Steps to Reproduce
                                                </label>
                                                <textarea
                                                    value={bug.stepsToReproduce}
                                                    onChange={(e) => updateBug(bug.id, 'stepsToReproduce', e.target.value)}
                                                    placeholder="1. First step&#10;2. Second step&#10;3. Expected vs actual result"
                                                    rows={3}
                                                    className="w-full px-2 py-1 border text-gray-700 border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCharterModal;