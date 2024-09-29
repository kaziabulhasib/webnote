import { useState, useEffect } from "react";
// import "./App.css";
import "./index.css";

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    const savedText = localStorage.getItem("text");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("text", text);
  }, [text]);

  const clearText = () => setText("");

  const copyText = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // alert("Text copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className='container  mx-auto '>
      <h1 className=' text-center text-3xl my-8'>
        Welcome to webnote , write your text
      </h1>
      <div className='container mx-auto  px-8'>
        <textarea
          className='w-full h-[80vh] outline-none text-2xl bg-none '
          value={text}
          onChange={handleTextChange}
          placeholder='Start writing...'
        />
      </div>
      <div className='flex justify-center gap-6 '>
        <button onClick={clearText}>Clear Text</button>
        <button onClick={copyText}>Copy Text</button>
      </div>
    </div>
  );
}

export default App;
