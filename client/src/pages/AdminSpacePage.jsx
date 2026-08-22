import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, User, FolderGit2, Cpu, GraduationCap, Award, Trophy,
  FileText, Plus, Trash2, Upload, Lock, Pencil, X, Save,
  Briefcase, Image, Code2, Sparkles, MapPin, Target,
  BarChart3, Activity, Eye, Download, Globe, Clock, Smartphone,
  RefreshCw, FileSpreadsheet, UserCheck, ChevronRight, Filter,
  ExternalLink, Mail
} from 'lucide-react';
import {
  getProfile, updateProfile,
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, updateSkill, deleteSkill,
  getEducation, createEducation, updateEducation, deleteEducation,
  getCertifications, createCertification, updateCertification, deleteCertification,
  getAchievements, createAchievement, updateAchievement, deleteAchievement,
  getExperience, createExperience, updateExperience, deleteExperience,
  getCodingProfiles, createCodingProfile, updateCodingProfile, deleteCodingProfile,
  getCareerNodes, createCareerNode, updateCareerNode, deleteCareerNode,
  getResume, uploadResumeFile, uploadMedia, resolveMediaUrl,
  getAnalyticsDashboard, exportAnalyticsCsv
} from '../services/api';
import { getSocket } from '../services/socket';
import PasswordModal from '../components/common/PasswordModal';
import { openPdfInNewTab } from '../utils/pdfHelpers';
import Toast from '../components/common/Toast';

// ─── Reusable input styling ─────────────────────────────────────────────
const inp = "w-full px-3 py-2 rounded-xl bg-[#09090b] border border-[#2d2d3a] text-[#fafafa] text-xs focus:outline-none focus:ring-1 focus:ring-[#6366f1] placeholder:text-[#52525b]";
const lbl = "block text-[10px] font-mono uppercase text-[#a1a1aa] font-bold mb-1";

