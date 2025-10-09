import React, { useState } from 'react';
import { Plus, Edit, Trash, Save, X, Tag } from 'lucide-react';
import DataService from '../../components/services/DataService';
import { useApi } from '../../hooks/useApi';

const ManagePromotions = () => {
    const { data: promotionsData, loading, error, refetch: fetchPromotions } = useApi(DataService.fetchAllPromotionsAdmin);
    const promotions = promotionsData?.data || [];

    const [showModal, setShowModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        applicableTo: 'all',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const handleOpenModal = (promo = null) => {
        if (promo) {
            setEditingPromotion(promo);
            setFormData({
                ...promo,
                startDate: promo.startDate.split('T')[0],
                endDate: promo.endDate.split('T')[0],
            });
        } else {
            setEditingPromotion(null);
            setFormData({
                title: '',
                description: '',
                discountType: 'percentage',
                discountValue: 0,
                applicableTo: 'all',
                startDate: '',
                endDate: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editingPromotion) {
                await DataService.updatePromotion(editingPromotion._id, formData);
            } else {
                await DataService.createPromotion(formData);
            }
            fetchPromotions();
            setShowModal(false);
        } catch (err) {
            alert('Failed to save promotion');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
            try {
                await DataService.deletePromotion(id);
                fetchPromotions();
            } catch (err) {
                alert('Failed to delete promotion');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Promotions</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={18} /> Add Promotion
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                {loading && <p>Loading promotions...</p>}
                {error && <p className="text-red-500">{error.message}</p>}
                <div className="space-y-4">
                    {promotions.map(promo => (
                        <div key={promo._id} className="border p-4 rounded-lg">
                            <h3 className="font-semibold">{promo.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                            <div className="mt-2 flex justify-end gap-2">
                                <button onClick={() => handleOpenModal(promo)} className="text-blue-600"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(promo._id)} className="text-red-600"><Trash size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{editingPromotion ? 'Edit Promotion' : 'Add Promotion'}</h2>
                        <div className="space-y-4">
                            <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className="w-full p-2 border rounded" />
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="w-full p-2 border rounded" rows="3"></textarea>
                            <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="w-full p-2 border rounded">
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                            <input type="number" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} placeholder="Discount Value" className="w-full p-2 border rounded" />
                            <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full p-2 border rounded" />
                            <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full p-2 border rounded" />
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

export default ManagePromotions;