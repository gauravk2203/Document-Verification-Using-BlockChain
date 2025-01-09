// Middleware to check if the user has the required access permissions (e.g., admin role)
const checkAccessPermission = (req, res, next) => {
    // Assuming the user information (e.g., role) is attached to the request object, 
    // typically done through authentication middleware (JWT, session, etc.)
    const userRole = req.user?.role; // Retrieve the user role from the request object

    // Check if the user has the 'admin' role
    if (userRole !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin rights required." });
    }

    // If the user has the correct role, allow them to proceed to the next middleware or route handler
    next();
};

module.exports = checkAccessPermission;
