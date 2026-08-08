import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, User, FolderGit2, Cpu, GraduationCap, Award, Trophy,
  FileText, Plus, Trash2, Upload, Lock, Pencil, X, Save,
  Briefcase, Image
} from 'lucide-react';
import {
  getProfile, updateProfile,
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, updateSkill, deleteSkill,
  getEducation, createEducation, updateEducation, deleteEducation,
  getCertifications, createCertification, updateCertification, deleteCertification,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
  getExperience, createExperience, updateExperience, deleteExperience,
  getResume, uploadResumeFile, uploadMedia
} from '../services/api';
import PasswordModal from '../components/common/PasswordModal';
import Toast from '../components/common/Toast';

// Reusable input styling
const inp = "w-full px-3 py-2 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[#fafafa] text-xs focus:outline-none focus:ring-1 focus:ring-[#6366f1] placeholder:text-[#52525b]";
const lbl = "block text-[10px] font-mono uppercase text-[#a1a1aa] font-bold mb-1";

const AdminSpacePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [experience, setExperience] = useState([]);
  const [resume, setResume] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  const [profileForm, setProfileForm] = useState({});
  const [projectForm, setProjectForm] = useState({ title: '', category: 'Full Stack MERN', shortDescription: '', description: '', technologies: '', repositoryUrl: '', liveUrl: '', thumbnail: '', displayOrder: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Languages & Core', proficiency: 'Intermediate', logo: '', percent: 80, displayOrder: 0 });
  const [educationForm, setEducationForm] = useState({ degree: 'B.Tech', branch: 'Computer Science and Engineering', college: 'RGMCET', startYear: '2023', endYear: '2027', cgpa: '8.1', percentage: '', description: '', displayOrder: 0 });
  const [certForm, setCertForm] = useState({ title: '', organization: '', issueDate: '', credentialUrl: '', credentialId: '', image: '', description: '', displayOrder: 0 });
  const [achieveForm, setAchieveForm] = useState({ title: '', rank: '1st', event: '', organization: 'RGMCET', year: '2025', description: '', image: '' });
  const [expForm, setExpForm] = useState({ role: '', company: '', companyLogo: '', startDate: '', endDate: '', year: '', location: '', mode: 'Internship', description: '', responsibilities: '', technologies: '', certificate: '', companyUrl: '', displayOrder: 0 });

  const avatarRef = useRef(null);
  const projectImgRef = useRef(null);
  const certImgRef = useRef(null);
  const skillLogoRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getProfile(), getProjects(), getSkills(), getEducation(),
        getCertifications(), getAchievements(), getExperience(), getResume()
      ]);
      const [profRes, projRes, skillRes, eduRes, certRes, achRes, expRes, resRes] = results;
      if (profRes.status === 'fulfilled' && profRes.value?.data?.data) setProfile(profRes.value.data.data);
      if (projRes.status === 'fulfilled' && projRes.value?.data?.data) setProjects(projRes.value.data.data);
      if (skillRes.status === 'fulfilled' && skillRes.value?.data?.data) setSkills(skillRes.value.data.data);
      if (eduRes.status === 'fulfilled' && eduRes.value?.data?.data) setEducation(eduRes.value.data.data);
      if (certRes.status === 'fulfilled' && certRes.value?.data?.data) setCertifications(certRes.value.data.data);
      if (achRes.status === 'fulfilled' && achRes.value?.data?.data) setAchievements(achRes.value.data.data);
      if (expRes.status === 'fulfilled' && expRes.value?.data?.data) setExperience(expRes.value.data.data);
      if (resRes.status === 'fulfilled' && resRes.value?.data?.data) setResume(resRes.value.data.data);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  const triggerMutation = (actionTitle, handler) => {
    setPendingAction({ title: actionTitle, handler });
    setModalOpen(true);
  };

  const handlePasswordVerified = async (password) => {
    if (!pendingAction?.handler) return;
    try {
      await pendingAction.handler(password);
      setToast({ message: pendingAction.title + ' — done!', type: 'success' });
      setShowAddForm(false);
      setEditingId(null);
      setEditForm({});
      fetchData();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Operation failed.', type: 'error' });
    } finally { setPendingAction(null); }
  };

  const uploadFile = async (file, pwd) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadMedia(fd, pwd);
    return res.data.url;
  };

  const csvToArr = (v) => typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : (v || []);
  const arrToCsv = (a) => Array.isArray(a) ? a.join(', ') : (a || '');

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({ ...item, technologies: arrToCsv(item.technologies), responsibilities: arrToCsv(item.responsibilities) });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  // ── PROFILE ───────────────────────────────────────────────────────────────
  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerMutation('Update Profile', async (pwd) => {
      let payload = { ...profileForm };
      const avatarFile = avatarRef.current?.files?.[0];
      if (avatarFile) payload.profileImage = await uploadFile(avatarFile, pwd);
      await updateProfile(payload, pwd);
    });
  };

  // ── EXPERIENCE ────────────────────────────────────────────────────────────
  const handleCreateExperience = (e) => {
    e.preventDefault();
    const payload = { ...expForm, responsibilities: csvToArr(expForm.responsibilities), technologies: csvToArr(expForm.technologies) };
    triggerMutation('Add Experience', async (pwd) => { await createExperience(payload, pwd); });
  };
  const handleUpdateExperience = (id) => {
    const payload = { ...editForm, responsibilities: csvToArr(editForm.responsibilities), technologies: csvToArr(editForm.technologies) };
    triggerMutation('Update Experience', async (pwd) => { await updateExperience(id, payload, pwd); });
  };
  const handleDeleteExperience = (id, role) => { triggerMutation('Delete: ' + role, async (pwd) => { await deleteExperience(id, pwd); }); };

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  const handleCreateProject = (e) => {
    e.preventDefault();
    triggerMutation('Add Project', async (pwd) => {
      let payload = { ...projectForm, technologies: csvToArr(projectForm.technologies) };
      const imgFile = projectImgRef.current?.files?.[0];
      if (imgFile) payload.thumbnail = await uploadFile(imgFile, pwd);
      await createProject(payload, pwd);
    });
  };
  const handleUpdateProject = (id) => {
    triggerMutation('Update Project', async (pwd) => {
      await updateProject(id, { ...editForm, technologies: csvToArr(editForm.technologies) }, pwd);
    });
  };
  const handleDeleteProject = (id, title) => { triggerMutation('Delete: ' + title, async (pwd) => { await deleteProject(id, pwd); }); };

  // ── SKILLS ────────────────────────────────────────────────────────────────
  const handleCreateSkill = (e) => {
    e.preventDefault();
    triggerMutation('Add Skill', async (pwd) => {
      let payload = { ...skillForm };
      const logoFile = skillLogoRef.current?.files?.[0];
      if (logoFile) payload.logo = await uploadFile(logoFile, pwd);
      await createSkill(payload, pwd);
    });
  };
  const handleUpdateSkill = (id) => { triggerMutation('Update Skill', async (pwd) => { await updateSkill(id, editForm, pwd); }); };
  const handleDeleteSkill = (id, name) => { triggerMutation('Delete: ' + name, async (pwd) => { await deleteSkill(id, pwd); }); };

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  const handleCreateEducation = (e) => {
    e.preventDefault();
    triggerMutation('Add Education', async (pwd) => { await createEducation(educationForm, pwd); });
  };
  const handleUpdateEducation = (id) => { triggerMutation('Update Education', async (pwd) => { await updateEducation(id, editForm, pwd); }); };
  const handleDeleteEducation = (id, degree) => { triggerMutation('Delete: ' + degree, async (pwd) => { await deleteEducation(id, pwd); }); };

  // ── CERTIFICATIONS ────────────────────────────────────────────────────────
  const handleCreateCertification = (e) => {
    e.preventDefault();
    triggerMutation('Add Certification', async (pwd) => {
      let payload = { ...certForm };
      const imgFile = certImgRef.current?.files?.[0];
      if (imgFile) payload.image = await uploadFile(imgFile, pwd);
      await createCertification(payload, pwd);
    });
  };
  const handleUpdateCertification = (id) => { triggerMutation('Update Certification', async (pwd) => { await updateCertification(id, editForm, pwd); }); };
  const handleDeleteCertification = (id, title) => { triggerMutation('Delete: ' + title, async (pwd) => { await deleteCertification(id, pwd); }); };

  // ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  const handleCreateAchievement = (e) => {
    e.preventDefault();
    triggerMutation('Add Achievement', async (pwd) => { await createAchievement(achieveForm, pwd); });
  };
  const handleUpdateAchievement = (id) => { triggerMutation('Update Achievement', async (pwd) => { await updateAchievement(id, editForm, pwd); }); };
  const handleDeleteAchievement = (id, title) => { triggerMutation('Delete: ' + title, async (pwd) => { await deleteAchievement(id, pwd); }); };

  // ── RESUME ────────────────────────────────────────────────────────────────
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('resume', file);
    triggerMutation('Upload Resume PDF', async (pwd) => { await uploadResumeFile(fd, pwd); });
  };

  // ── Tab config ────────────────────────────────────────────────────────────
  const navTabs = [
    { id: 'profile', name: 'Profile', icon: User, count: 1, color: '#6366f1' },
    { id: 'experience', name: 'Experience', icon: Briefcase, count: experience.length, color: '#06b6d4' },
    { id: 'projects', name: 'Projects', icon: FolderGit2, count: projects.length, color: '#06b6d4' },
    { id: 'skills', name: 'Skills', icon: Cpu, count: skills.length, color: '#c084fc' },
    { id: 'education', name: 'Education', icon: GraduationCap, count: education.length, color: '#10b981' },
    { id: 'certifications', name: 'Certs', icon: Award, count: certifications.length, color: '#f59e0b' },
    { id: 'achievements', name: 'Honors', icon: Trophy, count: achievements.length, color: '#c084fc' },
    { id: 'resume', name: 'Resume', icon: FileText, count: 1, color: '#6366f1' },
  ];

  // ── Reusable UI atoms ─────────────────────────────────────────────────────
  const SectionHeader = ({ icon: Icon, title, count, color, onAdd, addOpen }) => (
    <div className="flex items-center justify-between border-b border-[#2d2d3a] pb-4">
      <h3 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
        <Icon className="w-5 h-5" style={{ color }} />
        <span>{title} {count !== undefined && <span className="text-sm font-normal text-[#a1a1aa]">({count})</span>}</span>
      </h3>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono border transition-all"
          style={{ background: color + '18', color, borderColor: color + '40' }}>
          <Plus className="w-3.5 h-3.5" />
          <span>{addOpen ? 'Close Form' : 'Add New'}</span>
        </button>
      )}
    </div>
  );

  const ActionBtns = ({ onEdit, onDelete }) => (
    <div className="flex gap-2 shrink-0">
      <button onClick={onEdit} className="p-1.5 rounded-lg bg-[#6366f1]/10 text-[#6366f1] hover:bg-[#6366f1]/25 border border-[#6366f1]/20 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
      <button onClick={onDelete} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  );

  const EditActions = ({ onSave, onCancel }) => (
    <div className="flex gap-2 pt-1">
      <button type="button" onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366f1] text-white text-xs font-bold transition-all hover:bg-[#c084fc]"><Save className="w-3.5 h-3.5" />Save Changes</button>
      <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2d2d3a] text-[#a1a1aa] text-xs font-bold"><X className="w-3.5 h-3.5" />Cancel</button>
    </div>
  );

  const FormCard = ({ children, onSubmit, color, title }) => (
    <form onSubmit={onSubmit} className="p-5 rounded-2xl border space-y-3" style={{ borderColor: color + '40', background: '#121217' }}>
      <h4 className="text-xs font-bold font-mono uppercase" style={{ color }}>{title}</h4>
      {children}
      <button type="submit" className="w-full py-2.5 rounded-xl text-xs font-bold border mt-1 flex items-center justify-center gap-2 transition-all" style={{ background: color + '18', color, borderColor: color + '40' }}>
        <Lock className="w-3 h-3" />Save (Password Required)
      </button>
    </form>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-[#a1a1aa] font-mono text-sm animate-pulse">Loading Admin Space...</div></div>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 lg:px-12 w-full max-w-[1700px] mx-auto space-y-6">

      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30 text-xs font-mono font-semibold transition-all">← Return to Portfolio</Link>
        <span className="text-xs font-mono text-[#a1a1aa]">My Space — Control Room</span>
      </div>

      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-[#2d2d3a] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#6366f1]/40 shrink-0">
            <img src={profile.profileImage || '/Avatar.png'} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-[10px] font-mono font-bold border border-[#6366f1]/20 mb-1">
              <Shield className="w-3 h-3" /> SIVA SPACE — CONTROL ROOM
            </div>
            <h1 className="text-xl font-extrabold text-[#fafafa]">Welcome, Venkata Siva Reddy</h1>
            <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">All mutations are password-protected and sync to MongoDB instantly.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[10px] font-mono text-[#a1a1aa]">
          <Lock className="w-3.5 h-3.5 text-[#f59e0b]" /> Mutations require Admin Password
        </div>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowAddForm(false); setEditingId(null); }}
              className="p-3 rounded-2xl border text-center transition-all"
              style={active ? { background: tab.color + '18', borderColor: tab.color + '50', color: tab.color } : { background: '#121217', borderColor: '#2d2d3a', color: '#a1a1aa' }}>
              <Icon className="w-4 h-4 mx-auto mb-1" />
              <span className="block text-[10px] font-bold font-mono">{tab.name}</span>
              <span className="block text-xs font-extrabold">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Content card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#2d2d3a] space-y-6">

        {/* ─── PROFILE ───────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <SectionHeader icon={User} title="Profile & Personal Info" color="#6366f1" />
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Full Name</label><input type="text" className={inp} defaultValue={profile.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><label className={lbl}>Role / Title</label><input type="text" className={inp} defaultValue={profile.role} onChange={e => setProfileForm(p => ({ ...p, role: e.target.value }))} /></div>
                <div><label className={lbl}>Email</label><input type="email" className={inp} defaultValue={profile.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div><label className={lbl}>Phone</label><input type="text" className={inp} defaultValue={profile.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><label className={lbl}>GitHub URL</label><input type="text" className={inp} defaultValue={profile.github} onChange={e => setProfileForm(p => ({ ...p, github: e.target.value }))} /></div>
                <div><label className={lbl}>LinkedIn URL</label><input type="text" className={inp} defaultValue={profile.linkedin} onChange={e => setProfileForm(p => ({ ...p, linkedin: e.target.value }))} /></div>
              </div>
              <div><label className={lbl}>Short Bio Headline</label><input type="text" className={inp} defaultValue={profile.shortBio} onChange={e => setProfileForm(p => ({ ...p, shortBio: e.target.value }))} /></div>
              <div><label className={lbl}>Detailed Bio</label><textarea rows={3} className={inp} defaultValue={profile.longBio} onChange={e => setProfileForm(p => ({ ...p, longBio: e.target.value }))} /></div>
              {/* Avatar Upload */}
              <div>
                <label className={lbl}>Profile Avatar Image</label>
                <div className="flex items-center gap-4">
                  <img src={profile.profileImage || '/Avatar.png'} alt="avatar" className="w-14 h-14 rounded-xl object-cover border border-[#2d2d3a]" />
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] text-xs font-bold cursor-pointer hover:bg-[#6366f1]/20">
                    <Image className="w-4 h-4" /><span>Upload New Avatar</span>
                    <input type="file" ref={avatarRef} accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#c084fc] text-white font-bold text-xs transition-all">
                  <Lock className="w-3.5 h-3.5" /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── EXPERIENCE ─────────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <SectionHeader icon={Briefcase} title="Experience & Internships" count={experience.length} color="#06b6d4" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateExperience} color="#06b6d4" title="Add Experience / Internship">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Role / Title *</label><input required type="text" className={inp} placeholder="e.g. Full Stack Intern" value={expForm.role} onChange={e => setExpForm(p => ({ ...p, role: e.target.value }))} /></div>
                  <div><label className={lbl}>Company Name *</label><input required type="text" className={inp} placeholder="e.g. TechCorp Pvt Ltd" value={expForm.company} onChange={e => setExpForm(p => ({ ...p, company: e.target.value }))} /></div>
                  <div><label className={lbl}>Company Logo URL</label><input type="text" className={inp} placeholder="https://..." value={expForm.companyLogo} onChange={e => setExpForm(p => ({ ...p, companyLogo: e.target.value }))} /></div>
                  <div><label className={lbl}>Company Website</label><input type="text" className={inp} placeholder="https://company.com" value={expForm.companyUrl} onChange={e => setExpForm(p => ({ ...p, companyUrl: e.target.value }))} /></div>
                  <div><label className={lbl}>Start Date</label><input type="text" className={inp} placeholder="Jan 2024" value={expForm.startDate} onChange={e => setExpForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                  <div><label className={lbl}>End Date</label><input type="text" className={inp} placeholder="Jun 2024 / Present" value={expForm.endDate} onChange={e => setExpForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                  <div><label className={lbl}>Year (Display)</label><input type="text" className={inp} placeholder="2024" value={expForm.year} onChange={e => setExpForm(p => ({ ...p, year: e.target.value }))} /></div>
                  <div><label className={lbl}>Mode</label>
                    <select className={inp} value={expForm.mode} onChange={e => setExpForm(p => ({ ...p, mode: e.target.value }))}>
                      <option>Internship</option><option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Freelance</option>
                    </select>
                  </div>
                  <div><label className={lbl}>Location</label><input type="text" className={inp} placeholder="Remote / Hyderabad" value={expForm.location} onChange={e => setExpForm(p => ({ ...p, location: e.target.value }))} /></div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={expForm.displayOrder} onChange={e => setExpForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Description</label><textarea rows={2} className={inp} placeholder="Brief overview of role..." value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div><label className={lbl}>Responsibilities (comma separated)</label><textarea rows={2} className={inp} placeholder="Built REST APIs, Designed UI..." value={expForm.responsibilities} onChange={e => setExpForm(p => ({ ...p, responsibilities: e.target.value }))} /></div>
                <div><label className={lbl}>Technologies Used (comma separated)</label><input type="text" className={inp} placeholder="React, Node.js, MongoDB..." value={expForm.technologies} onChange={e => setExpForm(p => ({ ...p, technologies: e.target.value }))} /></div>
                <div><label className={lbl}>Certificate URL</label><input type="text" className={inp} placeholder="Link to internship certificate" value={expForm.certificate} onChange={e => setExpForm(p => ({ ...p, certificate: e.target.value }))} /></div>
              </FormCard>
            )}

            <div className="space-y-3">
              {experience.length === 0 && <p className="text-xs text-[#a1a1aa] font-mono text-center py-8">No experience entries yet. Click "Add New" to get started.</p>}
              {experience.map(exp => (
                <div key={exp._id} className="p-4 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === exp._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Role</label><input type="text" className={inp} value={editForm.role || ''} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))} /></div>
                        <div><label className={lbl}>Company</label><input type="text" className={inp} value={editForm.company || ''} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} /></div>
                        <div><label className={lbl}>Start Date</label><input type="text" className={inp} value={editForm.startDate || ''} onChange={e => setEditForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                        <div><label className={lbl}>End Date</label><input type="text" className={inp} value={editForm.endDate || ''} onChange={e => setEditForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                        <div><label className={lbl}>Year</label><input type="text" className={inp} value={editForm.year || ''} onChange={e => setEditForm(p => ({ ...p, year: e.target.value }))} /></div>
                        <div><label className={lbl}>Mode</label>
                          <select className={inp} value={editForm.mode || 'Internship'} onChange={e => setEditForm(p => ({ ...p, mode: e.target.value }))}>
                            <option>Internship</option><option>Full-Time</option><option>Part-Time</option><option>Contract</option>
                          </select>
                        </div>
                        <div><label className={lbl}>Location</label><input type="text" className={inp} value={editForm.location || ''} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))} /></div>
                        <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <div><label className={lbl}>Responsibilities (comma sep.)</label><textarea rows={2} className={inp} value={editForm.responsibilities || ''} onChange={e => setEditForm(p => ({ ...p, responsibilities: e.target.value }))} /></div>
                      <div><label className={lbl}>Technologies (comma sep.)</label><input type="text" className={inp} value={editForm.technologies || ''} onChange={e => setEditForm(p => ({ ...p, technologies: e.target.value }))} /></div>
                      <div><label className={lbl}>Certificate URL</label><input type="text" className={inp} value={editForm.certificate || ''} onChange={e => setEditForm(p => ({ ...p, certificate: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateExperience(exp._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#06b6d4] font-bold">{exp.mode} • {exp.year}</span>
                        <h4 className="text-sm font-bold text-[#fafafa]">{exp.role}</h4>
                        <p className="text-xs text-[#a1a1aa]">{exp.company}{exp.location ? ' • ' + exp.location : ''}</p>
                      </div>
                      <ActionBtns onEdit={() => startEdit(exp)} onDelete={() => handleDeleteExperience(exp._id, exp.role)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PROJECTS ───────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <SectionHeader icon={FolderGit2} title="Projects" count={projects.length} color="#06b6d4" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateProject} color="#06b6d4" title="Add New Project">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Title *</label><input required type="text" className={inp} placeholder="Project Name" value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div><label className={lbl}>Category</label><input type="text" className={inp} placeholder="Full Stack MERN / Frontend / AI" value={projectForm.category} onChange={e => setProjectForm(p => ({ ...p, category: e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Short Description *</label><input required type="text" className={inp} placeholder="One-line summary" value={projectForm.shortDescription} onChange={e => setProjectForm(p => ({ ...p, shortDescription: e.target.value }))} /></div>
                <div><label className={lbl}>Detailed Description</label><textarea rows={2} className={inp} value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className={lbl}>Technologies (comma sep.)</label><input type="text" className={inp} placeholder="React, Node.js..." value={projectForm.technologies} onChange={e => setProjectForm(p => ({ ...p, technologies: e.target.value }))} /></div>
                  <div><label className={lbl}>GitHub URL</label><input type="text" className={inp} placeholder="https://github.com/..." value={projectForm.repositoryUrl} onChange={e => setProjectForm(p => ({ ...p, repositoryUrl: e.target.value }))} /></div>
                  <div><label className={lbl}>Live URL</label><input type="text" className={inp} placeholder="https://..." value={projectForm.liveUrl} onChange={e => setProjectForm(p => ({ ...p, liveUrl: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Screenshot / Thumbnail Upload</label>
                    <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] text-xs font-bold cursor-pointer hover:bg-[#06b6d4]/20 w-fit">
                      <Image className="w-4 h-4" /><span>Upload Screenshot</span>
                      <input type="file" ref={projectImgRef} accept="image/*" className="hidden" />
                    </label>
                  </div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={projectForm.displayOrder} onChange={e => setProjectForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
              </FormCard>
            )}

            <div className="divide-y divide-[#2d2d3a]">
              {projects.map(proj => (
                <div key={proj._id} className="py-4">
                  {editingId === proj._id ? (
                    <div className="space-y-3 p-4 rounded-2xl bg-[#121217] border border-[#6366f1]/20">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Title</label><input type="text" className={inp} value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} /></div>
                        <div><label className={lbl}>Category</label><input type="text" className={inp} value={editForm.category || ''} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Short Description</label><input type="text" className={inp} value={editForm.shortDescription || ''} onChange={e => setEditForm(p => ({ ...p, shortDescription: e.target.value }))} /></div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div><label className={lbl}>Technologies</label><input type="text" className={inp} value={editForm.technologies || ''} onChange={e => setEditForm(p => ({ ...p, technologies: e.target.value }))} /></div>
                        <div><label className={lbl}>GitHub URL</label><input type="text" className={inp} value={editForm.repositoryUrl || ''} onChange={e => setEditForm(p => ({ ...p, repositoryUrl: e.target.value }))} /></div>
                        <div><label className={lbl}>Live URL</label><input type="text" className={inp} value={editForm.liveUrl || ''} onChange={e => setEditForm(p => ({ ...p, liveUrl: e.target.value }))} /></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Thumbnail URL</label><input type="text" className={inp} value={editForm.thumbnail || ''} onChange={e => setEditForm(p => ({ ...p, thumbnail: e.target.value }))} /></div>
                        <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <EditActions onSave={() => handleUpdateProject(proj._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {proj.thumbnail && <img src={proj.thumbnail} alt={proj.title} className="w-14 h-10 rounded-lg object-cover border border-[#2d2d3a] shrink-0" />}
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#06b6d4] font-bold">{proj.category}</span>
                          <h4 className="text-sm font-bold text-[#fafafa]">{proj.title}</h4>
                          <p className="text-xs text-[#a1a1aa] line-clamp-1">{proj.shortDescription}</p>
                        </div>
                      </div>
                      <ActionBtns onEdit={() => startEdit(proj)} onDelete={() => handleDeleteProject(proj._id, proj.title)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── SKILLS ─────────────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <SectionHeader icon={Cpu} title="Skills & Technologies" count={skills.length} color="#c084fc" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateSkill} color="#c084fc" title="Add New Skill">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Skill Name *</label><input required type="text" className={inp} placeholder="React, Docker, Python..." value={skillForm.name} onChange={e => setSkillForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><label className={lbl}>Category *</label><input required type="text" className={inp} placeholder="Frontend / Backend / Cloud & DevOps" value={skillForm.category} onChange={e => setSkillForm(p => ({ ...p, category: e.target.value }))} /></div>
                  <div><label className={lbl}>Proficiency</label>
                    <select className={inp} value={skillForm.proficiency} onChange={e => setSkillForm(p => ({ ...p, proficiency: e.target.value }))}>
                      <option>Expert</option><option>Advanced</option><option>Intermediate</option><option>Beginner</option>
                    </select>
                  </div>
                  <div><label className={lbl}>Skill % (0–100)</label><input type="number" min="0" max="100" className={inp} value={skillForm.percent} onChange={e => setSkillForm(p => ({ ...p, percent: +e.target.value }))} /></div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={skillForm.displayOrder} onChange={e => setSkillForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div>
                  <label className={lbl}>Logo (URL or Upload)</label>
                  <div className="flex items-center gap-3">
                    <input type="text" className={inp} placeholder="https://..." value={skillForm.logo} onChange={e => setSkillForm(p => ({ ...p, logo: e.target.value }))} />
                    <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/30 text-[#c084fc] text-xs font-bold cursor-pointer hover:bg-[#c084fc]/20">
                      <Upload className="w-3.5 h-3.5" /><span>Upload</span>
                      <input type="file" ref={skillLogoRef} accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              </FormCard>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map(skill => (
                <div key={skill._id} className="p-3 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === skill._id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={lbl}>Name</label><input type="text" className={inp} value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
                        <div><label className={lbl}>Category</label><input type="text" className={inp} value={editForm.category || ''} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))} /></div>
                        <div><label className={lbl}>Proficiency</label>
                          <select className={inp} value={editForm.proficiency || 'Intermediate'} onChange={e => setEditForm(p => ({ ...p, proficiency: e.target.value }))}>
                            <option>Expert</option><option>Advanced</option><option>Intermediate</option><option>Beginner</option>
                          </select>
                        </div>
                        <div><label className={lbl}>% (0–100)</label><input type="number" min="0" max="100" className={inp} value={editForm.percent ?? 80} onChange={e => setEditForm(p => ({ ...p, percent: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Logo URL</label><input type="text" className={inp} value={editForm.logo || ''} onChange={e => setEditForm(p => ({ ...p, logo: e.target.value }))} /></div>
                      <div><label className={lbl}>Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateSkill(skill._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {skill.logo && <img src={skill.logo} alt={skill.name} className="w-7 h-7 rounded-lg object-contain border border-[#2d2d3a]" />}
                          <div>
                            <span className="text-xs font-bold text-[#fafafa] block">{skill.name}</span>
                            <span className="text-[10px] text-[#c084fc] font-mono">{skill.category}</span>
                          </div>
                        </div>
                        <ActionBtns onEdit={() => startEdit(skill)} onDelete={() => handleDeleteSkill(skill._id, skill.name)} />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-1">
                          <span className="text-[#a1a1aa]">{skill.proficiency}</span>
                          <span className="text-[#c084fc] font-bold">{skill.percent ?? 80}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#2d2d3a] overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#c084fc] transition-all" style={{ width: (skill.percent ?? 80) + '%' }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── EDUCATION ──────────────────────────────────────────── */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <SectionHeader icon={GraduationCap} title="Education" count={education.length} color="#10b981" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateEducation} color="#10b981" title="Add Education Entry">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Degree *</label><input required type="text" className={inp} placeholder="B.Tech / Intermediate / SSC" value={educationForm.degree} onChange={e => setEducationForm(p => ({ ...p, degree: e.target.value }))} /></div>
                  <div><label className={lbl}>Branch / Stream</label><input type="text" className={inp} placeholder="Computer Science and Engineering" value={educationForm.branch} onChange={e => setEducationForm(p => ({ ...p, branch: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>College / Institution *</label><input required type="text" className={inp} placeholder="RGMCET, Nandyal" value={educationForm.college} onChange={e => setEducationForm(p => ({ ...p, college: e.target.value }))} /></div>
                  <div><label className={lbl}>Start Year</label><input type="text" className={inp} placeholder="2023" value={educationForm.startYear} onChange={e => setEducationForm(p => ({ ...p, startYear: e.target.value }))} /></div>
                  <div><label className={lbl}>End Year</label><input type="text" className={inp} placeholder="2027 (Expected)" value={educationForm.endYear} onChange={e => setEducationForm(p => ({ ...p, endYear: e.target.value }))} /></div>
                  <div><label className={lbl}>CGPA</label><input type="text" className={inp} placeholder="8.1" value={educationForm.cgpa} onChange={e => setEducationForm(p => ({ ...p, cgpa: e.target.value }))} /></div>
                  <div><label className={lbl}>Percentage (%)</label><input type="text" className={inp} placeholder="If applicable" value={educationForm.percentage} onChange={e => setEducationForm(p => ({ ...p, percentage: e.target.value }))} /></div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={educationForm.displayOrder} onChange={e => setEducationForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Description / Highlights</label><textarea rows={2} className={inp} value={educationForm.description} onChange={e => setEducationForm(p => ({ ...p, description: e.target.value }))} /></div>
              </FormCard>
            )}

            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu._id} className="p-4 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === edu._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Degree</label><input type="text" className={inp} value={editForm.degree || ''} onChange={e => setEditForm(p => ({ ...p, degree: e.target.value }))} /></div>
                        <div><label className={lbl}>Branch</label><input type="text" className={inp} value={editForm.branch || ''} onChange={e => setEditForm(p => ({ ...p, branch: e.target.value }))} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>College</label><input type="text" className={inp} value={editForm.college || ''} onChange={e => setEditForm(p => ({ ...p, college: e.target.value }))} /></div>
                        <div><label className={lbl}>Start Year</label><input type="text" className={inp} value={editForm.startYear || ''} onChange={e => setEditForm(p => ({ ...p, startYear: e.target.value }))} /></div>
                        <div><label className={lbl}>End Year</label><input type="text" className={inp} value={editForm.endYear || ''} onChange={e => setEditForm(p => ({ ...p, endYear: e.target.value }))} /></div>
                        <div><label className={lbl}>CGPA</label><input type="text" className={inp} value={editForm.cgpa || ''} onChange={e => setEditForm(p => ({ ...p, cgpa: e.target.value }))} /></div>
                        <div><label className={lbl}>Percentage</label><input type="text" className={inp} value={editForm.percentage || ''} onChange={e => setEditForm(p => ({ ...p, percentage: e.target.value }))} /></div>
                        <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateEducation(edu._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono font-bold text-[#10b981] uppercase">{edu.degree}</span>
                          <span className="text-[10px] text-[#a1a1aa] font-mono">• Order: {edu.displayOrder ?? 0}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#fafafa]">{edu.branch ? edu.degree + ' — ' + edu.branch : edu.degree}</h4>
                        <p className="text-xs text-[#a1a1aa]">{edu.college} • {edu.startYear}–{edu.endYear} {edu.cgpa ? '• CGPA: ' + edu.cgpa : ''}</p>
                      </div>
                      <ActionBtns onEdit={() => startEdit(edu)} onDelete={() => handleDeleteEducation(edu._id, edu.degree)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CERTIFICATIONS ─────────────────────────────────────── */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <SectionHeader icon={Award} title="Certifications" count={certifications.length} color="#f59e0b" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateCertification} color="#f59e0b" title="Add New Certification">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Title *</label><input required type="text" className={inp} placeholder="AWS Solutions Architect" value={certForm.title} onChange={e => setCertForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div><label className={lbl}>Issuing Organization *</label><input required type="text" className={inp} placeholder="Amazon Web Services" value={certForm.organization} onChange={e => setCertForm(p => ({ ...p, organization: e.target.value }))} /></div>
                  <div><label className={lbl}>Issue Date</label><input type="text" className={inp} placeholder="Jan 2024" value={certForm.issueDate} onChange={e => setCertForm(p => ({ ...p, issueDate: e.target.value }))} /></div>
                  <div><label className={lbl}>Credential ID</label><input type="text" className={inp} placeholder="ABC-123-XYZ" value={certForm.credentialId} onChange={e => setCertForm(p => ({ ...p, credentialId: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Credential Verification URL</label><input type="text" className={inp} placeholder="https://verify.example.com/..." value={certForm.credentialUrl} onChange={e => setCertForm(p => ({ ...p, credentialUrl: e.target.value }))} /></div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={certForm.displayOrder} onChange={e => setCertForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div>
                  <label className={lbl}>Certificate Image Upload</label>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-bold cursor-pointer hover:bg-[#f59e0b]/20 w-fit">
                    <Image className="w-4 h-4" /><span>Upload Certificate Image</span>
                    <input type="file" ref={certImgRef} accept="image/*" className="hidden" />
                  </label>
                </div>
                <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={certForm.description} onChange={e => setCertForm(p => ({ ...p, description: e.target.value }))} /></div>
              </FormCard>
            )}

            <div className="space-y-3">
              {certifications.map(cert => (
                <div key={cert._id} className="p-4 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === cert._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Title</label><input type="text" className={inp} value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} /></div>
                        <div><label className={lbl}>Organization</label><input type="text" className={inp} value={editForm.organization || ''} onChange={e => setEditForm(p => ({ ...p, organization: e.target.value }))} /></div>
                        <div><label className={lbl}>Issue Date</label><input type="text" className={inp} value={editForm.issueDate || ''} onChange={e => setEditForm(p => ({ ...p, issueDate: e.target.value }))} /></div>
                        <div><label className={lbl}>Credential ID</label><input type="text" className={inp} value={editForm.credentialId || ''} onChange={e => setEditForm(p => ({ ...p, credentialId: e.target.value }))} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Credential URL</label><input type="text" className={inp} value={editForm.credentialUrl || ''} onChange={e => setEditForm(p => ({ ...p, credentialUrl: e.target.value }))} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Image URL</label><input type="text" className={inp} value={editForm.image || ''} onChange={e => setEditForm(p => ({ ...p, image: e.target.value }))} /></div>
                        <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateCertification(cert._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {cert.image && <img src={cert.image} alt={cert.title} className="w-14 h-10 rounded-lg object-cover border border-[#2d2d3a] shrink-0" />}
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#f59e0b] font-bold">{cert.organization}</span>
                          <h4 className="text-sm font-bold text-[#fafafa]">{cert.title}</h4>
                          {cert.issueDate && <p className="text-xs text-[#a1a1aa]">{cert.issueDate}</p>}
                        </div>
                      </div>
                      <ActionBtns onEdit={() => startEdit(cert)} onDelete={() => handleDeleteCertification(cert._id, cert.title)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ACHIEVEMENTS ───────────────────────────────────────── */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <SectionHeader icon={Trophy} title="Achievements & Honors" count={achievements.length} color="#c084fc" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateAchievement} color="#c084fc" title="Add New Achievement">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Title *</label><input required type="text" className={inp} placeholder="Hackathon Winner / Academic Topper" value={achieveForm.title} onChange={e => setAchieveForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div><label className={lbl}>Rank / Position</label><input type="text" className={inp} placeholder="1st Place / Top 10" value={achieveForm.rank} onChange={e => setAchieveForm(p => ({ ...p, rank: e.target.value }))} /></div>
                  <div><label className={lbl}>Event / Competition Name *</label><input required type="text" className={inp} placeholder="Smart India Hackathon 2024" value={achieveForm.event} onChange={e => setAchieveForm(p => ({ ...p, event: e.target.value }))} /></div>
                  <div><label className={lbl}>Organisation / Host *</label><input type="text" className={inp} placeholder="RGMCET / AICTE / NASSCOM" value={achieveForm.organization} onChange={e => setAchieveForm(p => ({ ...p, organization: e.target.value }))} /></div>
                  <div><label className={lbl}>Year *</label><input required type="text" className={inp} placeholder="2025" value={achieveForm.year} onChange={e => setAchieveForm(p => ({ ...p, year: e.target.value }))} /></div>
                  <div><label className={lbl}>Image URL (Optional)</label><input type="text" className={inp} placeholder="https://..." value={achieveForm.image} onChange={e => setAchieveForm(p => ({ ...p, image: e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={achieveForm.description} onChange={e => setAchieveForm(p => ({ ...p, description: e.target.value }))} /></div>
              </FormCard>
            )}

            <div className="space-y-3">
              {achievements.map(ach => (
                <div key={ach._id} className="p-4 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === ach._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Title</label><input type="text" className={inp} value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} /></div>
                        <div><label className={lbl}>Rank</label><input type="text" className={inp} value={editForm.rank || ''} onChange={e => setEditForm(p => ({ ...p, rank: e.target.value }))} /></div>
                        <div><label className={lbl}>Event</label><input type="text" className={inp} value={editForm.event || ''} onChange={e => setEditForm(p => ({ ...p, event: e.target.value }))} /></div>
                        <div><label className={lbl}>Organisation</label><input type="text" className={inp} value={editForm.organization || ''} onChange={e => setEditForm(p => ({ ...p, organization: e.target.value }))} /></div>
                        <div><label className={lbl}>Year</label><input type="text" className={inp} value={editForm.year || ''} onChange={e => setEditForm(p => ({ ...p, year: e.target.value }))} /></div>
                        <div><label className={lbl}>Image URL</label><input type="text" className={inp} value={editForm.image || ''} onChange={e => setEditForm(p => ({ ...p, image: e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateAchievement(ach._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono font-bold text-[#c084fc] uppercase">{ach.rank}</span>
                          <span className="text-[10px] font-mono text-[#a1a1aa]">• {ach.year}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#fafafa]">{ach.title}</h4>
                        <p className="text-xs text-[#a1a1aa]">{ach.event}{ach.organization ? ' • ' + ach.organization : ''}</p>
                      </div>
                      <ActionBtns onEdit={() => startEdit(ach)} onDelete={() => handleDeleteAchievement(ach._id, ach.title)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── RESUME ─────────────────────────────────────────────── */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <SectionHeader icon={FileText} title="Active Resume PDF" color="#6366f1" />
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#2d2d3a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#a1a1aa] block">Currently Active</span>
                <span className="text-base font-bold text-[#fafafa]">{resume.title || 'Venkata_Siva_Reddy_Resume.pdf'}</span>
                {resume.url && <a href={resume.url} target="_blank" rel="noreferrer" className="text-xs text-[#06b6d4] underline block mt-1">View Current Resume ↗</a>}
              </div>
              <label className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30 font-bold text-xs transition-all">
                <Upload className="w-4 h-4" /><span>Upload New Resume PDF (Password Required)</span>
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

      </div>

      <PasswordModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handlePasswordVerified} actionTitle={pendingAction?.title || 'Operation'} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default AdminSpacePage;
