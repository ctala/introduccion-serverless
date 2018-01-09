var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
    console.log(dynamoDb);
} else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
}
;


/* GET products listing. */
router.get('/', function (req, res, next) {
    var params = {
        TableName: PRODUCTS_TABLE
    };

    dynamoDb.scan(params, function (err, data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            console.log(data);           // successful response
            res.json(data);
    });
});

// Get Product endpoint
router.get('/:productId', function (req, res) {
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: {
            productId: req.params.productId,
        },
    }

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({error: 'No se pudo obtener el producto'});
        }
        if (result.Item) {
            const {productId, name} = result.Item;
            res.json({productId, name});
        } else {
            res.status(404).json({error: "Producto no encontrado"});
        }
    });
})

router.post('/', function (req, res, next) {
    console.log("Creando Producto");
    const {productId, name} = req.body;
    console.log("productId = " + productId);
    console.log("name = " + name);

    if (typeof productId !== 'string') {
        res.status(400).json({error: '"productId" must be a string -> ' + productId});
    } else if (typeof name !== 'string') {
        res.status(400).json({error: '"name" must be a string' + name});
    }

    const params = {
        TableName: PRODUCTS_TABLE,
        Item: {
            productId: productId,
            name: name,
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({error: 'No se pudo crear producto'});
        }
        console.log("Producto " + productId + " creado exitosamente.");
        res.json({productId, name});
    });
});

module.exports = router;
