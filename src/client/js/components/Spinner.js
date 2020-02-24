import React from 'react';
import '../../css/Spinner.scss';

export const Spinner = () => <div className="Spinner" />;

export const SpinnerPage = ({className}) => (
  <div className={`SpinnerPage ${className}`}>
    <Spinner />
  </div>
);
