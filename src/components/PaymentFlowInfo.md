# Alur Pembayaran Carten'z

## Endpoint yang Digunakan:
1. `/api/payment/create-transaction` - Membuat transaksi Midtrans
2. `/api/booking/update-status` - Memperbarui status pembayaran
3. `/api/bookings` - Menyimpan dan mengambil data booking

## Flow Pembayaran:
1. Customer klik booking → checkout page
2. Data booking disiapkan di frontend
3. Request ke `/api/payment/create-transaction` untuk membuat transaksi Midtrans
4. Midtrans popup muncul untuk pembayaran
5. Setelah pembayaran:
   - Sukses → Update status ke 'paid' via `/api/booking/update-status`
   - Pending → Update status ke 'pending'
   - Gagal → Update status ke 'failed'
6. Redirect ke `/booking-success` dengan kode booking
7. Admin bisa lihat booking di `/admin/bookings`

## Pastikan Backend Mendukung:
- Endpoint `/api/payment/create-transaction` menerima data booking_id, amount, customer_email, customer_name, item_details
- Endpoint `/api/booking/update-status` untuk memperbarui status pembayaran
- Endpoint `/api/bookings` untuk menyimpan dan membaca data booking

## Fungsi handlePayment yang benar ada di file:
- `handlePaymentFixed.tsx` - berisi fungsi pembayaran yang sudah diperbaiki
- Salin fungsi ini ke dalam komponen Booking.tsx Anda