import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import apis, { endPoints } from '../services/apis';

const RANKS = [
  { value: 'BRONZE', label: '🥉 Bronze', color: 'from-amber-700 to-amber-600' },
  { value: 'SILVER', label: '🥈 Silver', color: 'from-slate-400 to-slate-300' },
  { value: 'GOLD', label: '🥇 Gold', color: 'from-yellow-500 to-yellow-400' },
  { value: 'PLATINUM', label: '💎 Platinum', color: 'from-cyan-400 to-cyan-300' },
  { value: 'DIAMOND', label: '💠 Diamond', color: 'from-blue-400 to-cyan-300' },
  { value: 'MASTER', label: '👑 Master', color: 'from-purple-500 to-purple-400' },
  { value: 'GRANDMASTER', label: '🔥 Grandmaster', color: 'from-red-500 to-orange-500' },
  { value: 'CHALLENGER', label: '⚡ Challenger', color: 'from-pink-500 to-rose-500' },
];

const PREFERENCES = [
  'FPS', 'MOBA', 'SPORTS', 'RACING', 'PUZZLE', 'ADVENTURE',
  'SIMULATION', 'STRATEGY', 'ACTION', 'RPG', 'HORROR', 'SCIFI',
  'FANTASY', 'WESTERN', 'HISTORICAL', 'MYSTERY', 'ROMANCE',
  'DRAMA', 'COMEDY', 'THRILLER', 'DOCUMENTARY', 'OTHER'
];

const GamingRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rank: 'BRONZE',
    preference: 'FPS',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return false;
    }
    if (formData.password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự', 'warning');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await apis.post(endPoints.auth.register, registerData);
      showToast('🎉 Đăng ký thành công! Hãy đăng nhập để bắt đầu', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.response?.data || 'Đăng ký thất bại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 rounded-2xl blur opacity-25" />
        
        <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ĐĂNG KÝ
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Tạo tài khoản để bắt đầu cuộc chơi</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= 1 ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'bg-slate-700 text-slate-500'
            }`}>1</div>
            <div className={`w-16 h-1 mx-2 rounded ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-slate-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= 2 ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' : 'bg-slate-700 text-slate-500'
            }`}>2</div>
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                {/* Email Input */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Tiếp theo →
                </button>
              </>
            ) : (
              <>
                {/* Name Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Họ</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Nguyễn"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">Tên</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Văn A"
                      required
                    />
                  </div>
                </div>

                {/* Rank Selection */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Rank Game</label>
                  <select
                    name="rank"
                    value={formData.rank}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                  >
                    {RANKS.map((rank) => (
                      <option key={rank.value} value={rank.value} className="bg-slate-800">
                        {rank.label}
                      </option>
                    ))}
                  </select>
                  {/* Rank Preview */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Preview:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${RANKS.find(r => r.value === formData.rank)?.color} text-white shadow-lg`}>
                      {RANKS.find(r => r.value === formData.rank)?.label}
                    </span>
                  </div>
                </div>

                {/* Preference Selection */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Thể loại game yêu thích</label>
                  <select
                    name="preference"
                    value={formData.preference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                  >
                    {PREFERENCES.map((pref) => (
                      <option key={pref} value={pref} className="bg-slate-800">
                        {pref}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 border border-slate-600/50 text-slate-300 font-semibold rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      '🎮 HOÀN TẤT ĐĂNG KÝ'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-slate-400 text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamingRegister;
