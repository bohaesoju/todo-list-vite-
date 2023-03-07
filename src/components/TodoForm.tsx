import { useState } from 'react';
import { TodoProps } from '../App';
import styled from 'styled-components'

interface TodoFormProps {
	onAddTodo: (todo: TodoProps) => void
}

function TodoForm({ onAddTodo }: TodoFormProps) {
  const [newTodo, setNewTodo] = useState('');

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.trim() !== '') {
      const todo = {
        text: newTodo,
        completed: false, 
        date: Date.now()
      };
      onAddTodo(todo);
      setNewTodo('');
    }
  };

  return (
    <Form onSubmit={handleAddTodoSubmit}>
      <Input type="text" value={newTodo} onChange={handleTodoChange} placeholder="이 곳에 할 일을 입력하고 엔터를 눌러주세요" />
    </Form>
  );
}

const Form = styled.form`
    display: flex;
    margin-bottom: 10px;
    padding:0 30px;
  `

  const Input = styled.input`
    flex-grow: 1;
    padding: 5px;
    border-radius: 5px;
    border: none;
    font-size: 16px;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  `

export default TodoForm;
