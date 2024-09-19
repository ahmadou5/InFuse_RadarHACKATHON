import { UserInterface } from '.'

export interface AuthContextProps {
  isLoggedIn: boolean
  user: UserInterface | undefined
  setUser: (user: UserInterface) => void
  logout: (user: UserInterface) => void
  isUserLoading: boolean
}
