import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

export const getOrCreateUser = async (userId) => {
    let user = await User.findById(userId);
    
    const allowedAdmins = ["amityadavx245@gmail.com", "admin@medimart.com"];

    // Promote allowed emails, demote any other email that was previously promoted
    if (user) {
        const emailLower = user.email.toLowerCase();
        const shouldBeAdmin = allowedAdmins.includes(emailLower);
        const currentRole = user.role;

        if (shouldBeAdmin && currentRole !== 'admin') {
            user.role = 'admin';
            await user.save();
            console.log(`Promoted existing user ${userId} (${user.email}) to admin role.`);
        } else if (!shouldBeAdmin && currentRole === 'admin') {
            user.role = 'customer';
            await user.save();
            console.log(`Demoted existing user ${userId} (${user.email}) to customer role.`);
        }
        return user;
    }

    try {
        console.log(`User ${userId} not found in MongoDB. Fetching from Clerk...`);
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || "unknown@clerk.com";
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Customer';
        const image = clerkUser.imageUrl || '';
        
        // Auto-promote ONLY amityadavx245@gmail.com and admin@medimart.com
        const emailLower = email.toLowerCase();
        const role = allowedAdmins.includes(emailLower) ? 'admin' : 'customer';

        try {
            user = await User.create({
                _id: userId,
                email,
                name,
                image,
                role
            });
            console.log(`On-demand synchronized user ${userId} to MongoDB:`, user.email, `Role: ${role}`);
        } catch (createError) {
            // If parallel calls triggered concurrent creation, handle duplicate gracefully
            if (createError.code === 11000) {
                console.log(`User ${userId} was concurrently created. Fetching from MongoDB...`);
                user = await User.findById(userId);
            } else {
                throw createError;
            }
        }
    } catch (error) {
        console.error(`Failed to on-demand sync user ${userId}:`, error.message);
    }
    return user;
};
