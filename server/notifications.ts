import { storage } from "./storage";

// Notification service for sending emails and SMS
export const notificationService = {
  async sendBookingConfirmedEmail(userId: string, bookingId: string, providerName: string, serviceType: string) {
    const prefs = await storage.getNotificationPreferences(userId);
    if (prefs?.emailBookings) {
      await storage.createNotification({
        userId,
        type: "booking_confirmed",
        channel: "email",
        subject: `Booking Confirmed - ${providerName}`,
        message: `Your booking for ${serviceType} with ${providerName} has been confirmed.`,
        bookingId,
        status: "sent",
      });
    }
  },

  async sendBookingCompletedEmail(userId: string, bookingId: string, providerName: string) {
    const prefs = await storage.getNotificationPreferences(userId);
    if (prefs?.emailBookings) {
      await storage.createNotification({
        userId,
        type: "booking_completed",
        channel: "email",
        subject: `Booking Completed - ${providerName}`,
        message: `Your booking with ${providerName} has been completed. Don't forget to leave a review!`,
        bookingId,
        status: "sent",
      });
    }
  },

  async sendPaymentEmail(userId: string, bookingId: string, amount: string) {
    const prefs = await storage.getNotificationPreferences(userId);
    if (prefs?.emailPayments) {
      await storage.createNotification({
        userId,
        type: "payment_received",
        channel: "email",
        subject: "Payment Received",
        message: `Payment of $${amount} has been received successfully.`,
        bookingId,
        status: "sent",
      });
    }
  },

  async sendMessageNotificationEmail(userId: string, senderName: string) {
    const prefs = await storage.getNotificationPreferences(userId);
    if (prefs?.emailMessages) {
      await storage.createNotification({
        userId,
        type: "message_received",
        channel: "email",
        subject: "New Message from " + senderName,
        message: `You have a new message from ${senderName}. Check the messages page to reply.`,
        status: "sent",
      });
    }
  },

  async sendNotificationViaSMS(userId: string, phoneNumber: string, message: string, type: string) {
    const prefs = await storage.getNotificationPreferences(userId);
    const shouldSend = type === "booking_confirmed" ? prefs?.smsBookings :
                      type === "payment_received" ? prefs?.smsPayments :
                      type === "message_received" ? prefs?.smsMessages : false;
    
    if (shouldSend) {
      await storage.createNotification({
        userId,
        type,
        channel: "sms",
        message,
        status: "sent",
      });
      // SMS sending would be implemented with Twilio when integrated
    }
  },
};
