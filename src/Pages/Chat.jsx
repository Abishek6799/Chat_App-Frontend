import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../Components/Navbar';
import UserList from '../Components/UserList';
import api from '../Services/api';

const socket = io('http://localhost:4000');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem('userId');
  const loggedInUserName = localStorage.getItem('name');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }

    if (loggedInUserId) {
      socket.emit('register', loggedInUserId);
    }

    if (selectedUser) {
      api
        .get(`/message/get/${selectedUser._id}`)
        .then((response) => setMessages(response.data))
        .catch(() => toast.error('Error fetching messages'));
    }

    socket.on('chat message', (newMessage) => {
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off('chat message');
    };
  }, [navigate, loggedInUserId, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const newMessage = {
      text: message,
      senderId: loggedInUserId,
      receiverId: selectedUser._id,
      user: { name: loggedInUserName },
      timestamp: new Date(),
    };

    try {
      await api.post('/message/send', {
        text: message,
        receiverId: selectedUser._id,
      });

      socket.emit('chat message', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-grow mt-16">
        <div className="w-1/4 bg-gray-800 border-r border-gray-700">
          <UserList
            loggedInUserId={loggedInUserId}
            onUserSelect={setSelectedUser}
            selectedUserId={selectedUser?._id}
          />
        </div>

        <div className="w-3/4 flex flex-col bg-gray-700">

          {selectedUser ? (
            <div className="flex flex-col flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => {
                const isCurrentUser =
                  msg.sender?._id === loggedInUserId || msg.senderId === loggedInUserId;
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`${
                        isCurrentUser ? 'bg-teal-500 text-white' : 'bg-gray-800 text-gray-200'
                      } rounded-lg px-5 py-3 max-w-xs shadow-md`}
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      <p className="text-base">{msg.text || 'Message not available'}</p>
                    </div>
                    <small className="text-gray-400 mt-1 mb-5 text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString("en-US",{hour:'2-digit',minute:'2-digit',hour12:true})}
                    </small>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a user to start chatting.
            </div>
          )}

          {selectedUser && (
            <form
              onSubmit={sendMessage}
              className="flex items-center gap-2 p-4 bg-gray-800 border-t border-gray-600"
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-lg bg-gray-700 text-white focus:outline-none resize-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
