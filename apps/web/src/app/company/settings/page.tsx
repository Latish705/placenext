"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BackendUrl } from '@/utils/constants';

interface CompanyProfile {
    comp_name: string;
    comp_contact_person: string;
    comp_industry: string;
    comp_website: string;
    comp_contact_no: string;
    comp_location: string;
    comp_address: string;
    comp_no_employs: number;
}

export default function CompanySettings() {
    const router = useRouter();
    const [profile, setProfile] = useState<CompanyProfile>({
        comp_name: '',
        comp_contact_person: '',
        comp_industry: '',
        comp_website: '',
        comp_contact_no: '',
        comp_location: '',
        comp_address: '',
        comp_no_employs: 0,
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchCompanyProfile();
    });

    const fetchCompanyProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/authentication/companyLogin');
                return;
            }

            const response = await axios.get(`${BackendUrl}/api/company/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                setProfile(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching company profile:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${BackendUrl}/api/company/profile`,
                profile,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: name === 'comp_no_employs' ? Number(value) : value
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Company Settings</h1>
            
            <div className="bg-white rounded-lg shadow-md">
                {/* Tab Navigation */}
                <div className="border-b">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'profile' 
                                    ? 'border-b-2 border-blue-500 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Company Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'account' 
                                    ? 'border-b-2 border-blue-500 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Account Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`px-6 py-4 text-sm font-medium ${
                                activeTab === 'notifications' 
                                    ? 'border-b-2 border-blue-500 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Notifications
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="comp_name"
                                            value={profile.comp_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Person *
                                        </label>
                                        <input
                                            type="text"
                                            name="comp_contact_person"
                                            value={profile.comp_contact_person}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Industry
                                        </label>
                                        <input
                                            type="text"
                                            name="comp_industry"
                                            value={profile.comp_industry}
                                            onChange={handleChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="comp_website"
                                            value={profile.comp_website}
                                            onChange={handleChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="comp_contact_no"
                                            value={profile.comp_contact_no}
                                            onChange={handleChange}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Number of Employees
                                        </label>
                                        <input
                                            type="number"
                                            name="comp_no_employs"
                                            value={profile.comp_no_employs}
                                            onChange={handleChange}
                                            min="1"
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="comp_location"
                                        value={profile.comp_location}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        name="comp_address"
                                        value={profile.comp_address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fetchCompanyProfile()}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                            <div className="space-y-6">
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Change Password</h4>
                                    <p className="text-gray-600 mb-4">Update your account password</p>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                        Change Password
                                    </button>
                                </div>
                                
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Two-Factor Authentication</h4>
                                    <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                                        Enable 2FA
                                    </button>
                                </div>
                                
                                <div className="border border-red-200 rounded-lg p-4">
                                    <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                                    <p className="text-red-600 mb-4">Permanently delete your company account and all associated data</p>
                                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Application Notifications</h4>
                                        <p className="text-gray-600 text-sm">Get notified when students apply to your jobs</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Job Status Updates</h4>
                                        <p className="text-gray-600 text-sm">Get notified about job approval/rejection status</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Marketing Emails</h4>
                                        <p className="text-gray-600 text-sm">Receive updates about new features and promotions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
