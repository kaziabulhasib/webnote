import { useState, useEffect } from "react";
import "./index.css";
import toast from "react-hot-toast";

function App() {
  const [notes, setNotes] = useState([{ text: "", name: "Page 1" }]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [newPageName, setNewPageName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [
      { text: "", name: "Page 1" },
    ];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const clearText = () => {
    const updatedNotes = [...notes];
    updatedNotes[currentNoteIndex].text = "";
    setNotes(updatedNotes);
  };

  const copyText = () => {
    navigator.clipboard
      .writeText(notes[currentNoteIndex].text)
      .then(() => {
        toast.success("Text copied");
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  const handleTextChange = (e) => {
    const updatedNotes = [...notes];
    updatedNotes[currentNoteIndex].text = e.target.value;
    setNotes(updatedNotes);
  };

  const createNewPage = () => {
    const newPage = { text: "", name: `Page ${notes.length + 1}` };
    setNotes([...notes, newPage]);
    setCurrentNoteIndex(notes.length);
    setNewPageName("");
  };

  const handleNoteChange = (index) => {
    setCurrentNoteIndex(index);
    setNewPageName(notes[index].name);
  };

  const downloadNote = () => {
    const noteName =
      notes[currentNoteIndex].name || `note_${currentNoteIndex + 1}`;
    const element = document.createElement("a");
    const file = new Blob([notes[currentNoteIndex].text], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${noteName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const deleteNote = () => {
    if (notes.length > 1) {
      const updatedNotes = notes.filter(
        (_, index) => index !== currentNoteIndex
      );
      setNotes(updatedNotes);
      setCurrentNoteIndex(0);
      toast.success(` ${newPageName} Deleted`);
    } else {
      toast.error("Cannot delete the last note.");
    }
  };

  const openRenameModal = () => {
    setNewPageName(notes[currentNoteIndex].name);
    setIsRenameModalOpen(true);
  };

  const renamePage = () => {
    const updatedNotes = [...notes];
    updatedNotes[currentNoteIndex].name =
      newPageName || updatedNotes[currentNoteIndex].name;
    setNotes(updatedNotes);
    setNewPageName("");
    setIsRenameModalOpen(false);
    toast.success("Page renamed");
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-center gap-6 my-6'>
        {notes.map((_, index) => (
          <button
            key={index}
            className={`mx-2 px-4 py-2 rounded-lg ${
              index === currentNoteIndex ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
            onClick={() => handleNoteChange(index)}>
            {notes[index].name}
          </button>
        ))}
        <button
          className='hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg'
          onClick={createNewPage}>
          New Page
        </button>
        {notes.length > 1 && (
          <button
            className='hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg'
            onClick={deleteNote}>
            Delete Page
          </button>
        )}
        <button
          className='hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-lg  '
          onClick={openRenameModal}>
          Rename
        </button>
      </div>

      <div className='container mx-auto px-8 tracking-widest lg:mt-16 mt-6'>
        <textarea
          className='w-full lg:h-[80vh] h-[75vh] outline-none text-3xl bg-none text-slate-600'
          value={notes[currentNoteIndex].text}
          onChange={handleTextChange}
          placeholder=' Welcome to WebNote, write your text...'
        />
      </div>

      <div className='flex justify-center gap-6 mt-4'>
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
        <button
          className='hover:bg-gray-100 px-4 py-2 rounded-lg'
          onClick={downloadNote}>
          Download
        </button>
      </div>

      {isRenameModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded'>
            <h2 className='text-lg mb-4'>Rename Page</h2>
            <input
              type='text'
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder='New Page Name'
              className='border p-2 rounded w-full'
            />
            <div className='flex justify-end mt-4'>
              <button
                className='bg-blue-500 text-white px-4 py-2 rounded'
                onClick={renamePage}>
                Save
              </button>
              <button
                className='ml-2 bg-gray-300 px-4 py-2 rounded'
                onClick={() => setIsRenameModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
