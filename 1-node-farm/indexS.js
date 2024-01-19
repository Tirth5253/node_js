
const http=require('http');
const url=require('url');
const fs=require('fs');
const replaceTemplate=require('./modules js/replaceTemplate')
const slugify=require('slugify')                                                         //slug is basically the last part of the URL that contains the unique string that identifies the resource that the website is displaying  for EX. we have the website with the url of the "http://127.0.0.1:8000/product?id=2"   so that can good if we better write that as "http://127.0.0.1:8000/apollo-brocoly" so the last part called "appolo brocoly" is called slug
//==========================================SERVER==================================================

//NOTE:we can use the readFileSync only bcse of its out side of callback of the server otherwise we cant 
const tempOverview=fs.readFileSync(`${__dirname}/starter/templates/templete-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/starter/templates/templete-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/starter/templates/templete-product.html`,'utf-8');



const data=fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);                                                         //here we have converted the json into the String

const slugs=dataObj.map(el => slugify(el.productName,{lower:true}));                   //here we have created the slug using the data's productName
console.log(slugs);

//so each time any request hits the server the callback function will run and it uses the "end" function
//here the "req" variable holds the all kind of stuf like a request url
const server=http.createServer((req,res)=>{
    
   const{query,pathname}= url.parse(req.url,true);                                     //note this is the function means "url.parse(req.url)" which return an object of named "url" which returns the variable called "query" which holds the "id" and that is from the our url address after "/" ex. "http://127.0.0.1:8000/product?id=0"  so its basically used to detects the id and we also have the variable which is called "pathname" that we have destructured;
    //OVERVIEW
    if(pathname === '/' || pathname==='/overview'){

        res.writeHead(200,{'Content-type':'text/html'})

       const cardsHtml= dataObj.map(el=>replaceTemplate(tempCard,el)).join('');        //here in the map function "el" element holds all the data of the JSON  at last all the data will be converted into the string
       const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
       res.end(output);
    //PRODUCT
    }else if(pathname==='/product'){                                                   //so this line says that our pathname means the pathname returned by the parse is equal to "product" then it will run the further code
        
        res.writeHead(200,{'Content-type':'text/html'})
        const product=dataObj[query.id];                                                //this code says that we will have only those data which is having id similar as we have written in the header of the browser so basically this code will retrive the data on the basis of the id only
        const output=replaceTemplate(tempProduct,product);                              //here in the product's replaceTemplate we didnt have much did like we did with "tempOverview" bcse we already made it and then we have reused it,
        res.end(output);
    }else
    //API
     if(pathname==='/api'){
     res.writeHead(200,{'Content-type':'application/json'})                             //this line says the browser that the json file or the data is coming
     res.end(data);
    //NOT FOUND
    }else{
    res.writeHead(404,{
        'Content-type':'text/html'
    })                                                                                 //this is the method to change the http status code to 404 and the second argument is the all about meta data and how we want to show the error message or in the .end by that we can use the html in the .end
    res.end('<h1>Page cannot be found:404</h1>')
}
});

//so this is the function that is used to listten the request of the users from the server when it listens it will sends the message that is written in the callback function
//so the first argument is the host , the second is the ip address of the local user
server.listen(8000,'127.0.0.1',()=>{
    console.log("listening to the requests 8000")
});


