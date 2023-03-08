const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// const { conn } = require('./models/connection');
const childRouter = require('./routes/childRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"

const app = express();
dotenv.config({ path: './config.env' });

app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
	app.use(logger('dev'));
}

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
	max: 50,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'ratingsQuantity',
			'ratingsAverage',
			'maxGroupSize',
			'difficulty',
			'price'
		]
	})
);

app.use(compression());

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_LOCAL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		console.log('MongoDB successfully connected');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

connectDB();

// mongoose.connect(process.env.DATABASE_LOCAL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const conn = mongoose.connection;

// conn.on('error', () => console.error.bind(console, 'connection error'));

// conn.once('open', () => console.info('Connection to Database is successful'));

// const session = conn.startSession();
// const abortTransaction = session.abortTransaction();

// ROUTES
app.use('/api/v1/user', userRouter);
app.use('/api/v1/child', childRouter);
app.use('/api/v1/rate', childRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler
app.use(globalErrorHandler);
console.log('-------------------- :>> ');
// module.exports = { app, conn, session, abortTransaction };
module.exports = app;
