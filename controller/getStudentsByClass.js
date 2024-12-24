import { db } from "../db/prisma.js";
export const getDataByClass = async (req, res) => {
    const { className } = req.params;
  
    try {
      const classData = await db.class.findUnique({
        where: { className },
        include: {
          students: true, 
          courses: true,  
        },
      });
  
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      res.status(200).json(classData);
    } catch (error) {
      console.error("Error fetching data by class:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  