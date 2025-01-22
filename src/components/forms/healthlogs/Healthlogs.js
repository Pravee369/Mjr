import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Healthlogs.css'

function Healthlogs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        let token = localStorage.getItem('token'); // Ensure this is correct
        if (!token) {
            console.error('No token found');
            return;
        }

        console.log("Fetching health logs...");
        axios.get("http://localhost:3000/healthlog-api/get-healthlogs", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            console.log("Health logs fetched:", res.data.payload);
            setLogs(res.data.payload || []);
        })
        .catch(err => {
            console.log("Error in getting healthlogs:", err);
        });
    }, []);

    const renderTableForType = (type) => {
        if (!logs || logs.length === 0) return null; // Check if logs are available
        console.log(logs);
        const filteredLogs = logs.filter(log => log.type === type);
        if (filteredLogs.length === 0) return null;
    
        // Extract the keys excluding 'type', 'username', and '_id'
        const excludedKeys = ['type', 'username', '_id'];
        const keys = Object.keys(filteredLogs[0]).filter(key => !excludedKeys.includes(key));
    
        return (
            <div key={type} className="table-container">
                <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                <table className="table">
                    <thead className="bg-success text-white">
                        <tr>
                            {keys.map((key, index) => (
                                <th key={index} className="fw-bold text-center">{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log, index) => (
                            <tr key={index}>
                                {keys.map((key, subIndex) => (
                                    <td key={subIndex} className="text-center">{log[key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    

    const types = ["general", "diabetes", "heartattack", "eyesight", "cancer"];

    return (
        <div>
            {types.map(type => renderTableForType(type))}
        </div>
    );
}

export default Healthlogs;
