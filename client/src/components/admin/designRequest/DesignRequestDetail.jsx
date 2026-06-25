import { useState } from 'react';
import { DESIGN_REQUEST_STATUS_OPTIONS } from '../../../constants/designRequest';

const DesignRequestDetail = ({ request, onClose, onUpdate, saving }) => {
  const [status, setStatus] = useState(request.status);
  const [adminNotes, setAdminNotes] = useState(request.adminNotes ?? '');
  const [quotedPrice, setQuotedPrice] = useState(request.quotedPrice ?? '');

  const handleSave = () => {
    const payload = { status, adminNotes };
    if (quotedPrice) payload.quotedPrice = Number(quotedPrice);
    onUpdate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-enugu-black">{request.customerName}</h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-400 hover:text-enugu-black">
            ×
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Email</p>
              <p className="mt-1 text-sm">{request.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Phone</p>
              <p className="mt-1 text-sm">{request.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Quantity</p>
              <p className="mt-1 text-sm font-medium">{request.quantity} pieces</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Submitted</p>
              <p className="mt-1 text-sm">
                {new Date(request.createdAt).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Design Description</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {request.designBrief}
            </p>
          </div>

          {request.referenceImages?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">Reference Image</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {request.referenceImages.map((img, i) => (
                  <a
                    key={i}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden border border-gray-200"
                  >
                    <img src={img.url} alt={`Reference ${i + 1}`} className="h-32 w-32 object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            >
              {DESIGN_REQUEST_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">
              Quoted Price (₹)
            </label>
            <input
              type="number"
              min="0"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              placeholder="Optional"
              className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-gray-500">Admin Notes</label>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-enugu-gold"
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-enugu-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-enugu-gold hover:text-enugu-black disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Request'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignRequestDetail;
