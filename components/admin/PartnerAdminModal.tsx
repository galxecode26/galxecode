"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, ExternalLink, ShieldCheck, Edit2, Handshake } from "lucide-react";
import { ConnectedPartner, INITIAL_PARTNERS } from "../partnerData";

interface PartnerAdminModalProps {
  onClose: () => void;
  onPartnersUpdated?: () => void;
}

export default function PartnerAdminModal({ onClose, onPartnersUpdated }: PartnerAdminModalProps) {
  const [partners, setPartners] = useState<ConnectedPartner[]>(INITIAL_PARTNERS);
  const [editingPartner, setEditingPartner] = useState<ConnectedPartner | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [logoSrc, setLogoSrc] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [badgeColor, setBadgeColor] = useState<ConnectedPartner["badgeColor"]>("purple");
  const [error, setError] = useState("");

  // Load custom partners
  const loadAllPartners = () => {
    try {
      const saved = localStorage.getItem("galxecode_custom_partners");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPartners([...INITIAL_PARTNERS, ...parsed]);
          return;
        }
      }
    } catch {
      // ignore
    }
    setPartners(INITIAL_PARTNERS);
  };

  useEffect(() => {
    loadAllPartners();
  }, []);

  const saveCustomPartnersToStorage = (allPartners: ConnectedPartner[]) => {
    try {
      const customOnly = allPartners.filter(
        (p) => !INITIAL_PARTNERS.some((init) => init.id === p.id)
      );
      localStorage.setItem("galxecode_custom_partners", JSON.stringify(customOnly));
      if (onPartnersUpdated) onPartnersUpdated();
    } catch {
      // ignore
    }
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Partner organization name is required.");
      return;
    }
    if (!role.trim()) {
      setError("Partnership role is required.");
      return;
    }
    if (!logoSrc.trim()) {
      setError("Logo image URL or file path is required.");
      return;
    }

    let updated: ConnectedPartner[];

    if (editingPartner) {
      // Edit existing
      updated = partners.map((p) =>
        p.id === editingPartner.id
          ? {
              ...p,
              name: name.trim(),
              role: role.trim(),
              logoSrc: logoSrc.trim(),
              websiteUrl: websiteUrl.trim() || undefined,
              description: description.trim() || undefined,
              badgeColor,
            }
          : p
      );
    } else {
      // Create new
      const newPartner: ConnectedPartner = {
        id: `partner-${Date.now()}`,
        name: name.trim(),
        role: role.trim(),
        logoSrc: logoSrc.trim(),
        websiteUrl: websiteUrl.trim() || undefined,
        description: description.trim() || undefined,
        badgeColor,
      };
      updated = [...partners, newPartner];
    }

    setPartners(updated);
    saveCustomPartnersToStorage(updated);

    // Reset form
    resetForm();
  };

  const startEdit = (partner: ConnectedPartner) => {
    setEditingPartner(partner);
    setName(partner.name);
    setRole(partner.role);
    setLogoSrc(partner.logoSrc);
    setWebsiteUrl(partner.websiteUrl || "");
    setDescription(partner.description || "");
    setBadgeColor(partner.badgeColor || "purple");
    setError("");
  };

  const handleDeletePartner = (id: string) => {
    const updated = partners.filter((p) => p.id !== id);
    setPartners(updated);
    saveCustomPartnersToStorage(updated);
    if (editingPartner?.id === id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setEditingPartner(null);
    setName("");
    setRole("");
    setLogoSrc("");
    setWebsiteUrl("");
    setDescription("");
    setBadgeColor("purple");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#0c0814] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Handshake size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Secure Partner Management</h3>
              <p className="text-xs text-zinc-400">Add, edit, or remove connected partners and their roles.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
            <h4 className="text-sm font-semibold text-purple-300 mb-4 flex items-center gap-2">
              {editingPartner ? <Edit2 size={14} /> : <Plus size={14} />}
              {editingPartner ? "Edit Partner" : "Add New Partner"}
            </h4>

            <form onSubmit={handleSavePartner} className="space-y-3.5">
              {error && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Partnership Role *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Title Partner, Technology Sponsor, AI Partner"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Logo Image URL or Path *
                </label>
                <input
                  type="text"
                  placeholder="e.g. /my-logo.png or https://site.com/logo.png"
                  value={logoSrc}
                  onChange={(e) => setLogoSrc(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Badge Color
                </label>
                <select
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value as ConnectedPartner["badgeColor"])}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                >
                  <option value="purple" className="bg-zinc-900">Purple</option>
                  <option value="emerald" className="bg-zinc-900">Emerald Green</option>
                  <option value="cyan" className="bg-zinc-900">Cyan Blue</option>
                  <option value="indigo" className="bg-zinc-900">Indigo</option>
                  <option value="amber" className="bg-zinc-900">Amber Gold</option>
                  <option value="rose" className="bg-zinc-900">Rose Red</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of partner role or contribution"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                {editingPartner && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
                >
                  {editingPartner ? "Update Partner" : "Add Partner"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Existing Partners List */}
          <div className="lg:col-span-7 flex flex-col">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center justify-between">
              <span>Current Connected Partners ({partners.length})</span>
              <span className="text-[10px] text-zinc-500 font-mono">Live on website</span>
            </h4>

            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-lg border border-white/10 bg-black p-1 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logoSrc} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 shrink-0">
                          {p.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">{p.logoSrc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <button
                      onClick={() => startEdit(p)}
                      title="Edit partner"
                      className="p-1.5 rounded-md text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeletePartner(p.id)}
                      title="Delete partner"
                      className="p-1.5 rounded-md text-zinc-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
