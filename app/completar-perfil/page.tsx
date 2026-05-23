import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CompletarPerfilClient from './CompletarPerfilClient';

export default async function CompletarPerfilPage() {
  const session = await getUserSession();
  
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  return (
    <CompletarPerfilClient 
      membershipPrice={user?.membershipPrice ?? null}
      membershipPaymentStatus={user?.membershipPaymentStatus ?? null}
    />
  );
}
