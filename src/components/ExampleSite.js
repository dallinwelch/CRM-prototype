import React from 'react';
import PropertyManagementSite from './PropertyManagementSite';
import './PropertyManagementSite.css';

const ExampleSite = () => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      overflow: 'auto',
      margin: 0,
      padding: 0
    }}>
      <PropertyManagementSite />
    </div>
  );
};

export default ExampleSite;
