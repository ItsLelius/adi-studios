import type { CurrentUser } from "../types";

export const mockUsers: CurrentUser[] = [
  {
    id: "user-admin",
    name: "Adi",
    email: "adi@adistudios.local",
    role: "admin",
  },
  {
    id: "user-maria",
    name: "Maria",
    email: "maria@adistudios.local",
    role: "employee",
  },
  {
    id: "user-john",
    name: "John",
    email: "john@adistudios.local",
    role: "employee",
  },
];