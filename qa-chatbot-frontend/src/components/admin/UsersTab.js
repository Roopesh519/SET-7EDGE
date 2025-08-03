import React from 'react';
import { Search, Plus } from 'lucide-react';
import UserList from './UserList';
import Pagination from './Pagination';

const UsersTab = ({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  userPage,
  handleSearch, 
  fetchUsers, 
  userActions,
  setShowUserModal,
  setEditingUser,
  isPageLoaded 
}) => {
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  return (
    <div className={`space-y-6 transition-all duration-700 delay-200 ease-out ${
      isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* User Management Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
        <form onSubmit={handleSearch} className="flex space-x-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleCreateUser}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      <UserList 
        users={users.users || []} 
        userActions={userActions}
        setEditingUser={setEditingUser}
        setShowUserModal={setShowUserModal}
      />

      <Pagination
        currentPage={users.currentPage}
        totalPages={users.totalPages}
        total={users.total}
        onPageChange={(page) => fetchUsers(page, searchTerm)}
        itemName="users"
      />
    </div>
  );
};

export default UsersTab;