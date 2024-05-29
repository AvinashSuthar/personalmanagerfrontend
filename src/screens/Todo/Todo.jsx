import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../protectedroute/AuthContext';
import './_Todo.css';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

function Todos() {
  const { user, fetchUserDetails } = useContext(AuthContext);
  const [hoverId, setHoverId] = useState(null);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };
  const BaseUrl = "https://personalmangerbackend.onrender.com";
 
  const handleCreateTodo = async () => {
    if (!task.trim()) {
      setError('Task cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BaseUrl}/api/todos`,
        { task, dueDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Todo created successfully');
      setTask('');
      setDueDate('');
      setShowCreateForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BaseUrl}/api/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUserDetails(token);
      setMessage('Todo deleted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleUpdateTodo = async (todoId) => {
    if (!editTask.trim()) {
      setError('Task cannot be empty');
      return;
    }
    setError(null);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BaseUrl}/api/todos/${todoId}`,
        { task: editTask, dueDate: new Date(editDueDate) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Todo updated successfully');
      setEditTask('');
      setEditDueDate('');
      setEditTodoId(null);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleMarkDoneTodo = async (todoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BaseUrl}/api/todos/${todoId}/markdone`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserDetails(token);
      setMessage('Todo marked as done successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const startEditTodo = (todo) => {
    setEditTodoId(todo._id);
    setEditTask(todo.task);
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString() : '');
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
  const formatDueDate = (dueDate) => {
    if(!dueDate){
      return "no due date";
    }
    const date = new Date(dueDate);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };



  return (
    <div>
      <h1 className='text-center border-bottom' style={{ background: 'linear-gradient(to right, violet, blue)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Todo</h1>
      <div className='msg'>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      </div>
      
      {user && user.todo ? (
          <ul>
          {user.todo.map((todo) => (
            <div 
              key={todo._id} 
              className="todo" 
              onMouseEnter={() => setHoverId(todo._id)} 
              onMouseLeave={() => setHoverId(null)}
            >
              {todo._id === editTodoId ? (
                <div className="editform">
                  <input
                    type="text"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    placeholder="Task"
                  />
                  <input
                    type="datetime-local"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                  <div>
                    <button
                      className='editbtn'
                      style={{ color: 'green' }}
                      onClick={() => handleUpdateTodo(todo._id)}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className='editbtn'
                      style={{ color: 'red' }}
                      onClick={() => setEditTodoId(null)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                
                  <p style={{  color: todo.completed ? 'green' : 'red', fontWeight:'500', margin:'10px 0 10px'}}> {todo.completed && <FaCheck/>} &nbsp;
                    {todo.task}
                  </p>
                  <p>Due date :  {todo.dueDate ? formatDueDate(todo.dueDate) : 'No due date'}</p>
                  
                  {hoverId === todo._id && (
                    <div className="todoActions">
                      <button className='editbtn' style={{ color: 'red' }} onClick={() => handleDeleteTodo(todo._id)}>
                        <FaTrash />
                      </button>
                      <button className='editbtn' style={{ color: 'green' }} onClick={() => startEditTodo(todo)}>
                        <FaEdit />
                      </button>
                      {!todo.completed && (
                        <button className='editbtn' style={{ color: 'blue' }} onClick={() => handleMarkDoneTodo(todo._id)}>
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </ul>
      ) : (
        <p>No todos available.</p>
      )}

      {showCreateForm && (
        <div className="createForm editform">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Task"
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button className='createBtn' onClick={handleCreateTodo} >
            Create New Todo
          </button>
        </div>
      )}

      <button className='toggleButton btn' onClick={toggleCreateForm}>
        <FaPlus />
      </button>

     
    </div>
  );
};
export default Todos;
