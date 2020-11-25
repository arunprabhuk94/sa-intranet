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

const setToken = (payload) => {
  let token = sessionStorage.getItem("token") || localStorage.getItem("token");
  if (payload.token) {
    token = payload.token;
    if (payload.storeToken) {
      localStorage.setItem("token", token);
    }
    sessionStorage.setItem("token", token);
  }
  return token;
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return initialState;
    case SET_USER:
      const user = action.payload.user;
      const token = setToken(action.payload);
      const auth = {
        isLoggedIn: true,
        user: { ...user, token },
      };
      return auth;
    default:
      return state;
  }
};

export default authReducer;
