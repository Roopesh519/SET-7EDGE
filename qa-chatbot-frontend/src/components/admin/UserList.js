import React from 'react';
import UserCard from './UserCard';

const UserList = ({ users, userActions, setEditingUser, setShowUserModal }) => {
  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl border border-white border-opacity-20 overflow-hidden">
      <div className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <UserCard
            key={user._id}
            user={user}
            index={index}
            userActions={userActions}
            setEditingUser={setEditingUser}
            setShowUserModal={setShowUserModal}
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;