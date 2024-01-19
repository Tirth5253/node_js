//so the streams are basically used to send or recieve the data but by sending or recieving in the small small amounts so the load not get incresed thats why apps like Netflix and Youtube called the streaming apps
//there are basically 4 types of Strams

//                              DESCRIPTION                       EXAMPLE                     IMPORTANT EVENTS       IMPORTANT FUNCTIONS
//1.READABLE STEAM  || strams from which we can read data      ||   http requests,fs and streams || data , end    ||    pipe() , read()
//2.WRITABLE STEAMS || streams from which we can write the data||      ''                  ' '   || drain , finish||    write() , end()
//3.DUPLEX STREAMS  || streams that can do both                ||  net websocket
//4.Transform Stm.

//here we have to note that all the streams are the part of the "EventEmiter" class 
//so we can use the "Event" in all the streams

//IN this file we will read the data from the file and send it back to the user using the streams

const fs=require('fs');
const server=require('http').createServer();

server.on('request',(req,res)=>{
    //=====solution1 basic====
  fs.readFile('./starter/test-file.txt','utf-8',(err,data)=>{
     if(err) console.log("there is an error 😒");
     res.end(data)
  });
})

server.listen(8000,'127.0.0.1',()=>console.log("server has been created"))