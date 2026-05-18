'use client';

import { useState } from 'react';
import { createProductAction, updateProductAction } from './actions';
import { ShoppingBag, Upload, Loader2, Save, Trash2, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id?: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  sizes: string | null;
  imageUrl: string | null;
  active: boolean;
}

export default function ProductForm({ 
  product, 
}: { 
  product?: Product; 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product?.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (removeImage) {
      formData.append('removeImage', 'true');
    }

    try {
      if (product?.id) {
        await updateProductAction(product.id, formData);
      } else {
        await createProductAction(formData);
      }
      
      if (!product?.id) {
        (e.target as HTMLFormElement).reset();
        setPreview(null);
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-neutral-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl font-sans">
      <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-6">
        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Columna Izquierda: Datos */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nombre del Producto</label>
            <input
              name="name"
              type="text"
              defaultValue={product?.name}
              required
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-gray-700 font-bold"
              placeholder="Ej: Sudadera Eurielec v2"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Descripción Técnica</label>
            <textarea
              name="description"
              defaultValue={product?.description || ''}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-gray-700 min-h-[120px] font-medium"
              placeholder="Detalles sobre el material, diseño, etc..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Precio de Venta (€)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product?.price}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all font-black text-xl"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Categoría</label>
              <select
                name="category"
                defaultValue={product?.category || 'hoodies'}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none font-black uppercase tracking-widest text-[10px]"
              >
                <option value="hoodies">Sudaderas (Temporada)</option>
                <option value="merch">Merchandising (Fijo)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tallas Referenciales (CSV)</label>
            <input
              name="sizes"
              type="text"
              defaultValue={product?.sizes || ''}
              placeholder="Ej: S,M,L,XL"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-gray-700 font-bold"
            />
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Este campo es informativo. Usa el gestor de stock para variantes reales.</p>
          </div>
        </div>

        {/* Columna Derecha: Imagen */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Multimedia</label>
            <div className="relative group aspect-square rounded-[2rem] border-2 border-dashed border-white/10 bg-black/40 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-red-600/40 shadow-inner">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <label className="p-4 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all border border-white/10 hover:scale-110">
                      <Upload className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        name="imageFile"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setPreview(URL.createObjectURL(file));
                            setRemoveImage(false);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setRemoveImage(true);
                      }}
                      className="p-4 bg-red-600/20 hover:bg-red-600/40 rounded-full transition-all border border-red-600/20 hover:scale-110"
                    >
                      <Trash2 className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer group/label">
                  <div className="p-5 bg-red-600/10 rounded-2xl group-hover/label:bg-red-600/20 transition-all border border-red-600/5">
                    <ImageIcon className="w-10 h-10 text-red-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-white uppercase tracking-widest">Integrar Imagen</p>
                    <p className="text-[10px] text-gray-600 mt-2 font-black uppercase tracking-widest italic opacity-60">PNG / JPG (MAX 5MB)</p>
                  </div>
                  <input
                    type="file"
                    name="imageFile"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                        setRemoveImage(false);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-white/5">
        <button
          type="submit"
          disabled={loading}
          className={`group flex items-center gap-3 px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            loading 
              ? 'bg-neutral-800 text-gray-600 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/20 hover:-translate-y-1 active:translate-y-0 w-full md:w-auto justify-center'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              {product ? 'Actualizar Registro' : 'Lanzar Producto'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
