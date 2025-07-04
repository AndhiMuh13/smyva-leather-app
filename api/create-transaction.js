// File: api/create-transaction.js
// Pastikan Anda sudah menjalankan `npm install midtrans-client`

const midtransClient = require('midtrans-client');

// Inisialisasi Snap Midtrans
// Kunci rahasia ini diambil dari Environment Variables di Vercel, bukan ditulis di sini
const snap = new midtransClient.Snap({
  isProduction: false, // Ganti ke true jika sudah live
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

/**
 * Handler untuk Vercel Serverless Function.
 * Fungsi ini akan menerima request dari frontend Anda.
 */
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ambil data pesanan dari body request yang dikirim oleh frontend
    const { orderId, total, items, customerDetails } = req.body;

    // Siapkan parameter yang akan dikirim ke Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      item_details: items,
      customer_details: customerDetails,
      // Anda bisa menambahkan parameter lain di sini sesuai dokumentasi Midtrans
      // seperti credit_card, gopay, dll.
    };

    // Buat transaksi menggunakan library Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Kirim kembali token transaksi ke frontend
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    // Tangani jika ada error saat membuat transaksi
    console.error("Error creating Midtrans transaction:", error.message);
    res.status(500).json({ error: error.message });
  }
}
