## ⚙️ Environment Setup

Before running the app, make sure your environment is correctly configured.

### 🧱 Prerequisites

- **Node.js** (v14 or newer)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** (for installing dependencies)

### 🗂️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/child-tracker-backend/readme.md
   cd child-tracker-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory and add the following:**

   ```env
   DATABASE_LOCAL=mongodb://localhost:27017/child-tracker
   NODE_ENV=development
   JWT_SECRET=####
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   EMAIL_USERNAME=####
   EMAIL_PASSWORD=####
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   ```

   > Replace these values with your own. If you're not using email features, you can skip the SMTP-related variables.

4. **Start MongoDB locally** (if not already running):

   ```bash
   mongod
   ```

5. **Start the server:**

   ```bash
   npm start
   ```

6. **Visit:**
   ```
   http://localhost:3000
   ```

# New Born Child Tracker

## Description

This is a Node.js and Express-based backend application designed to manage user, child, and log data. It includes features like authentication, security measures (e.g., rate limiting, CORS, and XSS protection), and MongoDB integration for data storage. The application also provides functionality to export data to Excel for reporting purposes.

## Features

- **Security**: Implements Helmet, CORS, rate limiting, XSS protection, and NoSQL injection prevention.
- **Error Handling**: Centralized error handling with a global error controller.
- **Database**: MongoDB integration for data storage.
- **Compression**: Reduces response sizes for faster performance.
- **Environment Configuration**: Uses dotenv for environment variable management.
- **HTTPS Support**: Ready for HTTPS implementation (commented out in the code).
- **Excel Export**: Generates Excel reports for user, child, log, and rating data.

## Installation

### Clone the repository:

```bash
git clone https://github.com/child-tracker-backend/readme.md
cd readme.md
```

### Install dependencies:

```bash
npm install
```

### Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_LOCAL=mongodb://localhost:27017/child-tracker
NODE_ENV=development
```

### Start the server:

```bash
npm start
```

## API Documentation

### 🔐 Authentication

- **POST `/api/v1/user/signup`**  
  Create a new user account.  
  **Body**: `name`, `email`, `password`, `passwordConfirm`

- **POST `/api/v1/user/login`**  
  Log in with email and password.  
  **Body**: `email`, `password`

- **GET `/api/v1/user/logout`**  
  Logs out the user.

- **POST `/api/v1/user/forgotPassword`**  
  Request a password reset token.  
  **Body**: `email`

- **PATCH `/api/v1/user/resetPassword/:token`**  
  Reset password using token.  
  **Body**: `password`, `passwordConfirm`

- **PATCH `/api/v1/user/updateMyPassword`**  
  Update password for the logged-in user.  
  **Body**: `passwordCurrent`, `password`, `passwordConfirm`

---

### 👤 User Management

- **GET `/api/v1/user/account`**  
  Get the currently logged-in user's account info.

- **PATCH `/api/v1/user/update`**  
  Update user profile info.

---

### 👶 Child Management

- **POST `/api/v1/child/add`**  
  Add a child to the account.  
  **Body**: `name`, `birthDate`, `gender`, `notes` _(optional)_

- **PATCH `/api/v1/child/update`**  
  Update child info.  
  **Body**: `childId`, other updated fields

- **GET `/api/v1/child/get`**  
  Get all children for the user.

- **POST `/api/v1/child/softDelete`**  
  Soft-delete a child.  
  **Body**: `childId`

- **DELETE `/api/v1/child/delete`**  
  Permanently delete a child.  
  **Body**: `childId`

---

### 📝 Log Management

- **POST `/api/v1/log/add`**  
  Add a log entry for a child.  
  **Body**: `childId`, `type`, `note`, `time`

- **GET `/api/v1/log/getAllLogs`**  
  Get all log entries for the user's children.

---

### 🛠️ Admin Features

> ⚠️ These routes are intended for admin use only and should be secured.

- **POST `/api/admin/getAllDataJson`**  
  Returns all data as JSON.  
  **Body**: `username`, `password` _(must match credentials defined in code)_

- **POST `/api/admin/getAllData`**  
  Returns all data as a downloadable Excel file.  
  **Body**: `username`, `password` _(same as above)_

## Security

The application includes the following security measures:

- **Helmet**: Sets secure HTTP headers.
- **Rate Limiting**: Limits requests to 5000 per hour per IP.
- **XSS Protection**: Sanitizes user input to prevent XSS attacks.
- **NoSQL Injection Prevention**: Sanitizes MongoDB queries.
- **CORS**: Enables Cross-Origin Resource Sharing.

## Database

The application uses MongoDB for data storage. To connect to your local MongoDB instance, update the `DATABASE_LOCAL` variable in the `.env` file.

## Error Handling

The application uses a centralized error-handling mechanism. If an error occurs, it will be caught by the `globalErrorHandler` and returned in a structured format.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

Thanks to the Express.js and MongoDB communities for their excellent documentation and support.

## Additional Notes

- The Excel export feature generates a multi-sheet Excel file containing user, child, log, and rating data.

## 🛠️ Admin API: Export All Data (Excel)

### **POST `/api/admin/getAllData`**

Generates and returns an **Excel (.xlsx)** file containing:

- User data
- Children associated with each user
- Logs related to users

### 🔐 Access

This endpoint is protected by **username/password** fields in the request body. These are hardcoded in the server and should be secured in production.

### 📥 Request Body

```json
{
	"username": "datadmin",
	"password": "neo@23@pp"
}
```

> These must match the values in the backend.

---

### 📤 Response

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Disposition: `attachment; filename="user data.xlsx"`
- Returns a downloadable Excel file with multiple sheets.

---

### 📄 Excel Structure

#### Sheet: `User Data`

Each row contains:

| Column             | Description                          |
| ------------------ | ------------------------------------ |
| User ID            | MongoDB `_id` of user                |
| Parent Name        | Full name of the parent              |
| Email              | Email address                        |
| Phone              | Phone number (if present)            |
| Child ID           | `_id` of each child (or blank)       |
| Child Name         | Full name of the child               |
| IsActiveAccount    | Whether the account is marked active |
| Date Of Birth      | Child's birth date                   |
| Pregnancy Duration | Weeks of pregnancy (if available)    |
| Gender             | Child gender                         |
| ChildAddedDate     | When the child entry was created     |

If a user has multiple children, each child will generate its own row with repeated parent info.

---

### 🗃 Data Sources

- `User.find({}).populate('children')`: gets all users and children
- `Log.aggregate(...)`: fetches logs grouped by `user_id`
