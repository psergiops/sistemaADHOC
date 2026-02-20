
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Car, Gauge, Fuel, CheckCircle2, AlertTriangle, MinusCircle, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { VehicleChecklist, Client, Staff } from '../types';

interface ChecklistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checklist: VehicleChecklist) => void;
  staffList: Staff[];
  clientList: Client[];
  currentUser?: Staff;
}

const DEFAULT_ITEMS = [
  'Pneus / Calibragem',
  'Faróis e Lanternas',
  'Lataria / Pintura',
  'Nível de Óleo / Água',
  'Freios',
  'Estepe / Macaco / Chave',
  'Documentos (CRLV)',
  'Rádio HT / Comunicação',
  'Lanterna Tática',
  'Limpeza Interna'
];

const ChecklistFormModal: React.FC<ChecklistFormModalProps> = ({ isOpen, onClose, onSave, staffList, clientList, currentUser }) => {
  const [formData, setFormData] = useState<Partial<VehicleChecklist>>({
    vehicleModel: '',
    vehiclePlate: '',
    odometer: 0,
    fuelLevel: 50,
    items: DEFAULT_ITEMS.map((label, idx) => ({ id: idx.toString(), label, status: 'ok' })),
    clientId: clientList[0]?.id || '',
    staffId: currentUser?.id || '',
    generalNotes: '',
    photos: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        vehicleModel: '',
        vehiclePlate: '',
        odometer: 0,
        fuelLevel: 50,
        items: DEFAULT_ITEMS.map((label, idx) => ({ id: idx.toString(), label, status: 'ok' })),
        clientId: clientList[0]?.id || '',
        staffId: currentUser?.id || (staffList.length > 0 ? staffList[0].id : ''),
        generalNotes: '',
        photos: []
      });
    }
  }, [isOpen, clientList, staffList, currentUser]);

  if (!isOpen) return null;

  const handleItemStatusChange = (index: number, status: 'ok' | 'issue' | 'na') => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], status };
    setFormData({ ...formData, items: newItems });
  };

  const handleItemNotesChange = (index: number, notes: string) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], notes };
    setFormData({ ...formData, items: newItems });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Fix: Explicitly cast Array.from result to File[] to avoid 'unknown' type error in strict mode
      const newFiles = Array.from(e.target.files) as File[];
      const currentPhotos = formData.photos || [];
      
      if (currentPhotos.length + newFiles.length > 5) {
        alert('Você só pode enviar no máximo 5 fotos.');
        return;
      }

      const promises = newFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(base64Images => {
        setFormData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), ...base64Images]
        }));
      });
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehiclePlate || !formData.clientId || !formData.staffId) return;

    const newChecklist: VehicleChecklist = {
      id: `chk-${Date.now()}`,
      date: new Date().toISOString(),
      staffId: formData.staffId,
      clientId: formData.clientId,
      vehicleModel: formData.vehicleModel || 'N/A',
      vehiclePlate: formData.vehiclePlate,
      odometer: formData.odometer || 0,
      fuelLevel: formData.fuelLevel || 0,
      items: formData.items || [],
      generalNotes: formData.generalNotes,
      photos: formData.photos || []
    };

    onSave(newChecklist);
    onClose();
  };

  const inputClassName = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Car size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-800">Nova Vistoria de Viatura</h3>
               <p className="text-sm text-slate-500">Checklist diário de frota e equipamentos</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Responsável</label>
                <select 
                  required
                  value={formData.staffId} 
                  onChange={e => setFormData({...formData, staffId: e.target.value})}
                  className={inputClassName}
                >
                  <option value="">Selecione...</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Local / Base</label>
                <select 
                  required
                  value={formData.clientId} 
                  onChange={e => setFormData({...formData, clientId: e.target.value})}
                  className={inputClassName}
                >
                  <option value="">Selecione...</option>
                  {clientList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Modelo do Veículo</label>
                <input 
                  type="text" required
                  placeholder="Ex: Gol G6 Branco"
                  className={inputClassName}
                  value={formData.vehicleModel}
                  onChange={e => setFormData({...formData, vehicleModel: e.target.value})}
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Placa</label>
                <input 
                  type="text" required
                  placeholder="ABC-1234"
                  className={inputClassName}
                  value={formData.vehiclePlate}
                  onChange={e => setFormData({...formData, vehiclePlate: e.target.value.toUpperCase()})}
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                   <Gauge size={16} /> Hodômetro (KM)
                </label>
                <input 
                  type="number" required
                  className={inputClassName}
                  value={formData.odometer || ''}
                  onChange={e => setFormData({...formData, odometer: parseInt(e.target.value)})}
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                   <Fuel size={16} /> Combustível ({formData.fuelLevel}%)
                </label>
                <input 
                  type="range" min="0" max="100" step="5"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                  value={formData.fuelLevel}
                  onChange={e => setFormData({...formData, fuelLevel: parseInt(e.target.value)})}
                />
                <div className="flex justify-between text-xs text-slate-400 px-1">
                   <span>Reserva</span>
                   <span>1/2</span>
                   <span>Cheio</span>
                </div>
             </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
             <h4 className="font-bold text-slate-800 mb-4">Itens de Inspeção</h4>
             <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {formData.items?.map((item, idx) => (
                   <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex-1 font-medium text-slate-700">{item.label}</div>
                      
                      <div className="flex gap-2">
                         <button 
                           type="button"
                           onClick={() => handleItemStatusChange(idx, 'ok')}
                           className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${item.status === 'ok' ? 'bg-green-100 text-green-700 shadow-sm ring-1 ring-green-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-green-50'}`}
                         >
                            <CheckCircle2 size={14} /> OK
                         </button>
                         <button 
                           type="button"
                           onClick={() => handleItemStatusChange(idx, 'issue')}
                           className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${item.status === 'issue' ? 'bg-red-100 text-red-700 shadow-sm ring-1 ring-red-200' : 'bg-white text-slate-500 border border-slate-200 hover:bg-red-50'}`}
                         >
                            <AlertTriangle size={14} /> Defeito
                         </button>
                         <button 
                           type="button"
                           onClick={() => handleItemStatusChange(idx, 'na')}
                           className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${item.status === 'na' ? 'bg-slate-200 text-slate-600 shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                         >
                            <MinusCircle size={14} /> N/A
                         </button>
                      </div>

                      {item.status === 'issue' && (
                         <input 
                           type="text" 
                           placeholder="Descreva o problema..."
                           className="w-full md:w-48 text-xs border border-red-200 rounded px-2 py-1.5 bg-red-50 focus:bg-white focus:border-red-400 outline-none"
                           value={item.notes || ''}
                           onChange={e => handleItemNotesChange(idx, e.target.value)}
                           autoFocus
                         />
                      )}
                   </div>
                ))}
             </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-slate-800">Fotos do Veículo</h4>
               <span className="text-xs text-slate-500">Máx. 5 fotos</span>
             </div>
             
             <div className="grid grid-cols-5 gap-3">
                {formData.photos?.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={photo} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                    <button 
                       type="button"
                       onClick={() => handleRemovePhoto(index)}
                       className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                {(!formData.photos || formData.photos.length < 5) && (
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors"
                   >
                      <Camera size={24} className="mb-1" />
                      <span className="text-[10px] font-medium">Adicionar</span>
                   </div>
                )}
             </div>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={handlePhotoUpload}
             />
          </div>

          <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Observações Gerais</label>
              <textarea 
                rows={2}
                className={inputClassName}
                placeholder="Alguma outra observação sobre o veículo?"
                value={formData.generalNotes}
                onChange={e => setFormData({...formData, generalNotes: e.target.value})}
              />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
             <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all"
            >
              <Save size={16} />
              Finalizar Vistoria
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChecklistFormModal;
