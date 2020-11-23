import React from "react";
import { useSelector } from "react-redux";

const ReferralList = () => {
  const referralData = useSelector((state) => state.referralData);
  return (
    <ul className="list-group">
      {referralData.referrals.map((referral, i) => (
        <li className="list-group-item" key={referral.id}>
          <span className="text-danger mr-2">{i + 1}</span>
          {referral.email}
        </li>
      ))}
    </ul>
  );
};

export default ReferralList;
