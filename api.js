var express = require('express');
var app = express();
var Jimp = require("jimp");
var request = require("request");
var http = require('http')
  , fs = require('fs'), 
  bodyParser = require('body-parser'),
  path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies
var port = 8080;


app.use(function (req, res, next) {
  console.log("body : "+req.body); // populated!
  console.log("imageUrl : "+req.body.imageUrl); // populated!

  next();
})

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


app.post('/api/rotateImage', function(req, res) {
  
var imageName = req.body.imageUrl; 
  var shouldConcertToGrayScale = req.body.shouldConcertToGrayScale; 
  var body = req.body; 
  console.log('imageUrl = '+imageName);

download(''+imageName, 'downloaded-img.jpg', function(){
  console.log('done. file name is downloaded-img.png');
  Jimp.read('downloaded-img.jpg').then(function (img2) {

    img2
         // .resize(256, 256)          
         .quality(60)                 
         // .greyscale()
         .rotate(90)                 
         .write("img1-Rotated.jpg"); 
}).catch(function (err) {
    console.error(err);
});

//TODO : Remove Nested function 
//TODO : Replace physical path with logical path
fs.readFile('img1-Rotated.jpg', function(err, data1) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    // res.end('<html> <body> <img src="img1-Rotated.jpg" alt="image" height="256" width="256"> </body> </html>');  
    res.end(data1);  
   }); //fs read file output image
   
});
}); 

// start the server
app.listen(port);
console.log('Server started! At http://website.com:' + port);