for(let i = 1; i <= 100; i++) {

     if(i % 3 === 0) {
   
      console.log("APPLES");
   
   }
   
   else if(i % 5 === 0) {
   
    console.log("ORANGES");
   
   }
   
   else if (i % 3 === 0 && i % 5 === 0 ) {
   
    console.log("APPLESORANGES");
   
   }
   
    else {
   
   console.log(i);
   
   }
   
   }