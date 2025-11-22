// Example payment service using the axios instance
import api from '../lib/api';

class PaymentService {
  // Create a new payment transaction
  static async createTransaction(paymentData) {
    try {
      const response = await api.post('/api/payment/create-transaction', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      throw error;
    }
  }

  // Get transaction status
  static async getTransactionStatus(transactionId) {
    try {
      const response = await api.get(`/api/payment/transaction-status/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  // Update booking status (typically used by backend or admin)
  static async updateBookingStatus(bookingData) {
    try {
      const response = await api.post('/api/payment/update-status', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
}

// Payment initialization function to use in your components
const initializePayment = async (bookingData) => {
  try {
    // Create transaction with Midtrans
    const paymentResult = await PaymentService.createTransaction({
      amount: bookingData.totalAmount,
      customer_email: bookingData.customerEmail,
      customer_name: bookingData.customerName,
      order_id: bookingData.bookingId || `ORDER-${Date.now()}`,
      item_details: bookingData.itemDetails || []
    });

    if (paymentResult.success && paymentResult.token) {
      // Redirect to Midtrans payment page or open snap popup
      window.snap.pay(paymentResult.token, {
        onSuccess: function(result) {
          console.log('Payment success!', result);
          // Handle success - maybe redirect to success page
        },
        onPending: function(result) {
          console.log('Payment pending!', result);
          // Handle pending payment
        },
        onError: function(result) {
          console.log('Payment error!', result);
          // Handle error
        },
        onClose: function() {
          console.log('Customer closed the popup without finishing the payment');
          // Handle payment cancellation
        }
      });
    } else {
      console.error('Failed to create payment transaction:', paymentResult.message);
      throw new Error(paymentResult.message || 'Failed to create payment transaction');
    }
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

export { PaymentService, initializePayment };