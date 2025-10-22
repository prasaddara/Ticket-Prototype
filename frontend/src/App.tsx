import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token')||'');
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({subject:'', description:'', priority:'Normal'});

  useEffect(()=>{ if(token) fetchTickets(); }, [token]);

  async function loginAs(role){
    const creds = { admin: 'admin@example.com', agent: 'agent@example.com', customer: 'customer@example.com' };
    const res = await fetch(API + '/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: creds[role], password: 'password' }) });
    const data = await res.json();
    if(data.token){ setToken(data.token); localStorage.setItem('token', data.token); setUser(data.user); }
  }

  async function fetchTickets(){
    const res = await fetch(API + '/tickets', { headers: { Authorization: 'Bearer '+token } });
    const data = await res.json();
    setTickets(data || []);
  }

  async function createTicket(e){
    e.preventDefault();
    await fetch(API + '/tickets', { method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer '+token}, body: JSON.stringify(form) });
    setForm({subject:'',description:'',priority:'Normal'});
    fetchTickets();
  }

  return (<div style={{padding:20,fontFamily:'Arial'}}>
    <h2>Ticketing Prototype</h2>
    {!token && <div>
      <p>Quick login as:</p>
      <button onClick={()=>loginAs('admin')}>Login as Admin</button>{' '}
      <button onClick={()=>loginAs('agent')}>Login as Agent</button>{' '}
      <button onClick={()=>loginAs('customer')}>Login as Customer</button>
    </div>}
    {token && <div>
      <p>Welcome {user?.name} ({user?.role}) <button onClick={()=>{localStorage.removeItem('token'); setToken(''); setUser(null);}}>Logout</button></p>
      <h3>Create Ticket</h3>
      <form onSubmit={createTicket}>
        <input placeholder='Subject' value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required /><br/>
        <textarea placeholder='Description' value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required /><br/>
        <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}><option>Low</option><option>Normal</option><option>High</option></select><br/>
        <button type='submit'>Create</button>
      </form>
      <h3>Tickets</h3>
      <button onClick={fetchTickets}>Refresh</button>
      <ul>{tickets.map(t=> (<li key={t.id}><b>{t.subject}</b> - {t.status} - Priority: {t.priority}<br/>Customer: {t.customer?.email} | Agent: {t.agent?.email || 'Unassigned'}
      <div>
      </div>
      </li>))}</ul>
    </div>}
  </div>);
}

export default App;
