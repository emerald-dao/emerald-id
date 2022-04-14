import { useState, useEffect } from 'react';
import { useFlow } from "../context/FlowContext.js";
import SuccessContainer from '../containers/SuccessContainer';
import InProcess from '../containers/InProcessContainer';
import FailContainer from '../containers/FailContainer';
import { useRouter } from 'next/router'
import { getDiscord } from '../helpers/serverAuth.js';
import "../flow/config";
import LoggedIn from '../containers/LoggedIn.js';

function Create(props) {
  const { user, authentication, transactionStatus, txId, checkEmeraldID, createEmeraldIDWithMultiPartSign } = useFlow();
  const router = useRouter()
  const { code } = router.query;
  const [discordInfo, setDiscordInfo] = useState({ username: '' });
  const [oauthInfo, setOAuthInfo] = useState({ error: 'initializing' });
  const [status, setStatus] = useState("");
  const [emeraldId, setEmeraldId] = useState(false);

  useEffect(() => {
    if (code) {
      changeDiscordName();
    }
  }, [code])

  useEffect(() => {
    if (user && user.loggedIn) {
      checkEmeraldIdExists();
    }
  }, [user])

  // Run when the redirect goes through
  const changeDiscordName = async () => {
    let { info, oauthData } = await getDiscord(code);
    setDiscordInfo(info);
    setOAuthInfo(oauthData);
  }

  const checkEmeraldIdExists = async () => {
    const exists = await checkEmeraldID();
    setEmeraldId(exists);
  }

  const createEmeraldID = async () => {
    const result = await createEmeraldIDWithMultiPartSign(oauthInfo, discordInfo.id);

    if (result) {
      setStatus("Success");
    } else {
      setStatus("Fail");
    }
  };

  if (!user || !user.loggedIn) {
    return (
      <>
        <div className="blocto">
          <button className="rounded flex" onClick={authentication}>
            <img src="/img/bloctologo.jpg" />
            <h1 className="blocto-color">Login with Blocto</h1>
          </button>
        </div>
        <div className="dapper">
          <button className='rounded flex'>
            <img src="/img/dapper.png" />
            <h1 className="dapper-color">Login with Dapper</h1>
          </button>
        </div>
      </>
    )
  } else if (emeraldId) {
    return (
      <LoggedIn />
    )
  } else {
    return (
      <>
        <div className="create">
          <h1 className="white">Welcome to <span className="emerald-color">EmeraldID</span>, {user.addr}!</h1>

          {status === 'Success'
            ? <SuccessContainer />
            : status === 'InProcess'
              ? <InProcess transactionStatus={transactionStatus} txId={txId} />
              : status === 'Fail'
                ? <FailContainer />
                : null
          }
          {user && user.loggedIn && status === ""
            ?
            <div className="elementor">
              <div>
                <h1>step 1: sign in</h1>
                <a href="https://discord.com/api/oauth2/authorize?client_id=955542718124294236&redirect_uri=https%3A%2F%2Fid.ecdao.org%2Fcreate&response_type=code&scope=identify"><img src="/img/Discord_button.png" /></a>
                <p>{discordInfo.username ? 'Hey there, ' + discordInfo.username + '!' : null}</p>
              </div>
              {oauthInfo && !oauthInfo.error
                ?

                <div>
                  <h1>step 2: create EmeraldID</h1>
                  <img src="/img/Emerald_ID_light_button.png" onClick={() => setupProcess()} />
                </div>
                :
                null
              }

            </div>


            : null}
        </div>
      </>
    );
  }
}

export default Create;
