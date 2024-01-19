module.exports=(temp,product)=>{                                               //as in this line we can see that we have the librabry called "module.exports" that means this will export the whole component as an anonymous function
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);           //here we have not wrpped the {%PRODUCTNAME%} in the "" but in the // and followed by the "g" means it will make the changes or replace globally not alone in the first place
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);
    if(!product.organic){
        output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    };
    return output;
}