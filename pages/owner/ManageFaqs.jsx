import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';
import DataService from '../../components/services/DataService';
import { useApi } from '../../hooks/useApi';

const ManageFaqs = () => {
    const { data: faqsData, loading, error, refetch: fetchFaqs } = useApi(DataService.fetchAllFaqsAdmin);
    const faqs = faqsData?.data || [];

    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({ question: '', answer: '', keywords: '', category: 'General' });

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({ ...faq, keywords: faq.keywords.join(', ') });
        } else {
            setEditingFaq(null);
            setFormData({ question: '', answer: '', keywords: '', category: 'General' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        const payload = { ...formData, keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean) };
        try {
            if (editingFaq) {
                await DataService.updateFaq(editingFaq._id, payload);
            } else {
                await DataService.createFaq(payload);
            }
            fetchFaqs();
            setShowModal(false);
        } catch (err) {
            alert('Failed to save FAQ');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await DataService.deleteFaq(id);
                fetchFaqs();
            } catch (err) {
                alert('Failed to delete FAQ');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage FAQs</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={18} /> Add FAQ
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                {loading && <p>Loading FAQs...</p>}
                {error && <p className="text-red-500">{error.message}</p>}
                <div className="space-y-4">
                    {faqs.map(faq => (
                        <div key={faq._id} className="border p-4 rounded-lg">
                            <h3 className="font-semibold">{faq.question}</h3>
                            <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                            <div className="mt-2 flex justify-end gap-2">
                                <button onClick={() => handleOpenModal(faq)} className="text-blue-600"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(faq._id)} className="text-red-600"><Trash size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
                        <div className="space-y-4">
                            <input value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} placeholder="Question" className="w-full p-2 border rounded" />
                            <textarea value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} placeholder="Answer" className="w-full p-2 border rounded" rows="4"></textarea>
                            <input value={formData.keywords} onChange={e => setFormData({...formData, keywords: e.target.value})} placeholder="Keywords (comma-separated)" className="w-full p-2 border rounded" />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg"><X size={18} /></button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Save size={18} /> Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFaqs;
