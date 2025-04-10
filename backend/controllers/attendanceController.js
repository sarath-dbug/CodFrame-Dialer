const Attendance = require("../models/Attendance");


// get formatDate
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};



const updateMemberAttendance = async (req, res) => {
    try {
        const { memberId } = req.body;

        if (!memberId) {
            return res.status(400).json({ message: 'Member ID is required' });
        }

        // Get today's date (start of the day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update or create attendance record for the member
        const attendanceRecord = await Attendance.findOneAndUpdate(
            { memberId, date: today },
            { status: 'present', updatedAt: Date.now() },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: 'Attendance updated to present for today',
            data: attendanceRecord,
        });
    } catch (error) {
        console.error('Error updating attendance on login:', error);
        res.status(500).json({ message: 'Failed to update attendance', error: error.message });
    }
};


const getMemberAttendance = async (req, res) => {
    try {
        const { memberId } = req.query;

        if (!memberId) {
            return res.status(400).json({ message: 'Member ID is required' });
        }

        const attendanceRecords = await Attendance.find({ memberId });

        const formattedRecords = attendanceRecords.map((record) => ({
            ...record.toObject(),
            date: formatDate(record.date), // Replace the date with the formatted date
          }));

        res.status(200).json({
            message: 'Member attendance records fetched successfully',
            data: formattedRecords,
        });
    } catch (error) {
        console.error('Error fetching member attendance:', error);
        res.status(500).json({ message: 'Failed to fetch member attendance', error: error.message });
    }
};


module.exports = {
    updateMemberAttendance,
    getMemberAttendance
};
