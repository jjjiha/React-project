import { useState } from 'react';
import './App.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
// import bg from './img/bg.png';
import data from './data.js';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Detail from './routes/Detail.js';

function App() {

  let [shoes] = useState(data)
  let [details] = useState(Detail)
  // console.log(details);
  let navigate = useNavigate();

  return (
    <div className="App">

      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">ShoeShop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate('/') }}>Home</Nav.Link>
            <Nav.Link onClick={() => { navigate('/detail') }}>Detail</Nav.Link>
            <Nav.Link onClick={() => { navigate('/about') }}>About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* <Link to="/">홈</Link>
      <Link to="/detail">상세페이지</Link> */}

      <Routes>
        <Route
          path='/' element=
          {
            <div>
              <div className='main-bg'></div>
              <div className='container'>
                <div className="row">
                  {
                    shoes.map(function (a, i) {
                      return (
                        <Card shoes={shoes[i]} i={i} />
                      )
                    })
                  }
                </div>
              </div>
            </div>
          }
        />
        <Route path='/detail/:id' element={<Detail shoes={shoes} />} />

        <Route path='/about' element={<About />}>
          <Route path='/about/member' element={<div>멤버</div>} />
          <Route path='/about/location' element={<div>위치정보</div>} />
        </Route>

        <Route path='/event' element={<Event />}>
          <Route path='/event/one' element={<div>첫 주문시 양배추즙 서비스</div>} />
          <Route path='/event/two' element={<div>생일기념 쿠폰받기</div>} />
        </Route>

        <Route path='*' element={<div>없는 페이지입니다.</div>} />
      </Routes>
    </div >
  )
};

function Card(props) {
  // console.log(props.i)
  return (
    <div className='col-md-4'>
      <img src={'https://codingapple1.github.io/shop/shoes' + (props.i + 1) + '.jpg'} width="80%" />
      <h4>{props.shoes.title}</h4>
      <p>{props.shoes.price}</p>
    </div>
  )
}

function About() {
  return (
    <div>
      <h4>회사 정보</h4>
      <Outlet></Outlet>
    </div>
  )
}

function Event() {
  return (
    <div>
      <h4>오늘의 이벤트</h4>
      <Outlet></Outlet>
    </div>
  )
}

export default App;
