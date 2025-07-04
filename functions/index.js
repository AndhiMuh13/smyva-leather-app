// functions/index.js

const functions = require("firebase-functions");
const midtransClient = require("midtrans-client");
const cors = require("cors")({origin: true});

// Inisialisasi Snap Midtrans
const snap = new midtransClient.Snap({
  isProduction: false, // Ganti ke true jika sudah production
  serverKey: functions.config().midtrans.server_key,
  clientKey: "SB-Mid-client-vF9q_RBtGCBrRlXe", // Ganti dengan Client Key Anda
});

exports.createMidtransTransaction = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Pastikan metode request adalah POST
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const {orderId, total, items, customerDetails} = req.body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      item_details: items,
      customer_details: customerDetails,
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
          // transaction token
          const transactionToken = transaction.token;
          console.log("transactionToken:", transactionToken);
          res.status(200).send({token: transactionToken});
        })
        .catch((e) => {
          console.error("Error creating transaction:", e);
          res.status(500).send({error: e.message});
        });
  });
});