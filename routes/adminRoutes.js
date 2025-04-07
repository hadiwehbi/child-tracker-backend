const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const childController = require('../controllers/childController');

const Child = require('./../models/childModel');
const User = require('../models/userModel');
const ExcelJS = require('exceljs');
const Log = require('./../models/logModel');
const JSZip = require('jszip');

const router = express.Router();

router.get('/login', (req, res) => {
	res.render('main');
});

router.post('/getAllDataJson', async (req, res) => {
	try {
		const { username, password } = req.body;
		if (username !== 'datadmin' || password !== 'neo@23@pp') {
			return res.send('Invalid username or password.');
		}
		const users = await User.find({}).populate('children');
		res.json(users);
	} catch (error) {
		console.error('Failed to fetch users:', error);
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});

router.post('/getAllData', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== 'datadmin' || password !== 'neo@23@pp') {
      return res.send('Invalid username or password.');
    }

    // Fetch users with their children and the logs from the database
    const users = await User.find({}).populate('children');
    const logs = await Log.aggregate([
      {
        $group: {
          _id: '$user_id',
          logs: { $push: '$$ROOT' }
        }
      },
      {
        $project: {
          _id: 0,
          user: 1,
          logs: 1
        }
      }
    ]);

    // 1. Generate "user data.xlsx"
    const wbUser = new ExcelJS.Workbook();
    const wsUser = wbUser.addWorksheet('User Data');
    const userHeaders = [
      "User ID", "Parent Name", "Email", "Phone",
      "Child ID", "Child Name", "IsActiveAccount",
      "Date Of Birth", "Pregnancy Duration", "Gender", "ChildAddedDate"
    ];
    wsUser.addRow(userHeaders);
    wsUser.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    // One row per child; if no children, still output parent data
    users.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          const row = [
            parent._id,
            parent.name,
            parent.email,
            parent.phone,
            child._id,
            child.childName,
            child.active,
            child.dateOfBirth,
            child.pregnancyDuration,
            child.gender,
            child.createdAt
          ];
          wsUser.addRow(row);
        });
      } else {
        const row = [
          parent._id,
          parent.name,
          parent.email,
          parent.phone,
          '', '', '', '', '', '', ''
        ];
        wsUser.addRow(row);
      }
    });
    wsUser.columns.forEach(col => col.width = 20);

    // 2. Generate "Usage Logs.xlsx"
    const wbLogs = new ExcelJS.Workbook();
    const wsLogs = wbLogs.addWorksheet('Usage Logs');
    const logsHeaders = ["User Id", "Action", "Description", "TakenAt"];
    wsLogs.addRow(logsHeaders);
    wsLogs.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    logs.forEach(group => {
      group.logs.forEach(log => {
        const row = [
          log.user_id,
          log.action,
          log.description,
          new Date(log.takenAt)
        ];
        wsLogs.addRow(row);
      });
    });
    wsLogs.columns.forEach(col => col.width = 20);

    // 3. Generate "Rating.xlsx"
    const wbRating = new ExcelJS.Workbook();
    const wsRating = wbRating.addWorksheet('Rating');
    const ratingHeaders = ["Parent ID", "Parent Name", "Rating Id", "Question", "Choice", "AdditionalText", "Taken At"];
    wsRating.addRow(ratingHeaders);
    wsRating.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    users.forEach(parent => {
      if (parent.rating && parent.rating.length > 0) {
        parent.rating.forEach(rate => {
          const row = [
            parent._id,
            parent.name,
            rate.ratingId,
            rate.text || rate.question,
            rate.rating || rate.choice,
            rate.additionalText,
            new Date(rate.takenAt)
          ];
          wsRating.addRow(row);
        });
      }
    });
    wsRating.columns.forEach(col => col.width = 20);

    // 4. Generate "Vaccine Logs.xlsx"
    const wbVaccine = new ExcelJS.Workbook();
    const wsVaccine = wbVaccine.addWorksheet('Vaccine Logs');
    // Here we include parent and child identifiers along with vaccine data.
    const vaccineHeaders = [
      "Parent ID", "Parent Name", "Child ID", "Child Name",
      "Vaccine Number", "Vaccine Name", "Starting Age",
      "Ending Age", "Age Group", "Decision-Answer", "Taken At"
    ];
    wsVaccine.addRow(vaccineHeaders);
    wsVaccine.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    users.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          // Assuming vaccine data is stored in child.data.vaccines
          if (child.data && child.data.vaccines && child.data.vaccines.length > 0) {
            child.data.vaccines.forEach(vaccine => {
              const row = [
                parent._id,
                parent.name,
                child._id,
                child.childName,
                vaccine.number,
                vaccine.question, // or vaccine.name if available
                vaccine.startingAge,
                vaccine.endingAge,
                vaccine.period, // interpreted as age group
                vaccine.decision,
                new Date(vaccine.takenAt)
              ];
              wsVaccine.addRow(row);
            });
          }
        });
      }
    });
    wsVaccine.columns.forEach(col => col.width = 20);

    // 5. Generate "Milestone-Age-Category.xlsx"
    const wbMilestone = new ExcelJS.Workbook();
    const wsMilestone = wbMilestone.addWorksheet('Milestones');
    const milestoneHeaders = [
      "Parent ID", "Parent Name", "Child ID", "Child Name",
      "Milestone Number", "Question", "Milestone Category",
      "Starting Age", "Ending Age", "Age Group", "Decision-Answer", "Entry Date"
    ];
    wsMilestone.addRow(milestoneHeaders);
    wsMilestone.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    users.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          // Assuming milestone data is stored in child.data.milestones
          if (child.data && child.data.milestones && child.data.milestones.length > 0) {
            child.data.milestones.forEach(milestone => {
              const row = [
                parent._id,
                parent.name,
                child._id,
                child.childName,
                milestone.number,
                milestone.question,
                milestone.category,
                milestone.startingAge,
                milestone.endingAge,
                milestone.period, // interpreted as age group
                milestone.decision,
                new Date(milestone.takenAt)
              ];
              wsMilestone.addRow(row);
            });
          }
        });
      }
    });
    wsMilestone.columns.forEach(col => col.width = 20);

    // Generate buffers for each workbook
    const userDataBuffer = await wbUser.xlsx.writeBuffer();
    const usageLogsBuffer = await wbLogs.xlsx.writeBuffer();
    const ratingBuffer = await wbRating.xlsx.writeBuffer();
    const vaccineBuffer = await wbVaccine.xlsx.writeBuffer();
    const milestoneBuffer = await wbMilestone.xlsx.writeBuffer();

    // Package all files into a zip using JSZip
    const zip = new JSZip();
    zip.file("user data.xlsx", userDataBuffer);
    zip.file("Usage Logs.xlsx", usageLogsBuffer);
    zip.file("Rating.xlsx", ratingBuffer);
    zip.file("Vaccine Logs.xlsx", vaccineBuffer);
    zip.file("Milestone-Age-Category.xlsx", milestoneBuffer);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=All_Data.zip");
    res.send(zipBuffer);
  } catch (error) {
    console.error("Failed to generate excel files:", error);
    res.status(500).json({ error: "Failed to generate excel files" });
  }
});

module.exports = router;
