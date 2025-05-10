import { showNotification } from "@/lib/showNotification";
import React, { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from "./Modal";

interface Password {
  _id: string;
  name: string;
  link: string;
  email: string;
  password: string;
}

const PasswordsComponent: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchPasswords();
    }
  }, [isAuthenticated]);

  const fetchPasswords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/passwords");
      const data = await response.json();
      setPasswords(data);
      setIsLoading(false);
    } catch (error) {
      showNotification("Hiba történt az adatok betöltése során", "error");
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      const response = await fetch("/api/verify-master-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: masterPassword }),
      });

      const data = await response.json();
      if (data.exists) {
        setIsAuthenticated(true);
      } else {
        showNotification("Helytelen jelszó!", "error");
      }
    } catch (error) {
      showNotification("Hiba történt az azonosítás során", "error");
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !link || !email || !password) {
      showNotification("Kérlek töltsd ki az összes mezőt!", "error");
      return;
    }

    const response = await fetch("/api/passwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        link,
        email,
        password
      }),
    });

    if (!response.ok) {
      showNotification("Hiba történt a mentés során", "error");
      return;
    }

    const data = await response.json();

    showNotification("Sikeresen elmentve", "success");
    setPasswords([...passwords, {
      _id: data._id,
      name: data.name,
      link: data.link,
      email: data.email,
      password: data.password
    }]);
    setName("");
    setLink("");
    setEmail("");
    setPassword("");
  };

  const handleEdit = (pwd: Password) => {
    setSelectedPassword(pwd);
    setEditName(pwd.name);
    setEditLink(pwd.link);
    setEditEmail(pwd.email);
    setEditPassword(pwd.password);
    setShowEditPassword(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/passwords?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPasswords(passwords.filter((pwd) => pwd._id !== id));
        showNotification("Sikeresen törölve", "success");
      } else {
        showNotification("Hiba történt a törlés során", "error");
      }
    } catch (error) {
      showNotification("Hiba történt a törlés során", "error");
    }
    setIsDeleting(null);
  };

  const handleUpdate = async () => {
    if (!selectedPassword) return;

    if (!editName || !editLink || !editEmail || !editPassword) {
      showNotification("Minden mező kitöltése kötelező!", "error");
      return;
    }

    try {
      const response = await fetch(`/api/passwords?id=${selectedPassword._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          link: editLink,
          email: editEmail,
          password: editPassword,
        }),
      });

      if (response.ok) {
        const updatedPasswords = passwords.map((pwd) =>
          pwd._id === selectedPassword._id
            ? {
                ...pwd,
                name: editName,
                link: editLink,
                email: editEmail,
                password: editPassword,
              }
            : pwd
        );
        setPasswords(updatedPasswords);
        setSelectedPassword(null);
        showNotification("Sikeresen módosítva", "success");
      } else {
        showNotification("Hiba történt a módosítás során", "error");
      }
    } catch (error) {
      showNotification("Hiba történt a módosítás során", "error");
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Jelszó szükséges</h2>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder="Add meg a mester jelszót"
            className="w-full p-2 mb-4 rounded-md border border-gray-300 placeholder:text-gray-800"
          />
          <button
            onClick={authenticate}
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Belépés
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-h-[100dvh] h-screen overflow-y-auto overflow-x-hidden flex flex-col bg-gray-100 text-gray-900 p-6 sm:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Jelszavak
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <form onSubmit={savePassword} className="space-y-4">
            <input
              type="text"
              placeholder="Név"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Jelszó Hozzáadása
            </button>
          </form>
        </div>

        {passwords.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Még nincsenek mentett jelszavak
          </div>
        ) : (
          <div className="space-y-4">
            {passwords.map((pwdEntry) => (
              <div
                key={pwdEntry._id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <a 
                      href={pwdEntry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {pwdEntry.name}
                    </a>
                    <p className="text-gray-600">Email: {pwdEntry.email}</p>
                    <div className="flex items-center gap-2">
                      <span>Jelszó: </span>
                      <span>{showPasswords[pwdEntry._id] ? pwdEntry.password : '••••••••'}</span>
                      <button
                        onClick={() => togglePasswordVisibility(pwdEntry._id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {showPasswords[pwdEntry._id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pwdEntry)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDelete(pwdEntry._id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      disabled={isDeleting === pwdEntry._id}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        state={!!selectedPassword} 
        handlerFunction={() => setSelectedPassword(null)}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Jelszó szerkesztése</h2>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Név"
            className="w-full p-2 rounded-md border border-gray-300"
          />
          <input
            type="url"
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            placeholder="Link"
            className="w-full p-2 rounded-md border border-gray-300"
          />
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded-md border border-gray-300"
          />
          <div className="relative">
            <input
              type={showEditPassword ? "text" : "password"}
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              placeholder="Jelszó"
              className="w-full p-2 rounded-md border border-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowEditPassword(!showEditPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showEditPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setSelectedPassword(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Mégse
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Mentés
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PasswordsComponent;
