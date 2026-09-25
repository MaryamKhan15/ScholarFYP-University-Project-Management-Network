import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FolderArchive,
  UploadCloud,
  FileText,
  Trash2,
  Download,
  AlertCircle
} from 'lucide-react';

export default function StudentDocuments() {
  const [projectData, setProjectData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('Proposal Document');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const projRes = await api.get('/projects/my');
      setProjectData(projRes.data.data.project);
      const docRes = await api.get(`/documents/project/${projRes.data.data.project._id}`);
      setDocuments(docRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !projectData) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectData._id);
      formData.append('documentType', documentType);

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading documents...</div>;

  if (!projectData) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">Project Workspace Required</p>
        <p className="text-xs text-slate-500 mt-1">Document hub opens once your project proposal is approved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FolderArchive className="w-6 h-6 text-indigo-600" /> Centralized Document Repository
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Store and version your SRS, Architecture Diagrams, Thesis Book, and Viva Slides in one secure place.
        </p>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Upload Project Artifact</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
            >
              <option value="Proposal Document">Proposal Document</option>
              <option value="SRS">System Requirements Specification (SRS)</option>
              <option value="Design Document">Design & Architecture Document</option>
              <option value="Progress Report">Progress Report Artifact</option>
              <option value="Final Thesis">Final Thesis / FYP Book</option>
              <option value="Presentation">Viva Presentation Slides</option>
              <option value="Other">Other File / Archive</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select File (PDF, DOCX, ZIP, PPTX)</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading || !file}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>

      {/* Documents List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-4">Project Submissions History</h3>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No documents uploaded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {documents.map((doc) => (
              <div key={doc._id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{doc.originalName || doc.fileName}</span>
                    <span className="text-[11px] text-slate-400">
                      {doc.documentType} • Version {doc.version} • {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                    title="Download / View"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
