module.exports = {
  loginRedirect: (auth, history, isAutologin = false) => {
    if (auth.isLoggedIn) {
      const historyMethod = isAutologin ? "replace" : "push";
      if (!auth.user.verified) {
        history[historyMethod]("/verifyemail");
      } else if (!auth.user.company) {
        history[historyMethod]("/setcompanydetails");
      } else if (!auth.user.isPasswordSet) {
        history[historyMethod]("/setpassword");
      } else if (
        (!window.location.pathname.includes("/app") && isAutologin) ||
        !isAutologin
      ) {
        if (!isAutologin) localStorage.removeItem("token");
        history[historyMethod]("/app");
      }
    }
  },
};
