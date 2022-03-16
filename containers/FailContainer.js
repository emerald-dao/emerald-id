import Image from 'next/image'

const FailContainer = () => {

    return (
        <main className="App fail">

            <section className="failSection">
                <div className="card failCard">
                    <div className="card-shape1"></div>
                    <div className="card-shape2"></div>
                    <div className="card-shape3"></div>
                    <img src="/fail_emerald.png" className="justHand"/>
                    <div className="text textFail">
                        <h1>Fail!</h1>
                        <p>Please try again or contact someone from our community and we will help you.</p>
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

export default FailContainer;