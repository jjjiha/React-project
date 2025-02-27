// App.js

import './App.css';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from "axios";

import Pagination from "../src/pages/Paging.tsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const SERVER_URL = "http://localhost:5050/api/posts";

function App() {

  let post = 'ReactBlog';
  let [글제목, 글제목변경] = useState([]);
  let [좋아요, 좋아요변경] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  let [title, setTitle] = useState(0);
  let [입력값, 입력값변경] = useState(''); // 기존의 입력값
  let [입력값2, 입력값2변경] = useState({}); // 아이템별 입력값을 위한 상태
  let [modal, setModal] = useState(false);
  let [totalItems, setTotalItems] = useState(0); // 초기 전체 아이템 수

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemCountPerPage = 5;  // 페이지당 아이템 수
  const location = useLocation();  // 현재 위치 정보
  const navigate = useNavigate();  // 페이지 이동을 위한 history 객체

  useEffect(() => {
    fetchData()
  }, []);  // 빈 배열을 넣으면 컴포넌트 마운트 시 한 번만 실행됨

  useEffect(() => {
    // 쿼리 파라미터에서 페이지 번호를 가져옴
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);
  }, [location.search]);  // location.search가 변경될 때마다 실행

  // 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await fetch(SERVER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {

        const data = await response.json();
        console.log('전체 데이터:', data);
        글제목변경(data);
        setTotalItems(data.length); // 전체 아이템 수 업데이트
        return data; // 모든 데이터를 반환

      } else {
        console.error('데이터 가져오기 실패:', response.statusText);
        return []; // 오류 발생 시 빈 배열 반환
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      return []; // 예외 발생 시 빈 배열 반환
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page); // 현재 페이지 업데이트
    navigate(`?page=${page}`); // URL 업데이트
  };

  // 현재 페이지에 해당하는 아이템만 필터링
  const currentItems = 글제목.slice((currentPage - 1) * itemCountPerPage, currentPage * itemCountPerPage);


  // 검색 기능
  const handleSearch = async () => {
    const allPosts = await fetchData(); // 모든 게시글을 가져옴
    const filteredPosts = allPosts.filter(post =>
      post.name.includes(입력값) // 입력값이 포함된 게시글 필터링
    );

    console.log('검색 결과:', filteredPosts); // 필터링된 결과 출력
    글제목변경(filteredPosts.length > 0 ? filteredPosts : allPosts); // 필터링된 결과가 없으면 전체 데이터로 초기화
  };


  return (


    <div >
      <div
        className="black-nav pb-4 pt-3">
        <h4 >{post}</h4>

        {/* 검색 */}
        <InputGroup className='mb-4' style={{ height: '50px' }}>



          <Form.Control
            placeholder='검색할 내용을 입력하세요'
            aria-label='검색할 내용을 입력하세요'
            area-describedby='basic-addon2'
            onChange={(e) => {
              입력값변경(e.target.value);
              console.log(입력값)
            }}
          />

          <Button
            // style={{ height: '50px' }}
            variant='secondary'
            id='button-addon2'
            onClick={handleSearch}
          >
            검색
          </Button>
        </InputGroup>

      </div>

      <div className="container p-5">

        <div className="container-xl mb-5">
          <ListGroup >

            {/* <ListGroup.Item action variant='secondary'> */}

            {/* 삽입 */}
            <InputGroup style={{ height: '50px' }}>
              {/* 정렬 */}
              <Button
                variant='secondary'
                id='button-addon2'
                style={{ height: '100%', color: 'black' }}
                onClick={() => {
                  let copy = [...글제목];
                  copy.sort((a, b) => a.name.localeCompare(b.name, 'ko')); // 한글 가나다순으로 정렬
                  글제목변경(copy);
                }}>가나다순 정렬</Button>
              <Form.Control

                placeholder='추가할 내용을 입력하세요'
                aria-label='추가할 내용을 입력하세요'
                area-describedby='basic-addon2'
                style={{ border: '1px solid black' }}
                onChange={(e) => {
                  입력값변경(e.target.value);
                  console.log(입력값)
                }} />

              <Button
                variant='secondary'
                id='button-addon2'
                style={{ height: '100%', width: 70, color: 'black' }}
                onClick={async () => {
                  if (입력값.trim()) { // 입력값이 빈 값이 아니면 실행
                    try {
                      console.log('데이터 추가 성공');
                      const response = await fetch(SERVER_URL, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title: 입력값 }),
                      });

                      if (response.ok) {
                        // 새로운 데이터를 서버에 저장한 후 다시 데이터를 가져옴
                        const updatedResponse = await fetch(SERVER_URL);
                        const data = await updatedResponse.json();
                        const titles = data.map(item => ({ id: item.id, name: item.name.trim(), date: item.date }));
                        글제목변경(titles);  // 상태를 업데이트하여 화면에 즉시 반영
                        입력값변경('');  // 입력 필드 초기화
                      } else {
                        console.error('Error adding post:', response.statusText);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                    }
                  } else {
                    alert('내용을 입력해주세요.');  // 입력 값이 없을 경우 알림
                  }
                }}
              >추가</Button>
            </InputGroup>

            {/* </ListGroup.Item> */}
          </ListGroup>
        </div>

        <div className="container-lg">
          {
            currentItems.map(function (item, i) {
              return (
                <ListGroup
                  key={`${item.id}-${i}`} /* id와 index를 함께 사용하여 고유한 key 생성 */
                  horizontal={`${item.id}-${i}`}
                  className='my-2'>

                  <ListGroup.Item action variant='light'>

                    <h5 onClick={() => { setModal(!modal); setTitle(i) }}>

                      {/* 제목 */}
                      {'제목 : ' + item.name}
                    </h5>

                    {/* 좋아요 */}
                    <span onClick={(e) => {
                      e.stopPropagation();
                      let copy = [...좋아요];
                      copy[i] = copy[i] + 1;
                      좋아요변경(copy)
                    }}> 👍 {좋아요[i]} </span>


                    {/* 날짜 */}
                    <p>{new Date(item.date).toLocaleDateString('ko-KR')}</p>

                    <InputGroup className='mb-3'>
                      {/* 삭제 */}
                      <Button
                        // style={{ border: '1px solid lightgray' }}
                        variant='outline-secondary'
                        onClick={async (e) => {
                          e.stopPropagation(); // 이벤트 전파 방지 (선택 사항)

                          try {
                            console.log('삭제 요청을 보냄: ID =', item.id);
                            const response = await fetch(SERVER_URL, {
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ id: item.id }),
                            });

                            if (response.ok) {

                              // 서버에서 데이터를 다시 가져옴
                              const updatedResponse = await fetch(SERVER_URL);
                              const data = await updatedResponse.json();

                              // 최신 데이터를 로컬 상태에 반영
                              const titles = data.map(item => ({ id: item.id }));
                              글제목변경(titles);  // 상태를 업데이트하여 화면에 즉시 반영
                              입력값변경('');  // 입력 필드 초기화
                              console.log('게시물 삭제 성공');

                              // 로컬 상태에서 삭제하는 코드 추가
                              let copy = [...글제목];
                              copy.splice(i, 1);
                              글제목변경(copy);
                            } else {
                              console.error('게시글 삭제 실패:', response.statusText);
                            }
                          } catch (error) {
                            console.error('삭제 중 에러 발생:', error);
                          }
                        }}>
                        삭제
                      </Button>

                      {/* 수정 */}


                      <Form.Control
                        style={{ border: '1px solid gray' }}
                        placeholder=' 수정할 내용을 입력하세요'
                        aria-label='수정할 내용을 입력하세요'
                        area-describedby='basic-addon2'
                        value={입력값2[item.id] || ''}  // 해당 아이템의 입력값을 가져옴
                        onChange={(e) => {
                          입력값2변경(prev => ({ ...prev, [item.id]: e.target.value })); // 특정 아이템의 입력값 업데이트
                          console.log(입력값2[item.id]); // 디버깅 로그
                        }}
                      />

                      <Button
                        variant='outline-secondary'
                        onClick={async () => {
                          const 수정할글ID = item.id; // 수정할 글의 ID

                          if (입력값2[수정할글ID]?.trim()) { // 해당 아이템의 입력값이 빈 값이 아니면 실행
                            try {
                              console.log('데이터 수정 시도 중...');

                              // 서버에 PUT 요청으로 수정된 데이터를 보냄
                              const response = await fetch(SERVER_URL, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ id: 수정할글ID, title: 입력값2[수정할글ID] }),  // id와 수정할 title을 함께 전송
                              });

                              if (response.ok) {
                                // 새로운 데이터를 서버에 저장한 후 다시 데이터를 가져옴
                                const updatedResponse = await fetch(SERVER_URL);
                                const data = await updatedResponse.json();
                                const titles = data.map(item => ({ id: item.id, name: item.name.trim() }));
                                글제목변경(titles);  // 상태를 업데이트하여 화면에 즉시 반영
                                입력값2변경(prev => ({ ...prev, [수정할글ID]: '' }));  // 입력 필드 초기화
                                console.log('게시물 수정 성공');
                              } else {
                                console.error('게시물 수정 실패:', response.statusText);
                              }
                            } catch (error) {
                              console.error('수정 중 에러 발생:', error);
                            }
                          } else {
                            alert('수정사항을 입력해주세요.');  // 입력 값이 없을 경우 알림
                          }
                        }}>
                        수정
                      </Button>
                    </InputGroup>

                  </ListGroup.Item>
                </ListGroup>
              )
            })
          }

          <Pagination
            totalItems={totalItems}
            itemCountPerPage={itemCountPerPage}
            pageCount={Math.ceil(totalItems / itemCountPerPage)} // 전체 페이지 수
            currentPage={currentPage}
            onPageChange={handlePageChange}  // 페이지 변경 함수 전달
          />

        </div>

      </div>
      {
        modal == true ? <Modal color={'lightgrey'} 글제목={글제목} 글제목변경={글제목변경} title={title} setTitle={setTitle} /> : null
      }

    </div >


  );
}


function Modal(props) {
  return (
    <div className='modal' style={{ background: props.color }}>
      <h4>
        {props.글제목[props.title]?.name}</h4>
      <p>날짜</p>
      <p>상세내용</p>
      <div>
        <button onClick={() => { props.setTitle(0) }}>0번글</button>
        <button onClick={() => { props.setTitle(1) }}>1번글</button>
        <button onClick={() => { props.setTitle(2) }}>2번글</button>
      </div>
      <div>
        <button onClick={() => props.setTitle(-1)}>닫기</button> {/* 모달 닫기 버튼 */}
      </div>
    </div>
  )
}

export default App;