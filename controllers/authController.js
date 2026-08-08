import User from "../models/User.js";
import { getOrCreateUser } from "../utils/syncUser.js";

// Retrieve User Profile (for Clerk authenticated session mapping)
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.auth().userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        let user = await getOrCreateUser(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User profile not found." });
        }

        res.json({ success: true, data: { user } });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update User Profile (Address details, name, phone)
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.auth().userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { name, phone, address, city, zipCode } = req.body;

        // Ensure user is created in MongoDB before update
        await getOrCreateUser(userId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    ...(name && { name }),
                    phone: phone || "",
                    address: address || "",
                    city: city || "",
                    zipCode: zipCode || ""
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User profile not found." });
        }

        res.json({ success: true, message: "Profile updated successfully", data: { user: updatedUser } });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
