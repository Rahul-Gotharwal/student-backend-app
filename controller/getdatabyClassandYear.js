import { db } from "../db/prisma.js";
export const getDataByClassAndYear = async (req, res) => {
    const { className, yearName } = req.params;
  
    try {
      const data = await db.course.findMany({
        where: {
          class: { className },
          year: { yearName },
        },
        include: {
          students: true, 
          teachers: true, 
        },
      });
  
      if (data.length === 0) {
        return res.status(404).json({ message: "No data found for the given class and year." });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data by class and year:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  