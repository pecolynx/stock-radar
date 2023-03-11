import { ReactElement } from 'react';

import { Route, Routes } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';

import '@/containers/App.css';
import { initI18n } from '@/app/i18n';
import { ApexChartDashboard } from '@/containers/dashboard/ApexChartDashboard';
import { initialData } from '@/containers/data';

initI18n();

export const App = (): ReactElement => {
  // const dispatch = useAppDispatch();
  const username = 'ABC';
  return (
    <div>
      <Menu>
        <Menu.Menu position="right">
          <Dropdown item text="" icon="bars">
            <Dropdown.Menu>
              <Dropdown.Item>{username}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>

      <Routes>
        <Route path={`/`} element={<ApexChartDashboard />} />
      </Routes>
    </div>
  );
};

// export const App = (): ReactElement => {
//   const sampleDataDates = [
//     { x: new Date(2016, 6, 1), open: 5, close: 10, high: 15, low: 0 },
//     { x: new Date(2016, 6, 2), open: 10, close: 15, high: 20, low: 5 },
//     { x: new Date(2016, 6, 3), open: 15, close: 20, high: 22, low: 10 },
//     { x: new Date(2016, 6, 4), open: 20, close: 10, high: 25, low: 7 },
//     { x: new Date(2016, 6, 5), open: 10, close: 8, high: 15, low: 5 },
//   ];
//   return (
//     <VictoryChart
//       theme={VictoryTheme.material}
//       domainPadding={{ x: 25 }}
//       scale={{ x: 'time' }}
//     >
//       <VictoryAxis tickFormat={(t: Date) => `${t.getDate()}/${t.getMonth()}`} />
//       <VictoryAxis dependentAxis />
//       <VictoryCandlestick
//         candleColors={{ positive: '#5f5c5b', negative: '#c43a31' }}
//         data={sampleDataDates}
//       />
//     </VictoryChart>
//   );
// };
