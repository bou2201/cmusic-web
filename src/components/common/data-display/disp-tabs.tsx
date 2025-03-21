'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { ReactNode, useState } from 'react';

export type DispTabsItem = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  component: ReactNode;
};

export type DispTabsProps = {
  tabs: DispTabsItem[];
  block?: boolean;
  cnTabs?: string;
  cnTabsList?: string;
};

export function DispTabs({ tabs, block, cnTabs, cnTabsList }: DispTabsProps) {
  const [value, setValue] = useState<string>(tabs[0].value);

  return (
    <Tabs defaultValue={value} className={cnTabs}>
      <TabsList
        className={cnTabsList}
        style={
          block
            ? {
                gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
                width: '100%',
                display: 'grid',
              }
            : {}
        }
      >
        {tabs.map((tab) => (
          <TabsTrigger
            value={tab.value}
            key={tab.value}
            onClick={(e) => {
              e.preventDefault();
              setValue(tab.value);
            }}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent value={tab.value} key={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
