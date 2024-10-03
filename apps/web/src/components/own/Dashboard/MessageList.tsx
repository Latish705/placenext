// components/MessageList.js
"use client"; // Ensure this is included

import { useState } from "react";
import MessageDetail from "./MessageDetail";

const messages = [
  {
    id: 1,
    from: "admin@college.edu",
    to: "student1@college.edu",
    subject: "Invalid Marksheet - Name doesn’t match",
    body: "Dear Student, your submitted marksheet has a name mismatch. Please submit a valid one.",
    category: "invalid marksheet",
  },
  {
    id: 2,
    from: "hr@company.com",
    to: "student1@college.edu",
    subject: "Job Offer",
    body: "Congratulations! You have been selected for the Software Engineer position at our company.",
    category: "job-related",
  },
  {
    id: 1,
    from: "admin@college.edu",
    to: "student1@college.edu",
    subject: "Invalid Marksheet - Name doesn’t match",
    body: "Dear Student, your submitted marksheet has a name mismatch. Please submit a valid one.",
    category: "invalid marksheet",
  },
  {
    id: 2,
    from: "hr@company.com",
    to: "student1@college.edu",
    subject: "Job Offer",
    body: "Congratulations! You have been selected for the Software Engineer position at our company.",
    category: "job-related",
  },
  {
    id: 1,
    from: "admin@college.edu",
    to: "student1@college.edu",
    subject: "Invalid Marksheet - Name doesn’t match",
    body: "Dear Student, your submitted marksheet has a name mismatch. Please submit a valid one.",
    category: "invalid marksheet",
  },
  {
    id: 2,
    from: "hr@company.com",
    to: "student1@college.edu",
    subject: "Job Offer",
    body: "Congratulations! You have been selected for the Software Engineer position at our company.",
    category: "job-related",
  },
  {
    id: 1,
    from: "admin@college.edu",
    to: "student1@college.edu",
    subject: "Invalid Marksheet - Name doesn’t match",
    body: "Dear Student, your submitted marksheet has a name mismatch. Please submit a valid one.",
    category: "invalid marksheet",
  },
  {
    id: 2,
    from: "hr@company.com",
    to: "student1@college.edu",
    subject: "Job Offer",
    body: "Congratulations! You have been selected for the Software Engineer position at our company.",
    category: "job-related",
  },
  {
    id: 1,
    from: "admin@college.edu",
    to: "student1@college.edu",
    subject: "Invalid Marksheet - Name doesn’t match",
    body: "Dear Student, your submitted marksheet has a name mismatch. Please submit a valid one.",
    category: "invalid marksheet",
  },
  {
    id: 2,
    from: "hr@company.com",
    to: "student1@college.edu",
    subject: "Job Offer",
    body: "Congratulations! You have been selected for the Software Engineer position at our company.",
    category: "job-related",
  },
];

const MessageList = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleClick = (message: any) => {
    setSelectedMessage(message);
  };

  return (
    <div className="flex  min-h-screen p-6 bg-gray-100 w-full">
      {selectedMessage ? (
        <MessageDetail
          message={selectedMessage}
          setSelectedMessage={setSelectedMessage}
        />
      ) : (
        <div className="flex-1 bg-white shadow-md rounded-lg divide-y divide-gray-200 overflow-y-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 hover:bg-gray-100 cursor-pointer flex flex-col"
              onClick={() => handleClick(message)}
            >
              <div className="flex flex-row justify-between ">
                <div className="font-semibold text-gray-900">
                  {message.subject}
                </div>
                <div className="text-gray-500">{message.from}</div>
              </div>
              <div className="text-sm text-gray-400">
                {message.body.slice(0, 50)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
