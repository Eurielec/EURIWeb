'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { geocodeCity } from '@/lib/geocode';

export async function toggleRoleAction(userId: string) {
  const session = await getUserSession();
  
  // Seguridad Estricta
  if (!session || session.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  // Prevenir que un admin se quite el rol a sí mismo
  if (session.userId === userId) {
    throw new Error('No puedes cambiar tu propio rol');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuario no encontrado');

  let newRole: 'GUEST' | 'USER' | 'ALUMNI' | 'VOCAL' | 'ADMIN' = 'USER';
  if (user.role === 'GUEST') newRole = 'USER';
  else if (user.role === 'USER') newRole = 'VOCAL';
  else if (user.role === 'VOCAL') newRole = 'ADMIN';
  else if (user.role === 'ADMIN') newRole = 'USER';

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath('/admin/users');
}

export async function deleteUserAction(userId: string) {
  const session = await getUserSession();
  
  if (!session || session.role !== 'ADMIN') {
    throw new Error('No autorizado');
  }

  if (session.userId === userId) {
    throw new Error('No puedes eliminarte a ti mismo');
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath('/admin/users');
}

import { UserEditSchema, UserCreateSchema } from '@/lib/schemas';

export async function updateUserAction(userId: string, formData: FormData) {
  const session = await getUserSession();
  
  // Security check: must be logged in, and must be ADMIN or the owner of the profile
  if (!session || (session.role !== 'ADMIN' && session.userId !== userId)) {
    return { error: 'No autorizado para editar este perfil.' };
  }

  // Pre-procesar provincia
  const provinceSelect = formData.get('province_select') as string;
  const provinceCustom = formData.get('province_custom') as string;
  const resolvedProvince = (provinceSelect === 'Otro' ? provinceCustom : provinceSelect) || (formData.get('province') as string);
  
  const rawData: Record<string, any> = Object.fromEntries(formData.entries());
  // Sobrescribir provincia con la resuelta
  rawData.province = resolvedProvince;
  // Convertir hasCar a boolean
  if (formData.has('hasCar')) {
    rawData.hasCar = formData.get('hasCar') === 'true';
  }

  const result = UserEditSchema.partial().safeParse(rawData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const validatedData = result.data;

  try {
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) return { error: 'Usuario no encontrado.' };

    let geo = { latitude: currentUser.latitude, longitude: currentUser.longitude };

    // Solo volver a geolocalizar si cambió la ciudad o la provincia
    if (validatedData.city !== currentUser.city || validatedData.province !== currentUser.province) {
      const resultGeo = await geocodeCity(validatedData.city, validatedData.province);
      if (resultGeo) {
        geo = resultGeo;
      }
    }

    const dataToUpdate: any = {};
    if (validatedData.name !== undefined) dataToUpdate.name = validatedData.name;
    if (validatedData.phone !== undefined) dataToUpdate.phone = validatedData.phone;
    if (validatedData.address !== undefined) dataToUpdate.address = validatedData.address;
    if (validatedData.city !== undefined) dataToUpdate.city = validatedData.city;
    if (validatedData.province !== undefined) dataToUpdate.province = validatedData.province;
    if (validatedData.zipCode !== undefined) dataToUpdate.zipCode = validatedData.zipCode;
    if (validatedData.university !== undefined) dataToUpdate.university = validatedData.university;
    if (validatedData.academicYear !== undefined) dataToUpdate.academicYear = validatedData.academicYear;
    
    if (geo.latitude !== currentUser.latitude || geo.longitude !== currentUser.longitude) {
       dataToUpdate.latitude = geo.latitude;
       dataToUpdate.longitude = geo.longitude;
    }

    if (validatedData.dietary !== undefined) dataToUpdate.dietary = validatedData.dietary;
    if (validatedData.allergies !== undefined) dataToUpdate.allergies = validatedData.allergies;
    if (validatedData.alcohol !== undefined) dataToUpdate.alcohol = validatedData.alcohol;
    if (validatedData.tShirtSize !== undefined) dataToUpdate.tShirtSize = validatedData.tShirtSize;
    if (validatedData.hasCar !== undefined) dataToUpdate.hasCar = validatedData.hasCar;

    if (session.role === 'ADMIN') {
      if (validatedData.email) dataToUpdate.email = validatedData.email;
      if (validatedData.role) {
        dataToUpdate.role = validatedData.role;
        dataToUpdate.vocalia = (validatedData.role === 'VOCAL' && validatedData.vocalia) ? validatedData.vocalia : null;
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate
    });

    revalidatePath('/admin/users');
    revalidatePath('/perfil');
    revalidatePath('/conocenos');
    
    return { success: true };
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return { error: 'Error del servidor al actualizar el usuario.' };
  }
}

export async function createUserAction(formData: FormData) {
  const session = await getUserSession();
  
  if (!session || session.role !== 'ADMIN') {
    return { error: 'No autorizado para crear usuarios.' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const result = UserCreateSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const validatedData = result.data;

  try {
    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({ where: { email: validatedData.email } });
    if (existing) return { error: 'Este correo electrónico ya está registrado.' };

    let geo = await geocodeCity(validatedData.city, validatedData.province);
    
    // Si falla la geocodificación de Ciudad + Provincia, intentamos solo la Provincia
    if (!geo && validatedData.province) {
      geo = await geocodeCity('', validatedData.province);
    }

    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        province: validatedData.province,
        zipCode: validatedData.zipCode,
        university: validatedData.university || 'UPM',
        academicYear: validatedData.academicYear || '1',
        role: validatedData.role || 'USER',
        vocalia: (validatedData.role === 'VOCAL' && validatedData.vocalia) ? validatedData.vocalia : null,
        latitude: geo?.latitude || null,
        longitude: geo?.longitude || null
      }
    });

    revalidatePath('/admin/users');
    revalidatePath('/conocenos');
    
    return { success: true };
  } catch (error) {
    console.error('Error creando usuario:', error);
    return { error: 'Error del servidor al crear el usuario.' };
  }
}
