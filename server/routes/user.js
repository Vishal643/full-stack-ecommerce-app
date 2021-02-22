const express = require('express');

const router = express.Router();

router.get('/user', (req, res) => {
	res.json({
		data: 'Hello Vishal Kumar From User',
	});
});

module.exports = router;
