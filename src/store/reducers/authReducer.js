import { LOGOUT, SET_USER } from "../actions/authActions";

const initialState = {
  isLoggedIn: false,
  user: {
    email: "",
    id: "",
    token: "",
    verified: false,
    isPasswordSet: false,
    company: null,
    color: "",
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      localStorage.setItem("token", "");
      return initialState;
    case SET_USER:
      const user = action.payload.user;
      let storedToken = localStorage.getItem("token");
      if (action.payload.token) storedToken = action.payload.token;

      if (action.payload.token && action.payload.setAutoLogin)
        localStorage.setItem("token", action.payload.token);
      else localStorage.removeItem("token");

      const auth = {
        isLoggedIn: true,
        user: { ...user, token: storedToken },
      };
      return auth;
    default:
      return state;
  }
};

export default authReducer;
