var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
var braintree = require('braintree');
// const privateKey  = fs.readFileSync('./certificates/server.key', 'utf8');
// const certificate = fs.readFileSync('./certificates/server.crt', 'utf8');
// const credentials = {key: privateKey, cert: certificate};


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');

app.set('views', './public/template');
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.render('carddetail')
  
});


app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/card',(req,res)=>{

})
app.post('/checkout',(req,res)=>{
  console.log(">>>>>>>hererererer")
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 's7v27h9jmgtdfj9m',
    publicKey: '47ngqy44wbyw53n2',
    privateKey: 'e77932420d24dda960b1f6722f157024'
  });
  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: '10.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
    console.log(">>result>>",result)
      if (result) {
        res.send(result)
       // res.render('response',{result:result});
      } else {
        res.status(500).send(error);
      }
  });
})

app.get('/data/:result',(req,res)=>{
  if(req.params){
      res.render('response',{result:req.params.result})
  }
})
//const server = require('https').createServer(credentials,app);
// const port = 4000;
// server.listen(port, () => {
//     console.log('Listening on ',port);
// });

app.listen(4000, function () {
  console.log('Ready to create payments on port 4000');
});
