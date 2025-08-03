import React from 'react';
import { Mail, Shield, BarChart3, User, Edit3, RefreshCw, Key, Trash2 } from 'lucide-react';

const UserCard = ({ user, index, userActions, setEditingUser, setShowUserModal }) => {
  const getUserInitials = (username) => {
    if (!username || typeof username !== 'string') return '?';
    return username.charAt(0).toUpperCase();
  };

  const getSafeUsername = (username) => username || 'Unknown User';

  const handleEdit = () => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleResetPassword = async () => {
    const newPassword = prompt(`Enter new password for ${getSafeUsername(user.username)}:`);
    if (newPassword && newPassword.length >= 6) {
      try {
        await userActions.resetPassword(user._id, newPassword);
        alert('Password reset successfully!');
      } catch (error) {
        alert('Error resetting password: ' + (error.response?.data?.message || error.message));
      }
    } else if (newPassword) {
      alert('Password must be at least 6 characters long');
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete user "${getSafeUsername(user.username)}"? This will also delete all their conversations.`)) {
      try {
        await userActions.delete(user._id);
        alert('User deleted successfully!');
      } catch (error) {
        alert('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteApiKey = async () => {
    if (window.confirm(`Delete API key for user "${getSafeUsername(user.username)}"?`)) {
      try {
        await userActions.deleteApiKey(user._id);
        alert('API key deleted successfully!');
      } catch (error) {
        alert('Error deleting API key: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-all duration-200" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* User Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">
                {getUserInitials(user.username)}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h4 className="text-lg font-semibold text-gray-800">{getSafeUsername(user.username)}</h4>
              {user.isAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 flex items-center mt-1 break-all">
              <Mail className="w-4 h-4 mr-2" />
              {user.email || 'No email'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center">
                <BarChart3 className="w-3 h-3 mr-1" />
                Trial: {user.trialPromptsUsed || 0}/5
              </span>
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-start sm:justify-end">
          <button
            onClick={handleEdit}
            className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleResetPassword}
            className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleDeleteApiKey}
            className="flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Key className="w-4 h-4" />
            <span>API</span>
          </button>

          <button
            onClick={handleDeleteUser}
            className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;