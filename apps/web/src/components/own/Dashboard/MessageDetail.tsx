"use client";
// components/MessageDetail.js
const MessageDetail = ({ message, setSelectedMessage }: any) => {
  return (
    <div className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg w-full">
      <button
        className="mb-4 text-blue-500 hover:underline"
        onClick={() => setSelectedMessage(null)}
      >
        Back to Inbox
      </button>
      <div className="mb-4">
        <div className="text-lg font-semibold">Subject: {message.subject}</div>
        <div className="text-sm text-gray-500">From: {message.from}</div>
        <div className="text-sm text-gray-500">To: {message.to}</div>
      </div>
      <div className="text-gray-900">{message.body}</div>
    </div>
  );
};

export default MessageDetail;
