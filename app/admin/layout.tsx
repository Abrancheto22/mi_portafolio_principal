import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React from 'react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/');
  }
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <Navbar user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto bg-gradient-to-br from-white to-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}