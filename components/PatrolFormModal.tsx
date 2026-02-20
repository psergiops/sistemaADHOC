
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Car, Footprints, Camera, Image as ImageIcon, Trash2, MapPin, User, FileText } from 'lucide-react';
import { Patrol, Client, Staff } from '../types';

interface PatrolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patrol: Patrol) => void;
  staffList: Staff[];
  clientList: Client[];
  currentUser?: Staff;
}

const PatrolFormModal: React.FC<PatrolFormModalProps> = ({ isOpen, onClose, onSave, staffList, clientList, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Patrol>>({
    type: 'Foot',
    report: '',
    clientId: clientList[0]?.id || '',
    staffId: currentUser?.id || '',
    photos: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'Foot',
        report: '',
        clientId: clientList[0]?.id || '',
        staffId: currentUser?.id || (staffList.length > 0 ? staffList[0].id : ''),
        photos: []
      });
    }
  }, [isOpen, clientList, staffList, currentUser]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
    if (!formData.report || !formData.clientId || !formData.staffId) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const newPatrol: Patrol = {
      id: `pat-${Date.now()}`,
      date: new Date().toISOString(),
      staffId: formData.staffId,
      clientId: formData.clientId,
      type: formData.type || 'Foot',
      report: formData.report,
      photos: formData.photos || []
    };

    onSave(newPatrol);
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
                <MapPin size={24} />
             </div>
             <div>
               <h3 className="text-xl font-bold text-slate-800">Nova Ronda</h3>
               <p className="text-sm text-slate-500">Registro de atividade de segurança</p>
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
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><User size={14}/> Responsável</label>
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
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><MapPin size={14}/> Local / Base</label>
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
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-700">Tipo de Ronda</label>
             <div className="grid grid-cols-2 gap-4">
                <label className={`
                    flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${formData.type === 'Vehicle' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}
                `}>
                    <input type="radio" name="type" className="hidden" 
                        checked={formData.type === 'Vehicle'}
                        onChange={() => setFormData({...formData, type: 'Vehicle'})} 
                    />
                    <Car size={24} />
                    <span className="font-bold">Veicular</span>
                </label>

                <label className={`
                    flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${formData.type === 'Foot' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}
                `}>
                    <input type="radio" name="type" className="hidden" 
                        checked={formData.type === 'Foot'}
                        onChange={() => setFormData({...formData, type: 'Foot'})} 
                    />
                    <Footprints size={24} />
                    <span className="font-bold">A Pé</span>
                </label>
             </div>
          </div>

          {/* Report */}
          <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText size={14}/> Relatório da Ocorrência
              </label>
              <textarea 
                required
                rows={5}
                className={inputClassName}
                placeholder="Descreva detalhadamente o que foi verificado, horários e observações..."
                value={formData.report}
                onChange={e => setFormData({...formData, report: e.target.value})}
              />
          </div>

          {/* Photos */}
          <div className="border-t border-slate-100 pt-4">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-slate-800 flex items-center gap-2">
                   <ImageIcon size={16}/> Fotos / Evidências
               </h4>
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
              Salvar Ronda
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PatrolFormModal;
