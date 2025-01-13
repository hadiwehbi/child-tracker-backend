const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const childController = require('../controllers/childController');

const Child = require('./../models/childModel');
const User = require('../models/userModel');
const ExcelJS = require('exceljs');
const Log = require('./../models/logModel');

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

		const users = await User.find({}).populate('children');
		// res.json(users);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Application Data');

		// Define nested headers
		const parentHeaders = [
			{ label: 'userID', colspan: 1 },
			{ label: 'Parent Name', colspan: 1 },
			{ label: 'Email', colspan: 1 },
			{ label: 'Phone', colspan: 1 },
			{ label: 'Children', colspan: 21 },
			{ label: 'Rating', colspan: 5 }
		];

		parentHeaders.forEach((header, index) => {
			const columnIndex =
				parentHeaders[index - 1]?.colspan > 1
					? index + parentHeaders[index - 1]?.colspan + 1
					: index + 1;
			const cell = worksheet.getCell(1, columnIndex);

			cell.alignment = { horizontal: 'center' };
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet.getCell(1, columnIndex + header.colspan).address;
				worksheet.mergeCells(`${startCell}:${endCell}`);
			}
		});

		worksheet.mergeCells('A1:A4');
		worksheet.mergeCells('B1:B4');
		worksheet.mergeCells('C1:C4');
		worksheet.mergeCells('D1:D4');
		// worksheet.mergeCells('AA1:AA2');
		// worksheet.mergeCells('AB1:AB2');
		// worksheet.mergeCells('AC1:AC2');
		// worksheet.mergeCells('AD1:AD2');

		const childHeaders = [
			{ label: 'ChildName', colspan: 1 },
			{ label: 'childId', colspan: 1 },
			{ label: 'IsActiveAccount', colspan: 1 },
			{ label: 'Date Of Birth', colspan: 1 },
			{ label: 'Pregnancy Duration', colspan: 1 },
			{ label: 'Gender', colspan: 1 },
			{ label: 'ChildAddedDate', colspan: 1 },
			{ label: 'Data', colspan: 14 }
		];

		childHeaders.forEach((header, index) => {
			const columnIndex =
				childHeaders[index - 1]?.colspan > 1
					? index + childHeaders[index - 1]?.colspan + 5
					: index + 5;
			console.log('columnIndex', columnIndex);
			const cell = worksheet.getCell(2, columnIndex);

			cell.alignment = { horizontal: 'center' };
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet.getCell(2, columnIndex + header.colspan).address;
				console.log('columnIndex', columnIndex + header.colspan, startCell, endCell);

				worksheet.mergeCells(`${startCell}:${endCell}`);
			}
		});

		worksheet.mergeCells('E2:E4');
		worksheet.mergeCells('F2:F4');
		worksheet.mergeCells('G2:G4');
		worksheet.mergeCells('H2:H4');
		worksheet.mergeCells('I2:I4');
		worksheet.mergeCells('J2:J4');
		worksheet.mergeCells('K2:K4');

		const dataHeaders = [
			{ label: 'Milestones', colspan: 7 },
			{ label: 'Vaccines', colspan: 6 }
		];

		dataHeaders.forEach((header, index) => {
			const columnIndex =
				dataHeaders[index - 1]?.colspan > 1
					? index + dataHeaders[index - 1]?.colspan + 12
					: index + 12;
			const cell = worksheet.getCell(3, columnIndex);
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet.getCell(3, columnIndex + header.colspan).address;
				worksheet.mergeCells(`${startCell}:${endCell}`);
			}
		});

		const milestonesHeaders = [
			{ label: 'MilestoneNumber', colspan: 1 },
			{ label: 'Question', colspan: 1 },
			{ label: 'MilestoneCategory', colspan: 1 },
			{ label: 'Starting Age', colspan: 1 },
			{ label: 'Ending Age', colspan: 1 },
			{ label: 'Age group', colspan: 1 },
			{ label: 'Decision-Answer', colspan: 1 },
			{ label: 'Entry Date', colspan: 1 }
		];

		milestonesHeaders.forEach((header, index) => {
			const columnIndex =
				milestonesHeaders[index - 1]?.colspan > 1
					? index + milestonesHeaders[index - 1]?.colspan + 12
					: index + 12;
			const cell = worksheet.getCell(4, columnIndex);
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet.getCell(4, columnIndex + header.colspan).address;
				worksheet.mergeCells(`${startCell}:${endCell}`);
			}
		});

		const vaccinesHeaders = [
			{ label: 'VaccineNumber', colspan: 1 },
			{ label: 'VaccineName', colspan: 1 },
			{ label: 'Starting Age', colspan: 1 },
			{ label: 'Ending Age', colspan: 1 },
			{ label: 'Age group', colspan: 1 },
			{ label: 'Decision-Answer', colspan: 1 },
			{ label: 'Taken At', colspan: 1 }
		];

		vaccinesHeaders.forEach((header, index) => {
			const columnIndex =
				vaccinesHeaders[index - 1]?.colspan > 1
					? index + vaccinesHeaders[index - 1]?.colspan + 20
					: index + 20;
			const cell = worksheet.getCell(4, columnIndex);
			cell.value = header.label;

			if (header.label == 'Question') {
				cell.alignment = { wrapText: true };
			}

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet.getCell(4, columnIndex + header.colspan).address;
				worksheet.mergeCells(`${startCell}:${endCell}`);
			}
		});

		const ratingHeaders = [
			{ label: 'Rating Id', colspan: 1 },
			{ label: 'question', colspan: 1 },
			{ label: 'choice', colspan: 1 },
			{ label: 'additionalText', colspan: 1 },
			{ label: 'Taken At', colspan: 1 }
		];

		ratingHeaders.forEach((header, index) => {
			const columnIndex =
				ratingHeaders[index - 1]?.colspan > 1
					? index + ratingHeaders[index - 1]?.colspan + 27
					: index + 27;
			const cell = worksheet.getCell(2, columnIndex);
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet.getCell(2, columnIndex + header.colspan).address;
				worksheet.mergeCells(`${startCell}:${endCell}`);
			}
		});

		worksheet.mergeCells('AA2:AA4');
		worksheet.mergeCells('AB2:AB4');
		worksheet.mergeCells('AC2:AC4');
		worksheet.mergeCells('AD2:AD4');
		worksheet.mergeCells('AE2:AE4');

		let rowIndex = 5;
		let initialRowIndex = rowIndex;
		users.forEach((parent) => {
			const parentId = parent._id;
			const parentName = parent.name;
			const parentEmail = parent.email;

			worksheet.getCell(`A${rowIndex}`).value = parentId;
			worksheet.getCell(`B${rowIndex}`).value = parentName;
			worksheet.getCell(`C${rowIndex}`).value = parentEmail;
			worksheet.getCell(`D${rowIndex}`).value = parent.phone;

			let rates = rowIndex;
			// parent.rating?.forEach((rate) => {
			// 	worksheet.getCell(`AA${rates}`).value = rate.ratingId;
			// 	worksheet.getCell(`AB${rates}`).value = rate.text;
			// 	worksheet.getCell(`AC${rates}`).value = rate.rating;
			// 	worksheet.getCell(`AD${rates}`).value = rate.additionalText;
			// 	worksheet.getCell(`AE${rates}`).value = new Date(rate.takenAt).toLocaleDateString(
			// 		undefined,
			// 		{ year: 'numeric', month: 'long', day: 'numeric' }
			// 	);
			// 	rates++;
			// });

			if (parent.children.length > 0)
				parent.children?.forEach((child) => {
					worksheet.getCell(`E${rowIndex}`).value = child.childName;
					worksheet.getCell(`F${rowIndex}`).value = child._id;
					worksheet.getCell(`G${rowIndex}`).value = child.active;
					worksheet.getCell(`H${rowIndex}`).value = child.dateOfBirth;
					worksheet.getCell(`I${rowIndex}`).value = child.pregnancyDuration;
					worksheet.getCell(`J${rowIndex}`).value = child.gender;
					worksheet.getCell(`K${rowIndex}`).value = child.createdAt;

					let milestones = rowIndex;
					let vaccines = rowIndex;

					if (child?.data) {
						child.data?.milestones?.forEach((child) => {
							worksheet.getCell(`L${milestones}`).value = child.number;
							worksheet.getCell(`M${milestones}`).value = child.question;
							worksheet.getCell(`N${milestones}`).value = child.category;
							worksheet.getCell(`O${milestones}`).value = child.startingAge;
							worksheet.getCell(`P${milestones}`).value = child.endingAge;
							worksheet.getCell(`Q${milestones}`).value = child.period;
							worksheet.getCell(`R${milestones}`).value = child.decision;
							worksheet.getCell(`S${milestones}`).value = new Date(
								child.takenAt
							).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
							milestones++;
						});

						child.data?.vaccines?.forEach((child) => {
							worksheet.getCell(`T${vaccines}`).value = child.number;
							worksheet.getCell(`U${vaccines}`).value = child.question;
							worksheet.getCell(`V${vaccines}`).value = child.startingAge;
							worksheet.getCell(`W${vaccines}`).value = child.endingAge;
							worksheet.getCell(`X${vaccines}`).value = child.period;
							worksheet.getCell(`Y${vaccines}`).value = child.decision;
							worksheet.getCell(`Z${vaccines}`).value = new Date(child.takenAt).toLocaleDateString(
								undefined,
								{ year: 'numeric', month: 'long', day: 'numeric' }
							);

							vaccines++;
						});

						rowIndex = milestones > vaccines ? milestones : vaccines;
					} else rowIndex++;

					// worksheet.mergeCells(`E${initialRowIndex + 1}:E${rowIndex - 1}`);
					// worksheet.mergeCells(`F${initialRowIndex + 1}:F${rowIndex - 1}`);
					// worksheet.mergeCells(`G${initialRowIndex + 1}:G${rowIndex - 1}`);
					// worksheet.mergeCells(`H${initialRowIndex + 1}:H${rowIndex - 1}`);
					// worksheet.mergeCells(`I${initialRowIndex + 1}:I${rowIndex - 1}`);
					// worksheet.mergeCells(`J${initialRowIndex + 1}:J${rowIndex - 1}`);
					// worksheet.mergeCells(`K${initialRowIndex + 1}:K${rowIndex - 1}`);
				});
			else rowIndex++;

			if (rowIndex < rates) rowIndex = rates;

			// worksheet.mergeCells(`A${initialRowIndex + 1}:A${rowIndex - 1}`);
			// worksheet.mergeCells(`B${initialRowIndex + 1}:B${rowIndex - 1}`);
			// worksheet.mergeCells(`C${initialRowIndex + 1}:C${rowIndex - 1}`);
			// worksheet.mergeCells(`D${initialRowIndex + 1}:D${rowIndex - 1}`);
		});

		// Iterate over all cells in the worksheet
		worksheet.eachRow((row, rowNumber) => {
			row.eachCell((cell, colNumber) => {
				if (rowNumber == 1 || rowNumber == 2 || rowNumber == 3 || rowNumber == 4)
					cell.font = { bold: true };

				// Apply text alignment to center
				cell.alignment = { horizontal: 'center', vertical: 'middle' };

				// Fit cell to text
				cell.alignment.shrinkToFit = true;
				cell.alignment.wrapText = false;

				// const column = worksheet.getColumn(columnIndex);
				// column.alignment = { wrapText: true };

				// Set maximum width for the cell
				const maxWidth = 60;

				worksheet.getColumn(colNumber).width =
					cell.value?.toString().length + 4 > 15 ? cell.value?.toString().length + 4 : 15;
			});
		});

		// Find the last row with values
		let lastRow = worksheet.lastRow;
		while (!lastRow.values || lastRow.values.length === 0) {
			lastRow = lastRow.getCell('A').getRow(-1);
		}

		// Get the index of the last row
		const lastRowIndex = lastRow.number;

		// Remove empty rows after the last row with values
		const emptyRowCount = worksheet.rowCount - lastRowIndex;
		if (emptyRowCount > 0) {
			worksheet.spliceRows(lastRowIndex + 1, emptyRowCount);
		}

		///////// Logs

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

		const worksheet2 = workbook.addWorksheet('Logs'); // Sheet name
		const logHeaders = [
			{ label: 'User Id', colspan: 1 },
			{ label: 'Action', colspan: 1 },
			{ label: 'Description', colspan: 1 },
			{ label: 'TakenAt', colspan: 1 }
		];

		logHeaders.forEach((header, index) => {
			const columnIndex =
				parentHeaders[index - 1]?.colspan > 1
					? index + parentHeaders[index - 1]?.colspan + 1
					: index + 1;
			const cell = worksheet2.getCell(1, columnIndex);

			cell.alignment = { horizontal: 'center' };
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet2.getCell(1, columnIndex + header.colspan).address;
				worksheet2.mergeCells(`${startCell}:${endCell}`);
			}
		});

		rowIndex = 2;
		// Iterate through the JSON data
		logs.forEach((logs) => {
			logs.logs.forEach((log) => {
				// Add log data to the worksheet
				worksheet2.getCell(`A${rowIndex}`).value = log.user_id;
				worksheet2.getCell(`B${rowIndex}`).value = log.action;
				worksheet2.getCell(`C${rowIndex}`).value = log.description;
				const dateCell = worksheet2.getCell(`D${rowIndex}`);
				dateCell.value = new Date(log.takenAt);
				dateCell.numFmt = 'yyyy-mm-dd hh:mm:ss'; // Format the cell to display date and time
				rowIndex++;
			});
		});

		worksheet2.eachRow((row, rowNumber) => {
			row.eachCell((cell, colNumber) => {
				if (rowNumber == 1) cell.font = { bold: true };

				// Apply text alignment to center
				cell.alignment = { horizontal: 'center', vertical: 'middle' };

				// Fit cell to text
				cell.alignment.shrinkToFit = true;
				cell.alignment.wrapText = false;

				// Set maximum width for the cell
				const maxWidth = 60;

				worksheet2.getColumn(colNumber).width =
					cell.value?.toString().length + 4 > 15 ? cell.value?.toString().length + 4 : 15;
			});
		});

		// Rating worksheet3
		const worksheet3 = workbook.addWorksheet('Rating'); // Sheet name
		const rateHeaders = [
			{ label: 'Parent ID', colspan: 1 },
			{ label: 'Parent Name', colspan: 1 },
			{ label: 'Rating Id', colspan: 1 },
			{ label: 'Question', colspan: 1 },
			{ label: 'Choice', colspan: 1 },
			{ label: 'AdditionalText', colspan: 1 },
			{ label: 'Taken At', colspan: 1 }
		];
		rateHeaders.forEach((header, index) => {
			const columnIndex =
				rateHeaders[index - 1]?.colspan > 1
					? index + rateHeaders[index - 1]?.colspan + 1
					: index + 1;
			const cell = worksheet3.getCell(1, columnIndex);

			cell.alignment = { horizontal: 'center' };
			cell.value = header.label;

			if (header.colspan > 1) {
				const startCell = cell.address;
				const endCell = worksheet3.getCell(1, columnIndex + header.colspan).address;
				worksheet3.mergeCells(`${startCell}:${endCell}`);
			}
		});
		// Iterate through the JSON data
		users.forEach((parent) => {
			console.log('----> rating', parent);
			let rates = 2;
			parent.rating?.forEach((rate) => {
				worksheet3.getCell(`A${rates}`).value = parent._id;
				worksheet3.getCell(`B${rates}`).value = parent.name;
				worksheet3.getCell(`C${rates}`).value = rate?.ratingId;
				worksheet3.getCell(`D${rates}`).value = rate?.text || rate?.question;
				worksheet3.getCell(`E${rates}`).value = rate?.rating || rate?.choice;
				worksheet3.getCell(`F${rates}`).value = rate?.additionalText;
				worksheet3.getCell(`G${rates}`).value = new Date(rate?.takenAt).toLocaleDateString(
					undefined,
					{ year: 'numeric', month: 'long', day: 'numeric' }
				);
				rates++;
			});
		});

		worksheet3.eachRow((row, rowNumber) => {
			row.eachCell((cell, colNumber) => {
				if (rowNumber == 1) cell.font = { bold: true };

				// Apply text alignment to center
				cell.alignment = { horizontal: 'center', vertical: 'middle' };

				// Fit cell to text
				cell.alignment.shrinkToFit = true;
				cell.alignment.wrapText = false;

				// Set maximum width for the cell
				const maxWidth = 60;

				worksheet3.getColumn(colNumber).width =
					cell.value?.toString().length + 4 > 15 ? cell.value?.toString().length + 4 : 15;
			});
		});

		// Generate a unique filename for the Excel file
		const now = new Date();
		const formattedDate = now
			.toLocaleString('en-US', { timeZone: 'UTC' })
			.replace(/[/ :]/g, '/')
			.split(',')[0];
		const filename = `Neonatal_Data_${formattedDate}.xlsx`;

		// Set the response headers for the download
		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

		// Save the workbook to a buffer
		const buffer = await workbook.xlsx.writeBuffer();

		// Send the buffer as the response
		res.send(buffer);
	} catch (error) {
		console.error('Failed to fetch users:', error);
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});

module.exports = router;
