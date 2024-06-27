import { memo } from 'react';

import SidebarItem, { TSidebarItemProps } from '@/layouts/SidebarLayout/Sidebar/SidebarItem';

const SidebarNestedItem = ({ item, currentRoute, onClick }: TSidebarItemProps) => {
  return (
    <SidebarItem key={currentRoute.id} styles={{ mx: 1 }} item={item} currentRoute={currentRoute} onClick={onClick} />
  );
};

export default memo(SidebarNestedItem);
