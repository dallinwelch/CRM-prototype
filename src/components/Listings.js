import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Eye, Edit, Trash2 } from 'lucide-react';

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Hardcoded listings data matching the design
  const listings = [
    {
      id: 1,
      title: "Charming 2-Bed, 2-Bath Oasis in St. Petersburg - Your Cozy Retreat Awaits at 4212 8th Avenue North!",
      address: "4212 8th Avenue North",
      city: "St. Petersburg, FL 33713",
      dateAdvertised: "08-06-2025",
      daysOnMarket: 44,
      active: "Yes",
      image: null // No image placeholder
    },
    {
      id: 2,
      title: "Heyo!",
      address: "89 West Waterbury Drive",
      city: "Springboro, OH 45066",
      dateAdvertised: "09-15-2025",
      daysOnMarket: 4,
      active: "Yes",
      image: null // No image placeholder
    },
    {
      id: 3,
      title: "Modern 3-Bedroom Family Home with Updated Kitchen",
      address: "1234 Oak Street",
      city: "Austin, TX 78701",
      dateAdvertised: "10-01-2025",
      daysOnMarket: 12,
      active: "Yes",
      image: null
    },
    {
      id: 4,
      title: "Luxury Downtown Condo with City Views",
      address: "5678 Main Street",
      city: "Denver, CO 80202",
      dateAdvertised: "09-28-2025",
      daysOnMarket: 8,
      active: "No",
      image: null
    }
  ];

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Home / Marketing</span>
      </div>

      {/* Page Title */}
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        color: 'rgb(68, 71, 69)', 
        marginBottom: '2rem' 
      }}>
        Listings
      </h1>

      {/* Search and Filter Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#64748b'
              }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} style={{ marginRight: '4px' }} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'rgb(0, 165, 79)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Active
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'white',
                color: 'rgb(68, 71, 69)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Yes
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'white',
                color: 'rgb(68, 71, 69)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Portfolio
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'white',
                color: 'rgb(68, 71, 69)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Property Type
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'white',
                color: 'rgb(68, 71, 69)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Property Group
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'white',
                color: 'rgb(68, 71, 69)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Portfolio Group
              </span>
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'white',
                color: 'rgb(68, 71, 69)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                Property Assignee
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredListings.map(listing => (
          <div key={listing.id} style={{
            display: 'flex',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem',
            gap: '1.5rem',
            transition: 'all 0.2s ease'
          }}>
            {/* Image Placeholder */}
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏔️</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '500' }}>NO IMAGE</div>
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'rgb(68, 71, 69)',
                marginBottom: '0.5rem',
                lineHeight: '1.4'
              }}>
                {listing.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <MapPin size={14} color="rgb(11, 67, 119)" />
                <span style={{ color: 'rgb(11, 67, 119)', fontWeight: '500' }}>
                  {listing.address}
                </span>
              </div>
              <div style={{ color: 'rgb(11, 67, 119)', marginBottom: '1rem' }}>
                {listing.city}
              </div>
            </div>

            {/* Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '150px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Date Advertised:</span>
                <span style={{ color: 'rgb(11, 67, 119)', fontWeight: '500' }}>{listing.dateAdvertised}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Days On Market:</span>
                <span style={{ color: 'rgb(11, 67, 119)', fontWeight: '500' }}>{listing.daysOnMarket}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Active:</span>
                <span style={{ 
                  color: listing.active === 'Yes' ? 'rgb(0, 165, 79)' : '#dc2626',
                  fontWeight: '500'
                }}>
                  {listing.active}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
              <button className="btn btn-secondary btn-sm">
                <Eye size={14} style={{ marginRight: '4px' }} />
                View
              </button>
              <button className="btn btn-secondary btn-sm">
                <Edit size={14} style={{ marginRight: '4px' }} />
                Edit
              </button>
              <button className="btn btn-secondary btn-sm">
                <Trash2 size={14} style={{ marginRight: '4px' }} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        marginTop: '2rem',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        <span>1 to {filteredListings.length} of {filteredListings.length} - show</span>
        <select style={{
          marginLeft: '0.5rem',
          padding: '0.25rem 0.5rem',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          backgroundColor: 'white'
        }}>
          <option value="15">15</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Listings;
