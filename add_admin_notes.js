const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'client', 'src', 'pages', 'AdminSpacePage.jsx');
let code = fs.readFileSync(adminPath, 'utf8');

// 1. Add import
if (!code.includes("getNotes")) {
  code = code.replace(
    /import \{\s*getProfile/,
    "import {\n  getNotes, createNote, updateNote, deleteNote,\n  getProfile"
  );
}

// 2. Add state
if (!code.includes("const [notes, setNotes] = useState([]);")) {
  code = code.replace(
    /const \[profile, setProfile\] = useState\(\{\}\);/,
    "const [profile, setProfile] = useState({});\n  const [notes, setNotes] = useState([]);\n  const [noteForm, setNoteForm] = useState({ title: '', slug: '', category: '', excerpt: '', content: '', readTime: '', isPublished: false, tags: '' });"
  );
}

// 3. Add to fetch
if (!code.includes("getNotes(pwd)")) {
  code = code.replace(
    /getWorkspaceItems\(\),\s*getAdminMessages\(pwd\)/,
    "getWorkspaceItems(),\n        getNotes(),\n        getAdminMessages(pwd)"
  );
  code = code.replace(
    /const \[profRes.*?flRes\] = results;/,
    "const [profRes, projRes, skillRes, eduRes, certRes, achRes, expRes, resRes, codRes, carRes, wsRes, notesRes, msgRes, flRes] = results;"
  );
  code = code.replace(
    /if \(wsRes\.status === 'fulfilled'.*?setWorkspaceItems\(wsRes\.value\.data\.data\);/,
    "if (wsRes.status === 'fulfilled' && wsRes.value?.data?.data) setWorkspaceItems(wsRes.value.data.data);\n      if (notesRes && notesRes.status === 'fulfilled' && notesRes.value?.data?.data) setNotes(notesRes.value.data.data);"
  );
}

// 4. Add handlers
if (!code.includes("handleCreateNote")) {
  const handlers = `
  // ── NOTES ────────────────────────────────────────────────────────────
  const handleCreateNote = (e) => {
    e.preventDefault();
    triggerMutation('Add Note', async (pwd) => { 
      const payload = { ...noteForm, tags: csvToArr(noteForm.tags) };
      await createNote(payload, pwd); 
    });
  };
  const handleUpdateNote = (id) => { 
    triggerMutation('Update Note', async (pwd) => { 
      const payload = { ...editForm, tags: csvToArr(editForm.tags) };
      await updateNote(id, payload, pwd); 
    }); 
  };
  const handleDeleteNote = (id, title) => { triggerMutation('Delete: ' + title, async (pwd) => { await deleteNote(id, pwd); }); };
  `;
  code = code.replace(/\/\/ ── EXPERIENCE ──/, handlers + "\n  // ── EXPERIENCE ──");
}

// 5. Add to navTabs
if (!code.includes("id: 'notes'")) {
  code = code.replace(
    /\{ id: 'projects', name: 'Projects', icon: FolderGit2, count: projects\.length, color: '#f87171' \},/,
    "{ id: 'projects', name: 'Projects', icon: FolderGit2, count: projects.length, color: '#f87171' },\n    { id: 'notes', name: 'Notes', icon: FileText, count: notes.length, color: '#f59e0b' },"
  );
}

// 6. Add to Switch
if (!code.includes("activeTab === 'notes'")) {
  const tabRender = `
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <SectionHeader icon={FileText} title="Notes & Articles" count={notes.length} color="#f59e0b" onAdd={() => { setShowAddForm(!showAddForm); setNoteForm({ title: '', slug: '', category: '', excerpt: '', content: '', readTime: '', isPublished: false, tags: '' }); }} addOpen={showAddForm} />
            
            {showAddForm && (
              <FormCard onSubmit={handleCreateNote} color="#f59e0b" title="Create New Note">
                <input required value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} placeholder="Title" className={inp} />
                <input required value={noteForm.slug} onChange={e => setNoteForm({...noteForm, slug: e.target.value})} placeholder="Slug (e.g. my-first-post)" className={inp} />
                <input required value={noteForm.category} onChange={e => setNoteForm({...noteForm, category: e.target.value})} placeholder="Category" className={inp} />
                <input required value={noteForm.excerpt} onChange={e => setNoteForm({...noteForm, excerpt: e.target.value})} placeholder="Excerpt" className={inp} />
                <input required value={noteForm.readTime} onChange={e => setNoteForm({...noteForm, readTime: e.target.value})} placeholder="Read Time (e.g. 5 min)" className={inp} />
                <input value={noteForm.tags} onChange={e => setNoteForm({...noteForm, tags: e.target.value})} placeholder="Tags (comma separated)" className={inp} />
                <textarea required value={noteForm.content} onChange={e => setNoteForm({...noteForm, content: e.target.value})} placeholder="Markdown Content" rows="8" className={inp}></textarea>
                <label className="flex items-center gap-2 text-white text-xs">
                  <input type="checkbox" checked={noteForm.isPublished} onChange={e => setNoteForm({...noteForm, isPublished: e.target.checked})} />
                  Published
                </label>
              </FormCard>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map(note => (
                <div key={note._id} className="glass-card p-5 rounded-2xl border border-[#2d2d3a] flex flex-col h-full">
                  {editingId === note._id ? (
                    <div className="space-y-3">
                      <input required value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className={inp} />
                      <input required value={editForm.slug} onChange={e => setEditForm({...editForm, slug: e.target.value})} className={inp} />
                      <textarea required value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} rows="4" className={inp}></textarea>
                      <label className="flex items-center gap-2 text-white text-xs"><input type="checkbox" checked={editForm.isPublished} onChange={e => setEditForm({...editForm, isPublished: e.target.checked})} /> Published</label>
                      <EditActions onSave={() => handleUpdateNote(note._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-500" />
                          <span className="text-[10px] font-mono text-amber-500 uppercase">{note.category}</span>
                        </div>
                        <ActionBtns onEdit={() => startEdit(note)} onDelete={() => handleDeleteNote(note._id, note.title)} />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{note.title}</h4>
                      <p className="text-xs text-zinc-400 mb-4 flex-grow line-clamp-3">{note.excerpt}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-zinc-800 pt-3">
                        <span>{note.isPublished ? 'Published' : 'Draft'}</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
  `;
  code = code.replace(/\{activeTab === 'projects' && \(/, tabRender + "\n        {activeTab === 'projects' && (");
}

fs.writeFileSync(adminPath, code);
console.log("Admin notes added");
