// fetch
// axios

import { useEffect, useState } from "react";
import axios from "axios";
const SERVER_URL = "http://localhost:4000/api/todo";

function App() {
  const [todoList, setTodoList] = useState([]);

  // axios 
  const fetchData = async () => {
    const response = await axios.get(SERVER_URL);
    setTodoList(response.data);

    // fetch
    // fetch('http://localhost:4000/api/todo')
    //   .then((response) => response.json())
    //   .then((data) => setTodoList(data));
  };
  useEffect(() => {
    fetchData()
  }, []);

  // axios
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    const done = e.target.done.checked;
    await axios.post(SERVER_URL, { text, done });
    fetchData();

    // fetch
    // fetch('http://localhost:4000/api/todo', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     text,
    //     done,
    //   }),
    // }).then(() =>
    //   fetchData()
    // );
  };

  return (
    <div className="App">
      <h1>TODO LIST</h1>
      <form onSubmit={onSubmitHandler}>
        <input name="text" />
        <input name="done" type="checkbox" />
        <input type='submit' value="추가" />
      </form>
      {todoList?.map((todo) =>
      (<div key={todo.id} style={{ display: 'flex' }}>
        <div>{todo.id}</div>
        <div>{todo.text}</div>
        <div>{todo.done ? 'Y' : 'N'}</div>
      </div>)
      )}
    </div>
  );
}

export default App;
