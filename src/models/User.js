const userRoles = {
  ADMIN: "admin",
  CONTROLLER: "controller",
};

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || userRoles.CONTROLLER;
    this.isActive = userData.isActive !== undefined ? userData.isActive : true;
    this.loginAttempts = userData.loginAttempts || 0;
    this.lastLogin = userData.lastLogin || null;
    this.createdAt = userData.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.lockUntil = null;
  }
}

export { userRoles, User };
