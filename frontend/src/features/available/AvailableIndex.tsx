import TableButton from 'components/TableButton';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from 'utils/helpers';
import { RootState } from '../../store';
import { Available, fetchAvailable } from './availableSlice';

const AvailableIndex: React.FC = () => {
  const { available, lastBatchAdded } = useSelector((state: RootState) => state.available);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAvailable());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addedOnBody = (available: Available) => formatDate(new Date(available.addedOn));

  const actionBody = (available: Available) => {
    return (
      <>
        <TableButton icon="mdi mdi-eye" url={`https://www.bbc.co.uk/iplayer/episodes/${available.id}`} />
      </>
    );
  };

  const genreBody = (available: Available) => {
    return available.categories.join(', ');
  };

  const rowClassName = (available: Available) => {
    if (available.downloaded) {
      return { 'p-highlight2': true };
    } else if (available.addedOn === lastBatchAdded) {
      return { 'p-highlight': true };
    } else {
      return {};
    }
  };

  return (
    <div>
      <h1>Available Programmes</h1>
      <DataTable value={available} autoLayout={true} paginator={true} rows={20} rowClassName={rowClassName}>
        <Column header="Programme" field="title" sortable={true} filter={true} filterMatchMode="contains" />
        <Column header="Synopsis" field="synopsis" />
        <Column
          header="Genres"
          field="categories"
          body={genreBody}
          filter={true}
          // filterField="genres"
          filterMatchMode="contains"
          // filterFunction={genreFilter}
        />
        {/* <Column header="ID" field="id" /> */}
        <Column header="Added On" body={addedOnBody} sortable={true} />
        <Column header="Actions" body={actionBody} />
      </DataTable>
    </div>
  );
};

export default AvailableIndex;
