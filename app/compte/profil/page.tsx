import { createClient } from "@/lib/supabase/server";
import { SectionCard } from "@/components/dashboard/EmptyState";
import { ProfileForm } from "@/components/forms/ProfileForm";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user!.id)
    .single();

  return (
    <SectionCard title="Mon profil">
      <ProfileForm
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
        email={user!.email ?? ""}
      />
    </SectionCard>
  );
}
