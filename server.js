import express from 'express'; // or `const express = require('express');` if using CommonJS
import { createStudents } from './controller/studentController.js';
import { createTeacher } from './controller/teacherController.js';
import { createCourses } from './controller/createCourseController.js';
import { getStudentsByYear } from './controller/getstudentsByYear.js';
import {getDataByClass} from './controller/getStudentsByClass.js'
import { getDataByClassAndYear } from './controller/getdatabyClassandYear.js';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from your frontend (replace with your frontend URL)
  methods: ['GET,POST,PUT,DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, // Enable cookies and credentials
  
}));
// routes for posting the data on the database
app.post('/api/students', createStudents)
// route for the teacher
app.post('/api/teacher',createTeacher)
app.post('/api/course',createCourses)

// for getting the data from the database
app.get("/api/students/year/:yearName", getStudentsByYear);
app.get("/api/classes/:className", getDataByClass);
app.get("/api/classes/:className/year/:yearName", getDataByClassAndYear);

// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
