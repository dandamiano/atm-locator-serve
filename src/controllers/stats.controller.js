const db = require('../models');

const getStatsOverview = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await db.Student.count();

    // Count total tutors (assuming role field exists in User model)
    const totalTutors = await db.User.count({ where: { role: 'tutor' } });

    // Count total active students
    const activeStudents = await db.Student.count({ where: { status: 'Active' } });

    // Count active packages
    const activePackages = await db.StudentPackage.count({ where: { status: 'Active' } });

    res.json({
      totalStudents,
      totalTutors,
      activeStudents,
      activePackages,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

module.exports = { getStatsOverview };
