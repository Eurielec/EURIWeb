'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProductVariantsAction, updateProductVariantsAction } from './actions';
import { Package, Plus, Trash2, Save, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Variant {
  id?: string;
  size: string;
  color: string;
  type: string;
  lining: string;
  stock: number;
}

export default function StockManager({ productId, productName, category }: { productId: string, productName: string, category: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadVariants = useCallback(async () => {
    setLoading(true);
    const data = await getProductVariantsAction(productId);
    setVariants(data.map(v => ({
      id: v.id,
      size: v.size || '',
      color: v.color || '',
      type: v.type || '',
      lining: v.lining || '',
      stock: v.stock
    })));
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    if (isOpen) {
      loadVariants();
    }
  }, [isOpen, loadVariants]);

  function addVariant() {
    setVariants([...variants, { size: '', color: '', type: '', lining: '', stock: 0 }]);
  }

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    await updateProductVariantsAction(productId, variants);
    setSaving(false);
    setIsOpen(false);
  }

  const isHoodie = category === 'hoodies';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-600/10 text-red-600 hover:bg-red-600/20 border border-red-600/20 transition-all font-sans"
      >
        <Package size={14} />
        Control Stock
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-black border border-white/10 w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden font-sans"
            >
              <header className="p-10 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
                <div>
                  <h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter italic">{productName}</h2>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Matriz de Inventario Dinámico</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-4 bg-transparent hover:bg-red-600 hover:text-white text-gray-500 border border-transparent hover:border-red-600 transition-all">
                  <X />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="animate-spin text-red-600" size={48} />
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Almacén...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 gap-6 text-[10px] font-black uppercase tracking-widest text-gray-600 px-4 pb-2 border-b border-white/10">
                      <div className="col-span-2">Talla</div>
                      <div className="col-span-2">Color</div>
                      {isHoodie && (
                        <>
                          <div className="col-span-2">Estilo</div>
                          <div className="col-span-2">Protección</div>
                        </>
                      )}
                      <div className={isHoodie ? 'col-span-2' : 'col-span-6'}>Disponibilidad</div>
                      <div className="col-span-2 text-right">Borrar</div>
                    </div>

                    <div className="space-y-3">
                      {variants.map((v, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 items-center bg-transparent p-3 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors">
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={v.size}
                              onChange={(e) => updateVariant(i, 'size', e.target.value)}
                              placeholder="S, M..."
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 font-bold"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={v.color}
                              onChange={(e) => updateVariant(i, 'color', e.target.value)}
                              placeholder="Rojo..."
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-red-600 font-bold"
                            />
                          </div>
                          {isHoodie && (
                            <>
                              <div className="col-span-2">
                                <select
                                  value={v.type}
                                  onChange={(e) => updateVariant(i, 'type', e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black uppercase text-white focus:outline-none focus:border-red-600"
                                >
                                  <option value="">Normal</option>
                                  <option value="con capucha">Capucha</option>
                                  <option value="sin capucha">S/ Capucha</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <select
                                  value={v.lining}
                                  onChange={(e) => updateVariant(i, 'lining', e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black uppercase text-white focus:outline-none focus:border-red-600"
                                >
                                  <option value="">Normal</option>
                                  <option value="con forro">Forrado</option>
                                  <option value="sin forro">S/ Forro</option>
                                </select>
                              </div>
                            </>
                          )}
                          <div className={isHoodie ? 'col-span-2' : 'col-span-6'}>
                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm font-black text-white focus:outline-none focus:border-red-600 text-center"
                            />
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button
                              onClick={() => removeVariant(i)}
                              className="p-3 text-gray-600 hover:text-white hover:bg-red-600 border border-transparent hover:border-red-600 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addVariant}
                      className="w-full py-6 border border-dashed border-white/10 flex items-center justify-center gap-3 text-gray-600 hover:text-white hover:border-red-600/40 transition-all font-black text-[10px] uppercase tracking-[0.3em] bg-transparent"
                    >
                      <Plus size={16} /> Insertar Nueva Variante
                    </button>
                  </>
                )}
              </div>

              <footer className="p-10 border-t border-white/10 bg-white/5 flex justify-end gap-6 shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-3 px-12 py-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Actualizar Inventario
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
