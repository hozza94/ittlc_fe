'use client';

import { useState } from 'react';

type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  subItems?: {
    id: string;
    label: string;
    href?: string;
  }[];
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems: MenuItem[] = [
    {
      id: 'member',
      label: '성도관리',
      subItems: [
        { id: 'member_list', label: '성도 조회' },
        { id: 'member_registraion', label: '성도 등록' },
        { id: 'member_modify', label: '정보 수정' },
      ],
    },
    {
      id: 'prayer_request',
      label: '기도',
      subItems: [
        { id: 'pray_list', label: '기도 제목' },
        { id: 'pray_registration', label: '기도 등록' },
      ],
    },
    // { id: 'offering', label: '헌금' },
    { id: 'admin', label: '관리자' },
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-100 overflow-hidden">
      {/* 상단 바 */}
      <header className="bg-white shadow-sm h-16 flex-shrink-0 flex items-center border-b">
        <div className="flex items-center w-full px-4">
          <h1 className="text-xl font-bold mr-8">ITTLC</h1>
          {/* 기존 상단 바 컨텐츠 */}
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">사용자</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <div className="w-48 bg-white shadow-lg flex flex-col">
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {menuItems.map((item) => (
              <li key={item.id} className="border-b border-gray-100">
                <div 
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => item.subItems && toggleMenu(item.id)}
                >
                  <span>{item.label}</span>
                  {item.subItems && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.id] ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                {item.subItems && (
                  <div 
                    className={`accordion-content ${expandedMenus[item.id] ? 'open' : ''}`}
                  >
                    <ul className="bg-gray-50">
                      {item.subItems.map((subItem) => (
                        <li 
                          key={subItem.id} 
                          className="px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                          {subItem.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

        {/* 페이지 컨텐츠 */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
