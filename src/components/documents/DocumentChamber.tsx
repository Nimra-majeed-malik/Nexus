import React, { useState, useRef } from 'react';
import { Upload, FileText, Eye, PenTool, X, Check } from 'lucide-react';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface Document {
  id: string;
  name: string;
  status: DocStatus;
  uploadedAt: string;
  size: string;
}

export const DocumentChamber: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Investment_Agreement.pdf', status: 'Draft', uploadedAt: '2026-07-01', size: '245 KB' },
    { id: '2', name: 'NDA_Contract.pdf', status: 'In Review', uploadedAt: '2026-07-02', size: '189 KB' },
    { id: '3', name: 'Term_Sheet.pdf', status: 'Signed', uploadedAt: '2026-07-03', size: '312 KB' },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSignPad, setShowSignPad] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        status: 'Draft',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${Math.round(file.size / 1024)} KB`
      };
      setDocuments(prev => [...prev, newDoc]);
    });
  };

  // Change document status
  const handleStatusChange = (id: string, status: DocStatus) => {
    setDocuments(docs =>
      docs.map(d => d.id === id ? { ...d, status } : d)
    );
  };

  // Delete document
  const handleDelete = (id: string) => {
    setDocuments(docs => docs.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  // Signature pad drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e40af';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const applySignature = () => {
    if (selectedDoc) {
      handleStatusChange(selectedDoc.id, 'Signed');
      setDocuments(docs =>
        docs.map(d => d.id === selectedDoc.id ? { ...d, status: 'Signed' } : d)
      );
    }
    setShowSignPad(false);
  };

  const getStatusColor = (status: DocStatus) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'In Review': return 'bg-blue-100 text-blue-800';
      case 'Signed': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📄 Document Chamber</h2>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-6 transition ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <Upload size={36} className="text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">Drag & drop files here</p>
        <p className="text-gray-400 text-sm mt-1">or click to browse • PDF, DOC, DOCX supported</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Documents list */}
      <div className="space-y-3">
        {documents.length === 0 && (
          <p className="text-center text-gray-400 py-4">No documents uploaded yet</p>
        )}
        {documents.map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                <p className="text-xs text-gray-400">{doc.uploadedAt} • {doc.size}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status badge + dropdown */}
              <select
                value={doc.status}
                onChange={(e) => handleStatusChange(doc.id, e.target.value as DocStatus)}
                className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(doc.status)}`}
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Signed">Signed</option>
              </select>

              {/* Preview button */}
              <button
                onClick={() => { setSelectedDoc(doc); setShowPreview(true); }}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                title="Preview"
              >
                <Eye size={16} className="text-gray-600" />
              </button>

              {/* Sign button */}
              <button
                onClick={() => { setSelectedDoc(doc); setShowSignPad(true); }}
                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
                title="Sign document"
              >
                <PenTool size={16} className="text-blue-600" />
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
                title="Delete"
              >
                <X size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">📄 {selectedDoc.name}</h3>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 min-h-48 flex items-center justify-center border">
              <div className="text-center">
                <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">{selectedDoc.name}</p>
                <p className="text-gray-400 text-sm mt-1">Size: {selectedDoc.size}</p>
                <p className="text-gray-400 text-sm">Uploaded: {selectedDoc.uploadedAt}</p>
                <span className={`inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(selectedDoc.status)}`}>
                  {selectedDoc.status}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowPreview(false); setShowSignPad(true); }}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <PenTool size={16} /> Sign Document
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Pad Modal */}
      {showSignPad && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">✍️ Sign Document</h3>
              <button onClick={() => setShowSignPad(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">Signing: <span className="font-medium text-gray-700">{selectedDoc.name}</span></p>
            
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden mb-2">
              <canvas
                ref={canvasRef}
                width={460}
                height={180}
                className="w-full cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <p className="text-xs text-gray-400 mb-4 text-center">Draw your signature above</p>

            <div className="flex gap-3">
              <button
                onClick={applySignature}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Apply Signature
              </button>
              <button
                onClick={clearSignature}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
              >
                Clear
              </button>
              <button
                onClick={() => setShowSignPad(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};