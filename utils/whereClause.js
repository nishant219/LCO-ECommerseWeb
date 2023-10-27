//what is where class ==> simple file/class which accepts that
//on which model you want to run user.find, category.find, x.find...
// 2nd parameter -long url string having queries,params ? = ...

const { stringify } = require("yamljs");

//base -Product.find(), x.find()
//bigQuery - bigQ - stringified object

class WhereClause {
  
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    // const searchword= this.bigQ.search ? {} : {}
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i", //case insensitive
          },
        }
      : {};
    this.base = this.base.find({ ...searchword });
    return this;
  }


  //filter - to filter products
  filter(){
    //convert bigQ into a string-> copyQ
    const copyQ={...this.bigQ}; //copy of bigQ, as we are dealing with reagex and it manipulates that string
    delete copyQ("search");
    delete copyQ("limit");
    delete copyQ("page");

    //Convert to string
    let stringOfCopyQ=JSON.stringify(copyQ);
//regex (/ \b()\b /g,  ()=>{})
    stringOfCopyQ = stringOfCopyQ.replace(
        /\b(gte|lte|gt|lt)\b/g, (m)=>`$${m}`
    );
//convert to json
    const jsonOfCopyQ =JSON.parse(stringOfCopyQ);

    this.base=this.base.find(jsonOfCopyQ)
return this;
} 



  //result per page
  pager(resultperPage) {
    let currentPage = 1; //initial page
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }

    const skipVal = resultperPage * (currentPage - 1);
    //limiting value per page--resultperPage
    //how many val to skip while showint next page -->skipval
    this.base = this.base.limit(resultperPage).skip(skipVal);
    return this;
  }


}

module.exports= WhereClause;