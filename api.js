module.exports = function (app, db) {
	const jwt = require('jsonwebtoken')

	app.post('/api/login', async function (req, res, next) {
		const { username } = req.body;
		const { password } = req.body;
		let role
		if (username === process.env.USERNAME) {
			role = 'admin'
		} else {
			role = 'user'
		}
		const token = jwt.sign({
			username
		}, process.env.ACCESS_TOKEN_SECRET);
		let checkDuplicate = await db.manyOrNone(`SELECT id from users WHERE username = $1`, [username]);

		if (checkDuplicate.length < 1) {
		await db.none(`insert into users (username, password, role) values ($1,$2,$3)`, [username, password, role])
		}
	
		res.json({
			token
		});

	})
	function verifyToken(req, res, next) {

		const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
		if (!req.headers.authorization || !token) {
			res.sendStatus(401);
			return;
		}
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		const { username } = decoded;

		if (username && username === process.env.USERNAME) {
			next();
		} else {
			res.status(403).json({
				message: 'unauthorized'
			});
		}

	}
	app.get('/api/test', function (req, res) {
		res.json({
			name: 'joe'
		});
	});

	app.get('/api/garments/:username', verifyToken, async function (req, res) {

		// add some sql queries that filter on gender & season
		const { season, gender } = req.query;
		const username = req.params.username
		console.log(req.params)
		let garments
		if (!gender && !season) {
			garments = await db.manyOrNone(`select * from garment`);
		}
		else if (gender && !season) {
			garments = await db.manyOrNone(`select * from garment where gender = $1`, [gender]);
		}
		else if (!gender && season) {
			garments = await db.manyOrNone(`select * from garment where season = $1`, [season]);
		}
		else if (gender && season) {
			garments = await db.manyOrNone(`select * from garment where season = $1 and gender = $2`, [season, gender]);
		}
		let id = await db.one(`select id from users where username = $1`, [username])
		const userId = id.id
		const cart = await db.manyOrNone(`SELECT * from cart WHERE user_id = $1`, [userId]);
		res.json({
			data: garments,
			cart: cart
		})
	});

	app.delete('/api/garments/:username', async function (req, res) {

		const username = req.params.username
		try {
		let id = await db.one(`select id from users where username = $1`, [username])
		const userId = id.id
		const cart = await db.none(`delete * from cart WHERE user_id = $1`, [userId]);
			res.json({
				status: 'success'
			})
		} catch (err) {
			// console.log(err);
			res.json({
				status: 'success',
				error: err.stack
			})
		}
	});
		


	app.put('/api/garment/:id', async function (req, res) {

		try {

			// use an update query...

			const { id } = req.params;
			const garment = await db.many(`select * from garment where id = $1`, [id]);

			// you could use code like this if you want to update on any column in the table
			// and allow users to only specify the fields to update

			let params = { ...garment, ...req.body };
			const { description, price, img, season, gender } = params;
			if (description) {
				await db.oneOrNone(`update garment set description = $1 where id = $2`, [description, id])
			}
			else if (price) {
				await db.oneOrNone(`update garment set price = $1 where id = $2`, [price, id])
			}
			else if (img) {
				await db.oneOrNone(`update img set img = $1 where id = $2`, [img, id])

			}
			else if (season) {
				await db.oneOrNone(`update garment set season = $1 where id = $2`, [season, id])

			}
			else if (gender) {
				await db.oneOrNone(`update garment set gender = $1 where id = $2`, [gender, id])
			}


			res.json({
				status: 'success'
			})
		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});

	app.get('/api/garment/:id', async function (req, res) {

		try {
			const { id } = req.params;
			// get the garment from the database
			const garment = await db.one(`select gender from garment where id = $1`, [id]);

			res.json({
				status: 'success',
				data: garment
			});

		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});


	app.post('/api/garment/', async function (req, res) {

		try {

			const { description, price, img, season, gender } = req.body;

			// insert a new garment in the database
			let checkDuplicate = await db.manyOrNone(`SELECT id from garment WHERE description = $1`, [description]);

			if (checkDuplicate.length < 1) {

				await db.none(`insert into garment (description, img, season, gender, price) values ($1,$2,$3,$4,$5)`, [description, img, season, gender, price])
				res.json({
					status: 'success'
				});
			}
			else {
				res.status(200).json({
					message: 'duplicate'
				})
			}

		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});
	app.post('/api/', async function (req, res) {

		try {

			const { item, price, username } = req.body;
			let id = await db.one(`select id from users where username = $1`, [username])
			const userId = id.id
			// insert a new garment in the database
			// let checkDuplicate = await db.manyOrNone(`SELECT id from garment WHERE description = $1`, [description]);

			// if (checkDuplicate.length < 1) {

				await db.none(`insert into cart (item, price, user_id) values ($1,$2,$3)`, [item, price, userId])
				res.json({
					status: 'success'
				});
			// }
			// else {
			// 	res.status(200).json({
			// 		message: 'duplicate'
			// 	})
			// }

		} catch (err) {
			console.log(err);
			res.json({
				status: 'error',
				error: err.message
			})
		}
	});

	app.get('/api/garments/grouped', async function (req, res) {
		const result = await db.many('select gender, count(*) from garment group by gender ORDER BY count(*) ASC')
		// use group by query with order by asc on count(*)
		res.json({
			data: result
		})
	});
	app.get('/api/garments/price/:price', async function (req, res) {
		const maxPrice = Number(req.params.price);
		let result
		if (maxPrice > 0) {
			result = await db.many('select * from garment where price <= $1', [maxPrice])
		}
		res.json({
			data: result
		})
	});


	app.delete('/api/garments', async function (req, res) {

		try {
			let { description } = req.query;
			// delete the garments with the specified gender
			await db.none(`delete from garment where description = $1`, [description])
			res.json({
				status: 'success'
			})
		} catch (err) {
			// console.log(err);
			res.json({
				status: 'success',
				error: err.stack
			})
		}
	});


}