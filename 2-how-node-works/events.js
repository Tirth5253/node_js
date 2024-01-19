const EventEmmiter=require('events');
const http=require('http');
//so in this file we will learn about the two things "event emmiter" and "event listener" 
//so the "event emiter" means the thing that can cause the event to emit   EX. in react or html clicking on button can cause the evnet so button can be emiter

class sales extends EventEmmiter{
    constructor(){
        super();                                                                 //this is the how we can inherit the all the classes of the eventemmiter
    }
}

const myEmmiter=new sales();                                                       //here we have made the new instance for the use of the class of the myEmmiter

myEmmiter.on("newSale",()=>console.log("There was a new sale"));                          //this line says we have used the "on" method along with that ,so the "on" has the two arguments 1st one is the thing that emited by the "emit()" so basically the argument passes in the "emit" and  in "On" matches then the code written in the "on"'s 2nd argument will get run 

myEmmiter.on("newSale",()=>console.log("Customer Name is Tirth"));                       //this line says that "on" can be run multiple times on the single "emit"

myEmmiter.on("newSale",stock=>{
    console.log(`there are basically ${stock} items left`)                               //this line of code says that we can use the second argument of the emit in the code of the "on";
})

myEmmiter.emit('newSale',9);                                                              //the emiter will basically generate the thing  that can cause the event 
                                                                                        // this all the upper code pattern called the "OBSERVER pattern"  bcse on will observe untill the emit can genrate

//========================================EVENTS IN HTTP SERVER =======================================================================

const server=http.createServer();

server.on('request',(req,res)=>{
    console.log('request recieved');
    res.end('Request recieved');
});

server.on('request',(req,res)=>{
    console.log('ANOTHER request recieved');
   
});

server.on('close',(req,res)=>{
    console.log('Server has been closed');
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('server has been started');
})