import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { loginContext } from '../../contexts/loginContext';
import './Prescription.css';

const Prescription = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const fileInputRef = useRef(null);
    let [currentUser, error, userLoginStatus, loginUser, logoutUser] = useContext(loginContext);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token=localStorage.getItem("token")
            const response = await axios.get('http://localhost:3000/doc-api/get-docs', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setDocuments(response.data.payload);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('username', currentUser.username);

        const now = new Date();
        const dateOnly = now.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        formData.append('date', dateOnly);

        try {

            const token=localStorage.getItem("token")
            await axios.post('http://localhost:3000/doc-api/upload', formData, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            fetchDocuments();
            setSelectedFile(null); // Clear selected file state
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the file input field
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="m-5">
            <input type="file" onChange={onFileChange} className="form-control " ref={fileInputRef} />
            <button onClick={onFileUpload} className="btn btn-success mt-3 btn-rounded">Upload</button>
            <h3 className="mt-5 mb-1">Uploaded Documents</h3>
            <div className="mb-2">
                
                {documents.reverse().map((doc, index) => (
                    doc.username === currentUser.username && (
                        <li className="lead" key={index}>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                Prescription <span>Uploaded on</span> {doc.date.split('T')[0]}
                            </a>
                        </li>
                    )
                ))}
            </div>
        </div>
    );
};

export default Prescription;
