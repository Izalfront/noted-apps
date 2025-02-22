'use client';

import { useState, useEffect, Suspense } from 'react';
import DeleteButton from '@/components/DeleteButton';
import UserForm from '@/components/form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  street?: string;
  city?: string;
  province?: string;
  postal_code?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  // Fungsi untuk pagination dan search
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`/api/users?page=${page}&search=${search}`);
        const data = await res.json();
        setUsers(data.data || []);
        setTotalPages(data.pagination.totalPages || 1);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    }
    fetchUsers();
  }, [page, search]);

  return (
    // Komponen utama untuk membungkus form dengan Suspense (lazy loading)
    <div className="p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <UserForm />
      </Suspense>

      <h1 className="text-2xl font-bold mb-4">Daftar User</h1>

      {/* Fitur Pencarian */}
      <input type="text" placeholder="Cari berdasarkan nama..." className="p-2 border rounded mb-4 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nama</th>
            <th className="p-2">Tanggal Lahir</th>
            <th className="p-2">Alamat</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        {/* Menampilkan Data */}
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2">
                  {user.firstname} {user.lastname}
                </td>
                <td className="p-2">{new Date(user.birthdate).toLocaleDateString()}</td>
                <td className="p-2">{user.street || user.city || user.province ? `${user.street || ''}, ${user.city || ''}, ${user.province || ''}, ${user.postal_code || ''}` : user.postal_code || 'Tidak ada alamat'}</td>

                <td className="p-2 flex space-x-5">
                  <Button>
                    <Link href={`/users/edit-users?id=${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteButton id={user.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Kontrol Paginasi */}
      <div className="flex justify-between items-center mt-4">
        <Button disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </Button>
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <Button disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
          Next
        </Button>
      </div>
    </div>
  );
}
