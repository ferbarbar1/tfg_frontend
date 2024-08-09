import {
  faHome,
  faCalendarDays,
  faAddressBook,
  faChartBar,
  faNotesMedical,
  faQuestionCircle,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

export const NAVLINKS = [
  {
    name: "Home",
    path: "/",
    icon: faHome,
    public: true,
  },
  {
    name: "Users",
    path: "/users",
    icon: faAddressBook,
    roles: ["owner"],
  },
  {
    name: "Services",
    path: "/services",
    icon: faNotesMedical,
    roles: ["owner", "client"],
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: faCalendarDays,
    roles: ["owner"],
  },
  {
    name: "My Appointments",
    path: "/my-appointments",
    icon: faCalendarDays,
    roles: ["worker", "client"],
  },
  {
    name: "Resources",
    path: "/resources",
    icon: faFolder,
    public: ["owner", "worker", "client"],
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: faChartBar,
    roles: ["owner"],
  },
  {
    name: "About Us",
    path: "/about",
    icon: faQuestionCircle,
    public: true,
  },
];
