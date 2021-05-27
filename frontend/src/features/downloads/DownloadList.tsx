import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import styles from './DownloadList.module.scss';
import { fetchDownloads, Download, deleteDownload } from './downloadSlice';
import { formatEpisodeNumber } from 'utils/helpers';
import TableButton from 'components/TableButton';
import TableDeleteButton from 'components/TableDeleteButton';

const DownloadList: React.FC = () => {
  const dispatch = useDispatch();
  const { downloads } = useSelector((state: RootState) => state.downloads);
  const { currentDownload } = useSelector((state: RootState) => state.status);

  useEffect(() => {
    dispatch(fetchDownloads());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (bbcID: string) => {
    dispatch(deleteDownload(bbcID));
  };

  const episodeColumn = (download: Download) => {
    if (download.isFilm) {
      return null;
    } else if (download.series < 0) {
      return '?';
    } else {
      return formatEpisodeNumber(download);
    }
  };

  const actionColumn = (download: Download) => {
    const disabled = download.bbcID === currentDownload?.bbcID;

    return (
      <>
        <TableButton icon="pencil" to={`/downloads/${download.bbcID}/edit`} disabled={disabled} />
        <TableDeleteButton
          icon="delete"
          objectName={download.programme}
          objectId={download.bbcID}
          handleDelete={handleDelete}
          disabled={disabled}
        />
      </>
    );
  };

  const taggedColumn = (download: Download) => (
    <i
      className={download.tagged ? 'mdi mdi-checkbox-marked-outline' : 'mdi mdi-checkbox-blank-outline'}
      style={{ margin: 'auto' }}
    />
  );

  if (downloads.length === 0) {
    return <Card className={styles.nodownloads}>No downloads queued.</Card>;
  } else {
    return (
      <DataTable value={downloads} autoLayout={true}>
        <Column field="bbcID" header="ID" />
        <Column field="programme" header="Programme" />
        <Column field="year" header="Year" className={styles.colCenter} />
        <Column header="Episode" body={episodeColumn} className={styles.colCenter} />
        <Column field="attempts" header="Attempts" className={styles.colRight} />
        <Column header="Tagged" body={taggedColumn} className={styles.colCenter} />
        <Column header="Actions" body={actionColumn} />
      </DataTable>
    );
  }
};

export default DownloadList;
