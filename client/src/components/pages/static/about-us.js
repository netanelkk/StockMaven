import React, {useEffect} from 'react'
import Template from './page-template';

function AboutUs({setTitle}) {

    useEffect(() => {
        setTitle("About Us");
    }, []);

    return (
        <>
            <Template title="About Us">
                <>
                    <p>
                    As computer science students, we embarked on an exciting project focused on stock market price prediction. Utilizing our technical skills and knowledge of machine learning algorithms, we aimed to develop a robust and accurate system capable of forecasting future stock prices. Our project involved gathering historical market data, analyzing various indicators, and training predictive models using cutting-edge techniques. By leveraging large datasets and implementing advanced algorithms, we strived to uncover patterns, trends, and correlations that could aid in predicting stock market movements. Our project not only provided us with hands-on experience in applying theoretical concepts to real-world problems but also enabled us to explore the dynamic and complex nature of financial markets. Through this endeavor, we aimed to contribute to the field of financial technology and gain valuable insights into the interplay between computer science and finance.
                    </p>
                    <h3>About the system</h3>
                    <p>
                    Our web application for the stock market price prediction project offers a comprehensive platform to explore and analyze the details of 50 selected stocks. The application provides users with a user-friendly interface where they can access real-time data, historical prices, and essential financial indicators for each stock. Additionally, our predictive models generate forecasts for the future prices of these stocks, providing users with valuable insights for their investment decisions. The app showcases visually appealing charts and graphs that display the historical trends and predicted movements of the selected stocks. Through the integration of advanced machine learning algorithms and powerful data visualization tools, our web application aims to empower users with the information they need to make informed investment choices. Whether they are seasoned traders or novice investors, our application serves as a valuable resource to navigate the complexities of the stock market and enhance their understanding of price dynamics.
                    </p>

                    <h2>The Team</h2>
                    <div className="credits">
                        <div className='credit'>
                            <img src={window.PATH + "/images/credits/nati.jpg"} />
                            <a href="https://www.linkedin.com/in/netanelk/" target="_blank">Netanel Kluzner</a>
                            <span>Full Stack Developer</span>
                        </div>
                        <div className='credit'>
                            <img src={window.PATH + "/images/credits/guy.jpg"} />
                            <a href="https://www.linkedin.com/in/guy-gavriel-halag" target="_blank">Guy Gavriel Halag</a>
                            <span>Data Scientist</span>
                        </div>
                        <div className='credit'>
                            <img src={window.PATH + "/images/credits/adir.png"} />
                            <a href="#" target="_blank">Adir Damari</a>
                            <span>Data Scientist</span>
                        </div>
                    </div>
                </>
            </Template>
        </>
    );
}

export default AboutUs;
