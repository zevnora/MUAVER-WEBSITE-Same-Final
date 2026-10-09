import React, { useState } from 'react';
import { 
  Crown, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  UserPlus, 
  Mail, 
  ArrowRight, 
  ExternalLink, 
  Lock, 
  FileCheck, 
  Trash2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { addAdminUser } from '../services/storeService';

interface AdminHandoverGuideProps {
  currentUserEmail: string;
  onNavigateToAdmins: () => void;
}

export const AdminHandoverGuide: React.FC<AdminHandoverGuideProps> = ({
  currentUserEmail,
  onNavigateToAdmins,
}) => {
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleQuickAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorNotice('Please provide a valid client email address.');
      return;
    }

    setSubmitting(true);
    setErrorNotice(null);

    try {
      await addAdminUser(
        clientEmail.trim(),
        'owner',
        currentUserEmail,
        clientName.trim() || 'Client (Primary Owner)'
      );
      setSuccessNotice(`Client email "${clientEmail.toLowerCase().trim()}" has been successfully added as an Owner in Firestore!`);
      setClientEmail('');
      setClientName('');
    } catch (err: any) {
      console.error('Handover quick add error:', err);
      setErrorNotice(err.message || 'Failed to add client account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-montserrat">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--gold-500)]/20 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[var(--gold-300)]" />
            <h3 className="font-heading text-xl text-white font-bold tracking-wide">
              Ownership Handover Guide
            </h3>
          </div>
          <p className="text-xs text-white/60 mt-1 max-w-2xl">
            This guide provides the administrative handover procedure to transfer full platform ownership to your client and remove developer access securely.
          </p>
        </div>

        <button
          onClick={onNavigateToAdmins}
          className="px-4 py-2 rounded-lg border border-[var(--gold-500)]/40 bg-[var(--gold-500)]/10 text-[var(--gold-300)] hover:bg-[var(--gold-500)]/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <span>View Admins Roster</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action: Register Client as Owner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#081438] via-[#0A1A4F] to-[#081438] border border-[var(--gold-500)]/30 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--gold-500)]/20 border border-[var(--gold-500)]/40 text-[var(--gold-300)]">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading text-base font-bold text-white">
              Step 1 Quick Action: Register Client Email as Owner
            </h4>
            <p className="text-xs text-white/60">
              Grant immediate Owner credentials to your client’s personal or business email in the Firestore registry.
            </p>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {errorNotice && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3 animate-fade-in shadow-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorNotice}</span>
          </div>
        )}

        <form onSubmit={handleQuickAddClient} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6">
            <input
              type="email"
              required
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client.name@muaver.com or client.gmail@gmail.com"
              className="w-full bg-[#050F2E] border border-[var(--gold-500)]/30 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--gold-500)]"
            />
          </div>
          <div className="sm:col-span-3">
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client Name (Optional)"
              className="w-full bg-[#050F2E] border border-[var(--gold-500)]/30 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[var(--gold-500)]"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Add as Owner'}
            </button>
          </div>
        </form>
      </div>

      {/* 4-Step Handover Protocol Cards */}
      <div className="space-y-4">
        <h4 className="font-heading text-sm font-bold text-[var(--gold-300)] uppercase tracking-wider">
          Standard Handover Protocol Checklist
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-[#081438] border border-[var(--gold-500)]/20 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--gold-500)]/20 border border-[var(--gold-500)] flex items-center justify-center font-bold text-xs text-[var(--gold-300)] font-mono">
                1
              </div>
              <h5 className="font-heading text-sm font-bold text-white">
                Add Client Email as Owner
              </h5>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Use the form above or the <strong>Admins</strong> tab to register the client’s exact email address with the <strong>Owner</strong> role. This creates an authorization document in the <code className="text-[var(--gold-300)] font-mono bg-white/5 px-1 rounded">admins</code> collection in Firestore.
            </p>
            <div className="p-2.5 rounded-lg bg-[#050F2E] border border-white/10 text-[11px] text-white/50 font-mono">
              admins/{'{client_email}'} → role: "owner"
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-[#081438] border border-[var(--gold-500)]/20 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--gold-500)]/20 border border-[var(--gold-500)] flex items-center justify-center font-bold text-xs text-[var(--gold-300)] font-mono">
                2
              </div>
              <h5 className="font-heading text-sm font-bold text-white">
                Client Signs In to /adminAUHS
              </h5>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Direct the client to navigate to <code className="text-[var(--gold-300)] font-mono bg-white/5 px-1 rounded">/adminAUHS</code>. They can sign in with Google or create an account with email & password. Because their email is in the <code className="text-[var(--gold-300)] font-mono bg-white/5 px-1 rounded">admins</code> collection, they enter immediately with full Owner privileges.
            </p>
            <div className="p-2.5 rounded-lg bg-[#050F2E] border border-white/10 text-[11px] text-white/50 font-mono">
              Unlisted emails are blocked by UI and Firestore rules.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-[#081438] border border-[var(--gold-500)]/20 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--gold-500)]/20 border border-[var(--gold-500)] flex items-center justify-center font-bold text-xs text-[var(--gold-300)] font-mono">
                3
              </div>
              <h5 className="font-heading text-sm font-bold text-white">
                Client Deletes Developer Account
              </h5>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Once the client is logged in and verifies their Owner badge, they open the <strong>Admins</strong> tab and click the red trash can icon next to the developer's email (<span className="text-[var(--gold-300)] font-mono">{currentUserEmail}</span>). This deletes the developer record from Firestore instantly.
            </p>
            <div className="p-2.5 rounded-lg bg-[#050F2E] border border-white/10 text-[11px] text-white/50 font-mono">
              Revocation is immediate — developer can no longer enter.
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-[#081438] border border-[var(--gold-500)]/20 space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--gold-500)]/20 border border-[var(--gold-500)] flex items-center justify-center font-bold text-xs text-[var(--gold-300)] font-mono">
                4
              </div>
              <h5 className="font-heading text-sm font-bold text-white">
                Built-In Protection Against Lockout
              </h5>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              The system features a fail-safe safeguard: neither the client nor the developer can delete or demote the last remaining Owner. There must always be at least one Owner active, guaranteeing the client will never accidentally lock themselves out of their store.
            </p>
            <div className="p-2.5 rounded-lg bg-[#050F2E] border border-white/10 text-[11px] text-white/50 font-mono">
              Enforced by: storeService.ts & Firestore security rules.
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture Audit Note */}
      <div className="p-6 rounded-2xl bg-[#081438] border border-white/10 space-y-3 text-xs">
        <h4 className="font-heading text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security & Zero Hardcoded Email Verification</span>
        </h4>
        <ul className="space-y-2 text-white/70">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Hardcoded Emails:</strong> No admin email is hardcoded anywhere in the React codebase or in <code className="text-white font-mono bg-white/5 px-1 rounded">firestore.rules</code>. Access is strictly query-driven against the dynamic <code className="text-white font-mono bg-white/5 px-1 rounded">admins</code> collection.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Database-Level Enforcement:</strong> Firestore security rules reject writes to settings, products, orders, and banners unless the caller’s authenticated token email exists as an active record in <code className="text-white font-mono bg-white/5 px-1 rounded">/admins/{'{email}'}</code>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Fresh Setup Auto-Bootstrap:</strong> When deploying to a brand-new Firebase instance, the very first user who logs in is automatically granted the primary Owner role and locks initial bootstrap security.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
