var express = require('express');
var router = express.Router();
var ObjectID = require('mongoskin').ObjectID;
/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/userlist', function (req, res) {
	var db = req.db;
	db.collection('userlist').find().toArray(function (err, items) {
		res.json(items);
	});
});

router.post('/adduser', function (req, res) {
	var db = req.db;
	console.log(req.body);
	db.collection('userlist').insert(req.body, function (err, result) {
		res.send(
			(err==null)? {msg:''}:{msg:err}
			);
	});
});

router.delete('/delete/:id', function (req,res) {
	var db = req.db;
	var userDelete = req.params.id;
	db.collection('userlist').removeById(userDelete, function (err, result) {
		res.send((result===1)? {msg:''}:{msg:'error: '+ err});
	});
});

router.put('/edituser/:id', function (req, res) {
	var db = req.db;
	var userEdit = req.params.id;
	console.log(userEdit);
	db.collection('userlist').update({_id: new ObjectID(userEdit)}, req.body, function (err, result) {
		res.send(
			(err==null)? {msg:''}:{msg:err}
			);
	});
});
module.exports = router;
