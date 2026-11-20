import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { ArrowLeft, LogOut, LockKeyhole, Plus, Pencil, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react'

const blank = { title:'', category:'Print Design', description:'', project_url:'', sort_order:0, is_published:false, image_url:'', video_url:'' }
const BUCKET = 'portfolio-media'
const MAX_VIDEOS = 10
const MAX_SECONDS = 15

export default function Admin() {
  const [session,setSession] = useState(null)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [busy,setBusy] = useState(true)
  const [saving,setSaving] = useState(false)
  const [message,setMessage] = useState('')
  const [projects,setProjects] = useState([])
  const [editingId,setEditingId] = useState(null)
  const [showForm,setShowForm] = useState(false)
  const [form,setForm] = useState(blank)
  const [imageFile,setImageFile] = useState(null)
  const [videoFile,setVideoFile] = useState(null)

  const loadProjects = useCallback(async () => {
    const {data,error} = await supabase.from('projects').select('*').order('sort_order').order('created_at',{ascending:false})
    if(error) setMessage(error.message); else setProjects(data || [])
  }, [])

  const verifyAdmin = useCallback(async (s) => {
    if(!s?.user?.id) { setSession(null); return false }
    const {data,error} = await supabase.from('admin_profiles').select('is_admin').eq('user_id',s.user.id).maybeSingle()
    if(error || !data?.is_admin) {
      await supabase.auth.signOut()
      setSession(null)
      setMessage(error?.message || 'এই অ্যাকাউন্টে Admin permission নেই।')
      return false
    }
    setSession(s)
    return true
  }, [])

  useEffect(() => {
    let active = true
    async function init() {
      const {data,error} = await supabase.auth.getSession()
      if(!active) return
      if(error) setMessage(error.message)
      if(data.session) await verifyAdmin(data.session)
      if(active) setBusy(false)
    }
    init()
    const {data:{subscription}} = supabase.auth.onAuthStateChange(event => {
      if(event === 'SIGNED_OUT') setSession(null)
    })
    return () => { active=false; subscription.unsubscribe() }
  }, [verifyAdmin])

  useEffect(() => { if(session) loadProjects() }, [session,loadProjects])

  async function signIn(e) {
    e.preventDefault(); setBusy(true); setMessage('')
    const {data,error} = await supabase.auth.signInWithPassword({email,password})
    if(error) { setMessage(error.message); setBusy(false); return }
    await verifyAdmin(data.session)
    setBusy(false)
  }

  async function uploadMedia(file) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const {error} = await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false})
    if(error) throw error
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  function newProject() {
    setEditingId(null); setForm(blank); setImageFile(null); setVideoFile(null); setMessage(''); setShowForm(true)
    setTimeout(() => document.getElementById('project-editor')?.scrollIntoView({behavior:'smooth',block:'start'}), 50)
  }

  function closeForm() {
    setShowForm(false); setEditingId(null); setForm(blank); setImageFile(null); setVideoFile(null)
  }

  function editProject(p) {
    setEditingId(p.id)
    setForm({title:p.title||'',category:p.category||'Print Design',description:p.description||'',project_url:p.project_url||'',sort_order:p.sort_order||0,is_published:!!p.is_published,image_url:p.image_url||'',video_url:p.video_url||''})
    setImageFile(null); setVideoFile(null); setMessage(''); setShowForm(true)
    setTimeout(() => document.getElementById('project-editor')?.scrollIntoView({behavior:'smooth',block:'start'}), 50)
  }

  async function saveProject(e) {
    e.preventDefault()
    if(!form.title.trim()) { setMessage('Project title লিখতে হবে।'); return }
    setSaving(true); setMessage('')
    try {
      if(videoFile) {
        const duration = await new Promise((resolve,reject) => {
          const url=URL.createObjectURL(videoFile), v=document.createElement('video')
          v.preload='metadata'
          v.onloadedmetadata=()=>{URL.revokeObjectURL(url);resolve(v.duration)}
          v.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('ভিডিও ফাইলটি পড়া যাচ্ছে না।'))}
          v.src=url
        })
        if(duration>MAX_SECONDS) throw new Error('ভিডিওর দৈর্ঘ্য সর্বোচ্চ ১৫ সেকেন্ড হতে পারবে।')
        const count=projects.filter(p=>p.video_url && p.id!==editingId).length
        if(count>=MAX_VIDEOS) throw new Error('সর্বোচ্চ ১০টি ভিডিও Project রাখা যাবে।')
      }
      const image_url=imageFile ? await uploadMedia(imageFile) : form.image_url
      const video_url=videoFile ? await uploadMedia(videoFile) : form.video_url
      const payload={title:form.title.trim(),category:form.category,description:form.description.trim()||null,project_url:form.project_url.trim()||null,sort_order:Number(form.sort_order)||0,is_published:!!form.is_published,image_url:image_url||null,video_url:video_url||null,updated_at:new Date().toISOString()}
      const result=editingId ? await supabase.from('projects').update(payload).eq('id',editingId) : await supabase.from('projects').insert(payload)
      if(result.error) throw result.error
      setMessage(editingId?'Project আপডেট হয়েছে।':'নতুন Project যোগ হয়েছে।')
      setEditingId(null); setForm(blank); setImageFile(null); setVideoFile(null); setShowForm(false)
      await loadProjects()
    } catch(err) { setMessage(err.message || 'Project সংরক্ষণ করা যায়নি।') }
    finally { setSaving(false) }
  }

  async function togglePublish(p) {
    const {error}=await supabase.from('projects').update({is_published:!p.is_published,updated_at:new Date().toISOString()}).eq('id',p.id)
    if(error) setMessage(error.message)
    else { setMessage(p.is_published?'Project Draft করা হয়েছে।':'Project Publish করা হয়েছে।'); await loadProjects() }
  }

  async function deleteProject(p) {
    if(!window.confirm(`“${p.title}” Project মুছে ফেলতে চাও?`)) return
    const {error}=await supabase.from('projects').delete().eq('id',p.id)
    if(error) setMessage(error.message)
    else { setProjects(items=>items.filter(x=>x.id!==p.id)); setMessage('Project মুছে ফেলা হয়েছে।') }
  }

  async function signOut() { await supabase.auth.signOut(); setProjects([]) }

  if(busy) return <div className="admin-page"><p>Loading admin…</p></div>
  if(!session) return <main className="admin-page">
    <a className="admin-back" href="/"><ArrowLeft size={16}/> Back to portfolio</a>
    <form className="admin-login" onSubmit={signIn}>
      <span className="admin-kicker"><LockKeyhole size={15}/> PRIVATE AREA</span><h1>Welcome<br/><em>back.</em></h1>
      <p>Sign in to manage your portfolio.</p>
      <label>Email address</label><input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/>
      <label>Password</label><input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>
      {message && <p className="admin-error">{message}</p>}
      <button disabled={busy}>{busy?'Signing in…':'Sign in'} <span>↗</span></button>
    </form>
  </main>

  return <main className="admin-page">
    <header className="admin-top"><a className="logo" href="/">KABTOHIN<span>®</span></a><button className="admin-logout" onClick={signOut}><LogOut size={15}/> Sign out</button></header>
    <section className="admin-content">
      <span className="admin-kicker">CONTENT MANAGEMENT</span><h1>Dashboard<span>.</span></h1>
      <p>Signed in as {session.user.email}</p>
      <div className="admin-stat"><strong>{projects.length}</strong><span>Portfolio projects · {projects.filter(p=>p.is_published).length} published</span></div>
      <div className="admin-section-heading"><h2>Projects</h2><button className="admin-primary" onClick={newProject}><Plus size={16}/> Add project</button></div>
      {message && <p className="admin-notice">{message}</p>}
      {showForm && <form className="project-form" id="project-editor" onSubmit={saveProject}>
        <div className="form-heading"><h2>{editingId?'Edit project':'New project'}</h2><button type="button" onClick={closeForm}>Cancel</button></div>
        <label>Project title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Botanical Campaign"/></label>
        <label>Description<textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="A short description of this project"/></label>
        <div className="admin-form-grid">
          <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Print Design</option><option>Motion Design</option><option>Social Media Design</option><option>Presentation Design</option></select></label>
          <label>Project link (optional)<input type="url" value={form.project_url} onChange={e=>setForm({...form,project_url:e.target.value})} placeholder="https://"/></label>
          <label>Display order<input type="number" min="0" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></label>
        </div>
        <div className="admin-form-grid">
          <label className="upload-field"><Upload size={18}/><span>{imageFile?imageFile.name:form.image_url?'Cover image already attached':'Choose cover image'}</span><input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)}/></label>
          <label className="upload-field"><Upload size={18}/><span>{videoFile?videoFile.name:form.video_url?'Video already attached':'Choose video (max 15 sec)'}</span><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e=>setVideoFile(e.target.files?.[0]||null)}/></label>
          <label className="publish-field"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publish on website</label>
        </div>
        <small>Maximum 10 video projects. Each video can be up to 15 seconds. Use compressed media for faster loading.</small>
        <button className="admin-primary" disabled={saving}>{saving?'Saving…':<><Upload size={16}/>{editingId?'Save changes':'Create project'}</>}</button>
      </form>}
      {projects.length===0 ? <p>No projects yet. Add your first project below.</p> :
        <div className="admin-projects">{projects.map(p=><article key={p.id}>
          <div className="admin-project-main">{p.image_url?<img src={p.image_url} alt=""/>:p.video_url?<span className="admin-media-placeholder">VIDEO</span>:null}<div><strong>{p.title}</strong><span>{p.category} · {p.is_published?'Published':'Draft'}</span></div></div>
          <div className="admin-project-actions"><button onClick={()=>togglePublish(p)}>{p.is_published?<EyeOff size={16}/>:<Eye size={16}/>}<span>{p.is_published?'Draft':'Publish'}</span></button><button onClick={()=>editProject(p)}><Pencil size={16}/><span>Edit</span></button><button className="admin-delete" onClick={()=>deleteProject(p)}><Trash2 size={16}/><span>Delete</span></button></div>
        </article>)}</div>}

    </section>
  </main>
}
