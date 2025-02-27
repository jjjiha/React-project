// server.js (백엔드)

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5050; // 포트번호 설정
const cors = require('cors');

// Database 연결
const pool = new Pool({
    user: 'jiha',       // DB 계정
    host: 'localhost',  // 호스트
    database: 'blogDB', // 연결할 DB
    password: '1234',   // DB 비밀번호
    port: 5432,
});

app.use(cors());
app.use(express.json()); // JSON 데이터 처리

// 조회 (get)
app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
        console.log(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// 삽입 (post)
app.post('/api/posts', async (req, res) => {

    const { title } = req.body;
    try {

        const result = await pool.query(
            'INSERT INTO posts (name, date) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *',
            [title]
        );
        res.status(201).json(result.rows[0]);  // 추가된 데이터를 반환
    } catch (err) {
        console.error('Error adding post:', err);
        res.status(500).send('Internal Server Error');
    }
});

// 삭제 (delete)
app.delete('/api/posts', async (req, res) => {
    const { id } = req.body;  // 요청 본문에서 ID 추출
    console.log('Received ID for deletion:', id); // 디버깅 로그
    console.log('삭제 성공;;');
    if (!Number.isInteger(id)) {
        return res.status(400).send('ID는 정수여야 합니다.');  // ID가 정수가 아닐 경우
    }
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]); // 추출된 ID를 사용
        if (result.rowCount > 0) {
            res.status(204).send(); // 204 No Content (성공적으로 삭제된 경우)
        } else {
            res.status(404).send('해당 게시글을 찾을 수 없습니다.'); // 해당 ID가 없는 경우
        }
    } catch (error) {
        console.error('게시글 삭제 중 에러 발생:', error);
        res.status(500).send('서버 내부 오류');
    }
});

// 수정 (update)
app.put('/api/posts', async (req, res) => {
    const { id, title } = req.body;  // 요청 본문에서 ID와 수정할 title을 추출
    console.log('Received ID for update:', id);  // 디버깅 로그
    console.log('업데이트 성공;;');

    // ID가 정수인지 확인
    if (!Number.isInteger(id)) {
        return res.status(400).send('ID는 정수여야 합니다.');  // ID가 정수가 아닐 경우
    }

    try {
        // 데이터베이스 업데이트 쿼리 실행 (id에 해당하는 name 필드 수정)
        const result = await pool.query('UPDATE posts SET name = $1 WHERE id = $2', [title, id]);

        if (result.rowCount > 0) {
            res.status(204).send('게시글이 업데이트되었습니다.'); // 성공적으로 업데이트된 경우
        } else {
            res.status(404).send('해당 게시글을 찾을 수 없습니다.'); // 해당 ID가 없는 경우
        }
    } catch (error) {
        console.error('게시글 수정 중 에러 발생:', error);
        if (!res.headersSent) {
            res.status(500).send('서버 내부 오류');
        }
    }
});

// 검색 (get)
app.get('/api/posts', async (req, res) => {
    const { title } = req.query; // 쿼리 파라미터에서 title 추출
    console.log('Received title for search:', title);  // 디버깅 로그

    try {
        // title을 이용해 데이터베이스에서 검색
        const result = await pool.query('SELECT * FROM posts WHERE name ILIKE $1', [`%${title}%`]);

        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).json({ message: 'No posts found' }); // 검색 결과가 없을 경우
        }
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Server Error' }); // 서버 오류 처리
    }
});




