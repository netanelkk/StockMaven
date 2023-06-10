import React, { useState, useEffect } from 'react'
import Header from './components/header';
import Homepage from './components/pages/homepage';
import Stocks from './components/pages/stocks';
import Stock from './components/pages/stock';
import Top from './components/pages/top';
import Saved from './components/pages/saved';
import Account from './components/pages/account';
import Analyse from './components/pages/analyse';
import Footer from './components/footer';
import AboutUs from './components/pages/static/about-us';
import Contact from './components/pages/contact';
import Terms from './components/pages/static/terms';
import Privacy from './components/pages/static/privacy';
import Error404 from './components/pages/static/error404';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import './App.css';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en);

const local = true;
if (local) {
  window.PATH = "";
  window.API_URL = "http://localhost:4100";
} else {
  window.PATH = "";
  window.API_URL = "https://netanel.vps.webdock.cloud:4200";
}


const Pages = React.memo(({ isUserSignedIn, onLogout }) => {
  const { pathname } = useLocation();
  
  // Scroll back to top on router change
  useEffect(() => {
    const canControlScrollRestoration = 'scrollRestoration' in window.history
    if (canControlScrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    setTimeout(() => {
      window.scrollTo({top: 0, left: 0, behavior: "instant"});
    }, 1)
  }, [pathname]);

  const setTitle = (title) => {
    document.title = "StockMaven"+((title=="") ? "" : " - "+title);
  };

  return (
    <div className="main">
      <Routes>
        <Route path={window.PATH + "/"} element={<Homepage setTitle={setTitle} />} />
        <Route path={window.PATH + "/stocks"} element={<Stocks setTitle={setTitle}  />} >
          <Route path=":query" />
        </Route>
        <Route path={window.PATH + "/stock"} element={<Stock setTitle={setTitle} isUserSignedIn={isUserSignedIn} />}>
          <Route path=":symbol" />
        </Route>
        <Route path={window.PATH + "/top"} element={<Top setTitle={setTitle} isUserSignedIn={isUserSignedIn} />} />
        <Route path={window.PATH + "/saved"} element={<Saved setTitle={setTitle} isUserSignedIn={isUserSignedIn} />} />
        <Route path={window.PATH + "/account"} element={<Account setTitle={setTitle} isUserSignedIn={isUserSignedIn} onLogout={onLogout} />} />
        <Route path={window.PATH + "/analyse"} element={<Analyse setTitle={setTitle} isUserSignedIn={isUserSignedIn} />} />
        <Route path={window.PATH + "/about"} element={<AboutUs setTitle={setTitle} />} />
        <Route path={window.PATH + "/contact"} element={<Contact setTitle={setTitle} />} />
        <Route path={window.PATH + "/terms-of-service"} element={<Terms setTitle={setTitle} />} />
        <Route path={window.PATH + "/privacy-policy"} element={<Privacy setTitle={setTitle} />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
});

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(localStorage.getItem('token') !== null);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("myid");
    setIsUserSignedIn(false);
    window.location.href = "";
  };


  return (
    <BrowserRouter>
      <Header isUserSignedIn={isUserSignedIn} onLogout={onLogout} />
      <Pages isUserSignedIn={isUserSignedIn} onLogout={onLogout} />
      <Footer />
    </BrowserRouter>
  );
}


export default App;
