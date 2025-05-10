import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";

interface Comment {
  text: string;
  author: string;
  createdAt: string;
}

interface Note {
  _id: string;
  content: string;
  comments: Comment[];
  author: string;
  createdAt: string;
}

const NotesComponent = () => {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ content: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [commentText, setCommentText] = useState("");
  const [activeCommentNote, setActiveCommentNote] = useState<string | null>(
    null
  );
  const [isAddNoteSeen, setIsAddNoteSeen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
    const savedIsAddNoteSeen = localStorage.getItem('isAddNoteSeen');
    if (savedIsAddNoteSeen !== null) {
      setIsAddNoteSeen(savedIsAddNoteSeen === 'true');
    }
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Hiba a jegyzetek betöltésekor:", error);
      setError("Nem sikerült betölteni a jegyzeteket. Kérjük, próbálja újra később.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingNote) {
        await fetch(`/api/notes?id=${editingNote._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newNote.content,
          }),
        });
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newNote.content,
            author: session?.user?.username || "Névtelen",
          }),
        });
      }
      setNewNote({ content: "" });
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Hiba a jegyzet mentésekor:", error);
      setError("Nem sikerült menteni a jegyzetet. Kérjük, próbálja újra később.");
    }
  };

  const handleAddComment = async (noteId: string) => {
    if (!commentText.trim()) return;

    try {
      setIsLoading(true);
      await fetch(`/api/notes?id=${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: {
            text: commentText,
            author: session?.user?.username || "Névtelen",
            createdAt: new Date().toISOString(),
          },
        }),
      });
      setCommentText("");
      setActiveCommentNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Hiba a hozzászólás hozzáadásakor:", error);
      setError("Nem sikerült hozzáadni a hozzászólást. Kérjük, próbálja újra később.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
      });
      fetchNotes();
    } catch (error) {
      console.error("Hiba a jegyzet törlésekor:", error);
      setError("Nem sikerült törölni a jegyzetet. Kérjük, próbálja újra később.");
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setNewNote({ content: note.content });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const toggleAddNote = (value: boolean) => {
    setIsAddNoteSeen(value);
    localStorage.setItem('isAddNoteSeen', value.toString());
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => fetchNotes()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Újrapróbálkozás
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Betöltés...</p>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        <p>Nincsenek még jegyzetek. Legyen Ön az első, aki létrehoz egyet!</p>
        <button
          onClick={() => toggleAddNote(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Új jegyzet létrehozása
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 text-black relative">
        <button
            className={`absolute top-5 left-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${!isAddNoteSeen ? 'block' : 'hidden'}`}
            onClick={() => toggleAddNote(true)}
        >
            Nyitás
        </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Jegyzetek
      </h1>
      <form onSubmit={handleSubmit} className={`mb-8 ${isAddNoteSeen ? 'block' : 'hidden'}`}>
        <div className="mb-4">
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ content: e.target.value })}
            placeholder="Írja ide a jegyzetét..."
            className="w-full p-2 border rounded-lg shadow-sm placeholder:text-gray-400"
            rows={3}
            required
          />
        </div>
        <div className="flex flex-row items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
          {editingNote ? "Jegyzet Frissítése" : "Jegyzet Hozzáadása"}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          type="button"
          onClick={() => toggleAddNote(false)}
          >
            Bezárás
        </button>
            </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-yellow-100 p-4 rounded-lg shadow-md transform hover:rotate-1 transition-transform"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-700">{note.author}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-gray-600 hover:text-blue-500"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-gray-600 hover:text-red-500"
                >
                  <DeleteIcon />
                </button>
                <button
                  onClick={() =>
                    setActiveCommentNote(
                      activeCommentNote === note._id ? null : note._id
                    )
                  }
                  className="text-gray-600 hover:text-green-500"
                >
                  <AddCommentIcon />
                </button>
              </div>
            </div>
            <p className="text-gray-800 mb-2">{note.content}</p>

            {activeCommentNote === note._id && (
              <div className="mt-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Írja ide a hozzászólását..."
                  className="w-full p-2 border rounded-lg shadow-sm placeholder:text-gray-400 text-sm"
                  rows={2}
                />
                <button
                  onClick={() => handleAddComment(note._id)}
                  className="mt-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                >
                  Hozzászólás
                </button>
              </div>
            )}

            {note.comments && note.comments.length > 0 && (
              <div className="mt-2 pt-2 border-t border-yellow-200">
                {note.comments.map((comment, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {formatDateTime(note.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesComponent;
