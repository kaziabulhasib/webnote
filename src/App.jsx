import { useState, useEffect } from "react";
import "./index.css";
import toast from "react-hot-toast";

function App() {
  const [notes, setNotes] = useState([{ text: "", name: "Page 1" }]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [newPageName, setNewPageName] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lastClearedText, setLastClearedText] = useState(""); // Store the last cleared text

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [
      { text: "", name: "Page 1" },
    ];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Listen for Ctrl + Z key press to undo clearing
  useEffect(() => {
    const handleUndo = (e) => {
      if (e.ctrlKey && e.key === "z") {
        undoClearText();
      }
    };
    window.addEventListener("keydown", handleUndo);

    return () => {
      window.removeEventListener("keydown", handleUndo);
    };
  }, [lastClearedText]); // Add lastClearedText to the dependency array

  const clearText = () => {
    const currentText = notes[currentNoteIndex].text;

    // Save the current text to allow undo
    if (currentText) {
      setLastClearedText(currentText); // Store the current text before clearing
    }

    const updatedNotes = [...notes];
    updatedNotes[currentNoteIndex].text = "";
    setNotes(updatedNotes);
    toast.success("Text cleared. Press Ctrl + Z to undo.");
  };

  const undoClearText = () => {
    // Restore the text if there is any previously cleared text
    if (lastClearedText) {
      const updatedNotes = [...notes];
      updatedNotes[currentNoteIndex].text = lastClearedText; // Restore the last cleared text
      setNotes(updatedNotes);
      setLastClearedText(""); // Clear the stored text to prevent multiple undos
      toast.success("Undo successful.");
    } else {
      toast.error("Nothing to undo.");
    }
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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true); // Open delete confirmation modal
  };

  const deleteNote = () => {
    if (notes.length > 1) {
      const deletedPageName = notes[currentNoteIndex].name; // Store deleted page name
      const updatedNotes = notes.filter(
        (_, index) => index !== currentNoteIndex
      );
      setNotes(updatedNotes);
      setCurrentNoteIndex(0);
      toast.success(`${deletedPageName} Deleted`); // Show deleted page name
    } else {
      toast.error("Cannot delete the last note.");
    }
    setIsDeleteModalOpen(false); // Close the confirmation modal
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
            onClick={openDeleteModal}>
            Delete Page
          </button>
        )}
        <button
          className='hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-lg'
          onClick={openRenameModal}>
          Rename
        </button>
      </div>

      <div className='container mx-auto px-8 tracking-widest lg:mt-16 mt-6'>
        <textarea
          className='w-full lg:h-[75vh] h-[70vh] outline-none text-3xl bg-none text-slate-600'
          value={notes[currentNoteIndex].text}
          onChange={handleTextChange}
          placeholder=' Welcome to WebNote, write your text...'
        />
      </div>

      <div className='flex justify-center gap-6 mt-4'>
        <button
          className='hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg'
          onClick={clearText}>
          Clear Text
        </button>
        <button
          className='hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-lg'
          onClick={copyText}>
          Copy Text
        </button>
        <button
          className='hover:bg-blue-100 text-blue-500 px-4 py-2 rounded-lg'
          onClick={downloadNote}>
          Download
        </button>
      </div>

      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-16 rounded border-2'>
            <h2 className='text-lg mb-4'>Rename Page</h2>
            <input
              type='text'
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder='New Page Name'
              className='border px-8 py-4 outline-zinc-300 rounded w-full'
            />

            <div className='flex justify-between mt-8 w-full'>
              <button
                className='bg-blue-500 text-white px-6 py-2 rounded'
                onClick={renamePage}>
                Save
              </button>
              <button
                className='ml-2 bg-gray-300 px-6 py-2 rounded'
                onClick={() => setIsRenameModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-16 rounded border-2'>
            <h2 className='text-lg mb-4'>
              Are you sure you want to delete "{notes[currentNoteIndex].name}"?
            </h2>
            <div className='flex justify-between mt-8'>
              <button
                className='bg-red-500 text-white px-6 py-2 rounded'
                onClick={deleteNote}>
                Delete
              </button>
              <button
                className='ml-2 bg-gray-300 px-6 py-2 rounded'
                onClick={() => setIsDeleteModalOpen(false)}>
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
