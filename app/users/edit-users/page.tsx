'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Validasi form menggunakan zod
const userSchema = z.object({
  firstname: z.string().min(1, 'Nama depan wajib diisi'),
  lastname: z.string().min(1, 'Nama belakang wajib diisi'),
  birthdate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  address: z.object({
    street: z.string().min(1, 'Jalan wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    province: z.string().min(1, 'Provinsi wajib diisi'),
    postal_code: z.string().min(1, 'Kode pos wajib diisi'),
  }),
});

// Komponen utama untuk membungkus form dengan Suspense (lazy loading)
export default function UserForm() {
  return (
    <Suspense fallback={<p>Loading form...</p>}>
      <UserFormContent />
    </Suspense>
  );
}

// Komponen form utama untuk mengedit user
function UserFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);

  // Mengambil ID user dari parameter URL jika tersedia
  useEffect(() => {
    setUserId(searchParams.get('id'));
  }, [searchParams]);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    birthdate: '',
    address: { street: '', city: '', province: '', postal_code: '' },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!userId);

  // Fetch data user jika userId tersedia
  useEffect(() => {
    if (userId) {
      async function fetchUser() {
        try {
          const res = await fetch(`/api/users?id=${userId}`);
          if (!res.ok) throw new Error('Gagal mengambil data');

          const { data } = await res.json();
          const user = data[0];

          setFormData({
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            birthdate: user.birthdate?.split('T')[0] || '',
            address: {
              street: user.street || '',
              city: user.city || '',
              province: user.province || '',
              postal_code: user.postal_code || '',
            },
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingData(false);
        }
      }

      fetchUser();
    }
  }, [userId]);

  // Handle perubahan input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Jika input terkait dengan alamat, update nested object `address`
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validasi form dengan zod
    const parsed = userSchema.safeParse(formData);
    if (!parsed.success) {
      // Format error menjadi object agar bisa ditampilkan di form
      const formattedErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        formattedErrors[err.path.join('.')] = err.message;
      });
      setErrors(formattedErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: userId }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan data');

      router.push('/users');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>

      {isLoadingData ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nama Depan</label>
            <Input name="firstname" value={formData.firstname} onChange={handleChange} />
            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
          </div>

          <div>
            <label>Nama Belakang</label>
            <Input name="lastname" value={formData.lastname} onChange={handleChange} />
            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
          </div>

          <div>
            <label>Tanggal Lahir</label>
            <Input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
          </div>

          <div>
            <h2 className="text-lg font-semibold">Alamat</h2>
            <label>Jalan</label>
            <Input name="address.street" value={formData.address.street} onChange={handleChange} />
            {errors['address.street'] && <p className="text-red-500 text-sm">{errors['address.street']}</p>}

            <label>Kota</label>
            <Input name="address.city" value={formData.address.city} onChange={handleChange} />
            {errors['address.city'] && <p className="text-red-500 text-sm">{errors['address.city']}</p>}

            <label>Provinsi</label>
            <Input name="address.province" value={formData.address.province} onChange={handleChange} />
            {errors['address.province'] && <p className="text-red-500 text-sm">{errors['address.province']}</p>}

            <label>Kode Pos</label>
            <Input name="address.postal_code" value={formData.address.postal_code} onChange={handleChange} />
            {errors['address.postal_code'] && <p className="text-red-500 text-sm">{errors['address.postal_code']}</p>}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      )}
    </div>
  );
}
