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
      <header className="border-b border-white/10 pb-10">
        <h1 className="text-5xl md:text-7xl font-black text-red-600 uppercase tracking-tighter italic leading-none">Gestión de Tienda</h1>
        <p className="text-gray-400 mt-4 text-sm font-black uppercase tracking-[0.2em]">Informes de ventas y catálogo de productos institucionales.</p>
      </header>

      {/* ── Dashboard de Ventas ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/10 p-8 hover:bg-white/5 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-black text-xs uppercase tracking-[0.2em]">Ingresos Totales</p>
              <h3 className="text-5xl font-black text-white mt-4 group-hover:text-red-600 transition-colors leading-none">{totalRevenue.toFixed(2)} €</h3>
            </div>
            <DollarSign className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
          </div>
        </div>

        <div className="border border-white/10 p-8 hover:bg-white/5 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-black text-xs uppercase tracking-[0.2em]">Pedidos Pagados</p>
              <h3 className="text-5xl font-black text-white mt-4 group-hover:text-red-600 transition-colors leading-none">{paidOrdersN}</h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
          </div>
        </div>

        <div className="border border-white/10 p-8 hover:bg-white/5 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-black text-xs uppercase tracking-[0.2em]">Pedidos Pendientes</p>
              <h3 className="text-5xl font-black text-white mt-4 group-hover:text-red-600 transition-colors leading-none">{pendingOrdersN}</h3>
            </div>
            <Clock className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      <StoreControls />

      {/* ── Gestión de Productos ── */}
      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4 italic">
            <Package className="text-red-600 w-6 h-6" strokeWidth={1.5} /> CATÁLOGO
          </h2>
        </div>

        <ProductForm />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map(p => (
            <div key={p.id} className="border border-white/10 p-8 flex flex-col sm:flex-row gap-8 group hover:bg-white/5 transition-all">
              <div className="w-32 h-32 overflow-hidden shrink-0 bg-black shadow-xl border border-white/10">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 bg-red-600/10 text-[9px] font-black uppercase tracking-widest text-red-600 mb-2 border border-red-600/20">
                      {p.category}
                    </span>
                    <h4 className="font-black text-2xl text-white uppercase tracking-tighter">{p.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-red-600 italic leading-none">{p.price.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span className="flex items-center gap-2"><Tag size={14} className="text-red-600" /> {p.sizes || 'TALLA ÚNICA'}</span>
                  <span className={`flex items-center gap-2 ${p.active ? 'text-green-500' : 'text-red-600/50'}`}>
                    {p.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {p.active ? 'ACTIVO' : 'PAUSADO'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
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
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4 italic border-b border-white/10 pb-4">
          <TrendingUp className="text-red-600 w-6 h-6" strokeWidth={1.5} /> INFORME DE VENTAS
        </h2>

        <div className="border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 border-b border-white/10">
                <th className="px-8 py-6">Referencia</th>
                <th className="px-8 py-6">Producto</th>
                <th className="px-8 py-6 text-center">Detalle</th>
                <th className="px-8 py-6 text-right">Importe</th>
                <th className="px-8 py-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-white font-black text-xs uppercase tracking-tight">{order.checkoutReference || '---'}</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-white font-bold italic uppercase tracking-tight">{order.product.name}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">{order.size || '--'}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-white font-black text-lg italic">{order.amount.toFixed(2)} €</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <span className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border ${
                       order.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                       order.status === 'FAILED' ? 'bg-red-600/10 text-red-600 border-red-600/30' :
                       'bg-transparent text-gray-400 border-white/10'
                     }`}>
                       {order.status === 'PAID' ? 'PAGADO' : order.status === 'PENDING' ? 'PENDIENTE' : 'FALLIDO'}
                     </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-black uppercase tracking-[0.2em] text-xs">Sin actividad registrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
