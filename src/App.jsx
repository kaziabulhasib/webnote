import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");

  // Load saved content on mount
  useEffect(() => {
    const savedText = localStorage.getItem("text");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Save content in local storage when text changes
  useEffect(() => {
    localStorage.setItem("text", text);
  }, [text]);

  const clearText = () => setText("");

  return (
    <div className='container'>
      <h1 className='text-red-500'>Hello world</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Start writing...'
      />
      <button onClick={clearText}>Clear Text</button>
      {/* Add more buttons for exporting if needed */}
    </div>
  );
}

export default App;
