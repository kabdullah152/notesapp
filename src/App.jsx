import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({ authMode: "userPool" });

export default function App() {
  const [notes, setNotes] = useState([]);

  // Subscribe to notes updates
  useEffect(() => {
    const subscription = client.models.Note.observeQuery().subscribe({
      next: (result) => setNotes([...result.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    await client.models.Note.create({
      content: form.get("content"),
    });

    event.target.reset();
  }

  async function deleteNote(note) {
    await client.models.Note.delete(note);
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Flex
          className="App"
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          minHeight="100vh"
          padding="2rem"
          backgroundColor="white" // ✅ White background
        >
          <Heading level={1}>Notes App</Heading>
          <Text marginBottom="1rem">Welcome, {user?.username}</Text>

          {/* Form for creating notes */}
          <View as="form" margin="2rem 0" onSubmit={createNote} width="100%">
            <Flex direction="row" gap="1rem" justifyContent="center">
              <TextField
                name="content"
                placeholder="Write a note"
                label="Note"
                labelHidden
                variation="quiet"
                required
                width="60%"
              />
              <Button type="submit" variation="primary">
                Create Note
              </Button>
            </Flex>
          </View>

          <Divider width="100%" />
          <Heading level={2} margin="2rem 0">
            My Notes
          </Heading>

          {/* ✅ Notes displayed under "My Notes" */}
          <Flex direction="column" gap="1rem" width="100%" maxWidth="600px">
            {notes.map((note) => (
              <Flex
                key={note.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                border="1px solid #ccc"
                borderRadius="8px"
                padding="1rem"
                backgroundColor="#f9f9f9"
                boxShadow="sm"
              >
                <Text>{note.content}</Text>
                <Button
                  variation="destructive"
                  size="sm"
                  onClick={() => deleteNote(note)}
                >
                  Delete
                </Button>
              </Flex>
            ))}
          </Flex>

          <Button marginTop="2rem" onClick={signOut}>
            Sign Out
          </Button>
        </Flex>
      )}
    </Authenticator>
  );
}
