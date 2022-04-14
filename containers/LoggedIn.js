import React, { useState } from 'react';
import { useFlow } from "../context/FlowContext.js";
import "../flow/config";
import { useRouter } from 'next/router';

function LoggedIn(props) {
  const router = useRouter();
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
        <button className="back-arrow" onClick={() => {
          authentication();
          router.push('/')
        }}>&#8592;</button>
        <h1 className="white">Welcome to <span className="emerald-color">EmeraldID</span>, <> </>
          <span className="align">
            {props.mode === 'blocto'
              ?
              <img className="span-image" src="/img/bloctologo.jpg" />
              :
              props.mode === 'discord'
                ?
                <img className="span-image" src="/img/discord-logo.png" />
                : null
            }
            {props.user}!
          </span>
        </h1>
        <p>You have already created your EmeraldID. Yay!</p>
        <p>To reset your EmeraldID, please click <button className="reset-color" onClick={resetEmeraldID}>here</button>.</p>

        {status === 'Success'
          ? <h1>You successfully reset your EmeraldID. Please refresh the page to create a new one.</h1>
          : status === 'InProcess'
            ? <h1>Your EmeraldID is being reset...</h1>
            : status === 'Fail'
              ? <h1>Failed to reset your EmeraldID.</h1>
              : null
        }
      </div>
    </>
  );
}

export default LoggedIn;
