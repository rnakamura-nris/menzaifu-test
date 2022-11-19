import { API } from "aws-amplify";
import { listTodos } from "../graphql/queries";
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from "../graphql/mutations";

const fetchTodos = async () => {
  const apiData = await API.graphql({ query: listTodos });
  const todoFromAPI = apiData.data.listTodos.items;
  return todoFromAPI;
};

const createTodos = async (event, setState) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const data = {
    name: form.get("name"),
    description: form.get("description"),
  };
  await API.graphql({
    query: createTodoMutation,
    variables: { input: data },
  });
  const fetchResult = await fetchTodos();
  setState(fetchResult);
  event.target.reset();
};

const deleteTodos = async ({ id }, state, setState) => {
  const newTodos = state.filter((elem) => elem.id !== id);
  await API.graphql({
    query: deleteTodoMutation,
    variables: { input: id },
  });
  setState(newTodos);
};

export { fetchTodos, createTodos, deleteTodos };
