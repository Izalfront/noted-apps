'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Skema Validasi Zod
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
{
  /* Form Tambah Data User */
}
export default function UserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    birthdate: '',
    address: { street: '', city: '', province: '', postal_code: '' },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validasi dengan Zod
    const parsed = userSchema.safeParse(formData);
    if (!parsed.success) {
      const formattedErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        formattedErrors[err.path.join('.')] = err.message;
      });
      setErrors(formattedErrors);
      setLoading(false);
      return;
    }

    // Format ulang data agar sesuai dengan backend
    const formattedData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      birthdate: formData.birthdate,
      ...formData.address,
    };

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menambahkan user');
      }

      alert('User berhasil ditambahkan!');
      router.push('/users');
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tambah User</h1>

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
          <h2 className="text-lg font-semibold mt-9">Alamat:</h2>
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
          {loading ? 'Menyimpan...' : 'Tambah User'}
        </Button>
      </form>
    </div>
  );
}
