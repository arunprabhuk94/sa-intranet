import { loginRedirect } from "../../utils/auth";

export const LOGOUT = "LOGOUT";
export const SET_USER = "SET_USER";

export const logoutAction = () => {
  return { type: LOGOUT };
};

export const setUserAction = (
  { user, token },
  history,
  { storeToken = false, isAutoLogin = false } = {}
) => {
  return async (dispatch, getState) => {
    await dispatch({
      type: SET_USER,
      payload: { user, token, storeToken, isAutoLogin, history },
    });
    const { auth } = getState();
    loginRedirect(auth, history, isAutoLogin);
  };
};
