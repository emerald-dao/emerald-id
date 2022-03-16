import { useState } from 'react';
import { useFlow } from "../../context/FlowContext.js";
import SuccessContainer from '../../containers/SuccessContainer';
import InProcess from '../../containers/InProcessContainer';
import FailContainer from '../../containers/FailContainer';
import "../../flow/config";

function Home(props) {
    const {user, authentication, transactionStatus, txId, checkEmeraldID, createEmeraldIDWithMultiPartSign} = useFlow();
    const [status, setStatus] = useState("");
    const [classname, setClassname] = useState('Login');

    const setupProcess = async () => {
        
        const exists = await checkEmeraldID();
        console.log(exists)
        setClassname('');
        if (!exists) {
            setStatus('InProcess');
            createEmeraldID();
        } else {
            setStatus('Success');
        }
        
    }

    const createEmeraldID = async () => {
        const result = await createEmeraldIDWithMultiPartSign();

        if (result) {
            setStatus("Success");
        } else {
            setStatus("Fail");
        }
    };

    return (
        <div className={classname}>

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
                
                <button className="button-9 green" onClick={() => setupProcess()}>Create EmeraldID</button> 
                
                : null}

            {status === "" 
                ? <button className="button-9" onClick={() => authentication()}>
                    Authenticate
                  </button> 
                : null
            }
            
        </div>
    );
}

export default Home;
