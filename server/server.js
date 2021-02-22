const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fs = require('fs');
const { readdirSync } = require('fs');
require('dotenv').config();

//import routes
const authRoutes = require('./routes/auth');

//app
const app = express();

//database
mongoose
	.connect(process.env.DATABASE_MONGO, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Database Connected !!!'))
	.catch((err) => console.log(`Database connection Error ${err}`));

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(cors());

//routes middleware

// fs.readdirSync('./routes').map((route) =>
// 	app.use('/api', require('./routes/' + route))
// );
//below is the same as above just destructured from fs
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

//port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
