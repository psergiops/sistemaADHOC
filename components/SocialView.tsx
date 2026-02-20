
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Post, Staff, Comment, Client } from '../types';
import { 
  Menu, Search, Image as ImageIcon, Send, ThumbsUp, MessageCircle, MoreHorizontal, Trash2, X, MapPin, Pencil, Check, HelpCircle, AtSign, Filter
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SocialViewProps {
  posts: Post[];
  staff: Staff[];
  currentUser: Staff;
  clients: Client[];
  onAddPost: (post: Post) => void;
  onUpdatePost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onLikePost: (postId: string, userId: string) => void;
  onCommentPost: (postId: string, comment: Comment) => void;
  onToggleMenu: () => void;
  onShowHelp: () => void;
}

const SocialView: React.FC<SocialViewProps> = ({ 
  posts, staff, currentUser, clients, onAddPost, onUpdatePost, onDeletePost, onLikePost, onCommentPost, onToggleMenu, onShowHelp 
}) => {
  // Post Creation State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [postLocationId, setPostLocationId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTaggingOpen, setIsTaggingOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Feed State
  const [filterLocationId, setFilterLocationId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Interaction State
  const [commentText, setCommentText] = useState<Record<string, string>>({}); 
  const [expandedComments, setExpandedComments] = useState<string[]>([]); 
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Determine available locations for the current user (for posting)
  const availableLocations = useMemo(() => {
    if (['Diretoria', 'Supervisor', 'Administração'].includes(currentUser.role) || currentUser.id === 'admin-master') {
        return clients;
    }
    return clients.filter(c => c.assignedStaffIds?.includes(currentUser.id));
  }, [clients, currentUser]);

  // Auto-select location for new post if user has only one
  useEffect(() => {
      if (availableLocations.length === 1 && !postLocationId) {
          setPostLocationId(availableLocations[0].id);
      }
  }, [availableLocations, postLocationId]);

  // Filter and Sort Posts
  const filteredPosts = useMemo(() => {
      return posts
        .filter(post => {
            // Location Filter
            if (filterLocationId && post.locationId !== filterLocationId) return false;
            
            // Text Search
            if (searchTerm) {
                const author = staff.find(s => s.id === post.authorId);
                const searchLower = searchTerm.toLowerCase();
                return (
                    post.content.toLowerCase().includes(searchLower) ||
                    author?.name.toLowerCase().includes(searchLower)
                );
            }
            return true;
        })
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts, filterLocationId, searchTerm, staff]);

  const getStaff = (id: string) => staff.find(s => s.id === id) || { name: 'Usuário', avatar: null, role: '' };
  const getClientName = (id?: string) => clients.find(c => c.id === id)?.name;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPostImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleTagUser = (userName: string) => {
      setNewPostContent(prev => prev + `@${userName} `);
      setIsTaggingOpen(false);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newPostContent.trim() && !newPostImage)) return;
    
    if (availableLocations.length > 0 && !postLocationId) {
        alert("Por favor, selecione o local da postagem.");
        return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
        const newPost: Post = {
            id: `post-${Date.now()}`,
            authorId: currentUser.id,
            locationId: postLocationId || undefined,
            content: newPostContent,
            imageUrl: newPostImage || undefined,
            timestamp: new Date().toISOString(),
            likes: [],
            comments: []
        };
        
        onAddPost(newPost);
        setNewPostContent('');
        setNewPostImage(null);
        if (availableLocations.length > 1) setPostLocationId('');
        
        setIsSubmitting(false);
    }, 500);
  };

  const toggleComments = (postId: string) => {
      if (expandedComments.includes(postId)) {
          setExpandedComments(prev => prev.filter(id => id !== postId));
      } else {
          setExpandedComments(prev => [...prev, postId]);
      }
  };

  const  submitComment = (postId: string) => {
      const text = commentText[postId];
      if (!text?.trim()) return;

      const newComment: Comment = {
          id: `c-${Date.now()}`,
          authorId: currentUser.id,
          content: text,
          timestamp: new Date().toISOString()
      };

      onCommentPost(postId, newComment);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      
      if (!expandedComments.includes(postId)) {
          setExpandedComments(prev => [...prev, postId]);
      }
  };

  const handleStartEdit = (post: Post) => {
      setEditingPostId(post.id);
      setEditText(post.content);
  };

  const handleCancelEdit = () => {
      setEditingPostId(null);
      setEditText('');
  };

  const handleSaveEdit = (post: Post) => {
      if (!editText.trim()) return;
      onUpdatePost({ ...post, content: editText });
      setEditingPostId(null);
      setEditText('');
  };

  const roleTranslations: Record<string, string> = {
    'Security': 'Segurança',
    'Concierge': 'Porteiro',
    'Supervisor': 'Supervisor',
    'RH': 'RH',
    'Diretoria': 'Diretoria',
    'Administração': 'Administração'
  };

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F]">
      
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={onToggleMenu} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
            <div>
                <h2 className="text-xl font-bold text-slate-800">AD-HOC Social</h2>
                <p className="text-sm text-slate-500">Mural de interação da equipe</p>
            </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Location Filter */}
            <div className="relative flex-1 md:w-48">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                    value={filterLocationId}
                    onChange={(e) => setFilterLocationId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-700 appearance-none cursor-pointer"
                >
                    <option value="">Todos os Locais</option>
                    {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Search */}
            <div className="relative flex-1 md:w-48 hidden sm:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-700"
                />
            </div>

            <button
                onClick={onShowHelp}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium ml-2"
                title="Ver Tutorial"
            >
                <HelpCircle size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F0F2F5]">
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
            
            {/* Create Post Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                        {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">
                                {currentUser.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none text-sm transition-all"
                            placeholder={`No que você está pensando, ${currentUser.name.split(' ')[0]}?`}
                            rows={newPostContent ? 3 : 1}
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        
                        {newPostImage && (
                            <div className="relative mt-2 rounded-lg overflow-hidden border border-slate-200">
                                <img src={newPostImage} alt="Preview" className="max-h-64 w-full object-cover" />
                                <button 
                                    onClick={() => setNewPostImage(null)}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-3">
                            <div className="flex items-center gap-2 w-full sm:w-auto relative">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <ImageIcon size={18} />
                                    <span className="hidden sm:inline">Foto</span>
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />

                                {/* Tag Button */}
                                <button 
                                    onClick={() => setIsTaggingOpen(!isTaggingOpen)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium
                                        ${isTaggingOpen ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}
                                    `}
                                >
                                    <AtSign size={18} />
                                    <span className="hidden sm:inline">Marcar</span>
                                </button>

                                {/* Tagging Dropdown List */}
                                {isTaggingOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                        <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 uppercase">Selecionar Pessoa</p>
                                        </div>
                                        <div className="p-1">
                                            {staff.map(s => (
                                                <button 
                                                    key={s.id}
                                                    onClick={() => handleTagUser(s.name)}
                                                    className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                                        {s.avatar ? <img src={s.avatar} className="w-full h-full rounded-full object-cover"/> : s.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-slate-700 truncate">{s.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {availableLocations.length > 0 && (
                                    <div className="relative flex-1 sm:flex-none">
                                        <MapPin size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select 
                                            value={postLocationId}
                                            onChange={(e) => setPostLocationId(e.target.value)}
                                            className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-300"
                                        >
                                            <option value="">Selecione o local...</option>
                                            {availableLocations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={handleSubmitPost}
                                disabled={(!newPostContent.trim() && !newPostImage) || isSubmitting}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-1.5 rounded-lg text-sm font-bold text-white transition-all
                                    ${(!newPostContent.trim() && !newPostImage) || isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}
                                `}
                            >
                                {isSubmitting ? 'Enviando...' : 'Publicar'}
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Backdrop to close tagging */}
                {isTaggingOpen && (
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsTaggingOpen(false)}></div>
                )}
            </div>

            {/* Posts Feed */}
            {filteredPosts.map(post => {
                const author = getStaff(post.authorId);
                const isLiked = post.likes.includes(currentUser.id);
                const commentsCount = post.comments.length;
                const likesCount = post.likes.length;
                const showComments = expandedComments.includes(post.id);
                const locationName = getClientName(post.locationId);
                const isEditing = editingPostId === post.id;

                return (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Post Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                    {author.avatar ? (
                                        <img src={author.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-sm">
                                            {author.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">
                                        {author.name}
                                        {locationName && (
                                            <span className="font-normal text-slate-500"> em <span className="font-medium text-slate-700">{locationName}</span></span>
                                        )}
                                    </h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        {roleTranslations[author.role] || author.role} • {formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true, locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-1">
                                {post.authorId === currentUser.id && !isEditing && (
                                    <button 
                                        onClick={() => handleStartEdit(post)}
                                        className="text-slate-400 hover:text-blue-600 p-2 hover:bg-slate-50 rounded-full transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                )}
                                {(post.authorId === currentUser.id || currentUser.role === 'Diretoria') && (
                                    <button 
                                        onClick={() => onDeletePost(post.id)}
                                        className="text-slate-400 hover:text-red-500 p-2 hover:bg-slate-50 rounded-full transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-2">
                            {isEditing ? (
                                <div className="bg-slate-50 p-2 rounded-lg border border-blue-200">
                                    <textarea 
                                        className="w-full bg-transparent outline-none text-sm text-slate-800 resize-none"
                                        rows={3}
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button 
                                            onClick={handleCancelEdit}
                                            className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={() => handleSaveEdit(post)}
                                            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1"
                                        >
                                            <Check size={12} /> Salvar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-800 text-sm whitespace-pre-line leading-relaxed">
                                    {post.content.split(' ').map((word, i) => {
                                        if (word.startsWith('@')) {
                                            return <span key={i} className="text-blue-600 font-bold">{word} </span>
                                        }
                                        return word + ' ';
                                    })}
                                </p>
                            )}
                        </div>
                        {post.imageUrl && (
                            <div className="mt-2 w-full bg-slate-100 border-y border-slate-100">
                                <img src={post.imageUrl} alt="Post content" className="w-full max-h-[500px] object-cover" />
                            </div>
                        )}

                        {/* Actions Stats */}
                        <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-500 border-b border-slate-50">
                            <span>{likesCount > 0 ? `${likesCount} curtidas` : 'Seja o primeiro a curtir'}</span>
                            <button onClick={() => toggleComments(post.id)} className="hover:underline">
                                {commentsCount > 0 ? `${commentsCount} comentários` : 'Nenhum comentário'}
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex border-b border-slate-100">
                            <button 
                                onClick={() => onLikePost(post.id, currentUser.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors hover:bg-slate-50
                                    ${isLiked ? 'text-blue-600' : 'text-slate-600'}
                                `}
                            >
                                <ThumbsUp size={18} className={isLiked ? 'fill-current' : ''} />
                                Curtir
                            </button>
                            <button 
                                onClick={() => toggleComments(post.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <MessageCircle size={18} />
                                Comentar
                            </button>
                        </div>

                        {/* Comments Section */}
                        {showComments && (
                            <div className="bg-slate-50 p-4 space-y-4">
                                {post.comments.map(comment => {
                                    const commentAuthor = getStaff(comment.authorId);
                                    return (
                                        <div key={comment.id} className="flex gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                {commentAuthor.avatar ? (
                                                    <img src={commentAuthor.avatar} alt="Avatar" className="w-full h-full object-cover"/>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xs">
                                                        {commentAuthor.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-bold text-slate-800 text-xs">{commentAuthor.name}</span>
                                                    <span className="text-[10px] text-slate-400">{formatDistanceToNow(parseISO(comment.timestamp), { addSuffix: true, locale: ptBR })}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {/* Add Comment Input */}
                                <div className="flex gap-2 mt-4 pt-2 border-t border-slate-200">
                                    <input 
                                        type="text" 
                                        placeholder="Escreva um comentário..." 
                                        className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        value={commentText[post.id] || ''}
                                        onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                                    />
                                    <button 
                                        onClick={() => submitComment(post.id)}
                                        disabled={!commentText[post.id]?.trim()}
                                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            
            {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <MessageCircle size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">Nenhuma publicação encontrada</p>
                    <p className="text-sm">Tente mudar o filtro ou seja o primeiro a postar!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SocialView;
