import Auth from "../models/auth.model.js";
const getProfile = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.userId).select("-password -emailToken -resetPasswordToken");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update User Profile

const updateProfile = async (req, res) => {
    try {
        const {  username, email, password } = req.body;
        const user = await Auth.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

    

// Follow a User

const followUser = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.userId);
        const followUser = await Auth.findById(req.params.id);

        if (!user || !followUser) return res.status(404).json({ message: "User not found" });   

        if (user.following.includes(req.params.id)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        user.following.push(req.params.id);
        followUser.followers.push(req.user.userId);

        await user.save();
        await followUser.save();

        res.json({ message: "User followed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

// Unfollow a User

const unfollowUser = async (req, res) => {
    try {
        const user = await Auth.findById(req.user.userId);
        const followUser = await Auth.findById(req.params.id);

        if (!user || !followUser) return res.status(404).json({ message: "User not found" });

        if (!user.following.includes(req.params.id)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        user.following = user.following.filter((id) => id !== req.params.id);
        followUser.followers = followUser.followers.filter((id) => id !== req.user.userId);

        await user.save();
        await followUser.save();

        res.json({ message: "User unfollowed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

export { getProfile, updateProfile, followUser, unfollowUser };
