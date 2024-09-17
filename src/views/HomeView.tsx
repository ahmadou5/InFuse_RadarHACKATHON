import { TransactionService } from "@/lib/services/transaction.service"
import { UserService } from "@/lib/services/user.service"
import { useInitData } from "@telegram-apps/sdk-react"
import { useEffect } from "react"


export const Homeview = () => {
    useEffect(() => {
       const user = UserService.GetUser();
       console.log(user,'shegen')
       const trx = TransactionService.GetTransactionByAddress('3SztGJVq9WFKdENT4ogtAN8dkrF1yDi5uQyPQiQKAKLe')
       console.log(trx,'ahmadous')
    },[])
    const tgData = useInitData()
    return(<>{`hello tg ${tgData?.user?.firstName}`} </>)
}