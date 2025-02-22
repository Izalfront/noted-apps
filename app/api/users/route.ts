import { NextResponse } from 'next/server';
import { db } from '@/drizzle/config';
import { users, addresses } from '@/drizzle/schema';
import { eq, like, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';
    const limit = 5;
    const offset = (page - 1) * limit;

    // Buat array filter
    const filters = [];
    if (userId) filters.push(eq(users.id, Number(userId)));
    if (search) filters.push(like(users.firstname, `%${search}%`));

    // `where()` hanya dipanggil jika ada filter
    const userData = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        birthdate: users.birthdate,
        street: addresses.street,
        city: addresses.city,
        province: addresses.province,
        postal_code: addresses.postal_code,
      })
      .from(users)
      .leftJoin(addresses, eq(users.id, addresses.user_id))
      .where(filters.length ? sql`${sql.join(filters, ' AND ')}` : undefined)
      .limit(limit)
      .offset(offset);

    // Hitung total users untuk pagination
    const totalUsers = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(filters.length ? sql`${sql.join(filters, ' AND ')}` : undefined);

    return NextResponse.json({
      data: userData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((totalUsers[0]?.count || 0) / limit),
        totalUsers: totalUsers[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// ✅ POST: Tambah User dengan Transaksi
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstname, lastname, birthdate, street, city, province, postal_code } = body;

    await db.insert(users).values({ firstname, lastname, birthdate });

    const [userIdRow] = await db.select({ userId: sql<number>`MAX(id)` }).from(users);
    const userId = userIdRow.userId;

    if (street || city || province || postal_code) {
      await db.insert(addresses).values({
        user_id: userId,
        street,
        city,
        province,
        postal_code,
      });
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ error: 'Gagal menambahkan user' }, { status: 500 });
  }
}

// ✅ PUT: Update User dengan Validasi & Transaksi
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, firstname, lastname, birthdate, address } = body;

    const existingUser = await db.select().from(users).where(eq(users.id, id));
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    await db.transaction(async (trx) => {
      await trx.update(users).set({ firstname, lastname, birthdate }).where(eq(users.id, id));

      if (address) {
        const existingAddress = await trx.select().from(addresses).where(eq(addresses.user_id, id));
        if (existingAddress.length > 0) {
          await trx.update(addresses).set(address).where(eq(addresses.user_id, id));
        } else {
          await trx.insert(addresses).values({ user_id: id, ...address });
        }
      }
    });

    return NextResponse.json({ message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Gagal memperbarui user' }, { status: 500 });
  }
}

// ✅ DELETE: Hapus User dengan Transaksi
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const userExists = await db.select().from(users).where(eq(users.id, id));
    if (userExists.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    await db.transaction(async (trx) => {
      await trx.delete(addresses).where(eq(addresses.user_id, id));
      await trx.delete(users).where(eq(users.id, id));
    });

    return NextResponse.json({ message: 'User dan alamat berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Gagal menghapus user' }, { status: 500 });
  }
}
