import { hasSizeGuideImage } from '../../../utils/sizeGuideImage';



const SizeGuideTable = ({ sizeGuides, onEdit, onDelete, loading }) => {

  if (loading) {

    return (

      <div className="flex items-center justify-center py-16">

        <div className="h-8 w-8 animate-spin rounded-full border-2 border-enugu-gold border-t-transparent" />

      </div>

    );

  }



  if (!sizeGuides.length) {

    return (

      <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">

        <p className="text-sm text-gray-500">No size guides yet. Create your first size guide.</p>

      </div>

    );

  }



  return (

    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">

      <table className="min-w-full divide-y divide-gray-200 text-sm">

        <thead className="bg-gray-50">

          <tr>

            {['Name', 'Image', 'Default', 'Status', 'Actions'].map((head) => (

              <th

                key={head}

                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"

              >

                {head}

              </th>

            ))}

          </tr>

        </thead>

        <tbody className="divide-y divide-gray-100">

          {sizeGuides.map((guide) => (

            <tr key={guide._id ?? guide.id} className="hover:bg-gray-50/50">

              <td className="px-4 py-3 font-medium text-enugu-black">{guide.name}</td>

              <td className="px-4 py-3 text-gray-500">

                {hasSizeGuideImage(guide) ? (

                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">

                    Uploaded

                  </span>

                ) : (

                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">

                    No image

                  </span>

                )}

              </td>

              <td className="px-4 py-3">

                {guide.isDefault ? (

                  <span className="inline-flex rounded-full bg-enugu-black px-2.5 py-0.5 text-xs font-medium text-white">

                    Global

                  </span>

                ) : (

                  <span className="text-xs text-gray-400">—</span>

                )}

              </td>

              <td className="px-4 py-3">

                <span

                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${

                    guide.isActive

                      ? 'bg-green-100 text-green-800'

                      : 'bg-gray-100 text-gray-600'

                  }`}

                >

                  {guide.isActive ? 'Active' : 'Inactive'}

                </span>

              </td>

              <td className="px-4 py-3">

                <div className="flex gap-3">

                  <button

                    type="button"

                    onClick={() => onEdit(guide)}

                    className="text-xs font-medium uppercase tracking-wider text-enugu-black hover:text-enugu-gold"

                  >

                    Manage

                  </button>

                  <button

                    type="button"

                    onClick={() => onDelete(guide)}

                    className="text-xs font-medium uppercase tracking-wider text-red-600 hover:text-red-800"

                  >

                    Delete

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};



export default SizeGuideTable;

