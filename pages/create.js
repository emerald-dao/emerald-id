import { useState, useEffect } from 'react';
import { useFlow } from "../context/FlowContext.js";
import SuccessContainer from '../containers/SuccessContainer';
import InProcess from '../containers/InProcessContainer';
import FailContainer from '../containers/FailContainer';
import { useRouter } from 'next/router'
import { getDiscord } from '../helpers/serverAuth.js';
import "../flow/config";

function Create(props) {
    const { user, authentication, transactionStatus, txId, checkEmeraldID, createEmeraldIDWithMultiPartSign } = useFlow();
    const router = useRouter()
    const { code } = router.query;
    const [discordInfo, setDiscordInfo] = useState({ username: '' });
    const [oauthInfo, setOAuthInfo] = useState({ error: 'initializing' });
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (code) {
            changeDiscordName();
        }
    }, [code])

    // Run when the redirect goes through
    const changeDiscordName = async () => {
        let { info, oauthData } = await getDiscord(code);
        setDiscordInfo(info);
        setOAuthInfo(oauthData);
    }

    const setupProcess = async () => {

        const exists = await checkEmeraldID(code);
        console.log(exists)
        if (!exists) {
            setStatus('InProcess');
            createEmeraldID();
        } else {
            setStatus('Success');
        }
    }

    const createEmeraldID = async () => {
        const result = await createEmeraldIDWithMultiPartSign(oauthInfo, discordInfo.id);

        if (result) {
            setStatus("Success");
        } else {
            setStatus("Fail");
        }
    };

    return (
        <div className="create">

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
                            <button className="button-9 green" onClick={() => setupProcess()}>Create EmeraldID</button>
                        </div>
                        :
                        null
                    }

                </div>


                : null}

            {status === ""
                ?
                <button className="button-9 auth" onClick={() => authentication()}>
                    {user && user.addr ? user.addr : 'Authenticate'}
                </button>
                : null
            }

        </div>
    );
}

export default Create;
