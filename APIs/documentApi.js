const express = require("express");
const expressAsyncHandler = require('express-async-handler');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multerObj = require("./middlewares/CloudinaryConfig");
const verifyToken = require("./middlewares/verifyToken");

const docApp = express.Router();

// Body parser
docApp.use(express.json());

docApp.post('/upload', multerObj.single('file'),verifyToken, expressAsyncHandler(async (req, res) => {
    const docCollectionObj = req.app.get("docCollection");
    const newDoc = {
        filename: req.file.filename,
        url: req.file.path,
        username: req.body.username,
        date: new Date(req.body.date)
    };

    try {
        await docCollectionObj.insertOne(newDoc);
        res.status(201).send({ message: "Document posted successfully" });
    } catch (error) {
        console.error("Error posting document:", error);
        res.status(400).send({ message: "Document is not posted, Something went wrong" });
    }
}));



docApp.get('/get-docs',verifyToken, expressAsyncHandler(async (req, res) => {
    const docCollectionObj = req.app.get("docCollection");

    try {
        let allDocs = await docCollectionObj.find().toArray();
        res.status(200).send({ message: "Got all documents", payload: allDocs });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send({ message: "Error fetching documents" });
    }
}));

module.exports = docApp;
