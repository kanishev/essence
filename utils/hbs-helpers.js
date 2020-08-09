module.exports = {
    greaterThan(v1, options){
        if (v1.length >= 4) {
            return options.fn(this);
         }
         return options.inverse(this);
   
    }
}
