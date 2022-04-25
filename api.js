module.exports = function (app, db) {

	app.get('/api/test', function (req, res) {
		res.json({
			name: 'joe'
		});
	});

	app.get('/api/garments', async function (req, res) {

		const { season, gender } = req.query;
		let garments
		if (!gender && !season) {
			garments = await db.many(`select * from garment`);
		}
		else if (gender && !season) {
			garments = await db.many(`select * from garment where gender = $1`, [gender]);
		}
		else if (!gender && season) {
			garments = await db.many(`select * from garment where season = $1`, [season]);
		}
		else if (gender && season) {
			garments = await db.many(`select * from garment where season = $1 and gender = $2`, [season, gender]);
		}

		// add some sql queries that filter on gender & season
		res.json({
			data: garments
		})
	});

	app.put('/api/garment/:id', async function (req, res) {

		try {

			// use an update query...

			const { id } = req.params;
			const garment = await db.many(`select description from garment where id = $1`, [id]);

			// you could use code like this if you want to update on any column in the table
			// and allow users to only specify the fields to update

			// let params = { ...garment, ...req.body };
			// const { description, price, img, season, gender } = params;
			await db.oneOrNone(`update garment set gender = 'Unisex' where id = $1`, [id])


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
			await db.none(`insert into garment (description, img, season, gender, price) values ($1,$2,$3,$4,$5)`, [description,img,season,gender,price])

			res.json({
				status: 'success'
			});

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


	app.delete('/api/garments', async function (req, res) {

		try {
			let { gender } = req.query;
			// delete the garments with the specified gender
			await db.none(`delete from garment where gender = $1`, [gender])
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