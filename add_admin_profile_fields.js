const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'client', 'src', 'pages', 'AdminSpacePage.jsx');
let code = fs.readFileSync(adminPath, 'utf8');

const profileFields = `
              <h5 className="text-emerald-400 text-xs font-mono mt-4 mb-2">Home Page Status</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Currently Building</label>
                  <input value={profileForm.homeStatusCurrentlyBuilding || ''} onChange={e => setProfileForm({...profileForm, homeStatusCurrentlyBuilding: e.target.value})} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Recently Explored</label>
                  <input value={profileForm.homeStatusRecentlyExplored || ''} onChange={e => setProfileForm({...profileForm, homeStatusRecentlyExplored: e.target.value})} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Open To</label>
                  <input value={profileForm.homeStatusOpenTo || ''} onChange={e => setProfileForm({...profileForm, homeStatusOpenTo: e.target.value})} className={inp} />
                </div>
              </div>

              <h5 className="text-emerald-400 text-xs font-mono mt-4 mb-2">Now Page Content</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Building</label>
                  <input value={profileForm.nowCurrentlyBuilding || ''} onChange={e => setProfileForm({...profileForm, nowCurrentlyBuilding: e.target.value})} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Learning</label>
                  <input value={profileForm.nowLearning || ''} onChange={e => setProfileForm({...profileForm, nowLearning: e.target.value})} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Exploring</label>
                  <input value={profileForm.nowExploring || ''} onChange={e => setProfileForm({...profileForm, nowExploring: e.target.value})} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Up Next</label>
                  <input value={profileForm.nowNext || ''} onChange={e => setProfileForm({...profileForm, nowNext: e.target.value})} className={inp} />
                </div>
              </div>
`;

if (!code.includes("Home Page Status")) {
  code = code.replace(
    /<button type="submit" disabled={avatarUp.isUploading} className="w-full py-3 rounded-xl bg-\[#ef4444\] hover:bg-\[#dc2626\]/,
    profileFields + "\n              <button type=\"submit\" disabled={avatarUp.isUploading} className=\"w-full py-3 rounded-xl bg-[#ef4444] hover:bg-[#dc2626]"
  );
  fs.writeFileSync(adminPath, code);
  console.log("Admin profile fields added");
} else {
  console.log("Fields already present");
}
