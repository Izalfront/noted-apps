'use client';

import { Button } from '@/components/ui/button';

{
  /* Fungsi delete di komponen tombol delete */
}
export default function DeleteButton({ id }: { id: number }) {
  const deleteUser = async () => {
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus user ini?');
    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menghapus user');
      }

      alert('User berhasil dihapus');
      window.location.reload();
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <Button onClick={deleteUser} variant="destructive">
      Hapus
    </Button>
  );
}
