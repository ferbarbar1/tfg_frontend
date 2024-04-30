import {
  faHome,
  //faChartLine,
  faCalendarDays,
  faAddressBook,
  faChartBar,
  //faBoxes,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";

export const NAVLINKS = [
  {
    name: "Home",
    path: "/",
    icon: faHome,
  },
  {
    name: "Users",
    path: "/users",
    icon: faAddressBook,
  },
  {
    name: "Services",
    path: "/services",
    icon: faNotesMedical,
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: faCalendarDays,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: faChartBar,
  },
  /*
  {
    name: "Revenue",
    path: "/revenue",
    icon: faChartLine,
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: faBoxes,
  },
  */
];
