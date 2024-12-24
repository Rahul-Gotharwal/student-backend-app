import { db } from "../db/prisma.js";
export const createStudents = async (req, res) => {
  try {
    const {
      name,
      email,
      cohort,
      status,
      lastLogin,
      image,
      courses: courseNames,
      yearName,
      className,
    } = req.body;
    if (!name || !email || !cohort || !status || !yearName) {
      return res
        .status(400)
        .json({
          message: "All required fields (including yearName) must be provided",
        });
    }

    if (!courseNames || !Array.isArray(courseNames)) {
      return res
        .status(400)
        .json({ message: "Courses must be an array of course IDs" });
    }
       
       let year;
       try {
         year = await db.year.upsert({
           where: { yearName },
           create: { yearName },
           update: {},
         });
       } catch (error) {
         console.error("Error creating/finding year:", error);
         return res.status(500).json({ message: "Internal server error" });
       }
     
       let studentClass;
       try {
         studentClass = await db.class.upsert({
           where: { className },
           create: { className, yearId: year.id }, 
           update: { yearId: year.id }, 
         });
       } catch (error) {
         console.error("Error creating/finding class:", error);
         return res.status(500).json({ message: "Internal server error" });
       }
    
    const createdCourses = [];
    for (const courseName of courseNames) {
      try {
        let course = await db.course.findFirst({ where: { courseName } });
        if (!course) {
         
          course = await db.course.create({
            data:{
              courseName,
              yearId:year.id,
              description:`${courseName} course for the year ${yearName}`,
              classId: studentClass.id
            }
          }) 
       
        }
        else if (!course.yearId) {
       
          course = await db.course.update({
            where: { id: course.id },
            data: { yearId: year.id ,classId:studentClass.id},
          });
        }
        createdCourses.push(course); 
      } catch (error) {
        console.error("Error creating/finding course:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
   
    const student = await db.student.create({
      data: {
        name,
        email,
        cohort,
        image: image || null, 
        status,
        lastLogin: lastLogin || new Date(),
        courses: {
            connect: createdCourses.map((course) => ({ id: course.id })) 
        },
        yearId: year.id, 
        classId:studentClass.id
      },
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};