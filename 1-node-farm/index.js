const fs=require('fs');

   
//============================================READING THE FILES============================================================

const textIn=fs.readFileSync('./starter/txt/input.txt','utf-8');//here the first one as a argument is the file location that  we want to read and the second onr is the character encoding
console.log(textIn);
const textOut=`this is the all we know about the avacados: ${textIn}.\nCreated on ${Date.now()} `;
fs.writeFileSync('./starter/txt/output.txt',textOut);
console.log("file has been written");


//reading the file in the async way which is non blocking


//in this you have the two parameters the first one is the file we want to read and the second one is the callback function that have the two parameters "err and Data"
//in this below code first the "starter.txt" file code will read and then we have the all file text stored in the "data1" and it will be pass down as a file name in next function
//NOTE:here we have made the async code using callBack bcse of that we have genrated the problem called the "CallBack Hell" so its not recomended

fs.readFile('./starter/txt/start.txt','utf-8',(err,data1)=>{

    if(err) console.log("there is the error 🔥")

    fs.readFile(`./starter/txt/${data1}.txt`,'utf-8',(err,data2)=>{
        fs.readFile('./starter/txt/append.txt','utf-8',(err,data3)=>{
            console.log(data3)

            fs.writeFile('./starter/txt/final.txt',`${data2}\n${data3}`,'utf-8' ,err=>{         //here in the write the first argument is the location file and the second args is the text we want to write and in the  callback function we only have the "err" so 
                console.log("your file has been written")
            });      
        });
    });
});

