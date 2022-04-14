import React, { useState } from 'react';
import { useFlow } from "../context/FlowContext.js";
import "../flow/config";

function LoggedIn(props) {
  const { authentication, user, resetEmeraldIDWithMultiPartSign } = useFlow();
  const [status, setStatus] = useState("");

  const resetEmeraldID = async () => {
    setStatus('InProcess');
    const result = await resetEmeraldIDWithMultiPartSign();

    if (result) {
      setStatus('Success');
    } else {
      setStatus('Fail');
    }
  }

  return (
    <>
      <div className="create white">
        <h1 className="white">Welcome to <span className="emerald-color">EmeraldID</span>, {user.addr}!</h1>
        <p>You have already created your EmeraldID. Yay!</p>
        <p>To reset your EmeraldID, please click <button className="blocto-color" onClick={resetEmeraldID}>here</button>.</p>

        {status === 'Success'
          ? <h1>You successfully reset your EmeraldID. Please refresh the page to create a new one.</h1>
          : status === 'InProcess'
            ? <h1>Your EmeraldID is being reset...</h1>
            : status === 'Fail'
              ? <h1>Failed to reset your EmeraldID.</h1>
              : null
        }

        <button onClick={authentication}>Log out</button>
      </div>
    </>
  );
}

export default LoggedIn;
