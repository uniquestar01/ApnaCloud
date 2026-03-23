import React, { useState, useEffect } from 'react';
import { 
  Folder, File, Trash2, Download, Edit3, Share2, 
  Grid, List as ListIcon, Search, Upload, FolderPlus,
  Image, FileVideo, FileText, FileArchive, Loader2, X, ExternalLink, Link
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { fileService } from '../services/api';
import { FileSkeleton } from '../components/Skeleton';
import DeleteModal from '../components/DeleteModal';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null);
  
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fileService.getFiles();
      setFiles(res.data);
    } catch (err) {
      toast.error('Identity sync failed');
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading(`Uploading ${file.name}...`);
    setUploading(true);
    setUploadProgress(0);

    try {
      await fileService.uploadFile(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });
      toast.success(`${file.name} distributed to node`, { id: toastId });
      fetchFiles();
    } catch (err) {
      toast.error('Transmission failed', { id: toastId });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!deletingFile) return;
    try {
      await fileService.deleteFile(deletingFile.name);
      toast.success('Data purged');
      setDeletingFile(null);
      fetchFiles();
    } catch (err) {
      toast.error('Deletion failure');
    }
  };

  const FileIconComponent = ({ type, is_folder }) => {
    if (is_folder) return <Folder className="text-primary fill-primary/10" size={viewMode === 'grid' ? 44 : 20} />;
    const ext = type?.split('/')?.[1] || '';
    if (['jpg', 'png', 'jpeg', 'webp', 'gif'].includes(ext)) return <Image className="text-emerald-500" size={viewMode === 'grid' ? 44 : 20} />;
    if (['mp4', 'mkv', 'avi', 'webm'].includes(ext)) return <FileVideo className="text-violet-500" size={viewMode === 'grid' ? 44 : 20} />;
    if (['zip', 'rar', '7z', 'x-zip-compressed'].includes(ext)) return <FileArchive className="text-amber-500" size={viewMode === 'grid' ? 44 : 20} />;
    return <FileText className="text-slate-400" size={viewMode === 'grid' ? 44 : 20} />;
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-1">Repository Node</p>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors duration-500">My Files</h1>
        </motion.div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-white/5 rounded-2xl p-1 items-center transition-colors">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
              <ListIcon size={18} />
            </button>
          </div>

          <div className="relative group min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Search data blocks..."
              className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all w-full shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <label className="btn-primary cursor-pointer flex items-center gap-3 px-8 py-4 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
            <Upload size={20} /> 
            <span className="font-black tracking-tight text-xs uppercase">Init Upload</span>
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </header>

      {uploading && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary blur-[100px] opacity-20" />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Data Streaming Point</p>
                    <span className="text-3xl font-black">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
                    <motion.div className="bg-primary h-full shadow-[0_0_20px_rgba(37,99,235,0.8)]" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                </div>
            </div>
        </motion.div>
      )}

      <div className={`
        ${loading ? 'py-12' : filteredFiles.length === 0 ? 'py-24' : 'pb-24'}
        bg-white/40 dark:bg-slate-900/40 rounded-[3rem] p-8 lg:p-12 shadow-inner border border-white/20 dark:border-white/5 transition-all duration-500
      `}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => <FileSkeleton key={i} />)}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-0 duration-500">
               <File size={56} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight transition-colors">No Data Streams.</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">Upload a packet to initialize your personal cloud node.</p>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10' : 'flex flex-col gap-6'}`}>
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.div 
                  key={file.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`
                    group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-all duration-500 cursor-pointer
                    hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] hover:-translate-y-2
                    ${viewMode === 'grid' ? 'p-10 flex flex-col items-center gap-6' : 'px-10 py-6 flex items-center gap-8'}
                  `}
                >
                  <div onClick={() => !file.is_folder && setPreviewFile(file)} className={`${viewMode === 'grid' ? 'flex flex-col items-center gap-6 w-full' : 'flex items-center gap-8 flex-1'}`}>
                    <div className={`
                      ${viewMode === 'grid' ? 'w-24 h-24' : 'w-14 h-14'} 
                      rounded-[2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500
                    `}>
                      <FileIconComponent type={file.type || ''} is_folder={file.is_folder} />
                    </div>
                    <div className={`${viewMode === 'grid' ? 'text-center w-full' : ''}`}>
                      <span className="font-black text-slate-800 dark:text-slate-200 block truncate group-hover:text-primary transition-colors text-base tracking-tight leading-tight">
                        {file.name}
                      </span>
                      {viewMode === 'grid' && (
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 px-6">
                            {file.is_folder ? 'Folder' : (file.size / (1024 * 1024)).toFixed(1) + 'MB Container'}
                          </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button onClick={() => setDeletingFile(file)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">
                       <Trash2 size={20} />
                    </button>
                    <a href={fileService.getPreviewUrl(file.id)} download className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all">
                       <Download size={20} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {previewFile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/95 backdrop-blur-3xl z-[120] flex items-center justify-center p-6 transition-colors duration-500">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[3.5rem] w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative border border-white/10">
              <div className="p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="font-black text-3xl text-slate-900 dark:text-white tracking-tight">{previewFile.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Data Stream Preview</p>
                </div>
                <button onClick={() => setPreviewFile(null)} className="w-14 h-14 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl rounded-2xl flex items-center justify-center transition-all border border-transparent dark:border-white/5">
                  <X size={28} className="text-slate-900 dark:text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-12">
                {previewFile.type?.startsWith('image/') ? (
                  <img src={fileService.getPreviewUrl(previewFile.id)} className="max-w-full max-h-full object-contain rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-800" alt={previewFile.name} />
                ) : (
                  <div className="flex flex-col items-center text-center max-w-sm">
                    <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center mb-8">
                       <FileText size={56} className="text-primary" />
                    </div>
                    <h4 className="text-2xl font-black dark:text-white mb-4 tracking-tight">Stream Block Restricted</h4>
                    <p className="text-slate-400 font-medium mb-10 text-sm">Visual preview nodes for this protocol are currently unavailable. Initialize download for local access.</p>
                    <button onClick={() => window.open(fileService.getPreviewUrl(previewFile.id))} className="btn-primary w-full py-5 rounded-3xl shadow-2xl shadow-primary/30 text-lg uppercase font-black">
                      Extract Data Block
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteModal isOpen={!!deletingFile} onClose={() => setDeletingFile(null)} onConfirm={handleDelete} itemName={deletingFile?.name} />
    </div>
  );
};

export default FileManager;
