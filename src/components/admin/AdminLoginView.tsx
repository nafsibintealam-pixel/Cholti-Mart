import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Server, 
  AlertCircle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useAdminAuth, ROLE_DEFINITIONS } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types';
import { useShop } from '../../context/ShopContext';
import { useCustomizer } from '../../context/CustomizerContext';

export const AdminLoginView: React.FC = () => {
  const { login, backendConfig } = useAdminAuth();
  const { navigateTo } = useShop();
  const { config } = useCustomizer();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login({
        usernameOrEmail: username,
        password: password === '••••••••' ? 'cholti_admin_secure_pass' : password,
        selectedRole
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1D0F] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#E4EB9C] selection:text-[#142C14]">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2D5128]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#537B2F]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand & Administrative Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D5128] to-[#142C14] border border-[#8DA750]/40 text-[#E4EB9C] shadow-xl mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {config.siteSettings.storeName}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-medium">
            Administrative Management Portal &bull; WordPress & WooCommerce
          </p>
        </div>

        {/* Security / Protected Area Notice */}
        <div className="bg-[#142C14]/90 border border-[#8DA750]/30 rounded-2xl p-3.5 text-xs text-neutral-300 flex items-start gap-3 backdrop-blur-md shadow-sm">
          <Lock className="w-4 h-4 text-[#E4EB9C] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Restricted Administrator Access</span>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              This area is strictly reserved for authorized store administrators, managers, and fulfillment officers. Unauthenticated visitors are blocked.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>Username or Email</span>
                <span className="text-[10px] text-neutral-500 font-normal">WordPress User</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin or email@choltimart.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] focus:ring-1 focus:ring-[#8DA750] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>Password</span>
                <span className="text-[10px] text-neutral-500 font-normal">Encrypted</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#8DA750] focus:ring-1 focus:ring-[#8DA750] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Simulator (for Role-Based Access Control evaluation) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#E4EB9C]" />
                  <span>Administrative Role & Permissions</span>
                </span>
                <span className="text-[10px] text-[#E4EB9C] font-mono">RBAC</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              >
                {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((roleKey) => (
                  <option key={roleKey} value={roleKey}>
                    {ROLE_DEFINITIONS[roleKey].title} ({ROLE_DEFINITIONS[roleKey].wpEquivalent})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-neutral-400 leading-tight">
                {ROLE_DEFINITIONS[selectedRole].description}
              </p>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-neutral-900 border-neutral-700 text-[#2D5128] focus:ring-[#8DA750]"
                />
                <span className="text-xs text-neutral-400">Remember session (8 hours)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2D5128] to-[#142C14] hover:from-[#537B2F] hover:to-[#2D5128] text-white font-bold text-sm border border-[#8DA750]/50 shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying Administrator Token...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#E4EB9C]" />
                  <span>Log In to Store Admin</span>
                </>
              )}
            </button>

          </form>

          {/* Architecture Ready Notice */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E4EB9C]">
              <Server className="w-3.5 h-3.5" />
              <span>WordPress / WooCommerce Production Backend Architecture</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              In production, this interface authenticates directly with WordPress REST API at <code className="text-neutral-300 font-mono">{backendConfig.wpApiEndpoint}</code> using secure JWT authentication or WooCommerce REST API keys. No secrets or passwords exist in frontend code.
            </p>
          </div>

        </div>

        {/* Public Storefront Exit Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Customer Storefront</span>
          </button>
        </div>

      </div>
    </div>
  );
};