// ─── STABLE COMPONENT DEFINITIONS (outside parent to prevent focus loss) ─
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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────
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
  const [codingProfiles, setCodingProfiles] = useState([]);
  const [careerNodes, setCareerNodes] = useState([]);

  // Analytics state
  const [analyticsOverview, setAnalyticsOverview] = useState({});
  const [analyticsEngagement, setAnalyticsEngagement] = useState({});
  const [analyticsSources, setAnalyticsSources] = useState([]);
  const [analyticsRecruiter, setAnalyticsRecruiter] = useState([]);
  const [analyticsSessions, setAnalyticsSessions] = useState([]);
  const [analyticsRealtime, setAnalyticsRealtime] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isAnalyticsAuthorized, setIsAnalyticsAuthorized] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  const [profileForm, setProfileForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', category: 'Full Stack MERN', shortDescription: '', description: '', technologies: '', repositoryUrl: '', liveUrl: '', thumbnail: '', displayOrder: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Languages & Core', type: 'technical', proficiency: 'Intermediate', logo: '', percent: 80, displayOrder: 0, description: '' });
  const [educationForm, setEducationForm] = useState({ degree: 'B.Tech', branch: 'Computer Science and Engineering', college: 'RGMCET', startYear: '2023', endYear: '2027', cgpa: '8.1', percentage: '', description: '', displayOrder: 0 });
  const [certForm, setCertForm] = useState({ title: '', organization: '', issueDate: '', credentialUrl: '', credentialId: '', image: '', description: '', displayOrder: 0 });
  const [achieveForm, setAchieveForm] = useState({ title: '', rank: '1st', event: '', organization: 'RGMCET', year: '2025', description: '', image: '' });
  const [expForm, setExpForm] = useState({ role: '', company: '', companyLogo: '', startDate: '', endDate: '', year: '', location: '', mode: 'Internship', description: '', responsibilities: '', technologies: '', certificate: '', companyUrl: '', displayOrder: 0 });
  const [codingForm, setCodingForm] = useState({ platform: '', username: '', profileUrl: '', logo: '', problemsSolved: '150+', rating: '', rank: '', description: '', displayOrder: 0 });
  const [careerForm, setCareerForm] = useState({ year: '', title: '', subtitle: '', description: '', status: 'future', icon: 'Target', displayOrder: 0 });

  const avatarRef = useRef(null);
  const projectImgRef = useRef(null);
  const certImgRef = useRef(null);
  const skillLogoRef = useRef(null);
  const achieveImgRef = useRef(null);

  useEffect(() => { 
    fetchData(); 
    fetchAnalyticsData();

    // Socket.io Live Updates Subscription
    const socket = getSocket();

    const handleConnect = () => {
      setIsLiveConnected(true);
      socket.emit('subscribe:analytics');
    };

    const handleDisconnect = () => {
      setIsLiveConnected(false);
    };

    const handleAnalyticsUpdate = (payload) => {
      if (import.meta.env.DEV) {
        console.log('[Dashboard Live Update Received]:', payload);
      }
      fetchAnalyticsData(undefined, true);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('analytics:update', handleAnalyticsUpdate);

    if (socket.connected) {
      handleConnect();
    }

    // Fallback polling every 12 seconds in case socket is disconnected
    const fallbackPoll = setInterval(() => {
      if (!socket.connected) {
        fetchAnalyticsData(undefined, true);
      }
    }, 12000);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('analytics:update', handleAnalyticsUpdate);
      socket.emit('unsubscribe:analytics');
      clearInterval(fallbackPoll);
    };
  }, [selectedPeriod]);

  const fetchAnalyticsData = async (pwd, silent = false) => {
    if (!silent) setLoadingAnalytics(true);
    try {
      const activePwd = pwd || sessionStorage.getItem('admin_password');
      const res = await getAnalyticsDashboard(selectedPeriod, activePwd);
      if (res.data?.success) {
        const d = res.data;
        setIsAnalyticsAuthorized(Boolean(d.isAuthorized));
        setAnalyticsOverview(d.summary || {});
        setAnalyticsEngagement(d.engagement || {});
        setAnalyticsSources(d.traffic || []);
        setAnalyticsRecruiter(d.recruiterInterest || []);
        setAnalyticsSessions(d.sessions || []);
        setAnalyticsRealtime(d.summary?.activeVisitors || 0);
        if (!selectedPeriod && d.period) {
          setSelectedPeriod(d.period);
        }
      }
    } catch (err) {
      console.error('Analytics dashboard fetch error:', err);
    } finally {
      if (!silent) setLoadingAnalytics(false);
    }
  };

  const handleUnlockAnalytics = (pwd) => {
    sessionStorage.setItem('admin_password', pwd);
    fetchAnalyticsData(pwd);
    setToast({ message: 'Detailed analytics unlocked successfully!', type: 'success' });
  };

  const handleLockAnalytics = () => {
    sessionStorage.removeItem('admin_password');
    fetchAnalyticsData('');
    setToast({ message: 'Detailed telemetry locked.', type: 'info' });
  };

  const handleExportAnalyticsCsv = async (pwd) => {
    try {
      const activePwd = pwd || sessionStorage.getItem('admin_password');
      const res = await exportAnalyticsCsv(activePwd, selectedPeriod);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio_analytics_${selectedPeriod || 'export'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast({ message: 'Analytics CSV exported successfully!', type: 'success' });
    } catch (err) {
      console.error('Export CSV error:', err);
      setToast({ message: 'Failed to export CSV. Admin password required.', type: 'error' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getProfile(), getProjects(), getSkills(), getEducation(),
        getCertifications(), getAchievements(), getExperience(), getResume(),
        getCodingProfiles(), getCareerNodes()
      ]);
      const [profRes, projRes, skillRes, eduRes, certRes, achRes, expRes, resRes, codRes, carRes] = results;
      if (profRes.status === 'fulfilled' && profRes.value?.data?.data) {
        setProfile(profRes.value.data.data);
        setProfileForm(profRes.value.data.data);
      }
      if (projRes.status === 'fulfilled' && projRes.value?.data?.data) setProjects(projRes.value.data.data);
      if (skillRes.status === 'fulfilled' && skillRes.value?.data?.data) setSkills(skillRes.value.data.data);
      if (eduRes.status === 'fulfilled' && eduRes.value?.data?.data) setEducation(eduRes.value.data.data);
      if (certRes.status === 'fulfilled' && certRes.value?.data?.data) setCertifications(certRes.value.data.data);
      if (achRes.status === 'fulfilled' && achRes.value?.data?.data) setAchievements(achRes.value.data.data);
      if (expRes.status === 'fulfilled' && expRes.value?.data?.data) setExperience(expRes.value.data.data);
      if (resRes.status === 'fulfilled' && resRes.value?.data?.data) setResume(resRes.value.data.data);
      if (codRes.status === 'fulfilled' && codRes.value?.data?.data) setCodingProfiles(codRes.value.data.data);
      if (carRes.status === 'fulfilled' && carRes.value?.data?.data) setCareerNodes(carRes.value.data.data);
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
    // Resolve to full URL so it works across origins (client ≠ server)
    return resolveMediaUrl(res.data.url);
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
      let payload = { ...profile, ...profileForm };
      const avatarFile = avatarRef.current?.files?.[0];
      if (avatarFile) payload.profileImage = await uploadFile(avatarFile, pwd);
      await updateProfile(payload, pwd);
      setAvatarPreview(null);
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
    triggerMutation('Add Achievement', async (pwd) => {
      let payload = { ...achieveForm };
      const imgFile = achieveImgRef.current?.files?.[0];
      if (imgFile) payload.image = await uploadFile(imgFile, pwd);
      await createAchievement(payload, pwd);
    });
  };
  const handleUpdateAchievement = (id) => { triggerMutation('Update Achievement', async (pwd) => { await updateAchievement(id, editForm, pwd); }); };
  const handleDeleteAchievement = (id, title) => { triggerMutation('Delete: ' + title, async (pwd) => { await deleteAchievement(id, pwd); }); };

  // ── CODING PROFILES ───────────────────────────────────────────────────────
  const handleCreateCodingProfile = (e) => {
    e.preventDefault();
    triggerMutation('Add Coding Profile', async (pwd) => { await createCodingProfile(codingForm, pwd); });
  };
  const handleUpdateCodingProfile = (id) => { triggerMutation('Update Coding Profile', async (pwd) => { await updateCodingProfile(id, editForm, pwd); }); };
  const handleDeleteCodingProfile = (id, platform) => { triggerMutation('Delete: ' + platform, async (pwd) => { await deleteCodingProfile(id, pwd); }); };

  // ── CAREER NODES ──────────────────────────────────────────────────────────
  const handleCreateCareerNode = (e) => {
    e.preventDefault();
    triggerMutation('Add Career Node', async (pwd) => { await createCareerNode(careerForm, pwd); });
  };
  const handleUpdateCareerNode = (id) => { triggerMutation('Update Career Node', async (pwd) => { await updateCareerNode(id, editForm, pwd); }); };
  const handleDeleteCareerNode = (id, title) => { triggerMutation('Delete: ' + title, async (pwd) => { await deleteCareerNode(id, pwd); }); };

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
    { id: 'analytics', name: 'Analytics', icon: BarChart3, count: analyticsOverview.totalVisitors || 0, color: '#10b981' },
    { id: 'experience', name: 'Experience', icon: Briefcase, count: experience.length, color: '#06b6d4' },
    { id: 'projects', name: 'Projects', icon: FolderGit2, count: projects.length, color: '#06b6d4' },
    { id: 'skills', name: 'Skills', icon: Cpu, count: skills.length, color: '#c084fc' },
    { id: 'education', name: 'Education', icon: GraduationCap, count: education.length, color: '#10b981' },
    { id: 'certifications', name: 'Certs', icon: Award, count: certifications.length, color: '#f59e0b' },
    { id: 'achievements', name: 'Honors', icon: Trophy, count: achievements.length, color: '#c084fc' },
    { id: 'coding', name: 'Coding', icon: Code2, count: codingProfiles.length, color: '#38bdf8' },
    { id: 'career', name: 'Roadmap', icon: Sparkles, count: careerNodes.length, color: '#6366f1' },
    { id: 'resume', name: 'Resume', icon: FileText, count: 1, color: '#6366f1' },
  ];

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
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#6366f1]/40 shrink-0">
            <img src={resolveMediaUrl(profile.profileImage) || '/Avatar.png'} alt="avatar" className="w-full h-full object-cover" />
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
      <div className="grid grid-cols-4 sm:grid-cols-11 gap-2">
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

        {/* ─── ANALYTICS ─────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            overview={analyticsOverview}
            engagement={analyticsEngagement}
            sources={analyticsSources}
            recruiterSignals={analyticsRecruiter}
            sessions={analyticsSessions}
            realtime={analyticsRealtime}
            isLiveConnected={isLiveConnected}
            selectedPeriod={selectedPeriod}
            isAuthorized={isAnalyticsAuthorized}
            onUnlock={() => {
              setPendingAction(() => (pwd) => handleUnlockAnalytics(pwd));
              setModalOpen(true);
            }}
            onLock={handleLockAnalytics}
            onRefresh={() => fetchAnalyticsData()}
            onExport={() => {
              if (isAnalyticsAuthorized) {
                handleExportAnalyticsCsv();
              } else {
                setPendingAction(() => (pwd) => handleExportAnalyticsCsv(pwd));
                setModalOpen(true);
              }
            }}
            loading={loadingAnalytics}
          />
        )}

        {/* ─── PROFILE ───────────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <SectionHeader icon={User} title="Profile & Personal Info" color="#6366f1" />
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={lbl}>Full Name</label><input type="text" className={inp} value={profileForm.name || ''} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><label className={lbl}>Role / Title</label><input type="text" className={inp} value={profileForm.role || ''} onChange={e => setProfileForm(p => ({ ...p, role: e.target.value }))} /></div>
                <div><label className={lbl}>Email</label><input type="email" className={inp} value={profileForm.email || ''} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} /></div>
                <div><label className={lbl}>Phone</label><input type="text" className={inp} value={profileForm.phone || ''} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} /></div>
                <div><label className={lbl}>GitHub URL</label><input type="text" className={inp} value={profileForm.github || ''} onChange={e => setProfileForm(p => ({ ...p, github: e.target.value }))} /></div>
                <div><label className={lbl}>LinkedIn URL</label><input type="text" className={inp} value={profileForm.linkedin || ''} onChange={e => setProfileForm(p => ({ ...p, linkedin: e.target.value }))} /></div>
              </div>
              <div><label className={lbl}>Short Bio Headline</label><input type="text" className={inp} value={profileForm.shortBio || ''} onChange={e => setProfileForm(p => ({ ...p, shortBio: e.target.value }))} /></div>
              <div><label className={lbl}>Detailed Bio</label><textarea rows={3} className={inp} value={profileForm.longBio || ''} onChange={e => setProfileForm(p => ({ ...p, longBio: e.target.value }))} /></div>

              {/* About Me & Development Vision Fields */}
              <div className="pt-4 border-t border-[#2d2d3a]">
                <h4 className="text-xs font-bold font-mono uppercase text-[#38bdf8] mb-3 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> About Me & Development Vision</h4>
                <div className="space-y-3">
                  <div><label className={lbl}>Career Goal</label><textarea rows={2} className={inp} value={profileForm.careerGoal || ''} onChange={e => setProfileForm(p => ({ ...p, careerGoal: e.target.value }))} placeholder="e.g. Become a strong software engineer..." /></div>
                  <div><label className={lbl}>Current Focus Areas</label><input type="text" className={inp} value={profileForm.currentFocus || ''} onChange={e => setProfileForm(p => ({ ...p, currentFocus: e.target.value }))} placeholder="e.g. MERN Stack, DSA, Cloud, AI" /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className={lbl}>Location</label><input type="text" className={inp} value={profileForm.location || ''} onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))} placeholder="Andhra Pradesh, India" /></div>
                    <div><label className={lbl}>Availability Status</label><input type="text" className={inp} value={profileForm.availability || ''} onChange={e => setProfileForm(p => ({ ...p, availability: e.target.value }))} placeholder="Open for Internships & SWE Roles" /></div>
                  </div>
                </div>
              </div>

              {/* Education Summary Fields */}
              <div className="pt-4 border-t border-[#2d2d3a]">
                <h4 className="text-xs font-bold font-mono uppercase text-[#10b981] mb-3 flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" /> Education Summary & College Website</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className={lbl}>Degree</label><input type="text" className={inp} value={profileForm.degree || ''} onChange={e => setProfileForm(p => ({ ...p, degree: e.target.value }))} placeholder="B.Tech" /></div>
                  <div><label className={lbl}>Branch</label><input type="text" className={inp} value={profileForm.branch || ''} onChange={e => setProfileForm(p => ({ ...p, branch: e.target.value }))} placeholder="Computer Science" /></div>
                  <div><label className={lbl}>College Name</label><input type="text" className={inp} value={profileForm.college || ''} onChange={e => setProfileForm(p => ({ ...p, college: e.target.value }))} placeholder="RGMCET" /></div>
                  <div className="sm:col-span-2"><label className={lbl}>College Website URL</label><input type="text" className={inp} value={profileForm.collegeUrl || ''} onChange={e => setProfileForm(p => ({ ...p, collegeUrl: e.target.value }))} placeholder="https://www.rgmcet.edu.in/" /></div>
                  <div><label className={lbl}>Graduation Year</label><input type="number" className={inp} value={profileForm.graduationYear || 2027} onChange={e => setProfileForm(p => ({ ...p, graduationYear: +e.target.value }))} /></div>
                  <div><label className={lbl}>CGPA</label><input type="number" step="0.1" className={inp} value={profileForm.cgpa || 8.1} onChange={e => setProfileForm(p => ({ ...p, cgpa: +e.target.value }))} /></div>
                </div>
              </div>

              {/* Avatar Upload */}
              <div>
                <label className={lbl}>Profile Avatar Image</label>
                <div className="flex items-center gap-4">
                  <img src={avatarPreview || resolveMediaUrl(profileForm.profileImage || profile.profileImage) || '/Avatar.png'} alt="avatar" className="w-14 h-14 rounded-full object-cover border border-[#2d2d3a]" />
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] text-xs font-bold cursor-pointer hover:bg-[#6366f1]/20">
                    <Image className="w-4 h-4" /><span>{avatarPreview ? 'Change Selected Avatar' : 'Upload New Avatar'}</span>
                    <input 
                      type="file" 
                      ref={avatarRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
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
                        <div><label className={lbl}>Company Website URL</label><input type="text" className={inp} placeholder="https://company.com" value={editForm.companyUrl || ''} onChange={e => setEditForm(p => ({ ...p, companyUrl: e.target.value }))} /></div>
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
                        {proj.thumbnail && <img src={resolveMediaUrl(proj.thumbnail)} alt={proj.title} className="w-14 h-10 rounded-lg object-cover border border-[#2d2d3a] shrink-0" />}
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
                  <div><label className={lbl}>Skill Name *</label><input required type="text" className={inp} placeholder="React, Problem Solving..." value={skillForm.name} onChange={e => setSkillForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><label className={lbl}>Category *</label><input required type="text" className={inp} placeholder="Frontend / Soft Skills / Backend" value={skillForm.category} onChange={e => setSkillForm(p => ({ ...p, category: e.target.value }))} /></div>
                  <div><label className={lbl}>Skill Type *</label>
                    <select className={inp} value={skillForm.type || 'technical'} onChange={e => setSkillForm(p => ({ ...p, type: e.target.value }))}>
                      <option value="technical">Technical Skill</option>
                      <option value="soft">Soft Skill</option>
                    </select>
                  </div>
                  <div><label className={lbl}>Proficiency</label>
                    <select className={inp} value={skillForm.proficiency} onChange={e => setSkillForm(p => ({ ...p, proficiency: e.target.value }))}>
                      <option>Expert</option><option>Advanced</option><option>Intermediate</option><option>Beginner</option>
                    </select>
                  </div>
                  <div><label className={lbl}>Skill % (0–100)</label><input type="number" min="0" max="100" className={inp} value={skillForm.percent} onChange={e => setSkillForm(p => ({ ...p, percent: +e.target.value }))} /></div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={skillForm.displayOrder} onChange={e => setSkillForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Description / Subtitle</label><input type="text" className={inp} placeholder="Brief detail about this skill..." value={skillForm.description || ''} onChange={e => setSkillForm(p => ({ ...p, description: e.target.value }))} /></div>
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
                        <div><label className={lbl}>Skill Type</label>
                          <select className={inp} value={editForm.type || 'technical'} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))}>
                            <option value="technical">Technical Skill</option>
                            <option value="soft">Soft Skill</option>
                          </select>
                        </div>
                        <div><label className={lbl}>Proficiency</label>
                          <select className={inp} value={editForm.proficiency || 'Intermediate'} onChange={e => setEditForm(p => ({ ...p, proficiency: e.target.value }))}>
                            <option>Expert</option><option>Advanced</option><option>Intermediate</option><option>Beginner</option>
                          </select>
                        </div>
                        <div><label className={lbl}>% (0–100)</label><input type="number" min="0" max="100" className={inp} value={editForm.percent ?? 80} onChange={e => setEditForm(p => ({ ...p, percent: +e.target.value }))} /></div>
                        <div><label className={lbl}>Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Description</label><input type="text" className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <div><label className={lbl}>Logo URL</label><input type="text" className={inp} value={editForm.logo || ''} onChange={e => setEditForm(p => ({ ...p, logo: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateSkill(skill._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {skill.logo && <img src={resolveMediaUrl(skill.logo)} alt={skill.name} className="w-7 h-7 rounded-lg object-contain border border-[#2d2d3a]" />}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#fafafa] block">{skill.name}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${skill.type === 'soft' ? 'bg-[#06b6d4]/20 text-[#06b6d4]' : 'bg-[#6366f1]/20 text-[#a5b4fc]'}`}>
                                {skill.type === 'soft' ? 'Soft' : 'Tech'}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#c084fc] font-mono">{skill.category}</span>
                          </div>
                        </div>
                        <ActionBtns onEdit={() => startEdit(skill)} onDelete={() => handleDeleteSkill(skill._id, skill.name)} />
                      </div>
                      <div>
                        {skill.description && (
                          <p className="text-[11px] text-[#a1a1aa] mb-1.5 line-clamp-1">{skill.description}</p>
                        )}
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
                  <div className="sm:col-span-2"><label className={lbl}>College Website URL</label><input type="text" className={inp} placeholder="https://www.rgmcet.edu.in/" value={educationForm.collegeUrl} onChange={e => setEducationForm(p => ({ ...p, collegeUrl: e.target.value }))} /></div>
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
                        <div className="sm:col-span-2"><label className={lbl}>College Website URL</label><input type="text" className={inp} placeholder="https://www.rgmcet.edu.in/" value={editForm.collegeUrl || ''} onChange={e => setEditForm(p => ({ ...p, collegeUrl: e.target.value }))} /></div>
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
                        {cert.image && <img src={resolveMediaUrl(cert.image)} alt={cert.title} className="w-14 h-10 rounded-lg object-cover border border-[#2d2d3a] shrink-0" />}
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
                  <div>
                    <label className={lbl}>Image (URL or File Upload)</label>
                    <div className="flex items-center gap-2">
                      <input type="text" className={inp} placeholder="https://..." value={achieveForm.image} onChange={e => setAchieveForm(p => ({ ...p, image: e.target.value }))} />
                      <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/30 text-[#c084fc] text-xs font-bold cursor-pointer hover:bg-[#c084fc]/20">
                        <Upload className="w-3.5 h-3.5" /><span>Upload</span>
                        <input type="file" ref={achieveImgRef} accept="image/*" className="hidden" />
                      </label>
                    </div>
                  </div>
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

        {/* ─── CODING PROFILES ────────────────────────────────────── */}
        {activeTab === 'coding' && (
          <div className="space-y-6">
            <SectionHeader icon={Code2} title="Coding Profiles & Benchmarks" count={codingProfiles.length} color="#38bdf8" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            {showAddForm && (
              <FormCard onSubmit={handleCreateCodingProfile} color="#38bdf8" title="Add Coding Profile">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Platform Name *</label><input required type="text" className={inp} placeholder="LeetCode / CodeChef / HackerRank" value={codingForm.platform} onChange={e => setCodingForm(p => ({ ...p, platform: e.target.value }))} /></div>
                  <div><label className={lbl}>Username</label><input type="text" className={inp} placeholder="your_username" value={codingForm.username} onChange={e => setCodingForm(p => ({ ...p, username: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Profile URL *</label><input required type="text" className={inp} placeholder="https://leetcode.com/..." value={codingForm.profileUrl} onChange={e => setCodingForm(p => ({ ...p, profileUrl: e.target.value }))} /></div>
                  <div><label className={lbl}>Problems Solved</label><input type="text" className={inp} placeholder="150+" value={codingForm.problemsSolved} onChange={e => setCodingForm(p => ({ ...p, problemsSolved: e.target.value }))} /></div>
                  <div><label className={lbl}>Rating / Stars</label><input type="text" className={inp} placeholder="1650 / 4★" value={codingForm.rating} onChange={e => setCodingForm(p => ({ ...p, rating: e.target.value }))} /></div>
                  <div><label className={lbl}>Rank</label><input type="text" className={inp} placeholder="Top 15%" value={codingForm.rank} onChange={e => setCodingForm(p => ({ ...p, rank: e.target.value }))} /></div>
                  <div><label className={lbl}>Logo URL</label><input type="text" className={inp} placeholder="https://..." value={codingForm.logo} onChange={e => setCodingForm(p => ({ ...p, logo: e.target.value }))} /></div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={codingForm.displayOrder} onChange={e => setCodingForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Description</label><textarea rows={2} className={inp} placeholder="Focus areas, streaks, etc." value={codingForm.description} onChange={e => setCodingForm(p => ({ ...p, description: e.target.value }))} /></div>
              </FormCard>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {codingProfiles.length === 0 && <p className="text-xs text-[#a1a1aa] font-mono text-center py-8 col-span-full">No coding profiles yet. Click "Add New" to get started.</p>}
              {codingProfiles.map(cp => (
                <div key={cp._id} className="p-4 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === cp._id ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={lbl}>Platform</label><input type="text" className={inp} value={editForm.platform || ''} onChange={e => setEditForm(p => ({ ...p, platform: e.target.value }))} /></div>
                        <div><label className={lbl}>Username</label><input type="text" className={inp} value={editForm.username || ''} onChange={e => setEditForm(p => ({ ...p, username: e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Profile URL</label><input type="text" className={inp} value={editForm.profileUrl || ''} onChange={e => setEditForm(p => ({ ...p, profileUrl: e.target.value }))} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={lbl}>Problems Solved</label><input type="text" className={inp} value={editForm.problemsSolved || ''} onChange={e => setEditForm(p => ({ ...p, problemsSolved: e.target.value }))} /></div>
                        <div><label className={lbl}>Rating / Stars</label><input type="text" className={inp} value={editForm.rating || ''} onChange={e => setEditForm(p => ({ ...p, rating: e.target.value }))} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={lbl}>Rank</label><input type="text" className={inp} value={editForm.rank || ''} onChange={e => setEditForm(p => ({ ...p, rank: e.target.value }))} /></div>
                        <div><label className={lbl}>Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Logo URL</label><input type="text" className={inp} value={editForm.logo || ''} onChange={e => setEditForm(p => ({ ...p, logo: e.target.value }))} /></div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateCodingProfile(cp._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-[#fafafa]">{cp.platform}</h4>
                        <ActionBtns onEdit={() => startEdit(cp)} onDelete={() => handleDeleteCodingProfile(cp._id, cp.platform)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-[#09090b] border border-[#2d2d3a]">
                          <span className="block text-[10px] font-mono text-[#a1a1aa]">Solved</span>
                          <span className="text-sm font-bold text-[#38bdf8] font-mono">{cp.problemsSolved}</span>
                        </div>
                        {cp.rating && (
                          <div className="p-2.5 rounded-xl bg-[#09090b] border border-[#2d2d3a]">
                            <span className="block text-[10px] font-mono text-[#a1a1aa]">Rating</span>
                            <span className="text-sm font-bold text-[#c084fc] font-mono">{cp.rating}</span>
                          </div>
                        )}
                      </div>
                      {cp.profileUrl && <a href={cp.profileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#38bdf8] font-mono mt-2 block truncate hover:underline">{cp.profileUrl}</a>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CAREER ROAD SPINE ──────────────────────────────────── */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <SectionHeader icon={Sparkles} title="Career Road Spine" count={careerNodes.length} color="#6366f1" onAdd={() => setShowAddForm(f => !f)} addOpen={showAddForm} />

            <div className="p-3 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/20 text-xs text-[#a1a1aa] font-mono">
              <span className="text-[#6366f1] font-bold">ℹ Info:</span> When no career nodes exist in the database, the portfolio shows built-in default milestones. Add your own nodes here to override them.
            </div>

            {showAddForm && (
              <FormCard onSubmit={handleCreateCareerNode} color="#6366f1" title="Add Career Milestone">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={lbl}>Year / Period *</label><input required type="text" className={inp} placeholder="2024 or 2024 — 2025" value={careerForm.year} onChange={e => setCareerForm(p => ({ ...p, year: e.target.value }))} /></div>
                  <div><label className={lbl}>Title *</label><input required type="text" className={inp} placeholder="🎓 EDUCATION" value={careerForm.title} onChange={e => setCareerForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Subtitle</label><input type="text" className={inp} placeholder="Rajeev Gandhi Memorial College..." value={careerForm.subtitle} onChange={e => setCareerForm(p => ({ ...p, subtitle: e.target.value }))} /></div>
                  <div><label className={lbl}>Status</label>
                    <select className={inp} value={careerForm.status} onChange={e => setCareerForm(p => ({ ...p, status: e.target.value }))}>
                      <option value="completed">✅ Completed</option>
                      <option value="active">🟢 Active</option>
                      <option value="future">⏳ Future</option>
                    </select>
                  </div>
                  <div><label className={lbl}>Icon</label>
                    <select className={inp} value={careerForm.icon} onChange={e => setCareerForm(p => ({ ...p, icon: e.target.value }))}>
                      <option value="GraduationCap">🎓 GraduationCap</option>
                      <option value="Cpu">💻 Cpu</option>
                      <option value="Code2">🧠 Code2</option>
                      <option value="Briefcase">🏢 Briefcase</option>
                      <option value="FlaskConical">🧪 FlaskConical</option>
                      <option value="Trophy">🏆 Trophy</option>
                      <option value="Rocket">🚀 Rocket</option>
                      <option value="Target">🎯 Target</option>
                      <option value="Sparkles">✨ Sparkles</option>
                    </select>
                  </div>
                  <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={careerForm.displayOrder} onChange={e => setCareerForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                </div>
                <div><label className={lbl}>Description</label><textarea rows={2} className={inp} placeholder="Details about this milestone..." value={careerForm.description} onChange={e => setCareerForm(p => ({ ...p, description: e.target.value }))} /></div>
              </FormCard>
            )}

            <div className="space-y-3">
              {careerNodes.length === 0 && <p className="text-xs text-[#a1a1aa] font-mono text-center py-8">No custom career nodes. Default milestones are showing on the portfolio.</p>}
              {careerNodes.map(node => (
                <div key={node._id} className="p-4 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
                  {editingId === node._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className={lbl}>Year</label><input type="text" className={inp} value={editForm.year || ''} onChange={e => setEditForm(p => ({ ...p, year: e.target.value }))} /></div>
                        <div><label className={lbl}>Title</label><input type="text" className={inp} value={editForm.title || ''} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Subtitle</label><input type="text" className={inp} value={editForm.subtitle || ''} onChange={e => setEditForm(p => ({ ...p, subtitle: e.target.value }))} /></div>
                        <div><label className={lbl}>Status</label>
                          <select className={inp} value={editForm.status || 'future'} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                            <option value="completed">✅ Completed</option>
                            <option value="active">🟢 Active</option>
                            <option value="future">⏳ Future</option>
                          </select>
                        </div>
                        <div><label className={lbl}>Icon</label>
                          <select className={inp} value={editForm.icon || 'Target'} onChange={e => setEditForm(p => ({ ...p, icon: e.target.value }))}>
                            <option value="GraduationCap">🎓 GraduationCap</option>
                            <option value="Cpu">💻 Cpu</option>
                            <option value="Code2">🧠 Code2</option>
                            <option value="Briefcase">🏢 Briefcase</option>
                            <option value="FlaskConical">🧪 FlaskConical</option>
                            <option value="Trophy">🏆 Trophy</option>
                            <option value="Rocket">🚀 Rocket</option>
                            <option value="Target">🎯 Target</option>
                            <option value="Sparkles">✨ Sparkles</option>
                          </select>
                        </div>
                        <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={editForm.displayOrder ?? 0} onChange={e => setEditForm(p => ({ ...p, displayOrder: +e.target.value }))} /></div>
                      </div>
                      <div><label className={lbl}>Description</label><textarea rows={2} className={inp} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
                      <EditActions onSave={() => handleUpdateCareerNode(node._id)} onCancel={cancelEdit} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                            node.status === 'completed' ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/30' :
                            node.status === 'active' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30' :
                            'bg-[#3f3f46]/10 text-[#a1a1aa] border-[#3f3f46]/30'
                          }`}>{node.year}</span>
                          <span className="text-[10px] font-mono text-[#a1a1aa] capitalize">{node.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#fafafa]">{node.title}</h4>
                        <p className="text-xs text-[#a1a1aa]">{node.subtitle}</p>
                      </div>
                      <ActionBtns onEdit={() => startEdit(node)} onDelete={() => handleDeleteCareerNode(node._id, node.title)} />
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
            <SectionHeader icon={FileText} title="Active Resume PDF (Cloudinary & MongoDB)" color="#6366f1" />
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#2d2d3a] flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#a1a1aa] block">Currently Active Document</span>
                  <span className="text-base font-bold text-[#fafafa]">{resume.title || 'Venkata_Siva_Reddy_Resume.pdf'}</span>
                  {resume.url && (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openPdfInNewTab(resolveMediaUrl(resume.url))}
                        className="text-xs text-[#06b6d4] hover:text-[#38bdf8] font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        View Active PDF ↗
                      </button>
                      <span className="text-xs text-zinc-500 font-mono break-all bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
                        {resume.url.startsWith('http') ? resume.url : 'Stored in MongoDB'}
                      </span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30 font-bold text-xs transition-all shrink-0">
                  <Upload className="w-4 h-4" /><span>Upload New Resume PDF (Admin Protected)</span>
                  <input type="file" accept="application/pdf,.pdf" onChange={handleResumeUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

      </div>

      <PasswordModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handlePasswordVerified} actionTitle={pendingAction?.title || 'Operation'} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

// ─── ANALYTICS VIEW COMPONENT ──────────────────────────────────────────────
const AnalyticsView = ({
  overview = {}, engagement = {}, sources = [], recruiterSignals = [],
  sessions = [], realtime = 0, isLiveConnected = false, selectedPeriod = '',
  isAuthorized = false, onUnlock, onLock,
  onRefresh, onExport, loading = false
}) => {
  const [expandedSession, setExpandedSession] = useState(null);
  const [filterRecruiter, setFilterRecruiter] = useState(false);

  const displayedSessions = filterRecruiter
    ? (sessions || []).filter(s => s.isPotentialRecruiter || (s.potentialRecruiterScore || 0) >= 30)
    : (sessions || []);

  return (
    <div className="space-y-6">
      {/* Header with Realtime status & controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2d2d3a] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-[#fafafa] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Visitor Analytics & Telemetry</span>
            </h3>
            
            {/* Real-time Presence Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                {realtime > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${realtime > 0 ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
              </span>
              <span>{realtime > 0 ? `Active Visitors: ${realtime}` : 'No active visitors'}</span>
            </div>

            {/* Socket.io Live Stream Connection Status */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
              isLiveConnected 
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <span className="relative flex h-1.5 w-1.5">
                {isLiveConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isLiveConnected ? 'bg-indigo-400' : 'bg-amber-400'}`}></span>
              </span>
              <span>{isLiveConnected ? 'LIVE STREAM' : 'AUTO-POLLING'}</span>
            </div>

            {/* Active Period Badge */}
            {selectedPeriod && (
              <span className="px-2.5 py-1 rounded-full bg-[#121217] border border-[#2d2d3a] text-[#a1a1aa] text-[11px] font-mono font-bold">
                Period: <span className="text-[#fafafa]">{selectedPeriod}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#a1a1aa] font-mono mt-1">
            Privacy-conscious session tracking, section view timing, and recruiter interest telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Unlock / Lock Toggle */}
          {isAuthorized ? (
            <button
              type="button"
              onClick={onLock}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono font-bold text-red-400 transition-all"
              title="Lock deep telemetry"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Details</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onUnlock}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-mono font-bold text-indigo-400 transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Details</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121217] hover:bg-[#1a1a22] border border-[#2d2d3a] text-xs font-mono font-bold text-[#a1a1aa] hover:text-[#fafafa] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── PUBLIC TIER: Aggregate Summary Stat Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard label="Total Visitors" value={overview.totalVisitors ?? (loading ? '...' : 0)} color="#6366f1" loading={loading && overview.totalVisitors === undefined} />
        <StatCard label="Unique Visitors" value={overview.uniqueVisitors ?? (loading ? '...' : 0)} color="#38bdf8" loading={loading && overview.uniqueVisitors === undefined} />
        <StatCard label="Returning" value={overview.returningVisitors ?? (loading ? '...' : 0)} color="#c084fc" loading={loading && overview.returningVisitors === undefined} />
        <StatCard label="Total Sessions" value={overview.totalSessions ?? (loading ? '...' : 0)} color="#10b981" loading={loading && overview.totalSessions === undefined} />
        <StatCard label="Avg Duration" value={overview.avgSessionDuration !== undefined ? formatDuration(overview.avgSessionDuration) : (loading ? '...' : '0s')} color="#f59e0b" loading={loading && overview.avgSessionDuration === undefined} />
        <StatCard label="Today" value={overview.todayVisitors ?? (loading ? '...' : 0)} color="#06b6d4" loading={loading && overview.todayVisitors === undefined} />
        <StatCard label="This Week" value={overview.weekVisitors ?? (loading ? '...' : 0)} color="#a855f7" loading={loading && overview.weekVisitors === undefined} />
        <StatCard label="This Month" value={overview.monthVisitors ?? (loading ? '...' : 0)} color="#ec4899" loading={loading && overview.monthVisitors === undefined} />
      </div>

      {/* ─── DETAIL TIER: Gated by Password Authentication ─── */}
      {!isAuthorized ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121217] border border-[#2d2d3a] text-center space-y-4 max-w-xl mx-auto my-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-[#fafafa] font-mono">
              Detailed Telemetry & Recruiter Signals are Protected
            </h4>
            <p className="text-xs text-[#a1a1aa] font-mono leading-relaxed max-w-md mx-auto">
              Public aggregate numbers for {selectedPeriod || 'the active period'} are shown above. Enter your portfolio admin password to view recruiter interest flags, interaction goal telemetry, section view timings, and visitor session journeys.
            </p>
          </div>
          <button
            type="button"
            onClick={onUnlock}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-mono font-bold transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Unlock Detailed Telemetry</span>
          </button>
        </div>
      ) : (
        <>
          {/* Engagement & Recruiter Signals Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Key Action Engagement Cards */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-[#121217] border border-[#2d2d3a] space-y-4">
              <h4 className="text-xs font-mono uppercase font-bold text-[#fafafa] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6366f1]" />
                <span>Interaction & Goal Engagement</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <MetricBadge label="Resume Views" value={engagement?.actions?.resumeViews || 0} icon={Eye} color="#6366f1" />
                <MetricBadge label="Resume Downloads" value={engagement?.actions?.resumeDownloads || 0} icon={Download} color="#10b981" />
                <MetricBadge label="Project Views" value={engagement?.actions?.projectViews || 0} icon={FolderGit2} color="#38bdf8" />
                <MetricBadge label="GitHub Clicks" value={engagement?.actions?.githubClicks || 0} icon={Code2} color="#c084fc" />
                <MetricBadge label="LinkedIn Clicks" value={engagement?.actions?.linkedinClicks || 0} icon={UserCheck} color="#06b6d4" />
                <MetricBadge label="Email / Contact" value={engagement?.actions?.emailClicks || 0} icon={Mail} color="#f59e0b" />
              </div>
            </div>

            {/* Potential Recruiter Signals Card */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121217] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Potential Recruiter Interest</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
                  {(recruiterSignals || []).length} Flagged
                </span>
              </div>
              <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                High-engagement sessions based on observable interaction patterns (Viewed Resume + Downloaded Resume + Projects + LinkedIn).
              </p>

              <div className="space-y-2 pt-1">
                {(recruiterSignals || []).length === 0 ? (
                  <p className="text-xs font-mono text-[#a1a1aa] italic py-3">No high-engagement recruiter sessions recorded yet.</p>
                ) : (
                  recruiterSignals.slice(0, 4).map(s => (
                    <div key={s.sessionId} className="p-2.5 rounded-xl bg-[#09090b] border border-[#2d2d3a] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="font-bold text-[#fafafa]">#{s.sessionId}</span>
                        <span className="text-[10px] text-[#a1a1aa] ml-2">{s.country || 'India'} · {s.deviceType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">Score {s.potentialRecruiterScore}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section Engagement Bar Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#121217] border border-[#2d2d3a] space-y-4">
          <h4 className="text-xs font-mono uppercase font-bold text-[#fafafa] flex items-center justify-between">
            <span>Most Viewed Sections & Avg Time</span>
            <span className="text-[10px] text-[#a1a1aa]">IntersectionObserver Telemetry</span>
          </h4>
          
          <div className="space-y-2.5 pt-2">
            {(engagement.sections || []).length === 0 ? (
              <p className="text-xs font-mono text-[#a1a1aa] py-6 text-center">No section engagement data collected yet.</p>
            ) : (
              engagement.sections.slice(0, 6).map((sec, i) => {
                const maxViews = Math.max(...engagement.sections.map(s => s.views), 1);
                const percent = Math.min(100, Math.round((sec.views / maxViews) * 100));
                return (
                  <div key={sec.section || i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#fafafa]">{sec.section}</span>
                      <span className="text-[#a1a1aa]">{sec.views} views · avg {sec.avgTimeSpentSeconds}s</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#09090b] overflow-hidden border border-[#2d2d3a]">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Traffic Sources Breakdown */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#121217] border border-[#2d2d3a] space-y-4">
          <h4 className="text-xs font-mono uppercase font-bold text-[#fafafa]">Traffic Sources Breakdown</h4>
          <div className="space-y-3 pt-2">
            {(sources || []).length === 0 ? (
              <p className="text-xs font-mono text-[#a1a1aa] py-6 text-center">No traffic source data recorded.</p>
            ) : (
              sources.map(src => {
                const total = sources.reduce((sum, s) => sum + s.count, 0) || 1;
                const pct = Math.round((src.count / total) * 100);
                return (
                  <div key={src.source} className="p-3 rounded-xl bg-[#09090b] border border-[#2d2d3a] space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#fafafa] flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
                        {src.source}
                      </span>
                      <span className="text-[#a1a1aa] font-bold">{src.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#121217]">
                      <div className="h-full bg-[#38bdf8] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Visitor Session Inspector Table & Journey View */}
      <div className="p-5 rounded-2xl bg-[#121217] border border-[#2d2d3a] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2d2d3a] pb-3">
          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-[#fafafa] flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Visitor Session Details & Journey Flow</span>
            </h4>
            <p className="text-[11px] text-[#a1a1aa] font-mono">
              Anonymous visitor timelines with step-by-step navigation flow.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFilterRecruiter(!filterRecruiter)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              filterRecruiter
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-[#09090b] text-[#a1a1aa] border-[#2d2d3a] hover:text-[#fafafa]'
            }`}
          >
            <Filter className="w-3 h-3" />
            {filterRecruiter ? 'Showing Recruiter Sessions' : 'Filter Recruiter Sessions'}
          </button>
        </div>

        <div className="space-y-3">
          {displayedSessions.length === 0 ? (
            <p className="text-xs font-mono text-[#a1a1aa] text-center py-8">No visitor sessions recorded yet.</p>
          ) : (
            displayedSessions.map(s => {
              const isExpanded = expandedSession === s.sessionId;
              return (
                <div key={s.sessionId} className="rounded-2xl bg-[#09090b] border border-[#2d2d3a] overflow-hidden transition-all">
                  <div
                    onClick={() => setExpandedSession(isExpanded ? null : s.sessionId)}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#121217] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-[#6366f1] font-mono text-xs font-bold shrink-0">
                        #{s.sessionId?.substring(2, 6) || s.sessionId}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-[#fafafa]">
                            {s.startedAt ? new Date(s.startedAt).toLocaleString() : 'Just now'}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2d2d3a] text-[#a1a1aa]">
                            {s.isReturningVisitor ? 'Returning' : 'New Visitor'}
                          </span>
                          {s.isPotentialRecruiter && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                              Potential Recruiter
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#a1a1aa] mt-0.5">
                          <span>📍 {s.country || 'India'}</span>
                          <span>·</span>
                          <span>💻 {s.deviceType} ({s.operatingSystem} / {s.browser})</span>
                          <span>·</span>
                          <span>🔗 Source: {s.referrerSource || 'Direct'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="text-right">
                        <span className="block text-[#fafafa] font-bold">Duration: {formatDuration(s.durationSeconds || 0)}</span>
                        <span className="block text-[10px] text-[#a1a1aa]">Active: {formatDuration(s.activeTimeSeconds || 0)}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-[#a1a1aa] transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Session Detail & Visual Journey */}
                  {isExpanded && (
                    <div className="p-4 bg-[#121217] border-t border-[#2d2d3a] space-y-4 text-xs font-mono">
                      {/* Visual Journey Flow */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#a1a1aa] block mb-2">Visitor Journey Path:</span>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {(s.sectionsViewed || ['Hero']).map((sec, idx) => (
                            <React.Fragment key={idx}>
                              <span className="px-3 py-1 rounded-xl bg-[#6366f1]/15 text-[#6366f1] border border-[#6366f1]/30 font-bold">
                                {sec}
                              </span>
                              {idx < (s.sectionsViewed?.length || 1) - 1 && <span className="text-[#a1a1aa]">↓</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Actions Performed */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#a1a1aa] block mb-1">Key Actions Triggered:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(s.actionsPerformed || []).length === 0 ? (
                            <span className="text-[#a1a1aa] italic text-[11px]">No explicit link clicks or form actions.</span>
                          ) : (
                            s.actionsPerformed.map((act, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                ✓ {act}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

// Helper mini components for Analytics UI
const StatCard = ({ label, value, color, loading = false }) => (
  <div className="p-3.5 rounded-2xl bg-[#121217] border border-[#2d2d3a]">
    <span className="text-[10px] font-mono uppercase text-[#a1a1aa] block font-bold truncate">{label}</span>
    {loading ? (
      <div className="h-5 w-12 bg-[#2d2d3a] rounded-lg animate-pulse mt-1" />
    ) : (
      <span className="text-base font-extrabold font-mono mt-1 block" style={{ color }}>{value}</span>
    )}
  </div>
);

const MetricBadge = ({ label, value, icon: Icon, color }) => (
  <div className="p-3 rounded-xl bg-[#09090b] border border-[#2d2d3a] flex items-center justify-between">
    <div>
      <span className="text-[10px] font-mono text-[#a1a1aa] uppercase font-bold block">{label}</span>
      <span className="text-lg font-extrabold text-[#fafafa] font-mono mt-0.5 block">{value}</span>
    </div>
    <Icon className="w-5 h-5 shrink-0 opacity-80" style={{ color }} />
  </div>
);

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

export default AdminSpacePage;
