import { useState, useEffect } from 'react';
import { useFlow } from "../context/FlowContext.js";
import { useRouter } from 'next/router';
import { getDiscord } from '../helpers/serverAuth.js';
import "../flow/config";
import LoggedIn from '../containers/LoggedIn.js';
import Create from '../containers/Create.js';

function Home(props) {
  const { user, authentication, checkEmeraldIDFromAccount, checkEmeraldIDFromDiscord } = useFlow();
  const router = useRouter();
  const { code } = router.query;
  const [existingUser, setExistingUser] = useState();
  const [mode, setMode] = useState();
  const [secondary, setSecondary] = useState();
  const [discordInfo, setDiscordInfo] = useState({ username: '' });
  const [oauthInfo, setOAuthInfo] = useState({ error: 'initializing' });

  // When the Discord code changes, check
  // to see if this Discord is already mapped
  // to an EmeraldID
  useEffect(() => {
    if (code) {
      checkDiscordName();
    }
  }, [code])

  useEffect(() => {
    setExistingUser(null);
    if (user && user.loggedIn) {
      checkAddress();
    } else {
      code = null;
    }
  }, [user])

  // Run when the redirect goes through
  const checkDiscordName = async () => {
    let { info, oauthData } = await getDiscord(code);
    setDiscordInfo(info);
    setOAuthInfo(oauthData);

    if (!info || !info.id) return;
    const exists = await checkEmeraldIDFromDiscord(info.id);
    if (exists) {
      setExistingUser(info.username);
      setMode('discord');
      setSecondary(exists);
    }
  }

  const checkAddress = async () => {
    const exists = await checkEmeraldIDFromAccount();
    if (exists) {
      console.log("Hello")
      setExistingUser(user.addr);
      setMode('blocto');
    }
  }

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
          <button className='rounded flex unavailable'>
            <img src="/img/dapper.png" />
            <h1 className="dapper-color">Login with Dapper</h1>
          </button>
        </div>
      </>
    )
  } else if (existingUser) {
    return (
      <LoggedIn user={existingUser} mode={mode} secondary={secondary} />
    )
  } else {
    return (
      <Create discordInfo={discordInfo} oauthData={oauthInfo} />
    );
  }
}

export default Home;
