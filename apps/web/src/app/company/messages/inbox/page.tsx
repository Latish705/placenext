"use client";

import { useState } from 'react';

export default function CompanyMessages() {
    const [activeTab, setActiveTab] = useState('inbox');

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>
            
            <div className="bg-white rounded-lg shadow-md">
                {/* Tab Navigation */}
                <div className="border-b">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('inbox')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'inbox' 
                                    ? 'border-b-2 border-blue-500 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Inbox
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'sent' 
                                    ? 'border-b-2 border-blue-500 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Sent
                        </button>
                        <button
                            onClick={() => setActiveTab('compose')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'compose' 
                                    ? 'border-b-2 border-blue-500 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Compose
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'inbox' && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages in inbox</h3>
                            <p className="text-gray-500">Messages from students and colleges will appear here.</p>
                        </div>
                    )}

                    {activeTab === 'sent' && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No sent messages</h3>
                            <p className="text-gray-500">Messages you send will appear here.</p>
                        </div>
                    )}

                    {activeTab === 'compose' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-semibold mb-4">Compose Message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                                    <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select recipient...</option>
                                        <option value="students">All Students</option>
                                        <option value="college">College Administration</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter subject..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                                    <textarea 
                                        rows={8}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Type your message here..."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Send Message
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                    >
                                        Save Draft
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
