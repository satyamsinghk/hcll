const Student = require('../models/student');
const Transaction = require('../models/transaction');
const MessRegistration = require('../models/mess');

class AdminService {
  
  /**
   * Get all students with their Room details, Mess status (current month), 
   * and Fee status (current month).
   * Uses Aggregation Pipeline for single-query efficiency.
   */
  async GetAllStudentsDashboard(month, financialYear) {
    // Current Period
    const currentMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM
    
    return await Student.aggregate([
      // 1. Join with Rooms
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomDetails'
        }
      },
      { $unwind: { path: '$roomDetails', preserveNullAndEmptyArrays: true } },

      // 2. Join with Mess Registrations for this month
      {
        $lookup: {
          from: 'mess_registrations',
          let: { studentId: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                    $and: [
                        { $eq: ['$studentId', '$$studentId'] },
                        { $eq: ['$month', currentMonth] }
                    ]
                }
              } 
            }
          ],
          as: 'messDetails'
        }
      },
      { $unwind: { path: '$messDetails', preserveNullAndEmptyArrays: true } },

      // 3. Join with Fee Transactions for this month (Hostel Fee)
      {
        $lookup: {
          from: 'transactions',
          let: { studentId: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                    $and: [
                        { $eq: ['$studentId', '$$studentId'] },
                        { $eq: ['$month', currentMonth] },
                        { $eq: ['$type', 'HOSTEL_FEE'] },
                        { $eq: ['$status', 'SUCCESS'] }
                    ]
                }
              } 
            }
          ],
          as: 'feeDetails'
        }
      },
      { $unwind: { path: '$feeDetails', preserveNullAndEmptyArrays: true } },

      // 4. Project Final Shape
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          rollNumber: 1,
          email: 1,
          roomNumber: '$roomDetails.roomNumber',
          block: '$roomDetails.block',
          messStatus: { $ifNull: ['$messDetails.isRegistered', false] },
          feeStatus: { 
            $cond: { if: { $gt: ['$feeDetails', null] }, then: 'PAID', else: 'PENDING' } 
          }
        }
      }
    ]);
  }

  async GetUnpaidStudents(month) {
    const dashboardData = await this.GetAllStudentsDashboard(month);
    return dashboardData.filter(s => s.feeStatus === 'PENDING');
  }
}

module.exports = AdminService;
