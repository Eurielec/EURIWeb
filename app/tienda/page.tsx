'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';
import { useState, useRef, useCallback, useEffect } from 'react';
import { X, ShoppingBag, CreditCard, Loader2, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import { createSumUpCheckout, verifyAndCompleteOrder } from '@/app/actions/checkout';
import { getActiveProducts } from '@/app/actions/shop';
import { useSearchParams } from 'next/navigation';

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string;
  sizes: string | null;
  variants: Variant[];
}

type OpenCategory = 'hoodies' | 'merch' | null;
type PaymentState = 'idle' | 'loading' | 'widget' | 'success' | 'error';

export default function TiendaPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [shopSettings, setShopSettings] = useState<Record<string, string>>({});
  const [openCategory, setOpenCategory] = useState<OpenCategory>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [payingProduct, setPayingProduct] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Check for successful payment redirect
  const paymentSuccess = searchParams.get('payment') === 'success';
  const orderRef = searchParams.get('ref');

  useEffect(() => {
    // Cargar productos y configuración
    async function loadData() {
      const [prodData, settingsData] = await Promise.all([
        getActiveProducts(),
        import('@/app/actions/shop').then(m => m.getShopSettings())
      ]);
      setProducts(prodData);
      setShopSettings(settingsData);
    }
    loadData();

    // Completar pedido si venimos de SumUp
    if (paymentSuccess && orderRef) {
      verifyAndCompleteOrder(orderRef);
    }
  }, [paymentSuccess, orderRef]);

  const selectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const selectColor = (productId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const loadSumUpScript = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).SumUpCard) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }, []);

  const handlePayment = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    const size = selectedSizes[productId];
    const color = selectedColors[productId];

    // Verificar si el producto requiere talla o color
    const needsSize = product?.variants.some(v => v.size);
    const needsColor = product?.variants.some(v => v.color);

    if (needsSize && !size) {
      setPaymentError('Es obligatorio seleccionar una talla');
      setPayingProduct(productId);
      setPaymentState('error');
      setTimeout(() => { if (payingProduct === productId) setPaymentState('idle'); }, 3000);
      return;
    }

    if (needsColor && !color) {
      setPaymentError('Es obligatorio seleccionar un color');
      setPayingProduct(productId);
      setPaymentState('error');
      setTimeout(() => { if (payingProduct === productId) setPaymentState('idle'); }, 3000);
      return;
    }

    setPaymentState('loading');
    setPayingProduct(productId);
    setPaymentError('');

    const result = await createSumUpCheckout(productId, size, selectedColors[productId]);

    if (!result.success || !result.checkoutId) {
      setPaymentError(result.error || 'Error desconocido');
      setPaymentState('error');
      setTimeout(() => { setPaymentState('idle'); setPayingProduct(null); }, 4000);
      return;
    }

    await loadSumUpScript();
    setPaymentState('widget');

    setTimeout(() => {
      if (widgetRef.current && (window as unknown as Record<string, unknown>).SumUpCard) {
        widgetRef.current.innerHTML = '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).SumUpCard as any).mount({
          id: 'sumup-card-widget',
          checkoutId: result.checkoutId,
          onResponse: (type: string, body: { message?: string }) => {
            if (type === 'success') {
              setPaymentState('success');
              setTimeout(() => { setPaymentState('idle'); setPayingProduct(null); }, 5000);
            } else if (type === 'error') {
              setPaymentError(body?.message || 'Error en el pago');
              setPaymentState('error');
              setTimeout(() => { setPaymentState('idle'); setPayingProduct(null); }, 4000);
            }
          },
        });
      }
    }, 100);
  };

  const categories = [
    {
      id: 'hoodies' as const,
      title: t.shop.categories.hoodies,
      desc: t.shop.categories.hoodiesDesc,
      img: '/tienda/hoodie-capucha.png',
      isClosed: shopSettings['hoodies_status'] === 'closed',
      action: () => {
        if (shopSettings['hoodies_status'] === 'closed') {
          alert('Próxima venta próximamente');
          return;
        }
        setOpenCategory('hoodies');
      },
    },
    {
      id: 'lollipops' as const,
      title: t.shop.categories.lollipops,
      desc: t.shop.categories.lollipopsDesc,
      img: '/tienda/stickers.png',
      isClosed: false,
      action: () => window.open('https://sanvalentin.eurielec.etsit.upm.es/', '_blank'),
    },
    {
      id: 'merch' as const,
      title: t.shop.categories.merch,
      desc: t.shop.categories.merchDesc,
      img: '/tienda/taza.png',
      isClosed: shopSettings['merch_status'] === 'closed',
      action: () => {
        if (shopSettings['merch_status'] === 'closed') {
          alert('Tienda de merchandising cerrada temporalmente');
          return;
        }
        setOpenCategory('merch');
      },
    },
  ];

  const filteredProducts = products.filter(p => p.category === openCategory);

  return (
      <main className="tienda-page min-h-screen pt-28 pb-20 px-6 sm:px-10 relative overflow-hidden" style={{ background: 'var(--red)' }}>
      {/* Dec BG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.04]">
        <span className="text-[25vw] font-black text-black leading-none uppercase tracking-tighter whitespace-nowrap">SHOP</span>
      </div>

      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            style={{ background: '#0A0A0A', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <CheckCircle2 size={20} className="text-green-500" />
            <span className="text-white font-black text-sm uppercase tracking-widest">Pedido realizado con éxito</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        <header className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full mb-2 bg-black/20 text-white border border-black/10 text-[10px] font-black uppercase tracking-widest">
            EURIELEC STORE
          </span>
          <h1 className="font-black uppercase text-black" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.03em' }}>
            {t.shop.title}
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full bg-white" />
          <p className="max-w-2xl mx-auto text-lg font-light text-white/90 leading-relaxed">
            {t.shop.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring' }}
              whileHover={cat.isClosed ? {} : { y: -8, scale: 1.02 }}
              onClick={cat.action}
              className={`group relative overflow-hidden rounded-3xl text-left bg-black border border-white/5 shadow-2xl ${cat.isClosed ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              <div className="h-64 overflow-hidden relative">
                <img src={cat.img} alt={cat.title} className={`w-full h-full object-cover transition-transform duration-700 ${cat.isClosed ? 'grayscale' : 'group-hover:scale-110'}`} />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                {cat.isClosed && (
                  <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/60 backdrop-blur-[2px]">
                    <div className="px-6 py-3 bg-red-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/20">
                      Cerrado - Próxima Venta
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 pt-2 relative">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{cat.title}</h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed">{cat.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                   <ShoppingBag size={14} /> {cat.id === 'lollipops' ? t.shop.visitShop : cat.isClosed ? 'Próximamente' : 'Ver Catálogo'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-black">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
              <div>
                <h2 className="text-white text-3xl font-black uppercase tracking-tight">
                   {openCategory === 'hoodies' ? t.shop.categories.hoodies : t.shop.categories.merch}
                </h2>
              </div>
              <button onClick={() => setOpenCategory(null)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(product => {
                  const isPaying = payingProduct === product.id;
                  const price = product.price;
                  
                  // Obtener opciones únicas de las variantes
                  const availableSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))] as string[];
                  const availableColors = [...new Set(product.variants.map(v => v.color).filter(Boolean))] as string[];
                  
                  const selectedSize = selectedSizes[product.id];
                  const selectedColor = selectedColors[product.id];

                  // Encontrar stock para la combinación seleccionada (o stock total si no hay selección completa)
                  let currentStock = 0;
                  if (availableSizes.length > 0 && availableColors.length > 0) {
                    if (selectedSize && selectedColor) {
                      currentStock = product.variants.find(v => v.size === selectedSize && v.color === selectedColor)?.stock || 0;
                    } else {
                      // Mostrar stock total de la categoría si no hay selección
                      currentStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                    }
                  } else if (availableSizes.length > 0) {
                    if (selectedSize) {
                      currentStock = product.variants.find(v => v.size === selectedSize)?.stock || 0;
                    } else {
                      currentStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                    }
                  } else {
                    currentStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                  }

                  const isOutOfStock = currentStock <= 0;

                  return (
                    <div key={product.id} className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex flex-col group/item transition-all hover:border-red-600/30">
                      <div className="aspect-square relative bg-white/2 overflow-hidden">
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />}
                        <div className="absolute top-6 right-6 px-4 py-2 bg-red-600 rounded-full text-white font-black text-sm shadow-xl z-20">
                          {price.toFixed(2)} €
                        </div>
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                            <span className="text-white font-black text-xs uppercase tracking-[0.3em] border-2 border-white/20 px-6 py-3 rounded-xl">Sin existencias</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-8 space-y-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-white font-black text-xl uppercase tracking-tighter leading-none mb-2 italic">{product.name}</h4>
                            <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-2">{product.description}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Selector de Tallas */}
                          {availableSizes.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest flex justify-between">
                                {t.shop.sizes}
                                {selectedSize && <span className="text-red-500/60">Seleccionado</span>}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {availableSizes.map(size => (
                                  <button
                                    key={size}
                                    onClick={() => selectSize(product.id, size)}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                                      selectedSize === size ? 'bg-red-600 text-white scale-110 shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Selector de Colores */}
                          {availableColors.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest flex justify-between">
                                Colores Disponibles
                                {selectedColor && <span className="text-red-500/60">Seleccionado</span>}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {availableColors.map(color => (
                                  <button
                                    key={color}
                                    onClick={() => selectColor(product.id, color)}
                                    className={`px-4 py-2 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border ${
                                      selectedColor === color 
                                        ? 'bg-red-600 text-white border-red-500 translate-y-[-2px] shadow-lg shadow-red-600/20' 
                                        : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                    }`}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <Package size={14} className={currentStock > 0 ? 'text-red-600' : 'text-gray-600'} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${currentStock > 0 ? 'text-white' : 'text-gray-600'}`}>
                                  {selectedSize && (availableColors.length === 0 || selectedColor) 
                                    ? `Disponibilidad: ${currentStock} unidades` 
                                    : `Stock total: ${currentStock} uds`}
                                </span>
                             </div>
                          </div>

                          {isPaying && paymentState === 'widget' && (
                             <div className="bg-white rounded-2xl p-2 animate-in zoom-in-95 duration-300">
                               <div id="sumup-card-widget" ref={widgetRef} />
                             </div>
                          )}

                          {isPaying && paymentState === 'success' && (
                            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3">
                              <CheckCircle2 className="text-green-500" />
                              <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Pago realizado con éxito</span>
                            </div>
                          )}

                          {isPaying && paymentState === 'error' && (
                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest leading-tight">
                              <AlertCircle size={16} /> {paymentError}
                            </div>
                          )}

                          {!(isPaying && paymentState === 'widget') && paymentState !== 'success' && (
                            <button
                              onClick={() => handlePayment(product.id)}
                              disabled={paymentState === 'loading' || isOutOfStock}
                              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 ${
                                isOutOfStock ? 'bg-neutral-800 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02]'
                              }`}
                            >
                               {paymentState === 'loading' && isPaying ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                               {isOutOfStock ? 'Agotado' : `Proceder al pago`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                   <p className="col-span-full py-20 text-center text-white/20 font-black uppercase tracking-[0.2em]">No hay productos disponibles</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
