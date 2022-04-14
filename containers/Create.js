import SuccessContainer from '../containers/SuccessContainer';
import InProcess from '../containers/InProcessContainer';
import FailContainer from '../containers/FailContainer';
import { useState } from 'react';
import { useFlow } from "../context/FlowContext.js";
import BackButton from './BackButton';

function Create(props) {
  const { user, transactionStatus, txId, createEmeraldIDWithMultiPartSign } = useFlow();
  const [status, setStatus] = useState("");

  const createEmeraldID = async () => {
    const result = await createEmeraldIDWithMultiPartSign(props.oauthData, props.discordInfo.id);

    if (result) {
      setStatus("Success");
    } else {
      setStatus("Fail");
    }
  };

  return (
    <div className="create">
      <BackButton />
      <h1 className="white welcome">Welcome to <span className="emerald-color">EmeraldID</span>, {user.addr}!</h1>

      {status === 'Success'
        ? <SuccessContainer />
        : status === 'InProcess'
          ? <InProcess transactionStatus={transactionStatus} txId={txId} />
          : status === 'Fail'
            ? <FailContainer />
            :
            <div className="elementor">
              <div>
                <h1>step 1: sign in</h1>
                <a href="https://discord.com/api/oauth2/authorize?client_id=955542718124294236&redirect_uri=https%3A%2F%2Fid.ecdao.org%2F&response_type=code&scope=identify"><img className="format-img" src="/img/Discord_button.png" /></a>
                <p>{props.discordInfo?.username ? 'Hey there, ' + props.discordInfo.username + '!' : null}</p>
              </div>
              {props.oauthData && !props.oauthData.error
                ?
                <div>
                  <h1>step 2: create EmeraldID</h1>
                  <img className="format-img" src="/img/Emerald_ID_light_button.png" onClick={createEmeraldID} />
                </div>
                :
                null
              }
            </div>
      }
    </div>
  )
}

export default Create;