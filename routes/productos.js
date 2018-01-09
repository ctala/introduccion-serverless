var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('Index Productos');
});

router.get('/:id', function (req, res, next) {
    res.send('Producto ID : ' + req.params.id);
});

router.post('/', function (req, res, next) {
    res.send('CREANDO PRODUCTO');
});

module.exports = router;
