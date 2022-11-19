// React
import React, { useState, useEffect } from "react";
import "./App.css";
// Amplify
import { Amplify } from "aws-amplify";
import { Authenticator, Button, Flex, Heading, Text, TextField, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
// GraphQL Wrapper
import { fetchTodosUtil, createTodoUtil, deleteTodoUtil } from "./utils/fetchTodos";

Amplify.configure(awsExports);

function App(signOut, user) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchRes = await fetchTodosUtil();
      setTodos(fetchRes);
    })();
  }, []);

  const createTodo = async (event) => {
    const newTodos = await createTodoUtil(event);
    setTodos(newTodos);
  };

  const deleteTodo = async (todo) => {
    const newTodos = await deleteTodoUtil(todo.id, todos);
    setTodos(newTodos);
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <Authenticator>
            {({ signOut, user }) => (
              <main>
                <h1>Hello {user.username}</h1>
                <button onClick={signOut}>Sign out</button>
                <Heading level={1}>My Notes App</Heading>
                <View
                  as="form"
                  margin="3rem 0"
                  onSubmit={(e) => {
                    createTodo(e);
                  }}
                >
                  <Flex direction="row" justifyContent="center">
                    <TextField
                      name="name"
                      placeholder="Note Name"
                      label="Note Name"
                      labelHidden
                      variation="quiet"
                      required
                    />
                    <TextField
                      name="description"
                      placeholder="Note Description"
                      label="Note Description"
                      labelHidden
                      variation="quiet"
                      required
                    />
                    <Button type="submit" variation="primary">
                      Create Note
                    </Button>
                  </Flex>
                </View>
                <Heading level={2}>Current Notes</Heading>
                <View margin="3rem 0">
                  {todos.map((todo) => (
                    <Flex key={todo.id || todo.name} direction="row" justifyContent="center" alignItems="center">
                      <Text as="strong" fontWeight={700}>
                        {todo.name}
                      </Text>
                      <Text as="span">{todo.description}</Text>
                      <Button variation="link" onClick={() => deleteTodo(todo)}>
                        Delete todo
                      </Button>
                    </Flex>
                  ))}
                </View>
              </main>
            )}
          </Authenticator>
        </header>
      </div>
    </>
  );
}

export default App;
