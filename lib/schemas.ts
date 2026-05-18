import { z } from 'zod';

// Schema para el Login
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Schema para el Registro
export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "El nombre es demasiado corto" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  phone: z.string().min(9, { message: "Teléfono inválido" }),
  address: z.string().min(5, { message: "Dirección insuficiente" }),
  city: z.string().min(2, { message: "Ciudad inválida" }),
  province: z.string().min(2, { message: "Provincia inválida" }),
  zipCode: z.string().min(5, { message: "Código postal inválido" }),
  university: z.string().min(2, { message: "Universidad inválida" }),
  academicYear: z.string().min(1, { message: "Año académico inválido" }),
});

// Schema para completar el perfil
export const CompleteProfileSchema = z.object({
  phone: z.string().min(9, { message: "Teléfono inválido" }),
  address: z.string().min(5, { message: "Dirección insuficiente" }),
  city: z.string().min(2, { message: "Ciudad inválida" }),
  province: z.string().min(2, { message: "Provincia inválida" }),
  zipCode: z.string().min(5, { message: "Código postal inválido" }),
  university: z.string().min(2, { message: "Universidad inválida" }),
  academicYear: z.string().min(1, { message: "Año académico inválido" }),
});

// Schema para la creación de usuarios (Admin)
export const UserCreateSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  address: z.string().min(5, "Dirección insuficiente"),
  city: z.string().min(2, "Ciudad inválida"),
  province: z.string().min(2, "Provincia inválida"),
  zipCode: z.string().min(5, "Código postal inválido"),
  university: z.string().optional(),
  academicYear: z.string().optional(),
  role: z.enum(['GUEST', 'USER', 'ALUMNI', 'VOCAL', 'ADMIN']).default('USER'),
  vocalia: z.string().nullable().optional(),
});

// Schema para la edición de usuarios (Admin/User)
export const UserEditSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().min(9, "Teléfono inválido"),
  address: z.string().min(5, "Dirección insuficiente"),
  city: z.string().min(2, "Ciudad inválida"),
  province: z.string().min(2, "Provincia inválida"),
  zipCode: z.string().min(5, "Código postal inválido"),
  university: z.string().min(2, "Universidad inválida"),
  academicYear: z.string().min(1, "Año académico inválido"),
  role: z.enum(['GUEST', 'USER', 'ALUMNI', 'VOCAL', 'ADMIN']).optional(),
  vocalia: z.string().nullable().optional(),
  dietary: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  alcohol: z.string().nullable().optional(),
  tShirtSize: z.string().nullable().optional(),
  hasCar: z.boolean().optional(),
});
