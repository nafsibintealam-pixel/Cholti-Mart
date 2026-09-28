import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Crown, 
  Edit2, 
  ExternalLink,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { CustomerProfile, CustomerGroupItem } from '../../../types';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminSearchInput, 
  AdminPagination, 
  AdminModal, 
  AdminExportButton 
} from '../common/AdminUiElements';
import { customerService } from '../../../services';

export interface CustomersViewProps {
  subnav?: string;
  onNavigateSubnav: (sub: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  subnav = 'all_customers',
  onNavigateSubnav
}) => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => customerService.getCustomersSync());
  const [groups] = useState<CustomerGroupItem[]>(() => customerService.getCustomerGroupsSync());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerProfile | null>(null);

  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    district: 'Dhaka',
    area: '',
    address: '',
    group: 'Regular' as CustomerProfile['group'],
    notes: ''
  });

  const filtered = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'All' || c.group === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    await customerService.createCustomer({
      ...newCustomerForm,
      isGuest: false,
      status: 'active',
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: 'Never'
    });
    setCustomers(customerService.getCustomersSync());
    setIsAddModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['Name', 'Phone', 'Email', 'District', 'Group', 'Orders Count', 'Total Spent', 'Joined Date'];
    const rows = filtered.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.district}"`,
      c.group,
      c.ordersCount,
      c.totalSpent,
      c.joinedDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cholti_mart_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Subnav Pills */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'all_customers', label: `All Customers (${customers.length})` },
            { id: 'customer_groups', label: `Customer Groups (${groups.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateSubnav(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors ${
                subnav === tab.id
                  ? 'bg-[#2D5128] text-[#E4EB9C] font-bold border border-[#8DA750]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AdminExportButton onExportCsv={handleExportCsv} />
      </div>

      {subnav === 'customer_groups' ? (
        /* Customer Groups View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((grp) => (
            <AdminCard
              key={grp.id}
              title={
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>{grp.name}</span>
                </div>
              }
              subtitle={`${grp.memberCount} Members enrolled`}
              action={
                <AdminBadge variant="lime" size="xs">
                  {grp.discountPercentage}% Discount
                </AdminBadge>
              }
            >
              <div className="space-y-3 text-xs">
                <p className="text-neutral-300 leading-relaxed">{grp.description}</p>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Requirement: <strong>{grp.minOrdersRequired} orders completed</strong></span>
                  <span className="font-mono text-emerald-400">Active Tier</span>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        /* Customer Directory View */
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-3 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
              <AdminSearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search customers by name, phone, or district..."
                className="w-full sm:w-80"
              />

              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#8DA750]"
              >
                <option value="All">All Tiers ({customers.length})</option>
                <option value="VIP">VIP Club</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Regular">Regular</option>
                <option value="New">New</option>
              </select>
            </div>

            <AdminButton
              variant="lime"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Customer
            </AdminButton>
          </div>

          {/* Customers Table */}
          <AdminCard noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/90 text-neutral-400 text-[10px] uppercase font-bold tracking-wider border-b border-neutral-800">
                  <tr>
                    <th className="px-5 py-3.5">Customer Name</th>
                    <th className="px-4 py-3.5">Phone & Email</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Tier</th>
                    <th className="px-4 py-3.5">Orders</th>
                    <th className="px-4 py-3.5">Total Spent</th>
                    <th className="px-4 py-3.5">Last Order</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                  {paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D5128] to-[#142C14] border border-[#8DA750]/40 text-[#E4EB9C] flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{c.name}</span>
                            <span className="text-[10px] text-neutral-400">Joined {c.joinedDate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-mono text-emerald-400 text-[11px]">{c.phone}</div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[150px]">{c.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-neutral-300">
                        {c.area ? `${c.area}, ` : ''}{c.district}
                      </td>
                      <td className="px-4 py-3.5">
                        <AdminBadge
                          variant={c.group === 'VIP' ? 'lime' : c.group === 'Wholesale' ? 'purple' : 'neutral'}
                          size="xs"
                        >
                          {c.group}
                        </AdminBadge>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-white">
                        {c.ordersCount} orders
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#E4EB9C]">
                        ৳{c.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-400 text-[11px]">
                        {c.lastOrderDate}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setViewingCustomer(c)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="View Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </AdminCard>

        </div>
      )}

      {/* Add Customer Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Customer Profile"
        subtitle="Create verified shopper record with billing & delivery address"
        footer={
          <>
            <AdminButton variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="lime" size="sm" onClick={handleAddCustomer}>
              Create Customer
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newCustomerForm.name}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                placeholder="e.g. Farhana Akter"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                placeholder="+88017XXXXXXXX"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#8DA750]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Email Address</label>
              <input
                type="email"
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                placeholder="customer@email.com"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Customer Tier</label>
              <select
                value={newCustomerForm.group}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, group: e.target.value as any })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Wholesale">Wholesale</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">District / City *</label>
              <input
                type="text"
                required
                value={newCustomerForm.district}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, district: e.target.value })}
                placeholder="e.g. Dhaka, Chittagong, Sylhet"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
            <div>
              <label className="text-neutral-300 font-semibold block mb-1">Area / Thana</label>
              <input
                type="text"
                value={newCustomerForm.area}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, area: e.target.value })}
                placeholder="e.g. Dhanmondi, Mirpur"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-semibold block mb-1">Full Street Address</label>
            <textarea
              rows={2}
              value={newCustomerForm.address}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
              placeholder="House, Road, Apartment details"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-[#8DA750]"
            />
          </div>
        </form>
      </AdminModal>

      {/* Customer Profile View Modal */}
      {viewingCustomer && (
        <AdminModal
          isOpen={!!viewingCustomer}
          onClose={() => setViewingCustomer(null)}
          title={`Customer: ${viewingCustomer.name}`}
          subtitle={`Joined on ${viewingCustomer.joinedDate} &bull; ${viewingCustomer.ordersCount} Lifetime Orders`}
          footer={
            <AdminButton variant="outline" size="sm" onClick={() => setViewingCustomer(null)}>
              Close
            </AdminButton>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Phone Number</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{viewingCustomer.phone}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Lifetime Spend</span>
                <span className="font-mono text-[#E4EB9C] font-bold text-sm">৳{viewingCustomer.totalSpent.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">District</span>
                <span className="text-white font-medium">{viewingCustomer.district}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">Membership Tier</span>
                <AdminBadge variant="lime" size="xs">{viewingCustomer.group}</AdminBadge>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400 block text-[10px] uppercase font-bold mb-1">Delivery Address</span>
              <p className="text-neutral-200">{viewingCustomer.address || 'No street address saved'}</p>
            </div>

            {viewingCustomer.notes && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="block text-[10px] uppercase font-bold mb-1">Internal Notes</span>
                <p>{viewingCustomer.notes}</p>
              </div>
            )}
          </div>
        </AdminModal>
      )}

    </div>
  );
};
