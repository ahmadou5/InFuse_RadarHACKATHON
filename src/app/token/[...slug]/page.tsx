
import { TokenView } from "@/views/TokenView"

export default function token ({params} : { params: {
    slug: string
}}) {

    return(
        <div className="min-h-screen">
            <TokenView slug={params.slug}/>
        </div>
) 
}