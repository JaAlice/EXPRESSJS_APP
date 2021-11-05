const express = require('express');
const port = 3000;
const app = express();
const CryptoJS = require('crypto-js');
const plikdata = require('c:/users/Alicja/Desktop/apka_w_express/data');
const pug = require('pug');
const db = require('./queries');
app.set('view engine', 'pug');
app.set('views', 'src/views');
app.use(express.urlencoded({ extended: true }));

app.get('/users',  function (req, res) {
	db.getUsers()
		.then(data => {
			res.render('users', { title: 'Users', message: data})})
		.catch(err => { console.error(err); });
});

app.route('/userid')
	.get(function (req, res) {
		res.render('userid', {title: 'Users'})
	})
	.post(function (req, res) {
		let id = req.body.User_ID;
		if (id != undefined) {res.redirect('/users/'+id)}
		else {
			let mail = req.body.email;
			db.getUsersbyemail(mail,"")
			.then(data => {
				res.render('userid', { title: 'Users', message: data})})
			.catch(err => { console.error(err); });
		}
	})

app.route('/scheduleid')
	.get(function (req, res) {
		res.render('scheduleid', {title: 'Schedules'})
	})
	.post(function (req, res) {
		let id = req.body.User_ID;
		res.redirect('/schedules/'+id)
	})

app.get('/schedules',  function (req, res) {
	db.getSchedules()
		.then(data => {
			res.render('schedules', { title: 'Schedules', message: data})})
		.catch(err => { console.error(err); });
});

app.route('/').get(function (req, res) {
	res.render('index', { title: 'Main Page', message: 'Main Page' });
});



app.route('/users/new')
	.post(async function (req, res) {
		let first = req.body.firstname;
		let last = req.body.lastname;
		let mail = req.body.email;
		let pass = req.body.password;
		let count = await db.getUsersbyemail(mail,"count");
		if (count == 0) {
		db.addUser(first, last, mail, CryptoJS.SHA256(pass).toString());
		res.render('new_user', {
			title: 'Users',
			message: `User ${first} ${last} has been added!`,
		});}
		else {res.render('new_user', {
			title: 'Users',
			message: `User already created! Enter different email address!`,
		});}
	})
	.get(function (req, res) {
		res.render('new_user', { title: 'New User' });
	});

app.route('/schedules/new')
	.post(async function (req, res) {
		let id = req.body.User_ID;
		let day = req.body.Day;
		let from = req.body.From;
		let to = req.body.To;
		if (from >= to) {
		res.render('new_schedule', {
				title: 'new_schedule',
				answer: `Start time must be earlier than end time!`})
			return false}
		let addResult = await db.getSchedulesforUser(id, day, from, to);
		if (addResult == "added") {
		res.render('new_schedule', { title: 'New Schedule', answer: 'Schedule has been added!'})
		}
		else {
		res.render('new_schedule', { title: 'New Schedule', answer: 'Schedule has not been added! There are conflicting schedules:', message: addResult})
		}
	})
	.get(function (req, res) {
		res.render('new_schedule', { title: 'New Schedule' });
	});


app.get('/users/:id',  function (req, res) {
		let id = req.params['id'];
		db.getUsersbyID(id)
			.then(data => {
				res.render('userid', { title: 'Users', message: data})})
			.catch(err => { console.error(err); });
	});
	
app.get('/schedules/:id', function (req, res) {
	let id = req.params['id'];
	db.getSchedulebyID(id)
		.then(data => {
			res.render('scheduleid', { title: 'Schedules', message: data})})
		.catch(err => { console.error(err); });
	});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
