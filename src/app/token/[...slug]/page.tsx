import { SendView } from "@/views/SendView"
import { TokenView } from "@/views/TokenView"

export default function token ({params} : { params: {
    slug: string[]
}}) {

    if(params.slug.length === 2) {
        return(
        <div className="min-h-screen">
            <SendView />
        </div>
    )
    } else if (params.slug.length === 1) {
        return(
        <div className="min-h-screen">
            <TokenView />
        </div>
    )
    } 
    return(<div>Ahmada</div>) 
}