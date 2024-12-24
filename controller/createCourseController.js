import { db } from "../db/prisma.js";

export const createCourses = async (req, res) => {
  try {
    const { courseName, description, yearId } = req.body;

    if (!courseName) {
      return res.status(400).json({ message: 'Course name is required' });
    }

    let course = await db.course.findFirst({ where: { courseName } }); 
    if (course) {
      return res.status(400).json({ message: "Course already exists" });
    }

    if (yearId) {
      const validYear = await db.year.findUnique({ where: { id: yearId } });
      if (!validYear) {
        return res.status(400).json({ message: "Invalid year ID" });
      }
    }

    course = await db.course.create({
      data: {
        courseName,
        description,
        yearId, 
      },
    });

    res.status(201).json(course); 
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
};
/**
 *Student has a one-to-one (optional) relationship with Year.
Course has a one-to-one (optional) relationship with Year.
Year has a one-to-many relationship with both Student and Course.
Student and Course have a many-to-many relationship.
 */