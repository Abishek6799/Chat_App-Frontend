import React, { useEffect, useState } from 'react';
import api from '../Services/api';

const UserList = ({ loggedInUserId, onUserSelect, selectedUserId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        const filteredUsers = response.data.filter((user) => user._id !== loggedInUserId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (loggedInUserId) {
      fetchUsers();
    }
  }, [loggedInUserId]);

  return (
    <div className="bg-gray-900 text-white p-4 h-full overflow-y-auto rounded-lg shadow-lg">
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onUserSelect(user)}
            className={`flex items-center gap-4 p-3 cursor-pointer rounded-lg transition-all ${
              selectedUserId === user._id ? 'bg-teal-500 text-white' : 'hover:bg-gray-800'
            }`}
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold">
              {user.name[0]}
            </div>
            <span className="font-medium">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
