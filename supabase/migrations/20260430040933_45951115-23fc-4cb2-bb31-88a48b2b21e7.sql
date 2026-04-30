-- Fix touch_updated_at search_path
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict has_role execution: revoke from public/anon, allow authenticated only
revoke execute on function public.has_role(uuid, public.app_role) from public;
revoke execute on function public.has_role(uuid, public.app_role) from anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- Replace public-listing storage policy with admin-only listing.
-- Public reading via getPublicUrl still works without SELECT policy on objects.
drop policy if exists "Public can read project previews" on storage.objects;

create policy "Admins can list project previews"
  on storage.objects for select to authenticated
  using (bucket_id = 'project-previews' and public.has_role(auth.uid(), 'admin'));