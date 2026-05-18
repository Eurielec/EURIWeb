import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { ShoppingBag, TrendingUp, DollarSign, Package, Tag, CheckCircle2, XCircle, Clock } from 'lucide-react';
import ProductForm from './ProductForm';
import { redirect } from 'next/navigation';
import { ToggleStatusButton, DeleteProductButton } from './ClientComponents';
import StoreControls from './StoreControls';
import StockManager from './StockManager';

export default async function AdminTiendaPage() {
  const session = await getUserSession();
  const isAdmin = session?.role === 'ADMIN';
  const isVocalSudaderas = session?.role === 'VOCAL' && session?.vocalia === 'sudaderas';

  if (!isAdmin && !isVocalSudaderas) {
    redirect('/admin');
  }

  // Obtener datos
  const products = await prisma.shopProduct.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const orders = await prisma.shopOrder.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  // Estadísticas
  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + o.amount, 0);
  
  const paidOrdersN = orders.filter(o => o.status === 'PAID').length;
  const pendingOrdersN = orders.filter(o => o.status === 'PENDING').length;

  return (
    <div className="space-y-12 pb-20 font-sans">
      <header>
        <h1 className="text-5xl font-black mb-2 uppercase tracking-tighter text-red-600 italic">Gestión de Tienda</h1>
        <p className="text-gray-400 font-medium text-lg">Informes de ventas y catálogo de productos institucionales.</p>
        <div className="w-20 h-1 bg-red-600 mt-6" />
      </header>

      {/* ── Dashboard de Ventas ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Ingresos Totales</p>
              <h3 className="text-4xl font-black text-white mt-4">{totalRevenue.toFixed(2)} €</h3>
            </div>
            <div className="p-3.5 bg-red-600/10 rounded-2xl">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Pedidos Pagados</p>
              <h3 className="text-4xl font-black text-white mt-4">{paidOrdersN}</h3>
            </div>
            <div className="p-3.5 bg-red-600/10 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-black text-[10px] uppercase tracking-widest">Pedidos Pendientes</p>
              <h3 className="text-4xl font-black text-white mt-4">{pendingOrdersN}</h3>
            </div>
            <div className="p-3.5 bg-red-600/10 rounded-2xl">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </section>

      <StoreControls />

      {/* ── Gestión de Productos ── */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 italic">
            <Package className="text-red-600 w-6 h-6" /> Catálogo
          </h2>
        </div>

        <ProductForm />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-8 flex gap-8 group hover:border-red-600/30 transition-all backdrop-blur-md">
              <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 bg-black/60 shadow-xl">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-red-600/10 text-[9px] font-black uppercase tracking-widest text-red-600 mb-2 border border-red-600/20">
                      {p.category}
                    </span>
                    <h4 className="font-black text-xl text-white uppercase tracking-tight">{p.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-red-600 italic leading-none">{p.price.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span className="flex items-center gap-1.5"><Tag size={12} className="text-red-600" /> {p.sizes || 'Talla única'}</span>
                  <span className={`flex items-center gap-1.5 ${p.active ? 'text-green-500' : 'text-red-600/50'}`}>
                    {p.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {p.active ? 'Activo' : 'Pausado'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <ToggleStatusButton id={p.id} active={p.active} />
                  <StockManager productId={p.id} productName={p.name} category={p.category} />
                  <DeleteProductButton id={p.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Listado de Pedidos ── */}
      <section className="space-y-10 pt-10">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 italic border-b border-white/10 pb-4">
          <TrendingUp className="text-red-600 w-6 h-6" /> Informe de Ventas
        </h2>

        <div className="bg-neutral-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-[10px] uppercase font-black tracking-widest text-gray-600 italic">
                <th className="px-8 py-5 text-red-600">Referencia</th>
                <th className="px-8 py-5">Producto</th>
                <th className="px-8 py-5 text-center">Detalle</th>
                <th className="px-8 py-5 text-right">Importe</th>
                <th className="px-8 py-5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-white font-black text-xs uppercase tracking-tight">{order.checkoutReference || '---'}</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-white font-bold italic uppercase tracking-tight">{order.product.name}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-gray-500 font-black text-[10px] uppercase tracking-widest">{order.size || '--'}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-white font-black text-lg italic">{order.amount.toFixed(2)} €</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                       order.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                       order.status === 'FAILED' ? 'bg-red-600/10 text-red-600 border-red-600/20' :
                       'bg-white/5 text-gray-400 border-white/10'
                     }`}>
                       {order.status === 'PAID' ? 'Pagado' : order.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
                     </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-600 font-black uppercase tracking-[0.2em] italic opacity-40">Sin actividad registrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
