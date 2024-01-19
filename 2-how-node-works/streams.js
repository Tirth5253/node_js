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


//                    =====solution1 basic====
//   fs.readFile('./starter/test-file.txt','utf-8',(err,data)=>{                                  //as we can see that this function that is trying to access the file or read it ,has over 10,000 files so by this method we will read the all the 10,000 line all at once ,so that will cause our applicarion very slow bcse tons of requests are hitting the server
//      if(err) console.log("there is an error 😒");
//      res.end(data);
//   });




//       ==================SOLUTION2 Strems==================     [PROBLEM: so the problem of this sollution is that readStream has very fast capacity of reading the stream but as the writable is very slow  so as a result it will get very overwelmed means write cannot handles the data this problem is called "BACK PRESSURE"]

// const readable=fs.createReadStream('./starter/test-file.txt','utf-8');                           //here in this solution first we creates the "createReadStram" stored into variable then as we can know that all the readableStram can support the event listener as argument of "data" then as a second argument we can we have write that code that has been read in as a "chunk"  
// readable.on('data',chunk=>{
//     res.write(chunk);
// });
// readable.on('end',()=>{                                                                         //when all the data get fetched then it will run this event as an argument "end()" we do not have to pass the argument in that bcse we have already write it in the chunk 
//     res.end()
// });
// readable.on('error',err=>{console.log(err); res.end('file not found')});




//      ============SOLUTION 3 using readStream FUNCTIONS [pipe()]======================                    //so basically pipe will handles the flow speed of both ends

const readable=fs.createReadStream('./starter/test-file.txt','utf-8');
readable.pipe(res)                                                                                      // readableSource.pipe(WritableDestination);



})

server.listen(8000,'127.0.0.1',()=>console.log("server has been created"))