import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MessageSquare } from 'lucide-react';
import api from '../utils/api';
import LoadingScreen from '../components/admin/LoadingScreen';
import TabNavigation from '../components/admin/TabNavigation';
import OverviewTab from '../components/admin/OverviewTab';
import UsersTab from '../components/admin/UsersTab';
import ConversationsTab from '../components/admin/ConversationsTab';
import UserModal from '../components/admin/UserModal';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userPage, setUserPage] = useState(1);
  const [conversationPage, setConversationPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
    fetchConversations();
    setTimeout(() => setIsPageLoaded(true), 100);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (error.response?.status === 403) {
        navigate('/');
      }
    }
  };

  const fetchUsers = async (page = 1, search = '') => {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=10&search=${search}`);
      setUsers(response.data);
      setUserPage(page);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchConversations = async (page = 1) => {
    try {
      const response = await api.get(`/admin/conversations?page=${page}&limit=10`);
      setConversations(response.data);
      setConversationPage(page);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchTerm);
  };

  const userActions = {
    create: async (userForm) => {
      await api.post('/admin/users', userForm);
      fetchUsers(userPage, searchTerm);
    },
    update: async (userId, userForm) => {
      await api.put(`/admin/users/${userId}`, userForm);
      fetchUsers(userPage, searchTerm);
    },
    delete: async (userId) => {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers(userPage, searchTerm);
    },
    resetPassword: async (userId, newPassword) => {
      await api.post(`/admin/users/${userId}/reset-password`, { newPassword });
    },
    deleteApiKey: async (userId) => {
      await api.delete(`/admin/users/${userId}/api-key`);
    }
  };

  const exportConversations = async () => {
    try {
      const response = await api.get('/admin/export/conversations', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'conversations-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting conversations: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-500 ease-out ${
      isPageLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center py-6 transition-all duration-700 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-indigo-200">Manage users and system analytics</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Back to Chat</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isPageLoaded={isPageLoaded} 
        />

        {activeTab === 'overview' && analytics && (
          <OverviewTab analytics={analytics} isPageLoaded={isPageLoaded} />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userPage={userPage}
            handleSearch={handleSearch}
            fetchUsers={fetchUsers}
            userActions={userActions}
            setShowUserModal={setShowUserModal}
            setEditingUser={setEditingUser}
            isPageLoaded={isPageLoaded}
          />
        )}

        {activeTab === 'conversations' && (
          <ConversationsTab
            conversations={conversations}
            conversationPage={conversationPage}
            fetchConversations={fetchConversations}
            exportConversations={exportConversations}
            isPageLoaded={isPageLoaded}
          />
        )}
      </div>

      {showUserModal && (
        <UserModal
          editingUser={editingUser}
          userActions={userActions}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;