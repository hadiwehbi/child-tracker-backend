const ExcelJS = require('exceljs');

// Example data
const users = [
	{
		_id: '6448dc4d346edb8038c58293',
		name: 'Mortada Termos',
		email: 'mortada2@gmail.com',
		photo: 'default.jpg',
		children: [
			{
				active: 1,
				_id: '6448eadfc37f715597907277',
				childName: 'new1',
				dateOfBirth: '2020-08-15T00:00:00.000Z',
				photo: 'default.jpg',
				pregnancyDuration: 30,
				gender: 'Male',
				createdAt: '2023-04-26T09:11:59.914Z',
				__v: 0
			},
			{
				active: 1,
				_id: '6448eae7c37f71559790727c',
				childName: 'new2',
				dateOfBirth: '2020-08-15T00:00:00.000Z',
				photo: 'default.jpg',
				pregnancyDuration: 30,
				gender: 'Male',
				createdAt: '2023-04-26T09:12:07.815Z',
				__v: 0
			},
			{
				_id: '6448eaeac37f715597907281',
				childName: 'Hadi A',
				dateOfBirth: '2020-08-15T00:00:00.000Z',
				photo: 'default.jpg',
				pregnancyDuration: 30,
				gender: 'Male',
				createdAt: '2023-04-26T09:12:10.878Z',
				__v: 0,
				active: 0,
				data: {
					week1: {
						الدجاج: 'مثل',
						test2: 'value1',
						test3: 'value1',
						test4: 'value1'
					},
					week2: {
						test1: 'value2',
						test2: 'value2',
						test3: 'value2',
						test4: 'value2'
					}
				}
			},
			{
				_id: '6464ad37bcc2bf4f50e92e95',
				childName: 'Hadi A',
				dateOfBirth: '2020-08-15T00:00:00.000Z',
				active: 1,
				photo: 'default.jpg',
				pregnancyDuration: 30,
				gender: 'Male',
				createdAt: '2023-05-17T10:32:23.718Z',
				__v: 0,
				data: {
					childID: 1678838400000,
					milestones: [
						{
							number: 1,
							question: 'يرفع الرأس والخد عندما ينام على بطنه',
							category: 1,
							startingAge: 1,
							endingAge: 2,
							period: 1,
							decision: 1,
							takenAt: 1686657995132
						},
						{
							number: 2,
							question: 'يحرّك يديه و رجليه بسلاسة',
							category: 1,
							startingAge: 1,
							endingAge: 2,
							period: 1,
							decision: 1,
							takenAt: 1686657995132
						}
					],
					vaccines: [
						{
							number: 1,
							question: 'Hepatitis B (HepBV # 1)',
							startingAge: 0,
							endingAge: 1,
							period: 1,
							decision: 1,
							takenAt: 1686657995143
						},
						{
							number: 2,
							question: 'Hepatitis B (HepBV # 2)',
							startingAge: 1,
							endingAge: 2,
							period: 1,
							decision: 1,
							takenAt: 1686657995143
						}
					]
				}
			},
			{
				_id: '6464adce1e91911f80950597',
				childName: 'hadi1',
				parentId: '6448dc4d346edb8038c58293',
				dateOfBirth: '2020-08-15T00:00:00.000Z',
				active: 1,
				photo: 'default.jpg',
				pregnancyDuration: 30,
				gender: 'Male',
				createdAt: '2023-05-17T10:34:54.484Z',
				__v: 0
			}
		],
		__v: 9,
		phone: '123456',
		rating: {
			tes1: 'text',
			test2: 'text'
		},
		id: '6448dc4d346edb8038c58293'
	}
];

// Create a new workbook and worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Users');

// Define the user columns
const userColumns = [
	{ header: '_id', key: '_id' },
	{ header: 'name', key: 'name' },
	{ header: 'email', key: 'email' },
	{ header: 'photo', key: 'photo' },
	{ header: 'phone', key: 'phone' }
	// ...add other user properties
];

// Add user columns to the worksheet
worksheet.columns = userColumns;

// Function to add children properties to the worksheet
const addChildProperties = (child, rowIndex) => {
	Object.keys(child).forEach((prop) => {
		if (prop !== 'data') {
			worksheet.getCell(rowIndex, `children.${prop}`).value = child[prop];
		} else {
			// Add data properties to the worksheet
			Object.keys(child[prop]).forEach((dataProp) => {
				worksheet.getCell(rowIndex, `children.${prop}.${dataProp}`).value = child[prop][dataProp];
			});
		}
	});
};

// Function to add milestones and vaccines to the worksheet
const addMilestonesAndVaccines = (child, rowIndex) => {
    if (child.data) {
      const { milestones, vaccines } = child.data;
  
      if (milestones) {
        milestones.forEach((milestone, index) => {
          const milestoneIndex = index + 1;
          Object.entries(milestone).forEach(([key, value]) => {
            worksheet.getCell(rowIndex, `children.data.milestones.${milestoneIndex}.${key}`).value = value;
          });
        });
      }
  
      if (vaccines) {
        vaccines.forEach((vaccine, index) => {
          const vaccineIndex = index + 1;
          Object.entries(vaccine).forEach(([key, value]) => {
            worksheet.getCell(rowIndex, `children.data.vaccines.${vaccineIndex}.${key}`).value = value;
          });
        });
      }
    }
  };
// Iterate over each user
users.forEach((user, index) => {
	const rowIndex = index + 2; // Add 2 to account for the header row

	// Add user properties to the worksheet
	Object.keys(user).forEach((prop) => {
		if (prop !== 'children') {
			worksheet.getCell(rowIndex, prop).value = user[prop];
		}
	});

	// Add children properties to the worksheet
	if (user.children) {
		user.children.forEach((child, childIndex) => {
			const childRowIndex = rowIndex + childIndex;

			addChildProperties(child, childRowIndex);
			addMilestonesAndVaccines(child, childRowIndex);
		});
	}
});

// Save the workbook to a file
workbook.xlsx
	.writeFile('users.xlsx')
	.then(() => {
		console.log('Excel file created successfully.');
	})
	.catch((err) => {
		console.error('Error creating Excel file:', err);
	});
