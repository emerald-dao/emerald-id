import Image from 'next/image'
import { Transaction } from './Transaction';

const InProcess = (props) => {

    return (
        <main className="App inProcess">

            <section className="inProcessSection">
                <div className="card">
                    <img src="/emerald_logo.png" className="logoEmeraldBig format-img" />
                    <div className="card-shape1"></div>
                    <div className="card-shape2"></div>
                    <div className="card-shape3"></div>
                    <div className="text">
                        <h1>Setting up your EmeraldID</h1>
                        <Transaction transactionStatus={props.transactionStatus} txId={props.txId} />
                    </div>
                </div>
            </section>

            <footer>
                <div className="footerDiv">
                    <a href="https://discord.gg/emeraldcity" target="_blank"><i className="ri-discord-fill"></i></a>
                    <a href="https://twitter.com/emerald_dao" target="_blank"><i className="ri-twitter-fill"></i></a>
                    <a href=""><i className="ri-links-fill"></i></a>
                </div>
            </footer>

        </main>
    )
}

export default InProcess;