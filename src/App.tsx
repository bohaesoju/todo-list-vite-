import { useState, useEffect } from 'react';
import crypto from "crypto-js";
import styled from 'styled-components'
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';

export type TodoProps = {
  text: string
  completed: boolean;
  date: number;
}

const ENCRYPT_TODO_KEY = "encrypt-todo-key";
const LOCAL_STORAGE_TODO_KEY = "local-storage-todo-key";

function App() {
  const storedTodos: TodoProps[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODO_KEY) || '[]');
  const [todos, setTodos] = useState(storedTodos);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (todo: TodoProps): void => {
    setTodos([...todos, todo]);
  };

  const handleUpdateTodo = (date: number, updatedTodo: TodoProps) => {
    const newTodos = [...todos];
    const index = newTodos.findIndex((todo) => todo.date === date);
    newTodos[index] = updatedTodo;
    setTodos(newTodos);
  };

  const handleToggleTodo = (date: number) => {
    const newToggleTodos = todos.map((todo: TodoProps) => {
      if (todo.date === date) return { ...todo, completed: !todo.completed };
      return todo;
    })
    setTodos(newToggleTodos);
  };

  const handleDeleteTodo = (date: number) => {
    setTodos(todos.filter((todo: TodoProps) => todo.date !== date));
  };

  const handleSaveTodo = () => {
    const newTodos = [...todos]
    const encryptTodos = newTodos.map((todo) => {
      return {
        ...todo,
        text: crypto.AES.encrypt(todo.text, ENCRYPT_TODO_KEY).toString()
      };
    });
    console.log('encryptTodos', encryptTodos)
  };

  const getFilteredTodos = () => {
    return todos.filter((todo: TodoProps) => {
      if (filter === 'all') return true;
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return false;
    })
  }

  const getSortedTodos = () => {
    const filteredTodos = getFilteredTodos()
    return filteredTodos.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.date - a.date;
    })
  }
  
  const sortedTodos = getSortedTodos();

  return (
    <Root>
      <Body>
        <Title>Todos</Title>
        <TodoForm onAddTodo={handleAddTodo} />
        <ButtonWrap>
          <Button onClick={() => setFilter('all')} selected={filter === 'all'}>All</Button>
          <Button onClick={() => setFilter('active')} selected={filter === 'active'}>Active</Button>
          <Button onClick={() => setFilter('completed')} selected={filter === 'completed'}>Completed</Button>
        </ButtonWrap>
        <TodoItemWrap>
          {sortedTodos.map((todo) => (
            <TodoItem 
              key={todo.date} 
              todo={todo} 
              onToggleTodo={handleToggleTodo} 
              onUpdateTodo={handleUpdateTodo} 
              onDeleteTodo={handleDeleteTodo} 
            />
          ))}
        </TodoItemWrap>
      </Body>
      <Announcement>* 텍스트를 선택하면 수정이 가능합니다</Announcement>
      <SaveTodoButton onClick={handleSaveTodo}>저장</SaveTodoButton>
    </Root>
  );
}

const Root = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 0px 0px 20px;
    text-align: center;
  `

  const Body = styled.div`
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%), 0 25px 50px 0 rgb(0 0 0 / 10%);
    padding-top: 10px;
  `

  const Title = styled.h1`
    font-size: 50px;
    margin: 0 0 20px;
    color: rgba(175, 47, 47, 0.85);
  `

  const ButtonWrap = styled.div`
    padding: 10px 15px;
    border-bottom: 1px solid #e6e6e6;
  `

  const Button = styled.button<{ selected: boolean }>`
    padding: 3px 7px;
    color: white;
    background: none;
    border: ${props => props.selected ? "1px solid rgba(175, 47, 47, 0.8)" : "none"};
    border-radius: 3px;
    font-size: 16px;
    margin-right: 5px;
    cursor: pointer;
  `
  
  const SaveTodoButton = styled.button`
    padding: 6px 10px;
    color: black;
    background: white;
    border-radius: 3px;
    font-size: 16px;
    margin-right: 5px;
    cursor: pointer;
  `

  const TodoItemWrap = styled.ul`
    padding: 0;
  `

  const Announcement = styled.p`
    font-size: 14px;
    color: #777;
    padding: 0 20px;
    text-align: left;
  `

export default App;
