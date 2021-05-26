import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, formatEpisodeNumber } from 'utils/helpers';
import { RootState } from 'store';
import styles from '../downloads/DownloadList.module.scss';
import { fetchFinished, Download } from '../downloads/downloadSlice';

const DownloadList: React.FC = () => {
  const dispatch = useDispatch();
  const { finished } = useSelector((state: RootState) => state.downloads);

  useEffect(() => {
    dispatch(fetchFinished());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const episodeColumn = (download: Download) => {
    if (download.isFilm) {
      return null;
    } else if (download.series < 0) {
      return '?';
    } else {
      return formatEpisodeNumber(download);
    }
  };

  // const actionColumn = (download: Download) => {
  //   return (
  //     <>
  //       <TableButton icon="pencil" to={`/downloads/${download.id}/edit`} />
  //     </>
  //   );
  // };

  const dateFormat = window.innerWidth < 800 ? 'dd-MM' : 'dd-MM-yy';

  const downloadedAtColumn = (download: Download) => {
    return download.downloadedAt ? formatDate(download.downloadedAt, dateFormat) : '';
  };

  if (finished.length === 0) {
    return <Card className={styles.nodownloads}>Currently, there are no downloads in the download queue.</Card>;
  } else {
    return (
      <DataTable value={finished} autoLayout={true} paginator={true} rows={30}>
        {/* <Column field="id" header="ID" /> */}
        <Column field="programme" header="Programme" filter={true} filterMatchMode="contains" sortable={true} />
        <Column header="Episode" body={episodeColumn} />
        {window.innerWidth > 800 && <Column field="year" header="Year" sortable={true} />}
        {window.innerWidth > 800 && <Column field="attempts" header="Attempts" sortable={true} />}
        <Column field="downloadedAt" header="Datum" body={downloadedAtColumn} sortable={true} />
        {/* <Column header="Actions" body={actionColumn} /> */}
      </DataTable>
    );
  }
};

export default DownloadList;
