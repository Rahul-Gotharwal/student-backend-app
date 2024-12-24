import { db } from "../db/prisma.js";

export const getStudentsByYear = async (req, res) => {
  try {
    const { yearName } = req.params;

    if (!yearName) {
      return res.status(400).json({ message: "Year name is required" });
    }

    const studentsInYear = await db.year.findUnique({
      where: { yearName },
      include: {
        students: {
          include: {
            courses: true, 
          },
        },
        courses: true, 
      },
    });

    if (!studentsInYear) {
      return res.status(404).json({ message: "Year not found" });
    }

    res.status(200).json(studentsInYear);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
