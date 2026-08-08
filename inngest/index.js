import { Inngest } from "inngest";
import User from "../models/User.js";
import sendEmail from "../configs/nodeMailer.js";

// Initialize the Inngest client
export const inngest = new Inngest({ id: "medimart-app" });

// 1. Sync User creation from Clerk Webhook
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const email = email_addresses[0].email_address;
        const allowedAdmins = ["amityadavx245@gmail.com", "admin@medimart.com"];
        const role = allowedAdmins.includes(email.toLowerCase()) ? 'admin' : 'customer';
        
        const userData = {
            _id: id,
            email,
            name: `${first_name || ''} ${last_name || ''}`.trim() || 'Valued User',
            image: image_url,
            role
        };
        await User.create(userData);
    }
);

// 2. Sync User updating from Clerk Webhook
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const email = email_addresses[0].email_address;
        const allowedAdmins = ["amityadavx245@gmail.com", "admin@medimart.com"];
        const role = allowedAdmins.includes(email.toLowerCase()) ? 'admin' : 'customer';

        const userData = {
            email,
            name: `${first_name || ''} ${last_name || ''}`.trim() || 'Valued User',
            image: image_url,
            role
        };
        await User.findByIdAndUpdate(id, userData);
    }
);

// 3. Sync User deletion from Clerk Webhook
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

// 4. Send Welcome Email upon signing up
const sendWelcomeEmail = inngest.createFunction(
    { id: 'send-welcome-email' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { email_addresses, first_name } = event.data;
        const recipientEmail = email_addresses[0].email_address;
        const name = first_name || 'Customer';

        await sendEmail({
            to: recipientEmail,
            subject: 'Welcome to MediMart! 🩺',
            body: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #2c3e50;">Hello ${name},</h2>
                    <p>Welcome to <strong>MediMart</strong>! Your health and well-being are our highest priorities.</p>
                    <p>With your new account, you can quickly browse, order medicines online, and track delivery status right from your dashboard.</p>
                    <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3498db; border-radius: 4px;">
                        <strong>Quick Tip:</strong> Keep your shipping address up-to-date under your profile settings for faster checkout.
                    </p>
                    <p>If you have any questions, feel free to reply to this email.</p>
                    <br/>
                    <p>Stay Healthy,<br/><strong>The MediMart Team</strong></p>
                </div>
            `
        });
    }
);

// 5. Send Order Confirmation Email
const sendOrderConfirmationEmail = inngest.createFunction(
    { id: 'send-order-confirmation-email' },
    { event: 'app/order.confirmed' },
    async ({ event }) => {
        const { orderId, userEmail, userName, items, totalAmount } = event.data;

        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
            </tr>
        `).join('');

        await sendEmail({
            to: userEmail,
            subject: `Order Confirmed: Order #${orderId}`,
            body: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #27ae60; text-align: center;">Order Confirmed!</h2>
                    <p>Dear ${userName},</p>
                    <p>Thank you for shopping at MediMart. Your order <strong>#${orderId}</strong> has been received and is being prepared.</p>
                    
                    <h3 style="border-bottom: 2px solid #27ae60; padding-bottom: 5px; color: #2c3e50;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="padding: 8px; text-align: left;">Item</th>
                                <th style="padding: 8px; text-align: center;">Qty</th>
                                <th style="padding: 8px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    
                    <h4 style="text-align: right; margin-top: 15px; color: #2c3e50;">Total Paid/Due: $${totalAmount.toFixed(2)}</h4>
                    
                    <p>We will send you a shipment notification as soon as your items are on the way.</p>
                    <br/>
                    <p>Warm regards,<br/><strong>The MediMart Team</strong></p>
                </div>
            `
        });
    }
);

// Export all functions for registry mounting in server.js
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendWelcomeEmail,
    sendOrderConfirmationEmail
];
