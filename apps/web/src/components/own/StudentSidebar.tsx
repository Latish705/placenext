// Add this at the very top of the file to make it a Client Component
"use client";

import React, { useState } from 'react';

// Define types for the settings
type Settings = {
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
    notifications: boolean;
};

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<Settings>({
        theme: 'light',
        fontSize: 'medium',
        notifications: true,
    });

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings({ ...settings, theme: event.target.value as 'light' | 'dark' });
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings({ ...settings, fontSize: event.target.value as 'small' | 'medium' | 'large' });
    };

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettings({ ...settings, notifications: event.target.checked });
    };

    return (
        <div className={`settings-page ${settings.theme}`}>
            <h1>Settings</h1>

            <div className="setting-item">
                <label htmlFor="theme">Theme:</label>
                <select id="theme" value={settings.theme} onChange={handleThemeChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div className="setting-item">
                <label htmlFor="fontSize">Font Size:</label>
                <select id="fontSize" value={settings.fontSize} onChange={handleFontSizeChange}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>

            <div className="setting-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={handleNotificationChange}
                    />
                    Enable Notifications
                </label>
            </div>

            <div className="setting-item">
                <h2>Theme Preview:</h2>
                <div className={`preview-box ${settings.theme}`} style={{ fontSize: settings.fontSize }}>
                    This is a preview box for the {settings.theme} theme with {settings.fontSize} font size.
                </div>
            </div>

            <div className="setting-item">
                <button onClick={() => alert('Settings Saved!')}>Save Settings</button>
            </div>

            <style>
                {`
                    .settings-page {
                        padding: 20px;
                    }
                    .settings-page.light {
                        background-color: #ffffff;
                        color: #000000;
                    }
                    .settings-page.dark {
                        background-color: #333333;
                        color: #ffffff;
                    }
                    .preview-box {
                        border: 1px solid #ccc;
                        padding: 20px;
                        margin-top: 10px;
                        transition: background-color 0.3s;
                    }
                    .preview-box.light {
                        background-color: #f9f9f9;
                    }
                    .preview-box.dark {
                        background-color: #444444;
                    }
                    .setting-item {
                        margin-bottom: 15px;
                    }
                `}
            </style>
        </div>
    );
};

export default SettingsPage;
