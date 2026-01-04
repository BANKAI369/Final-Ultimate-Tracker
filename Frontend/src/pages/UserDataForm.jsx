 import React, { useState, useEffect } from 'react';
import { createData, getDataList, deleteData } from '../lib/dataApi';

export default function UserDataForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gmailPassword, setGmailPassword] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getDataList();
      setItems(res.items || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData({ title, content, gmailPassword });
      setTitle(''); setContent(''); setGmailPassword('');
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete item?')) return;
    await deleteData(id);
    await load();
  };

  return (
    <div className="p-4 max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" className="w-full p-2 border rounded" />
        <input 
          type="password" 
          value={gmailPassword} 
          onChange={e=>setGmailPassword(e.target.value)} 
          placeholder="Gmail App Password" 
          className="w-full p-2 border rounded" 
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </form>

      <hr className="my-4" />

      <h3 className="font-bold mb-2">Your items</h3>
      {loading ? <div>Loading...</div> : (
        <ul>
          {items.map(it => (
            <li key={it._id} className="mb-2 border p-2 rounded">
              <div className="flex justify-between">
                <strong>{it.title}</strong>
                <button onClick={()=>onDelete(it._id)} className="text-sm text-red-500">Delete</button>
              </div>
              <p className="text-sm">{it.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}