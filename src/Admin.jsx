import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { ArrowLeft, LogOut, LockKeyhole } from 'lucide-react'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(true)
  const [message, setMessage] = useState('')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (alive) { setSession(data.session); setBusy(false) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => { alive = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (session) loadProjects()
  }, [session])

  async function loadProjects() {
    const { data, error } = await supabase.from('projects').select('*').order('sort_order')
    if (error) setMessage(error.message)
    else setProjects(data || [])
  }

  async function signIn(event) {
    event.preventDefault()
    setBusy(true); setMessage('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage(error.message); setBusy(false); return }
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles').select('is_admin').eq('user_id', data.user.id).maybeSingle()
    if (profileError || !profile?.is_admin) {
      await supabase.auth.signOut()
      setMessage('এই অ্যাকাউন্টে Admin permission নেই।')
    }
    setBusy(false)
  }

  async function signOut() { await supabase.auth.signOut(); setProjects([]) }

  if (busy) return <div className="admin-page"><p>Loading admin…</p></div>

  if (!session) return <main className="admin-page">
    <a className="admin-back" href="/"><ArrowLeft size={16}/> Back to portfolio</a>
    <form className="admin-login" onSubmit={signIn}>
      <span className="admin-kicker"><LockKeyhole size={15}/> PRIVATE AREA</span>
      <h1>Welcome<br/><em>back.</em></h1>
      <p>Sign in to manage your portfolio.</p>
      <label>Email address</label>
      <input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} />
      {message && <p className="admin-error">{message}</p>}
      <button disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span>↗</span></button>
    </form>
  </main>

  return <main className="admin-page">
    <header className="admin-top"><a className="logo" href="/">KABTOHIN<span>®</span></a><button className="admin-logout" onClick={signOut}><LogOut size={15}/> Sign out</button></header>
    <section className="admin-content">
      <span className="admin-kicker">CONTENT MANAGEMENT</span>
      <h1>Dashboard<span>.</span></h1>
      <p>Signed in as {session.user.email}</p>
      <div className="admin-stat"><strong>{projects.length}</strong><span>Portfolio projects</span></div>
      <h2>Projects</h2>
      {message && <p className="admin-error">{message}</p>}
      {projects.length === 0 ? <p>No projects yet. Your dashboard connection is ready.</p> :
        <div className="admin-projects">{projects.map(p=><article key={p.id}><strong>{p.title}</strong><span>{p.category} · {p.is_published ? 'Published' : 'Draft'}</span></article>)}</div>}
    </section>
  </main>
}
