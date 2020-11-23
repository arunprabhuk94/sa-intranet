import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logoutAction } from "../../store/actions/authActions";
import { apiRequest } from "../../utils/requests";

const Logout = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    if (auth.user.token) {
      try {
        await apiRequest("get", "/users/logout", auth.user.token);
      } catch (err) {}
    }
    await dispatch(logoutAction());
    props.history.push("/login");
  }, [dispatch, auth, props]);

  useEffect(() => {
    logout();
  }, [logout]);
  return <div>Logging Out...</div>;
};

export default Logout;
