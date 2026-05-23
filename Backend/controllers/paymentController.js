const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// =====================================================
// 🔥 CREATE ORDER
// =====================================================
const createOrder = async (req, res) => {

  try {

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "receipt_order"
    };


    const order = await razorpay.orders.create(options);


    res.status(200).json(order);

  } catch (error) {

    res.status(500).json(error);

  }

};

module.exports = {
  createOrder
};