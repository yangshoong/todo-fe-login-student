import React, { useEffect, useState } from "react";
import TodoBoard from "../components/TodoBoard";
import api from "../utils/api";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const TodoPage = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const navigate = useNavigate();

  const getTasks = async () => {
    const response = await api.get("/tasks");
    setTodoList(response.data.data);
  };

  const addTodo = async () => {
    try {
      const response = await api.post("/tasks", { task: todoValue, isComplete: false });
      if (response.status === 200) {
        setTodoList([...todoList, response.data.data]);
        setTodoValue("");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        setTodoList(todoList.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, { isComplete: !task.isComplete });
      if (response.status === 200) {
        setTodoList(
          todoList.map((item) =>
            item._id === id ? { ...item, isComplete: !item.isComplete } : item
          )
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container>
      <Row className="justify-content-end mb-3">
        <Col xs="auto">
          <Button variant="primary" onClick={handleLogout}>
            로그아웃
          </Button>
        </Col>
      </Row>

    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            onChange={(event) => setTodoValue(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                addTodo();
              }
            }}
            className="input-box"
            value={todoValue}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button onClick={addTodo} className="button-add">
            추가
          </button>
        </Col>
      </Row>
      <TodoBoard
        todoList={todoList}
        deleteItem={deleteItem}
        toggleComplete={toggleComplete}
      />
    </Container>
    </Container>
  );
};

export default TodoPage;
