import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = "http://localhost:5000/api/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    const res = await axios.get(API_URL);
    setContacts(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
      fetchContacts(); // Update list without reload
    } catch (err) { alert("Error saving contact"); }
    setLoading(false);
  };


 
const isEmailValid = (email) => email.includes('@') && email.includes('.');

// This checks if the string is ONLY numbers and at least 10 digits
const isPhoneValid = (phone) => {
  const phoneRegex = /^[0-9]+$/; 
  return phone && phoneRegex.test(phone) && phone.length >= 10;
};
const deleteContact = async (id) => {
  if (window.confirm("Are you sure you want to delete this contact?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchContacts(); // Refresh list after deletion
    } catch (err) {
      alert("Error deleting contact");
    }
  }
};
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Form section */}
        

<div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">New Contact</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    
    {/* Name Field */}
    <div>
      <label className="block text-sm font-semibold mb-1">Full Name*</label>
      <input 
        className={`w-full border rounded-lg p-2.5 outline-none ${!formData.name && 'border-red-500'}`} 
        value={formData.name} 
        onChange={e => setFormData({...formData, name: e.target.value})} 
        required 
      />
      {!formData.name && <p className="text-red-500 text-xs mt-1 italic">Name is required</p>}
    </div>

    {/* Email Field */}
    <div>
      <label className="block text-sm font-semibold mb-1">Email*</label>
      <input 
        type="email" 
        className={`w-full border rounded-lg p-2.5 outline-none ${formData.email && !isEmailValid(formData.email) ? 'border-red-500' : ''}`} 
        value={formData.email} 
        onChange={e => setFormData({...formData, email: e.target.value})} 
        required 
      />
      {formData.email && !isEmailValid(formData.email) && (
        <p className="text-red-500 text-xs mt-1 italic">Please enter a valid email address</p>
      )}
    </div>

    {/* Phone Field */}
    
<div>
  <label className="block text-sm font-semibold mb-1">Phone Number*</label>
  <input 
    type="text"
    className={`w-full border rounded-lg p-2.5 outline-none ${
      formData.phone && !isPhoneValid(formData.phone) ? 'border-red-500' : 'border-gray-300'
    }`} 
    placeholder="e.g. 9876543210"
    value={formData.phone} 
    onChange={e => setFormData({...formData, phone: e.target.value})} 
    required 
  />
  {/* Show specific error if user enters letters */}
  {formData.phone && !/^[0-9]*$/.test(formData.phone) && (
    <p className="text-red-500 text-xs mt-1 italic">Please enter numbers only</p>
  )}
  {/* Show error if too short */}
  {formData.phone && /^[0-9]*$/.test(formData.phone) && formData.phone.length < 10 && (
    <p className="text-red-500 text-xs mt-1 italic">Phone must be of least 10 digits</p>
  )}
</div>

    {/* Message Field */}
    <div>
      <label className="block text-sm font-semibold mb-1">Message</label>
      <textarea 
        className="w-full border rounded-lg p-2.5 outline-none" 
        rows="3"
        value={formData.message} 
        onChange={e => setFormData({...formData, message: e.target.value})} 
      />
    </div>

    <button 
      disabled={!formData.name || !isEmailValid(formData.email) || !isPhoneValid(formData.phone) || loading} 
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all"
    >
      {loading ? "Saving..." : "Submit Contact"}
    </button>
  </form>
</div>

        {/* List Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500 overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact List</h2>
          <div className="overflow-y-auto max-h-[500px]">
            {contacts.length === 0 ? <p className="text-gray-500">No contacts found.</p> : 
              contacts.map(c => (
                
  <div key={c._id} className="border-b py-4 last:border-0 hover:bg-gray-50 transition px-2 flex justify-between items-center">
    <div>
      <h3 className="font-bold text-blue-600">{c.name}</h3>
      <p className="text-sm text-gray-600">{c.email} | {c.phone}</p>
      {c.message && <p className="text-xs mt-1 text-gray-500 italic">"{c.message}"</p>}
    </div>
    <button 
      onClick={() => deleteContact(c._id)}
      className="text-red-500 hover:text-red-700 font-semibold text-sm p-2"
    >
      Delete
    </button>
  </div>
))}
              
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;