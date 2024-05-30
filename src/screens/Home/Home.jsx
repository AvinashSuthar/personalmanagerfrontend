import React from 'react';
import Card from '../../components/card/MyCard';
import './_Home.css'; // Import your CSS file for styling

function Home() {
  return (
    <div className="notes-container">
      <div className="notes m-auto ">
        <Card title="FaStickyNote" heading="Notes" text="Jot down your ideas and inspirations..." path="/notes" />
        <Card title="FaTasks" heading="Todos" text="Prioritize your to-dos and stay productive..." path="/todo" />
        <Card title="FaCalendarAlt" heading="Scheduler" text="Plan your schedule ahead and never miss an important date..." path="/scheduler" />
        <Card title="FaBook" heading="Diary" text="Reflect on your day and record your memories..." path="/diary" />
        {/* <Card title="FaCalendarCheck" heading="Daily Routine" text="Manage your daily tasks and boost your productivity..." path="/dailytask" /> */}
        <Card title="FaBullseye" heading="Goals" text="Dream big, set goals, and make them a reality..." path="/goals" />
      </div>
    </div>
  );
}

export default Home;
