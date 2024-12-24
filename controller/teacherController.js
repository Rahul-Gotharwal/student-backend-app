import { db } from "../db/prisma.js";
import { createCourses } from "./createCourseController.js";

export const createTeacher = async (req, res) => {
  try {
    const { name, email, image, courses: courseNames } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    if (!courseNames || !Array.isArray(courseNames)) {
      return res
        .status(400)
        .json({ message: "Courses must be an array of course names" });
    }

    const createdCourses = []; 
    for (const courseName of courseNames) {
      try {
        // Check if course exists
        let course = await db.course.findFirst({ where: { courseName } });
        if (!course) {
 
          course = await createCourses({ body: { courseName } }); 
          createdCourses.push(course); 
        } else {
          createdCourses.push(course);
        }
      } catch (error) {
        console.error("Error creating/finding course:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }


    const teacher = await db.teacher.create({
      data: {
        name,
        email,
        image: image || null, 
        courses: {
          connect: createdCourses.map((course) => ({ id: course.id })), 
        },
      },
    });

    res.status(201).json(teacher);
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};