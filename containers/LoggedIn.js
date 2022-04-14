import React, { useState } from 'react';
import { useFlow } from "../context/FlowContext.js";
import "../flow/config";
import BackButton from './BackButton';
import { useRouter } from "next/router";

function LoggedIn(props) {
  const { authentication, resetEmeraldIDWithMultiPartSign } = useFlow();
  const [status, setStatus] = useState("");
  const router = useRouter();

  const resetEmeraldID = async () => {
    setStatus('InProcess');
    const result = await resetEmeraldIDWithMultiPartSign();

    if (result) {
      setStatus('Success');
    } else {
      setStatus('Fail');
    }
  }

  const createAgain = () => {
    authentication();
    router.push('/');
  }

  return (
    <>
      <div className="create white">
        <BackButton />
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

        {props.mode === 'blocto'
          ?
          <>
            {status === 'Success'
              ? <p>You successfully reset your EmeraldID. Please click <button className="reset-text emerald-color" onClick={createAgain}>here</button> to create a new one.</p>
              : status === 'InProcess'
                ?
                <h1>Your EmeraldID is being reset...</h1>
                : status === 'Fail'
                  ? <h1>Failed to reset your EmeraldID.</h1>
                  : 
                  <p>To reset your EmeraldID, please click <button className="reset-text red-text" onClick={resetEmeraldID}>here</button>.</p>
            }
          </>
          :
          props.mode === 'discord'
            ?
            <p>This EmeraldID is currently mapped to an account with address {props.secondary}. To reset, log in to that account first.</p>
            :
            null
        }
      </div>
    </>
  );
}

export default LoggedIn;
