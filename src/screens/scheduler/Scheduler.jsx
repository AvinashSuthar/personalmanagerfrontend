import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../protectedroute/AuthContext';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './_Scheduler.css';
function Scheduler() {
  const { user, fetchUserDetails } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editScheduledDate, setEditScheduledDate] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hoverId, setHoverId] = useState(null);

  const formatDueDate = (dueDate) => {
    if(!dueDate){
      return "no Date Provided";
    }
    const date = new Date(dueDate);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };
  const BaseUrl = "https://personalmangerbackend.onrender.com";

  const handleCreateScheduler = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BaseUrl}/api/scheduler`,
        { title, description, scheduledDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Scheduler entry created successfully');
      setTitle('');
      setDescription('');
      setScheduledDate('');
      setShowCreateForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDeleteScheduler = async (schedulerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BaseUrl}/api/scheduler/${schedulerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUserDetails(token);
      setMessage('Scheduler entry deleted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (scheduler) => {
    setEditId(scheduler._id);
    setEditTitle(scheduler.title);
    setEditDescription(scheduler.description);
    setEditScheduledDate(scheduler.scheduledDate);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
    setEditScheduledDate('');
  };

  const handleUpdateScheduler = async () => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BaseUrl}/api/scheduler/${editId}`,
        { title: editTitle, description: editDescription, scheduledDate: editScheduledDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Scheduler entry updated successfully');
      setEditId(null);
      setEditTitle('');
      setEditDescription('');
      setEditScheduledDate('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  useEffect(() => {
    const hideAfterDelay = setTimeout(() => {
      setError('');
      setMessage('');
    }, 1000);

    return () => clearTimeout(hideAfterDelay);
  }, [error, message]);

  return (
    <div>
      <h1 className='text-center border-bottom' style={{ background: 'linear-gradient(to right, violet, blue)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Scheduler</h1>

      <div className='msg'>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </div>

      {user && user.scheduler ? (
        <ul>
          {user.scheduler.map((entry) => (
            <div key={entry._id} className="schedule" onMouseEnter={() => setHoverId(entry._id)} onMouseLeave={() => setHoverId(null)}>
              {editId === entry._id ? (
                <div className="editform">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <input
                    type="datetime-local"
                    value={editScheduledDate}
                    onChange={(e) => setEditScheduledDate(e.target.value)}
                  />
                  <div>
                    <button className='editbtn' style={{ color: 'green' }} onClick={handleUpdateScheduler}><FaCheck /></button>
                    <button className='editbtn' style={{ color: 'red' }} onClick={handleCancelEdit}><FaTimes /></button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{fontWeight:'bold'}}>"{entry.title}" <span style={{fontWeight:'normal', fontStyle:'italic'}}>is Scheduled {formatDueDate(entry.scheduledDate)} </span> </p>
                  <p>{entry.description}</p>
                  {/* <p> </p> */}
                  {hoverId === entry._id && (
                    <div className="scheduleActions">
                      <button style={{ color: 'red' }} onClick={() => handleDeleteScheduler(entry._id)}><FaTrash /></button>
                      <button style={{ color: 'green' }} onClick={() => handleEdit(entry)}><FaEdit /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p>No schedules available.</p>
      )}

      {showCreateForm && (
        <div className="createForm editform">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <button className='createBtn' onClick={handleCreateScheduler}>Create New Scheduler Entry</button>
        </div>
      )}

      <button className='toggleButton btn' onClick={toggleCreateForm}>
        <FaPlus />
      </button>
    </div>
  );
}

export default Scheduler;
