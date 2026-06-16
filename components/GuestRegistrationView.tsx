
import React, { useState, useRef } from 'react';
import { Check, Calendar, MapPin, User, ArrowRight, AlertTriangle, Loader2, Camera, Image as ImageIcon, X } from 'lucide-react';

interface GuestRegistrationViewProps {
  token: string;
  data?: {
      hostName: string;
      eventName: string;
      locationName: string;
      date: string;
  };
  onRegister?: (name: string, doc: string, photo: string) => Promise<void>;
  onExit: () => void;
}

const GuestRegistrationView: React.FC<GuestRegistrationViewProps> = ({ token, data, onRegister, onExit }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!data) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Link Inválido</h2>
                <p className="text-slate-600 mb-6 text-sm">Este link de convite não foi encontrado ou expirou. Por favor, solicite um novo link ao seu anfitrião.</p>
                <button onClick={onExit} className="text-blue-600 hover:underline text-sm font-medium">Voltar para o sistema</button>
            </div>
        </div>
      );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !doc || !photo) return;

    setIsSubmitting(true);
    
    // Call parent handler to save to DB
    if (onRegister) {
        await onRegister(name, doc, photo);
    } else {
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
       {/* Decor Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-blue-100/50 rounded-full blur-[120px]"></div>
         <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] bg-indigo-100/50 rounded-full blur-[100px]"></div>
       </div>

       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden z-10 relative border border-white/50">
          {step === 'form' ? (
             <div className="p-8">
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Calendar size={32} />
                   </div>
                   <h1 className="text-2xl font-bold text-slate-800">Você foi convidado!</h1>
                   <p className="text-slate-500 mt-2 text-sm">
                       {data.eventName ? `Evento: ${data.eventName}` : 'Confirme sua presença preenchendo os dados abaixo.'}
                   </p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-500 flex-shrink-0">
                            <MapPin size={16} />
                        </div>
                        <span className="font-medium">{data.locationName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-500 flex-shrink-0">
                            <User size={16} />
                        </div>
                        <span className="font-medium">Anfitrião: {data.hostName}</span>
                    </div>
                    {data.date && (
                        <div className="flex items-center gap-3 text-sm text-slate-700">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <Calendar size={16} />
                            </div>
                            <span className="font-medium">Data: {new Date(data.date).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Seu Nome Completo</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 placeholder-slate-400"
                        placeholder="Digite seu nome..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isSubmitting}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Documento (RG/CPF)</label>
                      <input 
                        required 
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 placeholder-slate-400"
                        placeholder="Digite seu documento..."
                        value={doc}
                        onChange={e => setDoc(e.target.value)}
                        disabled={isSubmitting}
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sua Foto</label>
                      {photo ? (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                              <img src={photo} alt="Sua foto" className="w-full h-full object-cover" />
                              <button
                                  type="button"
                                  onClick={() => setPhoto('')}
                                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                                  disabled={isSubmitting}
                              >
                                  <X size={16} className="text-slate-600" />
                              </button>
                          </div>
                      ) : (
                          <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-48 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all flex flex-col items-center justify-center gap-2"
                              disabled={isSubmitting}
                          >
                              <Camera size={32} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-500">Clique para tirar ou enviar foto</span>
                              <span className="text-[10px] text-slate-400">O porteiro precisará da sua foto para identificação</span>
                          </button>
                      )}
                      <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={handlePhotoUpload}
                      />
                   </div>
                   <button 
                    type="submit" 
                    disabled={isSubmitting || !photo}
                    className={`w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-4 flex items-center justify-center gap-2 group
                        ${isSubmitting || !photo ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-xl'}
                    `}
                   >
                      {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Salvando...
                          </>
                      ) : (
                          <>
                            Confirmar Presença
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                          </>
                      )}
                   </button>
                </form>
                
                <div className="mt-8 text-center border-t border-slate-100 pt-4">
                    <button onClick={onExit} className="text-xs text-slate-400 hover:text-slate-600 hover:underline">
                        É funcionário? Acesse o sistema
                    </button>
                </div>
             </div>
          ) : (
             <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300 shadow-sm">
                   <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Tudo certo!</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Seu nome foi adicionado à lista de convidados de <strong>{data.hostName}</strong> com sucesso.<br/>
                    Apresente seu documento na portaria ao chegar.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Token de Acesso</p>
                    <p className="text-lg font-mono font-bold text-slate-700 tracking-wider">{token}</p>
                </div>
                <button 
                    onClick={() => { setStep('form'); setName(''); setDoc(''); setPhoto(''); }}
                    className="text-blue-600 font-medium hover:underline text-sm"
                >
                    Cadastrar outro convidado
                </button>
             </div>
          )}
       </div>
    </div>
  )
}

export default GuestRegistrationView;
