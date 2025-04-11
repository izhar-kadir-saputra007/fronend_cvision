import { useEffect, useState } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../APIS/CRUD';
import SideBar from "../components/SideBar";

const AdminEditUser = () => {
  const [users, setUsers] = useState([]); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('user'); 
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confPassword) {
        alert("Password dan konfirmasi password tidak cocok");
        return;
    }

    const userData = { name, email, phoneNumber, password, confPassword, role }; 

    if (editUserId) {
        await updateUser(editUserId, userData);
        setEditUserId(null);
    } else {
        await createUser(userData); 
    }

    // Reset form
    setName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfPassword('');
    fetchUsers(); // Refresh users list
};

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setRole(user.role); // Set role when editing user
    setPassword(''); // Do not pre-fill password during editing
    setConfPassword(''); // Do not pre-fill confirmPassword during editing
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers(); // Refresh the user list after delete
  };

  return (
    <div className="flex gap-16">
      <SideBar />
      <div className="text-secondary ">
        <h2 className="text-2xl font-bold mb-4">User List</h2>
        <div className=''>

        <form onSubmit={handleSubmit} className="mb-4 ">
          <input
            type="text"
            placeholder="Name"
            value={name || ''} // Default to empty string if null/undefined
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mr-2 text-primary"
          />
          <input
            type="email"
            placeholder="Email"
            value={email || ''} // Default to empty string if null/undefined
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mr-2 text-primary"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber || ''} // Default to empty string if null/undefined
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2 mr-2 text-primary"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 mr-2 text-primary"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mr-2 text-primary"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            className="border p-2 mr-2 text-primary"
          />
          {error && <p className="text-red-500">{error}</p>} {/* Error message */}
          <button type="submit" className="bg-secondary text-primary p-2 rounded">
            {editUserId ? "Update" : "Add"}
          </button>
        </form>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center mb-2">
              <span>{user.name} - {user.email} - {user.phoneNumber} - {user.role}</span>
              <div>
                <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white p-1 mr-2 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white p-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminEditUser;
