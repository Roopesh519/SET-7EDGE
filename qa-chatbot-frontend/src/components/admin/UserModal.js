import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Edit3, Save, X, Plus, Shield, BarChart3 } from 'lucide-react';

const UserModal = ({ editingUser, userActions, onClose }) => {
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: false,
    trialPromptsUsed: 0
  });

  useEffect(() => {
    if (editingUser) {
      setUserForm({
        username: editingUser.username,
        email: editingUser.email,
        isAdmin: editingUser.isAdmin,
        trialPromptsUsed: editingUser.trialPromptsUsed || 0
      });
    } else {
      setUserForm({
        username: '',
        email: '',
        password: '',
        isAdmin: false,
        trialPromptsUsed: 0
      });
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userActions.update(editingUser._id, {
          username: userForm.username,
          email: userForm.email,
          isAdmin: userForm.isAdmin,
          trialPromptsUsed: userForm.trialPromptsUsed
        });
        alert('User updated successfully!');
      } else {
        await userActions.create(userForm);
        alert('User created successfully!');
      }
      onClose();
    } catch (error) {
      alert(`Error ${editingUser ? 'updating' : 'creating'} user: ` + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white bg-opacity-95 backdrop-blur-md border border-white border-opacity-20 w-full max-w-md shadow-2xl rounded-2xl animate-fade-in">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              {editingUser ? (
                <>
                  <Edit3 className="w-6 h-6 mr-3 text-indigo-500" />
                  Edit User
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 mr-3 text-green-500" />
                  Create New User
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Username
              </label>
              <input
                type="text"
                required
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:shadow-sm"
                placeholder="Enter username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:shadow-sm"
                placeholder="Enter email address"
              />
            </div>

            {/* Password (only for new users) */}
            {!editingUser && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-gray-500" />
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:shadow-sm"
                  placeholder="Enter password"
                />
              </div>
            )}

            {/* Trial Prompts (only for editing) */}
            {editingUser && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                  Trial Prompts Used
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={userForm.trialPromptsUsed}
                  onChange={(e) => setUserForm({ ...userForm, trialPromptsUsed: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:shadow-sm"
                />
              </div>
            )}

            {/* Admin Checkbox */}
            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
              <input
                type="checkbox"
                id="isAdmin"
                checked={userForm.isAdmin}
                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label htmlFor="isAdmin" className="flex items-center text-gray-700 font-semibold cursor-pointer">
                <Shield className="w-4 h-4 mr-2 text-red-500" />
                Admin User
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {editingUser ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update User</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserModal;