const BigPromise = require("../middlewares/bigPromise");


exports.home = BigPromise(async (req, res) => {
  res.status(200).json({
    success: true,
    greeting: "Hello from API",
  });
});


exports.test=BigPromise(
  async(req,res)=>{
    res.status(200).json(
      {
        success:true,
        message:"Hello from test"
      }
    );
  }
);


exports.dummyhome = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      greeting: "Hello from dummy API home",
    });
  } catch (error) {
    console.log(error);
  }
};
