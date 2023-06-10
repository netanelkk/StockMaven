import React, { useState, useEffect } from 'react'
import { StockWidget } from '../../../elements/widget';
import { fetchCategories } from '../../../api';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Categories from '../../../elements/categories';


let sortoptions = ["Relevance", "Alphabetic Order (A-Z)", "Stock Price (High to Low)", "Stock Price (Low to High)"];
let sorticons = [<i className="bi bi-filter"></i>,
                 <i className="bi bi-sort-alpha-down"></i>,
                 <i className="bi bi-sort-numeric-down-alt"></i>,
                 <i className="bi bi-sort-numeric-up-alt"></i>];
const StocksContent = (props) => {
    const { query, catId } = props;
    const [data, setData] = useState(props.data);
    const [activeSort, setActiveSort] = useState(1);
    const [categories, setCategories] = useState();
    const [filtered, setFiltered] = useState(catId ? [catId] : []);


    const order = (index) => {
        setData(getsorted([...data], index));
        setActiveSort(index);
    }

    const getsorted = (arr, index) => {
        switch (index) {
            case 1:
                arr.sort((a, b) => { return a.id - b.id });
                break;
            case 2:
                arr.sort((a, b) => { return a.name.localeCompare(b.name) });
                break;
            case 3:
                arr.sort((a, b) => { return b.price - a.price });
                break;
            case 4:
                arr.sort((a, b) => { return a.price - b.price });
                break;
        }
        return arr;
    }

    useEffect(() => {
        (async () => {
            const d = await fetchCategories(query);
            if (!d.pass) return;
            setCategories(d.data);
        })();
    }, []);

    useEffect(() => {
        if (filtered.length > 0) {
            setData(getsorted(props.data.filter(val => { return filtered.includes(val.category) }), activeSort));
        } else {
            setData(getsorted(props.data, activeSort));
        }
    }, [filtered]);


    return (
        <>
            <div className="stocks-title">
                <h1>{(query ? data.length + ' Results for "' + decodeURI(query) + '"' : "All Stocks   ·   " + data.length + "")}</h1>
                <Navbar bg="light">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title={"Sort by " + sortoptions[activeSort - 1]} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => { order(1) }} className={((activeSort === 1) ? "active" : "")}>
                                        {sorticons[0]} {sortoptions[0]}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(2) }} className={((activeSort === 2) ? "active" : "")}>
                                        {sorticons[1]} {sortoptions[1]}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(3) }} className={((activeSort === 3) ? "active" : "")}>
                                        {sorticons[2]} {sortoptions[2]}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => { order(4) }} className={((activeSort === 4) ? "active" : "")}>
                                        {sorticons[3]} {sortoptions[3]}
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            <Categories categories={categories} filtered={filtered} setFiltered={setFiltered} />

            <div className="row">
                {data.map(stock => (<StockWidget stock={stock} key={"stock" + stock.id} optionClick={() => { }} />))}
            </div>
        </>)
}

export default StocksContent;