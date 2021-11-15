import { getIntInRange } from '@vuesion/utils/dist/randomGenerator';
import { IDataTableColumns } from './IDataTable';

export const dataTableColumnsFixture = (): IDataTableColumns => ({
  id: {
    visible: false,
  },
  avatar: {
    visible: false,
    searchable: false,
  },
  firstname: {
    visible: false,
  },
  lastname: {
    visible: false,
  },
  user: {
    title: 'User',
    slot: 'user',
    searchable: false,
  },
  age: {
    title: 'Age',
    slot: 'age',
    cssClass: 'ageColumn',
  },
  address: {
    title: 'Address',
  },
  status: {
    title: 'Status',
    slot: 'status',
  },
  created: {
    title: 'Created',
    slot: 'date',
    searchable: false,
  },
  updated: {
    title: 'Updated',
    slot: 'date',
    searchable: false,
  },
  actions: {
    title: ' ',
    slot: 'actions',
    sortable: false,
    searchable: false,
  },
});

export const dataTableRecordsFixture = (count = 100) => {
  const records: any[] = [];
  const firstNames = ['Toni', 'Jennifer', 'Charly', 'Bella', 'Ichabod', 'Allister', 'Rhona', 'Ella', 'Antonia'];
  const lastNames = ['Stark', 'Laurence', 'Harper', 'Thorn', 'Crane', 'McGregor', 'Smith', 'Young', 'Banderaz'];
  const streets = [
    'Wallstreet 1',
    'Winkelgasse 55',
    'Main Street 44b',
    'Route 66',
    'Las Vegas Boulevard South',
    'Fifth Avenue',
    'Avenue des Champs-Élysées',
    'Downing Street',
    'Lindenstrasse 4711',
  ];
  const avatars = [
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3150&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1535&q=80',
    'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGF2YXRhcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1626586066636-a1523dd2141b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1624561254177-28de5f2c36eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODd8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60',
  ];
  const statuses = ['new', 'pending', 'blocked', 'registered'];

  for (let i = 0; i < count; i++) {
    const id = getIntInRange(1, 1000000);
    records.push({
      id,
      avatar: avatars[getIntInRange(0, avatars.length - 1)],
      firstname: firstNames[getIntInRange(0, firstNames.length - 1)],
      lastname: lastNames[getIntInRange(0, lastNames.length - 1)],
      user: id,
      address: streets[getIntInRange(0, streets.length - 1)],
      status: statuses[getIntInRange(0, statuses.length - 1)],
      age: getIntInRange(20, 99),
      created: new Date().getTime() - getIntInRange(100000000, 1000000000),
      updated: new Date().getTime() - getIntInRange(10000000, 100000000),
    });
  }

  return records;
};

export const dataTableRecordsGroupingFixture = () => {
  const records: any[] = [];
  const firstNames = ['Toni', 'Jennifer', 'Charly', 'Bella', 'Ichabod', 'Allister', 'Rhona', 'Ella', 'Antonia'];
  const lastNames = ['Stark', 'Laurence', 'Harper', 'Thorn', 'Crane', 'McGregor', 'Smith', 'Young', 'Banderaz'];
  const streets = [
    'Wallstreet 1',
    'Winkelgasse 55',
    'Main Street 44b',
    'Route 66',
    'Las Vegas Boulevard South',
    'Fifth Avenue',
    'Avenue des Champs-Élysées',
    'Downing Street',
    'Lindenstrasse 4711',
  ];
  const avatars = [
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3150&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1535&q=80',
    'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGF2YXRhcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
    'https://images.unsplash.com/photo-1626586066636-a1523dd2141b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
    'https://images.unsplash.com/photo-1624561254177-28de5f2c36eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODd8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60',
  ];

  for (let i = 0; i < 17; i++) {
    const id = getIntInRange(1, 1000000);
    records.push({
      id,
      avatar: avatars[getIntInRange(0, avatars.length - 1)],
      firstname: firstNames[getIntInRange(0, firstNames.length - 1)],
      lastname: lastNames[getIntInRange(0, lastNames.length - 1)],
      user: id,
      address: streets[getIntInRange(0, streets.length - 1)],
      status: i < 6 ? 'new' : i < 10 ? 'pending' : 'blocked',
      age: getIntInRange(20, 99),
      created: new Date().getTime() - getIntInRange(100000000, 1000000000),
      updated: new Date().getTime() - getIntInRange(10000000, 100000000),
    });
  }

  return records;
};
