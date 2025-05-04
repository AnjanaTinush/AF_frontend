import {
    Globe,
    Map,
    Flag,
    Users,
    Search,
    Languages,
    Settings,
    Home,
    Coins
  } from 'lucide-react';
  
  const sideBarMenuItems = [
    {
      id: "home",
      path: "/",
      icon: Home,
      label: "Home",
      submenu: [],
    },
    {
      id: "explore",
      icon: Globe,
      label: "Explore Countries",
      submenu: [
        {
          id: "all",
          path: "/countrylist",
          label: "All Countries",
          icon: Flag,
        },
        {
          id: "capital",
          path: "/country/capital",
          label: "By Capital",
          icon: Map,
          badge: 5,
        },
        {
          id: "language",
          path: "/country/language",
          label: "By Language",
          icon: Languages,
        },
        {
          id: "currancy",
          path: "/country/currancy",
          label: "By Currancy",
          icon: Coins,
        },
      ],
    },
    {
      id: "favorites",
      path: "/favoritecountry",
      icon: Flag,
      label: "Favorite Countries",
      submenu: [],
    },
    {
      id: "statistics",
      path: "/statistics",
      icon: Users,
      label: "Population Stats",
      submenu: [],
    },
    {
      id: "search",
      path: "/search",
      icon: Search,
      label: "Advanced Search",
      submenu: [],
    },
    {
      id: "settings",
      path: "/settings",
      icon: Settings,
      label: "Settings",
      submenu: [],
    },
  ];
  
  export default sideBarMenuItems;
  