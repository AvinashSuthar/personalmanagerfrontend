import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../protectedroute/AuthContext';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './_Goals.css';

function Goals() {
  const { user, fetchUserDetails } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [editGoalId, setEditGoalId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const BaseUrl = "https://personalmangerbackend.onrender.com";
  const formatDueDate = (dueDate) => {
    if(!dueDate){
      return "no due date";
    }
    const date = new Date(dueDate);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };
  const handleCreateGoal = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BaseUrl}/api/goals`,
        { title, description, targetDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Goal created successfully');
      setTitle('');
      setDescription('');
      setTargetDate('');
      setShowCreateForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BaseUrl}/api/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUserDetails(token);
      setMessage('Goal deleted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (goal) => {
    setEditGoalId(goal._id);
    setEditTitle(goal.title);
    setEditDescription(goal.description);
    setEditTargetDate(goal.targetDate);
  };

  const handleCancelEdit = () => {
    setEditGoalId(null);
    setEditTitle('');
    setEditDescription('');
    setEditTargetDate('');
  };

  const handleUpdateGoal = async () => {
    if (!editTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BaseUrl}/api/goals/${editGoalId}`,
        { title: editTitle, description: editDescription, targetDate: editTargetDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Goal updated successfully');
      setEditGoalId(null);
      setEditTitle('');
      setEditDescription('');
      setEditTargetDate('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleMarkCompleted = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BaseUrl}/api/goals/${goalId}/markachieved`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Goal marked as completed');
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
      <h1 className='text-center border-bottom' style={{ background: 'linear-gradient(to right, violet, blue)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Goals</h1>

      <div className='msg'>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </div>

      {user && user.goals ? (
        <ul>
          {user.goals.map((goal) => (
            <div key={goal._id} className="goal" onMouseEnter={() => setHoverId(goal._id)} onMouseLeave={() => setHoverId(null)}>
              {editGoalId === goal._id ? (
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
                    type="date"
                    value={editTargetDate}
                    onChange={(e) => setEditTargetDate(e.target.value)}
                  />
                  <div>
                    <button className='editbtn' style={{ color: 'green' }} onClick={handleUpdateGoal}><FaCheck /></button>
                    <button className='editbtn' style={{ color: 'red' }} onClick={handleCancelEdit}><FaTimes /></button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{fontWeight:'bold'}}>"{goal.title}" <span style={{fontWeight:'normal', fontStyle:'italic'}}>Target Date: {formatDueDate(goal.targetDate)}</span> </p>
                  <p>{goal.description}</p>
                  <p>{goal.achieved ? 'Completed' : 'Not Completed'}</p>
                  {hoverId === goal._id && (
                    <div className="goalActions">
                      {!goal.achieved && <button style={{ color: 'green' }} onClick={() => handleMarkCompleted(goal._id)}><FaCheck/></button>}
                      <button style={{ color: 'red' }} onClick={() => handleDeleteGoal(goal._id)}><FaTrash /></button>
                      <button style={{ color: 'green' }} onClick={() => handleEdit(goal)}><FaEdit /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p>No goals available.</p>
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
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
          <button className='createBtn' onClick={handleCreateGoal}>Create New Goal</button>
        </div>
      )}

      <button className='toggleButton btn' onClick={toggleCreateForm}>
        <FaPlus />
      </button>
    </div>
  );
}

export default Goals;
