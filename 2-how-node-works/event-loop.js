const fs=require('fs');
const crypto=require('crypto');
const start=Date.now();

process.env.UV_THREADPOOL_SIZE=4;                                           //THIS IS THE CODE THAT WILL BASICALLY SETS THE AMOUNT OF THREADS IN THE PROGRAM OF CRYPTO BCSE CRYPTOGRAPHY IS THE HEAVY TASK THE MORE HAVE THREADS THE LESS TIME IT WILL TAKE

//here this is the code for the demostration of the "event-loop" in the NODE.js 
//so the event loop is basically runs all the callbacks that are not included in the "top level" code means it will be included in the inside functions
//all the event loop has the ques named the "callback" means it will have that type of callbacks stored in that
//so the event loop has the 4 steps in the cycle
//1.EXPIRED TIMER CALLBACK ===> this is the callback's that firstly runs means the callback type like "setTimeout" will run
//2. I/O POLLING AND CALLBACKS ===> in this second step the input and output operations will perform means opens like  "FILE READ AND WRITE"
//3. SETIMMEDIATE CALLBACK  ===>  this is the callback which runs immediately like "setImmediate";
//4. CLOSE CALLBACK  ===>  in this callback this will run when the callback is about to end

//NOTE: other than this there are two more queues 
//PROCESS.NEXTTICK().queue ===> this queue can be used when we want to use or run the callback just after any step ends EX when timer gets completed we uses the api to fetchs the data
// OTHER MICROSERVICES QUEUE ===> like promise resolves

//when the event loop senses that there is not any I/O callback running in the background it will ends the LOOP


setTimeout(()=>{
    console.log("Timer 1 finished")
},0);

setImmediate(()=>console.log("Immediate 1 finished"));

fs.readFile('./starter/test-file.txt','utf-8',()=>{
    
     console.log("I/O finished");
     console.log('------------------')
     setTimeout(()=>{ console.log("Timer 2 finished")},0);
     setTimeout(()=>{ console.log("Timer 3 finished")},3000);
     setImmediate(()=>console.log("Immediate 1 finished"));                            //here in the output you can see that the setImmediate got called before the 2 setTimeout bcse when the evet loop runs it sees that in "setTimeout" and "setImmediate" there is not any "I/O" callback so thats the reason wht the immediate run first then timer

     process.nextTick(()=>console.log("process.nextTick"))                            //here we can see that the "process.nextTick" is executed first ahead of all the callback functions bcse it is a part of the microtasks queue so it will get executed before each phase so nextTick can be executed 2 times in the event loop but the "setImmediate" can be run only once per loop , so their work is opposite as their names
//=========================================code for cryptography bcse of THREAD POOL====================================
             crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
             console.log(Date.now()-start,"password encryption")
            });
             crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
             console.log(Date.now()-start,"password encryption")
            });
             crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
             console.log(Date.now()-start,"password encryption")
            });
            crypto.pbkdf2('password','salt',100000,1024,'sha512',()=>{
                console.log(Date.now()-start,"password encryption")
               });

    });

console.log("Hello from the top level code");                                                               //here we can see that the top level code can executed immediately means first of all