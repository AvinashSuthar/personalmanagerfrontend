import React from 'react'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import './_MyCard.css'; // Import your CSS file for styling
import { FaStickyNote, FaTasks, FaCalendarAlt, FaBook, FaCalendarCheck, FaBullseye } from 'react-icons/fa';
function MyCard({title ,heading, text,path}) {
  let IconComponent = null;
  switch (title) {
    case 'FaStickyNote':
      IconComponent = FaStickyNote;
      break;
    case 'FaTasks':
      IconComponent = FaTasks;
      break;
    case 'FaCalendarAlt':
      IconComponent = FaCalendarAlt;
      break;
    case 'FaBook':
      IconComponent = FaBook;
      break;
    case 'FaCalendarCheck':
      IconComponent = FaCalendarCheck;
      break;
    case 'FaBullseye':
      IconComponent = FaBullseye;
      break;
    default:
      IconComponent = null;
  }
  return (
      <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>

    <div><Card style={{ width: '15rem' , height:'300px' , border:'none' }}>
      <Card.Body>
      {IconComponent && <IconComponent className="card-icon" color="#4a00e0" fontSize="1.5em" />}
        <Card.Title>{heading}</Card.Title>
        <Card.Text>
          {text}
        </Card.Text>
      </Card.Body>
    </Card></div> 
      </Link>
  ) 
}

export default MyCard