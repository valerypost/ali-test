/**
 * Created by vbalovnev on 3/24/2017.
 */
var search = require('./test1');
var aliSearch = require('./search');
console.log("start test");
console.log("The area of a circle of radius 4 is "+search.area);
console.log("The area of a cir "+search.cir(2));
console.log(`The area of a circle of radius 4 is ${search.cir(4)}`);
search.run();
var res=aliSearch.generateSearchResult("smd");
console.log(res);

