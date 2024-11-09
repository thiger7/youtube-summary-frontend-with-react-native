import TaskInput from "@/components/task/TaskInput";
import TaskItem from "@/components/task/TaskItem";
import { useState } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { Link } from "expo-router";

interface Task {
  id: string;
  text: string;
}

export default function HomeScreen() {
  const [taskText, setTaskText] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditting, setIsEditting] = useState<string | null>(null);

  const handleSaveTask = () => {
    if (!taskText.trim()) return;
    if (isEditting) {
      setTasks(
        tasks.map(task =>
          task.id === isEditting ? { ...task, text: taskText } : task,
        ),
      );
      setIsEditting(null);
    } else {
      const newTask = { id: Date.now().toString(), text: taskText };
      setTasks([...tasks, newTask]);
    }
    setTaskText("");
  };

  const handleEdit = (item: Task) => {
    setTaskText(item.text);
    setIsEditting(item.id);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Link href="/youtube-summary">
        <Text
          style={{
            padding: 20,
            backgroundColor: "green",
            color: "white",
            borderRadius: 6,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Youtube Summary
        </Text>
      </Link>
      <Text style={styles.title}>TODOアプリ</Text>
      <TaskInput
        taskText={taskText}
        setTaskText={setTaskText}
        handleSaveTask={handleSaveTask}
        isEditting={isEditting}
      />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccceee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  taskText: {
    maxWidth: "80%",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
