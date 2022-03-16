import React, { useState } from 'react';
import { useFlow } from "../context/FlowContext.js";
import "../flow/config";

function Reset(props) {
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
        <div className='Login'>
            {status === 'Success' 
                ? <h1>You successfully reset your EmeraldID.</h1>
                : status === 'InProcess'
                ? <h1>Your EmeraldID is being reset...</h1>
                : status === 'Fail'
                ? <h1>Failed to reset your EmeraldID.</h1>
                : null
            }
            {user && user.loggedIn && status === ""
                ? 
                    <button className="button-9 red" onClick={() => resetEmeraldID()}>Reset EmeraldID</button>
                : null}

            {user && !user.loggedIn && status === "" 
                ? <button className="button-9" onClick={() => authentication()}>
                    Log in with Blocto
                  </button> 
                : null
            }
            
        </div>
    );
}

export default Reset;
