import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../protectedroute/AuthContext';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './_Diary.css';

function Diary() {
  const { user, fetchUserDetails } = useContext(AuthContext);
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('');
  const [weather, setWeather] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editEntry, setEditEntry] = useState('');
  const [editMood, setEditMood] = useState('');
  const [editWeather, setEditWeather] = useState('');
  const [editTags, setEditTags] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const BaseUrl = "https://personalmangerbackend.onrender.com";
  const handleCreateEntry = async () => {
    if (!entry.trim()) {
      setError('Entry cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BaseUrl}/api/diary`,
        { entry, mood, weather, tags: tags.split(',').map(tag => tag.trim()) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Entry created successfully');
      setEntry('');
      setMood('');
      setWeather('');
      setTags('');
      setShowCreateForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BaseUrl}/api/diary/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUserDetails(token);
      setMessage('Entry deleted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleUpdateEntry = async (entryId) => {
    if (!editEntry.trim()) {
      setError('Entry cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BaseUrl}/api/diary/${entryId}`,
        { entry: editEntry, mood: editMood, weather: editWeather, tags: editTags.split(',').map(tag => tag.trim()) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Entry updated successfully');
      setEditEntryId(null);
      setEditEntry('');
      setEditMood('');
      setEditWeather('');
      setEditTags('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const startEditEntry = (entry) => {
    setEditEntryId(entry._id);
    setEditEntry(entry.entry);
    setEditMood(entry.mood);
    setEditWeather(entry.weather);
    setEditTags(entry.tags.join(', '));
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
      <h1 className='text-center border-bottom' style={{ background: 'linear-gradient(to right, violet, blue)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Diary</h1>

      <div className='msg'>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </div>

      {user && user.diary ? (
        <ul>
          {user.diary.map((entry) => (
            <div key={entry._id} className="entry " onMouseEnter={() => setHoverId(entry._id)} onMouseLeave={() => setHoverId(null)}>
              {editEntryId === entry._id ? (
                <div className="editform">
                  <textarea
                    value={editEntry}
                    onChange={(e) => setEditEntry(e.target.value)}
                    placeholder="Enter your diary entry"
                    required
                  />
                  <input
                    type="text"
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                    placeholder="Mood"
                    required
                  />
                  <input
                    type="text"
                    value={editWeather}
                    onChange={(e) => setEditWeather(e.target.value)}
                    placeholder="Weather"
                    required
                  />
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    required
                  />
                  <div>
                    <button className='editbtn' style={{ color: 'green' }} onClick={() => handleUpdateEntry(entry._id)}><FaCheck /></button>
                    <button className='editbtn' style={{ color: 'red' }} onClick={() => setEditEntryId(null)}><FaTimes /></button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{fontStyle:'italic' ,textDecoration:"underline" }}>{new Date(entry.entryDate).toLocaleString()}</p>
                  <p>{entry.entry}</p>
                  <p><strong>Mood:</strong> {entry.mood}</p>
                  <p><strong>Weather:</strong> {entry.weather}</p>
                  <p><strong>Tags:</strong> {entry.tags.join(', ')}</p>
                  {hoverId === entry._id && (
                    <div className="entryActions">
                      <button className='editbtn' style={{ color: 'green' }} onClick={() => handleDeleteEntry(entry._id)}><FaTrash /></button>
                      <button className='editbtn' style={{ color: 'red' }} onClick={() => startEditEntry(entry)}><FaEdit /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p>No entries available.</p>
      )}

      {showCreateForm && (
        <div className="createForm editform">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Enter your diary entry"
            required
          />
                      <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Mood"
              required
            />
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="Weather"
              required
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              required
            />
            <button className='createBtn' onClick={handleCreateEntry}>Create New Entry</button>
          </div>
        )}

        <button className='toggleButton btn' onClick={toggleCreateForm}>
          <FaPlus />
        </button>
      </div>
    );
}

export default Diary;

