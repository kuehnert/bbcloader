import { Card } from 'primereact/card';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const DebugCard: React.FC = () => {
  const { debug, env, externalIP } = useSelector((state: RootState) => state.status);

  const envTable = () => (
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>External IP</th>
          <td>{externalIP}</td>
        </tr>
        {Object.keys(env).map((k) => (
          <tr key={k}>
            <th>{k}</th>
            <td>{env[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (!debug) {
    return null;
  }

  return (
    <>
      <h2>Debugging Info</h2>
      <Card>{envTable()}</Card>
    </>
  );
};

export default DebugCard;
