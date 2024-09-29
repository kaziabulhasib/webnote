import { useState, useEffect } from "react";
// import "./App.css";
import "./index.css";
import toast from "react-hot-toast";

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
        toast.success("text copied");
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
      <h1 className=' text-center lg:text-3xl text-2xl my-8 text-slate-500'>
        Welcome to webnote , write your text
      </h1>
      <div className='container mx-auto  px-8 tracking-widest'>
        <textarea
          className='w-full lg:h-[80vh] h-[75vh] outline-none text-3xl bg-none text-slate-600 '
          value={text}
          onChange={handleTextChange}
          placeholder='Start writing...'
        />
      </div>
      <div className='flex justify-center gap-6 '>
        <button
          className='hover:bg-gray-100 px-4 py-2 rounded-lg'
          onClick={clearText}>
          Clear Text
        </button>
        <button
          className='hover:bg-gray-100 px-4 py-2 rounded-lg'
          onClick={copyText}>
          Copy Text
        </button>
        {/* <button className='text-semibold text-2xl'>...</button> */}
      </div>
    </div>
  );
}

export default App;
