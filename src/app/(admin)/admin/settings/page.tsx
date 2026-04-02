"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings state
  const [orgName, setOrgName] = useState("A New Day Foundation");
  const [orgEmail, setOrgEmail] = useState("info@anewdayfoundation.net");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("Los Angeles, California");
  const [orgAbout, setOrgAbout] = useState("Empowering tomorrow's leaders through innovative programs, mentorship, and community engagement.");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("20000");
  const [defaultAmounts, setDefaultAmounts] = useState("25, 50, 100, 250, 500, 1000");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const s = data.settings || {};
        if (s.org_name) setOrgName(s.org_name);
        if (s.org_email) setOrgEmail(s.org_email);
        if (s.org_phone) setOrgPhone(s.org_phone);
        if (s.org_address) setOrgAddress(s.org_address);
        if (s.org_about) setOrgAbout(s.org_about);
        if (s.facebook_url) setFacebook(s.facebook_url);
        if (s.youtube_url) setYoutube(s.youtube_url);
        if (s.instagram_url) setInstagram(s.instagram_url);
        if (s.twitter_url) setTwitter(s.twitter_url);
        if (s.monthly_donation_goal) setMonthlyGoal(s.monthly_donation_goal);
        if (s.default_donation_amounts) setDefaultAmounts(s.default_donation_amounts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_name: orgName,
          org_email: orgEmail,
          org_phone: orgPhone,
          org_address: orgAddress,
          org_about: orgAbout,
          facebook_url: facebook,
          youtube_url: youtube,
          instagram_url: instagram,
          twitter_url: twitter,
          monthly_donation_goal: monthlyGoal,
          default_donation_amounts: defaultAmounts,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      alert("Settings saved successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-foreground-muted mt-1">Manage site configuration</p>
      </div>

      <Card hover={false}>
        <CardHeader><CardTitle>Organization Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input id="orgName" label="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          <Input id="orgEmail" label="Contact Email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} />
          <Input id="orgPhone" label="Phone Number" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} />
          <Input id="orgAddress" label="Address" value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} />
          <Textarea id="orgAbout" label="About (Short)" value={orgAbout} onChange={(e) => setOrgAbout(e.target.value)} />
        </CardContent>
      </Card>

      <Card hover={false}>
        <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input id="facebook" label="Facebook URL" placeholder="https://facebook.com/..." value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          <Input id="youtube" label="YouTube URL" placeholder="https://youtube.com/..." value={youtube} onChange={(e) => setYoutube(e.target.value)} />
          <Input id="instagram" label="Instagram URL" placeholder="https://instagram.com/..." value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          <Input id="twitter" label="X (Twitter) URL" placeholder="https://x.com/..." value={twitter} onChange={(e) => setTwitter(e.target.value)} />
        </CardContent>
      </Card>

      <Card hover={false}>
        <CardHeader><CardTitle>Donation Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input id="monthlyGoal" label="Monthly Donation Goal ($)" type="number" value={monthlyGoal} onChange={(e) => setMonthlyGoal(e.target.value)} />
          <Input id="defaultAmounts" label="Preset Donation Amounts (comma-separated)" value={defaultAmounts} onChange={(e) => setDefaultAmounts(e.target.value)} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
