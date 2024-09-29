import { UserInterface } from '.'

export interface AuthContextProps {
  isLoggedIn: boolean
  user: UserInterface
  setUser: (user: UserInterface) => void
  logout: () => void
  fetchProfile: (userId:number) => void
  isUserLoading: boolean
}
