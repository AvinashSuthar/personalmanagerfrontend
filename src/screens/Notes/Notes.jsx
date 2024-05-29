import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../protectedroute/AuthContext';
import './_Notes.css';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
function Notes() {
  const { user, fetchUserDetails } = useContext(AuthContext); // Destructuring fetchUserDetails directly
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hoverId, setHoverId] = useState(null); // Define hoverId state
  const BaseUrl = "https://personalmangerbackend.onrender.com";

  const handleCreateNote = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      await axios.post(
        `${BaseUrl}/api/notes`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token); // Fetching user details to update context
      setMessage('Note created successfully');
      setContent(''); // Clear the input field
      setShowCreateForm(false); // Hide the create form
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await fetchUserDetails(token); // Fetching user details to update context

      await axios.delete(`${BaseUrl}/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUserDetails(token); // Fetching user details to update context
      setMessage('Note deleted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleUpdateNote = async (noteId) => {
    if (!editContent.trim()) {
      setError('Content cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BaseUrl}/api/notes/${noteId}`,
        { content: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token); // Fetching user details to update context
      setMessage('Note updated successfully');
      setEditContent(''); // Clear the input field
      setEditNoteId(null); // Exit edit mode
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const startEditNote = (note) => {
    setEditNoteId(note._id);
    setEditContent(note.content);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };
  useEffect(() => {
    // Function to hide error and message after one second
    const hideAfterDelay = setTimeout(() => {
      setError('');
      setMessage('');
    }, 1000);

    // Clear timeout when component unmounts
    return () => clearTimeout(hideAfterDelay);
  }, [error, message]); // Re-run effect when error or message changes
  return (
    <div >
      <h1 className='text-center border-bottom' style={{ background: 'linear-gradient(to right, violet, blue)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Notes</h1>

      <div className='msg' >
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </div>
      {user && user.notes ? (
        <ul>
          {user.notes.map((note) => (
            <div key={note._id} className="note" onMouseEnter={() => setHoverId(note._id)} onMouseLeave={() => setHoverId(null)}>
              {note._id === editNoteId ? (
                <div className="editform">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div >

                    <button className='editbtn' style={{ color: 'green' }} onClick={() => handleUpdateNote(note._id)}><FaCheck /></button>
                    <button className='editbtn' style={{ color: 'red' }} onClick={() => setEditNoteId(null)}><FaTimes /></button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontWeight: '600' }}>{new Date(note.createdAt).toLocaleString()}</p>
                  <p style={{ textAlign: 'justify' }}>{note.content}</p>
                  {hoverId === note._id && (
                    <div className="noteActions">
                      <button style={{ color: 'red' }} onClick={() => handleDeleteNote(note._id)}>  <FaTrash /></button>
                      <button style={{ color: 'green' }} onClick={() => startEditNote(note)}><FaEdit /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p>No notes available.</p>
      )}

      {showCreateForm && (
        <div className="createForm editform">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note content"
          />
          <button className='createBtn' onClick={handleCreateNote}>Create New Note</button>
        </div>
      )}

      <button className='toggleButton btn' onClick={toggleCreateForm}>
        <FaPlus />
      </button>


    </div>
  );
};

export default Notes;
