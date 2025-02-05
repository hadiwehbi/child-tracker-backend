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
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### Install dependencies:

```bash
npm install
```

### Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_LOCAL=mongodb://localhost:27017/your-database-name
NODE_ENV=development
```

### Start the server:

```bash
npm start
```

## API Documentation

### Authentication

- **Signup**: `POST /api/v1/user/signup`
- **Login**: `POST /api/v1/user/login`
- **Logout**: `GET /api/v1/user/logout`
- **Forgot Password**: `POST /api/v1/user/forgotPassword`
- **Reset Password**: `PATCH /api/v1/user/resetPassword/:token`
- **Update Password**: `PATCH /api/v1/user/updateMyPassword`

### User Management

- **Get User Account**: `GET /api/v1/user/account`
- **Update User**: `PATCH /api/v1/user/update`

### Child Management

- **Add Child**: `POST /api/v1/child/add`
- **Update Child**: `PATCH /api/v1/child/update`
- **Get Child**: `GET /api/v1/child/get`
- **Soft Delete Child**: `POST /api/v1/child/softDelete`
- **Delete Child**: `DELETE /api/v1/child/delete`

### Log Management

- **Add Log**: `POST /api/v1/log/add`
- **Get All Logs**: `GET /api/v1/log/getAllLogs`

### Admin Features

- **Get All Data (JSON)**: `POST /api/admin/getAllDataJson`
- **Get All Data (Excel)**: `POST /api/admin/getAllData`

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
- The admin routes are protected by a hardcoded username and password (`datadmin` and `neo@23@pp`).
