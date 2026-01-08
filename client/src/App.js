import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = "https://contact-management-k18x.onrender.com";

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    const res = await axios.get(API_URL);
    setContacts(res.data);
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (editId) {
      // Logic for updating existing contact
      await axios.put(`${API_URL}/${editId}`, formData);
      setEditId(null); // Exit edit mode
    } else {
      // Logic for creating new contact
      await axios.post(API_URL, formData);
    }
    setFormData({ name: '', email: '', phone: '', message: '' });
    fetchContacts();
  } catch (err) {
    alert("Error saving contact");
  }
  setLoading(false);
};

 


const handleEdit = (contact) => {
  setEditId(contact._id);
  setFormData({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    message: contact.message || ''
  });
  window.scrollTo(0, 0); 
};
 
const isEmailValid = (email) => email.includes('@') && email.includes('.');


const isPhoneValid = (phone) => {
  const phoneRegex = /^[0-9]+$/; 
  return phone && phoneRegex.test(phone) && phone.length == 10;
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
  {/* Show error if length is not equal to 10 */}
  {formData.phone && /^[0-9]*$/.test(formData.phone) && formData.phone.length != 10 && (
    <p className="text-red-500 text-xs mt-1 italic">Phone must be of 10 digits</p>
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

    
    {/* Submit / Update Button */}
            <button 
              type="submit"
              disabled={!formData.name || !isEmailValid(formData.email) || !isPhoneValid(formData.phone) || loading} 
              className={`w-full font-bold py-3 rounded-lg transition-all text-white ${
                editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'
              } disabled:bg-gray-300`}
            >
              {loading ? "Saving..." : editId ? "Update Contact" : "Submit Contact"}
            </button>

            {/* Cancel Button (Only shows during edit) */}
            {editId && (
              <button 
                type="button"
                onClick={() => { setEditId(null); setFormData({name:'', email:'', phone:'', message:''}) }}
                className="w-full mt-2 text-gray-500 text-sm underline hover:text-gray-700"
              >
                Cancel Edit
              </button>
            )}
          
      
  </form>
</div>

        {/* List Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500 overflow-hidden">
          
          
         <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact List</h2>
         {/* Search Bar */}
          <div className="mb-6">
  <div className="relative">
    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
      🔍
    </span>
    <input
      type="text"
      placeholder="Search by name..."
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
           </div>

      <div className="overflow-y-auto max-h-[500px]">
  {/*  Create the filtered list first */}
  {(() => {
    const filteredContacts = contacts.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );

    //  Check if the main database is empty
    if (contacts.length === 0) {
      return <p className="text-gray-500 text-center py-10">No contacts in your list yet.</p>;
    }

    // Check if the search result is empty
    if (filteredContacts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 font-medium">No matching contact found for "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm("")} 
            className="text-blue-500 text-sm underline mt-2"
          >
            Clear search
          </button>
        </div>
      );
    }

    //Otherwise, map the filtered results
    return filteredContacts.map((c) => (
      <div key={c._id} className="border-b py-4 last:border-0 hover:bg-gray-50 transition px-2 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-blue-600">{c.name}</h3>
          <p className="text-sm text-gray-600">{c.email} | {c.phone}</p>
          {c.message && <p className="text-xs mt-1 text-gray-500 italic">"{c.message}"</p>}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => handleEdit(c)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteContact(c._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  })()}
</div>        
    </div>

      </div>
    </div>
  );
}

export default App;