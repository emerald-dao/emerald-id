import Image from 'next/image'

const SuccessContainer = () => {

    return (
        <main className="App sucess">

            <section className="sucessSection">
                <div className="card">
                    <img src="/emerald_logo.png" className="logoEmerald format-img" />
                    <div className="card-shape1"></div>
                    <div className="card-shape2"></div>
                    <div className="card-shape3"></div>
                    <img src="/just_hand.png" className="justHand format-img" />
                    <div className="text">
                        <h1>Success!</h1>
                        <p>Please go back to Discord and click `Verify` again.</p>
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

export default SuccessContainer;