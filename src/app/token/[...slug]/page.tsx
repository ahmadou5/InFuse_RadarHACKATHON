
import { TokenView } from "@/views/TokenView"

export default function token ({params} : { params: {
    slug: string
}}) {
    if(params.slug.length > 1) {
        return (
        <div>
            Compress
        </div>
    )
    } else
    return(
        <div className="min-h-screen">
            <TokenView slug={params.slug}/>
        </div>
) 
}