import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import ReferralList from "./ReferralList";
import { updateReferralsAction } from "../../store/actions/referralAction";
import { apiRequest } from "../../utils/requests";

const Referrals = () => {
  const auth = useSelector((state) => state.auth);
  const referralData = useSelector((state) => state.referralData);
  const dispatch = useDispatch();

  const { referrals } = referralData;
  const remainingReferrals = auth.user.waitingNumber;
  const { protocol, host } = window.location;
  const referLink = `${protocol}//${host}/signup?referrerId=${auth.user.referId}`;

  const fetchReferrals = useCallback(async () => {
    try {
      const response = await apiRequest(
        "get",
        "/users/referrals",
        auth.user.token
      );
      dispatch(updateReferralsAction(response.data));
    } catch (err) {}
  }, [auth.user, dispatch]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  return (
    <div>
      <div className="jumbotron">
        {auth.user.isMember ? (
          <>
            <h1 className="text-success">You are a member now</h1>
            <p>
              <span className="text-success font-weight-bolder">
                {referrals.length}
              </span>{" "}
              total referrals. You can still refer more people to your heart's
              content.
            </p>
          </>
        ) : (
          <>
            <h1>
              <span className="text-success">{remainingReferrals}</span>{" "}
              {remainingReferrals > 1 ? "Referrals" : "Referral"} to go!
            </h1>
          </>
        )}
        <p>Share this link to refer people:</p>
        <div className="form-group input-group" title="click to copy">
          <input
            type="text"
            className="form-control"
            value={referLink}
            readOnly
          />
          <div className="input-group-append">
            <i className="input-group-text fas fa-copy"></i>
          </div>
        </div>
      </div>
      {referrals.length > 0 && (
        <>
          <h3>Referred by you ({referrals.length}):</h3>
          <ReferralList />
        </>
      )}
    </div>
  );
};

export default Referrals;
