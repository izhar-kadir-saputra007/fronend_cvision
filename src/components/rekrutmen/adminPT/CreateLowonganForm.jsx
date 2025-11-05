import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const CreateLowonganForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggalTutup: '',
    persyaratan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMarkdownChange = (val) => {
    setFormData(prev => ({ ...prev, persyaratan: val || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        judul: '',
        deskripsi: '',
        tanggalTutup: '',
        persyaratan: '',
      });
//periksa data yang dikirim
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Inline CSS untuk styling list di preview */}
      <style>{`
        .markdown-preview ul {
          list-style-type: disc !important;
          padding-left: 4.5rem !important;
        }
        .markdown-preview ol {
          list-style-type: decimal !important;
          padding-left: 4.5rem !important;
        }
        .markdown-preview li {
          margin-bottom: 0.25rem !important;
        }
      `}</style>

      <h2 className="text-2xl font-bold mb-6">Buat Lowongan Baru</h2>
      <form onSubmit={handleSubmit}>
        {/* Judul Lowongan */}
        <div className="mb-4">
          <label htmlFor="judul" className="block font-medium mb-2">
            Judul Lowongan *
          </label>
          <input
            type="text"
            id="judul"
            name="judul"
            value={formData.judul}
            onChange={handleInputChange}
            placeholder="Contoh: Backend Developer"
            required
            className="w-full text-color5 border px-3 py-2 rounded-md bg-[#f6f6f6]"
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-4">
          <label htmlFor="deskripsi" className="block font-medium mb-2">
            Deskripsi Lowongan *
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            placeholder="Deskripsikan tugas dan tanggung jawab"
            rows={4}
            required
            className="w-full text-color5 border px-3 py-2 rounded-md"
          />
        </div>

        {/* Tanggal Tutup */}
        <div className="mb-4">
          <label htmlFor="tanggalTutup" className="block font-medium mb-2">
            Tanggal Tutup *
          </label>
          <input
            type="date"
            id="tanggalTutup"
            name="tanggalTutup"
            value={formData.tanggalTutup}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            required
            className="w-full text-color5 border px-3 py-2 rounded-md"
          />
        </div>

        {/* Persyaratan Khusus (Markdown tanpa tombol preview) */}
        <div className="mb-6" data-color-mode="light">
          <label htmlFor="persyaratan" className="block font-medium mb-2">
            Persyaratan Khusus (Gunakan Markdown) *
          </label>
          <MDEditor
            value={formData.persyaratan}
            onChange={handleMarkdownChange}
            height={300}
            preview="edit"
          />
        </div>

        {/* Live Preview */}
        {formData.persyaratan && (
          <div className="markdown-preview p-4 border rounded">
    
            <MDEditor.Markdown source={formData.persyaratan} />
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLowonganForm;
